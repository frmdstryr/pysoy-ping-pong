import soy
from time import sleep
from random import random

sce = soy.scenes.Scene()
sce.ambient = soy.atoms.Color('purple')
sce.gravity = (0,0,0)
sce.friction = 1

scr = soy.Screen()
tex = soy.transports.File('media/pysoy_logo.soy')['gimp']
sleep(.1)

win = soy.Window(scr, 'simpleChase.py')
w = win.size
w = [w[0],w[1]]
w[0] = 700
w[1] = 700
win.size = w

cam = soy.bodies.Camera(sce)
cam.position = (0.0,0.0,20.0)
lig = soy.bodies.Light(sce)
lig.position = (-10.0,10.0,2.0)
pro = soy.widgets.Projector(win, camera=cam)
mat = soy.materials.stainlessSteel
mat2 = soy.materials.aventurine
key = soy.controllers.Keyboard(win)
key['q'] = soy.actions.Quit()
key[ 1 ] = soy.actions.Quit() #escape key
wcn = soy.controllers.Window(win)
wcn['close'] = soy.actions.Quit()

shape1 = soy.shapes.Sphere(0.5)
shape2 = soy.shapes.Capsule(0.5,3.0)

pred = soy.bodies.Body(scene=sce,model=soy.models.Shape(mat),shape=shape1)
pred.position = (random() * -5,random() * -5,-2)
pred.velocity = (0,0,0)
pred.rotation = (0,0,0)

prey = soy.bodies.Body(scene=sce,model=soy.models.Shape(mat2),shape=shape2)
prey.position = (random()*5,random()*5,2)
prey.velocity = (0,0,0)
prey.rotation = (0,0,0)

testv = .55   # change in velocity for the predator
xBound = 6.725  # boundaries of game area
yBound = 6.725
zBound = 4
bounce = .05  # amount of bounce from the boundaries

if __name__ == '__main__' :
  while True:
    sleep(0.1)
    
    predp = pred.position
    preyp = prey.position
    
    predv = pred.velocity
    predv = [predv[0], predv[1], predv[2]]
    preyv = prey.velocity
    preyv  = [preyv[0],preyv[1],preyv[2]]

    if predp[0] <= preyp[0] :   #if pred is to the left of prey
      predv[0] += testv
      pred.velocity = predv
   
    if predp[0] > preyp[0] :    #if pred is to the right of prey
      predv[0] += -(testv)
      pred.velocity = predv
          
    if predp[1] <= preyp[1] :   #if pred is below prey
      predv[1] += testv
      pred.velocity = predv
   
    if predp[1] > preyp[1] :    #if pred is above prey
      predv[1] += -(testv)
      pred.velocity = predv

    if predp[2] <= preyp[2] :   #if pred is behind prey
      predv[2] += testv
      pred.velocity = predv
   
    if predp[2] > preyp[2] :    #if pred is in front of prey
      predv[2] += -(testv)
      pred.velocity = predv

    #now maintain the bounds of the 'playing field'    
    if abs(predp[0]) > xBound:
      predv[0] *= -1
      pred.velocity = predv
    if predp[0] < -(xBound):
      predp[0] += bounce
      pred.position = predp 
    if predp[0] > xBound:
      predp[0] -= bounce         
      pred.position = predp
    if abs(preyp[0]) > xBound:
      preyv[0] *= -1
      prey.velocity = preyv
    if preyp[0] < -(xBound):
      preyp[0] += bounce
      prey.position = preyp
    if preyp[0] > xBound:
      preyp[0] -= bounce
      prey.position = preyp

    if abs(predp[1]) > yBound:
      predv[1] *= -1
      pred.velocity = predv
    if predp[1] < -(yBound):
      predp[1] += bounce
      pred.position = predp
    if predp[1] > yBound:
      predp[1] -= bounce
      pred.position = predp
    if abs(preyp[1]) > yBound:
      preyv[1] *= -1
      prey.velocity = preyv
    if preyp[1] < -(yBound):
      preyp[1] += bounce
      prey.position = preyp
    if preyp[1] > yBound:
      preyp[1] -= bounce
      prey.position = preyp

    if abs(predp[2]) > zBound:
      predv[2] *= -1
      pred.velocity = predv
    if predp[2] < -(zBound):
      predp[2] += bounce
      pred.position = predp
    if predp[2] > zBound:
      predp[2] -= bounce
      pred.position = predp
    if abs(preyp[2]) > zBound:
      preyv[2] *= -1
      prey.velocity = preyv
    if preyp[2] < -(zBound):
      preyp[2] += bounce
      prey.position = preyp
    if preyp[2] > zBound:
      preyp[2] -= bounce
      prey.position = preyp

    #slow the prey down if it gets too fast
    if preyv[0] > 10:
      preyv[0] = 7
    if preyv[1] > 10:
      preyv[1] = 7
    if preyv[2] > 10:
      preyv[2] = 7
    prey.velocity = preyv

