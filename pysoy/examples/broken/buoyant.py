#!/usr/bin/env python
import soy
import blocks
from time import sleep
from random import random

sce = soy.scenes.Scene()
cam = soy.bodies.Camera(sce)
cam.position = (0.0, 0.0, 15.0)

lig = soy.bodies.Light(sce)
lig.position = (-10.0,10.0,2.0)
m = soy.bodies.fields.Monopole(sce)
m.position=(0,0,0)
m.multiplier=-4
b = soy.bodies.fields.Buoyancy(sce)
b.position=(0,0,0)
b.density=2
b.shape = soy.shapes.Sphere(2.1)
d = soy.bodies.fields.Wind(sce)
d.position=(0,0,0)
d.density=4
d.vector=(0,0,0)
bks = blocks.blocks(sce)

scr = soy.Screen()
win = soy.Window(scr, size=(500,375))
win.title = 'Buoyant Blocks'
stx = soy.widgets.StackX(win)
pro = soy.widgets.Projector(stx, camera=cam)

if __name__ == '__main__' :
  while True:
    sleep(random()*2)
    c = int(random()*8)
    #blocks[cname[c]].rotation = (srand(), srand(), srand())
