.function soy_scenes_scene_body_distance_squared
.dest       4 distance
.source     4 xPos
.source     4 yPos
.source     4 zPos
.floatparam 4 xOrig
.floatparam 4 yOrig
.floatparam 4 zOrig

.temp   4 dx
.temp   4 dy
.temp   4 dz
.temp   4 dx2
.temp   4 dy2
.temp   4 dz2
.temp   4 xy

subf dx, xPos, xOrig
subf dy, yPos, yOrig
subf dz, zPos, zOrig

mulf dx2, dx, dx
mulf dy2, dy, dy
mulf dz2, dz, dz

addf xy, dx2, dy2
addf distance, xy, dz2

.function soy_scenes_scene_body_distance
.dest       4 distance
.source     4 xPos
.source     4 yPos
.source     4 zPos
.floatparam 4 xOrig
.floatparam 4 yOrig
.floatparam 4 zOrig

.temp   4 dx
.temp   4 dy
.temp   4 dz
.temp   4 dx2
.temp   4 dy2
.temp   4 dz2
.temp   4 xy
.temp   4 xyz

subf dx, xPos, xOrig
subf dy, yPos, yOrig
subf dz, zPos, zOrig

mulf dx2, dx, dx
mulf dy2, dy, dy
mulf dz2, dz, dz

addf xy, dx2, dy2
addf xyz, xy, dz2

sqrtf distance, xyz
