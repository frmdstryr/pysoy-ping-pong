#!/usr/bin/env python

import soy
from time import sleep

sce = soy.scenes.Scene()
cam = soy.bodies.Camera(sce)
cam.position = (0.0, 0.0, 10.0)
lig = soy.bodies.Light(sce)
lig.position = (-10.0,10.0,2.0)
fps = soy.textures.Print()
ogg = soy.transports.File('media/changeworld.ogg')
vid = ogg['video']
mat = soy.materials.Textured()
mat.colormap = vid
bil = soy.models.Billboard(mat)
bil.size = (4.0,3.0)
bod = soy.bodies.Body(sce)
bod.model = bil
bod.rotation = (1.0,0.4,0.2)

scr = soy.Screen()
win = soy.Window(scr, 'Video Billboard')
pro = soy.widgets.Projector(win, camera=cam)
can = soy.widgets.Canvas(win, texture=fps)

key = soy.controllers.Keyboard(win)
key['q'] = soy.actions.Quit()
key[ 1 ] = soy.actions.Quit() # 9 = esc key
wcn = soy.controllers.Window(win)
wcn['close'] = soy.actions.Quit()

if __name__ == '__main__' :
  while True:
    sleep(0.3)
    fps.text = str(cam.fps)
