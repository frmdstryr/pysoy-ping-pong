/*
 *  libsoy - soy.sgk2png
 *  Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */
[indent=4]

namespace soy
    class SGK2PNGConverter
        prop png_data : list of uchar
        
        construct()
            png_data = new list of uchar
            return
        
        def sgk2png (sgk_data : array of uchar)
            handle   : Rsvg.Handle
            surface  : Cairo.ImageSurface
            context  : Cairo.Context
            
            try
                handle = new Rsvg.Handle.from_data(sgk_data)
                surface = new Cairo.ImageSurface(Cairo.Format.ARGB32, handle.width, handle.height)
                context = new Cairo.Context(surface)
                handle.render_cairo(context)
                surface.write_to_png_stream(writefunc)
            except g : GLib.Error
                stdout.printf("Error: %s\n", g.message) // TODO better error management
                return
            
            return
        
        def get_png() : array of uchar
            data : array of uchar = new array of uchar[png_data.size]
            var i = 0
            for character in png_data
                data[i] = character
                i++
            return data
            
        // Satisfies the Cairo.WriteFunc delegate
        def writefunc(input : array of uchar) : Cairo.Status
            for character in input
                png_data.add(character)
            return Cairo.Status.SUCCESS
