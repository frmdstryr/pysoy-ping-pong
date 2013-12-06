#!/usr/bin/env python
import soy
from time import sleep
from random import random

sce = soy.scenes.Scene()
scr = soy.Screen()
tex = soy.transports.File('media/pysoy_logo.soy')['gimp']
sleep(.1) # Hold your horses, buddy!
win = soy.Window(scr, 'Mesh shape test', tex)
cam = soy.bodies.Camera(sce)
cam.position = (0.0, 0.0, 20.0)
lig = soy.bodies.Light(sce)
lig.position = (-10.0,10.0,2.0)
pro = soy.widgets.Projector(win, camera=cam)
mat = soy.materials.StainlessSteel()
key = soy.controllers.Keyboard(win)
key['q'] = soy.actions.Quit()
key[ 1 ] = soy.actions.Quit() # 9 = esc key
wcn = soy.controllers.Window(win)
wcn['close'] = soy.actions.Quit()


bks = []
for i in xrange(50):
  if random() < 0.45:
    sha = soy.shapes.Sphere(0.5)
    bks.append(soy.bodies.Body(scene=sce,model=soy.models.Shape(mat),shape=sha))
    m = soy.masses.Sphere(bks[-1])
    m.Create(1.0,0.5)
  elif random() < 0.45:
    sha = soy.shapes.Box(0.5, 0.5, 0.5)
    bks.append(soy.bodies.Body(scene=sce,model=soy.models.Shape(mat),shape=sha))
    m= soy.masses.Box(bks[-1])
    m.Create(1.0,0.5,0.5,0.5)
  else:
    sha = soy.shapes.Capsule(0.1, 3.0)
    bks.append(soy.bodies.Body(scene=sce,model=soy.models.Shape(mat),shape=sha))
    m = soy.masses.Capsule(bks[-1])
    m.Create(1.0)
  
  bks[-1].position = (random()*5.0, random()*5.0, random()*5.0)
  #bks[-1].velocity = (random(), random(), random())
  #bks[-1].rotation = (random(), random(), random())

if __name__ == '__main__' :
  while True:
    sleep(0.1)


