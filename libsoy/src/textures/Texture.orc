#
#   libsoy - soy.textures.Texture
#   Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group
#
#   This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU Affero General Public License as published by
#   the Free Software Foundation, either version 3 of the License, or
#   (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU Affero General Public License for more details.
#
#   You should have received a copy of the GNU Affero General Public License
#   along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

.function soy_textures_texture_surface2rgba
.flags 2d
.dest   4 rgba
.source 4 bgra
.const  1 c255, 255
.temp   4 fa
.temp   4 fr
.temp   4 fg
.temp   4 fb
.temp   2 t1
.temp   2 t2
.temp   2 wr
.temp   2 wg
.temp   2 wb
.temp   2 wa
.temp   1 r
.temp   1 g
.temp   1 b
.temp   1 a
.temp   1 adiv

splitlw  t2, t1, bgra
splitwb  g, b, t1
splitwb  a, r, t2

convubw  wa, a
convubw  wr, r
convubw  wg, g
convubw  wb, b
convuwl  fa, wa
convuwl  fr, wr
convuwl  fg, wg
convuwl  fb, wb
convlf   fa, fa
convlf   fr, fr
convlf   fg, fg
convlf   fb, fb

divf     fa, fa, c255
mulf     fr, fr, fa
mulf     fg, fg, fa
mulf     fb, fb, fa

convfl   fr, fr
convfl   fg, fg
convfl   fb, fb
convlw   wr, fr
convlw   wg, fg
convlw   wb, fb
convwb   r, wr
convwb   g, wg
convwb   b, wb

mergebw  t1, r, g
mergebw  t2, b, a
mergewl  rgba, t1, t2

.function soy_textures_texture_mipmap_horizontal
.flags 2d
.dest   4 mipmap
.source 8 texture

.temp 4 rgba1
.temp 4 rgba2
.temp 2 rg1
.temp 2 ba1
.temp 2 rg2
.temp 2 ba2
.temp 1 chan1
.temp 1 chan2
.temp 1 chan3
.temp 1 chan4
.temp 1 avgr
.temp 1 avgg
.temp 1 avgb
.temp 1 avga

splitql rgba2, rgba1, texture
splitlw ba1, rg1, rgba1
splitlw ba2, rg2, rgba2

splitwb chan2, chan1, rg1
splitwb chan4, chan3, rg2
avgub   avgr, chan1, chan3
avgub   avgg, chan2, chan4

splitwb chan2, chan1, ba1
splitwb chan4, chan3, ba2
avgub   avgb, chan1, chan3
avgub   avga, chan2, chan4

mergebw rg1, avgr, avgg
mergebw ba1, avgb, avga
mergewl mipmap, rg1, ba1

.function soy_textures_texture_mipmap_vertical
.flags 2d
.dest   4 mipmap
.source 4 rgba1
.param  4 width

.temp 4 rgba2
.temp 2 rg1
.temp 2 ba1
.temp 2 rg2
.temp 2 ba2
.temp 1 chan1
.temp 1 chan2
.temp 1 chan3
.temp 1 chan4
.temp 1 avgr
.temp 1 avgg
.temp 1 avgb
.temp 1 avga

loadoffl rgba2, rgba1, width

splitlw ba1, rg1, rgba1
splitlw ba2, rg2, rgba2

splitwb chan2, chan1, rg1
splitwb chan4, chan3, rg2
avgub   avgr, chan1, chan3
avgub   avgg, chan2, chan4

splitwb chan2, chan1, ba1
splitwb chan4, chan3, ba2
avgub   avgb, chan1, chan3
avgub   avga, chan2, chan4

mergebw rg1, avgr, avgg
mergebw ba1, avgb, avga
mergewl mipmap, rg1, ba1

.function soy_textures_texture_generate_palette_color
.dest   1 dst
.source 4 xs

.floatparam 4 chan1 
.floatparam 4 chan2 
.floatparam 4 chan3 
.floatparam 4 chan4 
.floatparam 4 y
.floatparam 4 divisor
.floatparam 4 bound

.temp   4 c
.temp   2 wc
.temp   4 tempChan1
.temp   4 tempChan2
.temp   4 chan12
.temp   4 chan34
.temp   4 x
.temp   4 x1
.temp   4 y1
.temp   4 fxs

divf   x, xs, divisor
subf   x1, bound, x

subf   y1, bound, y

mulf tempChan1, chan1, x1
mulf tempChan1, tempChan1, y1
mulf tempChan2, chan2, x
mulf tempChan2, tempChan2, y1
addf chan12, tempChan1, tempChan2

mulf tempChan1, chan3, x1
mulf tempChan1, tempChan1, y
mulf tempChan2, chan4, y
mulf tempChan2, tempChan2, x
addf chan34, tempChan1, tempChan2

addf   c, chan12, chan34
convfl c, c
convlw wc, c
convwb dst, wc

.function soy_textures_texture_generate_lerped_colors
.dest   1 dst
.source 4 xs

.floatparam 4 c1
.floatparam 4 c2
.floatparam 4 divisor

.temp 4 c
.temp 4 x1
.temp 2 wc

divf x1, xs, divisor

subf c, c2, c1
mulf c, c, x1
addf c, c, c1

convfl c, c
convlw wc, c
convwb dst, wc
