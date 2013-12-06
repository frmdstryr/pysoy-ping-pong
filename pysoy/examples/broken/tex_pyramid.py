#!/usr/bin/env python

import soy
import pyramid
from time import sleep

lava = soy.transports.File('media/lava.soy')['gimp']
pym = pyramid.Pyramid(lava)

scr = soy.Screen()
win = soy.Window(scr, 'Textured Pyramid')

sce = soy.scenes.Scene()
cam = soy.bodies.Camera(sce)
cam.position = (0.0, 0.0, 5.0)

ca1 = soy.widgets.Canvas(win, aspect=0.0, texture=lava)
pro = soy.widgets.Projector(win, camera=cam)
pyr = soy.bodies.Body(sce, mesh=pym)
pyr.rotation = (1.0, 1.0, 0.0)

key = soy.controllers.Keyboard(win)
key['q'] = soy.actions.Quit()
key[ 1 ] = soy.actions.Quit() # 9 = esc key
    
wcn = soy.controllers.Window(win)
wcn['close'] = soy.actions.Quit()

if __name__ == '__main__' :
  while True:
    sleep(10)
