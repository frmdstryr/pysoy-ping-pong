#!/usr/bin/env python3

import soy
from time import sleep
from math import sqrt

scn = soy.scenes.Scene()
scn['cam'] = soy.bodies.Camera(soy.atoms.Position((0,0,15)))
scn['light'] = soy.bodies.Light(soy.atoms.Position((10, -3, 5)))

client = soy.Client()
client.window.append(soy.widgets.Projector(scn['cam']))
#kc = soy.controllers.Controller(win)
#wcn['close'] = soy.actions.Quit()
#key = soy.controllers.Keyboard(win)
#key['q'] = soy.quit()
#key[ 1 ] = soy.quit() #escape key

#bkgrnd = soy.bodies.Box(scn)
#bkgrnd.position.z = -10
#bkgrnd.size = soy.atoms.Size((40,40,1))
#bkgrnd.material = soy.materials.Colored()
#bkgrnd.material.ambient = soy.atoms.Color('blue')
#bkgrnd.material.diffuse = soy.atoms.Color('blue')
#bkgrnd.material.specular = soy.atoms.Color('blue')
#
scn['wall'] = soy.bodies.Box()
scn['wall'].size = soy.atoms.Size((5,.1,10))
scn['wall'].position = soy.atoms.Position((0.3, 1, 0))
scn['wall'].material = soy.materials.Colored()
scn['wall'].material.ambient = soy.atoms.Color('pink')
scn['wall'].material.diffuse = soy.atoms.Color('red')
scn['wall'].material.specular = soy.atoms.Color('red')

scn['cube'] = soy.bodies.Box()
scn['cube'].size = soy.atoms.Size((1,1,1))
scn['cube'].position = soy.atoms.Position((0,-3,0.5))
scn['cube'].material = soy.materials.Colored()
scn['cube'].material.ambient = soy.atoms.Color('green')
scn['cube'].material.diffuse = soy.atoms.Color('yellow')
scn['cube'].material.specular = soy.atoms.Color('yellow')

cont = soy.controllers.SpaceNavigator(scn, scn['cube'], soy.atoms.Position((0,3,5)), 0.5, 1, bounds=soy.atoms.Size((1,1,1)))

print(cont.path)
while not cont.finished:
    print(cont, "Current Position: {},".format(scn['cube'].position), "Next waypoint:", cont.path[0])
    sleep(1)
sleep(2)

del cont

print("\nNew Path (this may take a while!)\n")
cont = soy.controllers.SpaceNavigator(scn, scn['cube'], soy.atoms.Position((0.3,1,0.5)), 0.5, 1, bounds=soy.atoms.Size((1,1,1)))
print(cont.path)
while not cont.finished:
    print(cont, "Current Position: {},".format(scn['cube'].position), "Next waypoint:", cont.path[0])
    sleep(1)

del cont

cont = soy.controllers.GridNavigator(scn, scn['cube'], soy.atoms.Position((0,-3,0.5)), 0.5, 1, bounds=soy.atoms.Size((1,1,1)))
print(cont.path)
while not cont.finished:
    print(cont, "Current Position: {},".format(scn['cube'].position), "Next waypoint:", cont.path[0])
    sleep(1)

del cont
sleep(3)
soy.quit()
