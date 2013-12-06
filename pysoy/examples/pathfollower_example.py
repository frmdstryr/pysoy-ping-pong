#!/usr/bin/env python3

import soy
from time import sleep

scn = soy.scenes.Scene()
scn['cam'] = soy.bodies.Camera()
scn['cam'].position.z = 15
scn['light'] = soy.bodies.Light()
scn['light'].position = soy.atoms.Position((-2, 3, 5))

client = soy.Client()
client.window.append(soy.widgets.Projector(scn['cam']))
#kc = soy.controllers.Controller(win)
#wcn['close'] = soy.actions.Quit()
#key = soy.controllers.Keyboard(win)
#key['q'] = soy.quit()
#key[ 1 ] = soy.quit() #escape key

scn['bkgrnd'] = soy.bodies.Box()
scn['bkgrnd'].position.z = -10
scn['bkgrnd'].size = soy.atoms.Size((40,40,1))
scn['bkgrnd'].material = soy.materials.Colored()
scn['bkgrnd'].material.ambient = soy.atoms.Color('blue')
scn['bkgrnd'].material.diffuse = soy.atoms.Color('blue')
scn['bkgrnd'].material.specular = soy.atoms.Color('blue')

scn['cube'] = soy.bodies.Box()
scn['cube'].size = soy.atoms.Size((1,1,1))
scn['cube'].material = soy.materials.Colored()
scn['cube'].material.ambient = soy.atoms.Color('green')
scn['cube'].material.diffuse = soy.atoms.Color('yellow')
scn['cube'].material.specular = soy.atoms.Color('yellow')

path = (soy.atoms.Position((0,0,0)),
        soy.atoms.Position((3,0,0)),
        soy.atoms.Position((3,3,0)),
        soy.atoms.Position((3,3,3)),
        soy.atoms.Position((0,3,3)),
        soy.atoms.Position((0,0,3)),
        soy.atoms.Position((3,0,3)),
        soy.atoms.Position((0,3,0)),
        soy.atoms.Position((0,0,0)),
        soy.atoms.Position((-3,0,0)),
        soy.atoms.Position((-3,-3,0)),
        soy.atoms.Position((-3,-3,-3)),
        soy.atoms.Position((0,-3,-3)),
        soy.atoms.Position((0,0,-3)),
        soy.atoms.Position((-3,0,-3)),
        soy.atoms.Position((0,-3,0)),
        soy.atoms.Position((0,0,0)))

cont = soy.controllers.Pathfollower(scn, scn['cube'], path, 0.5)

if __name__ == '__main__' :
    while client.window and len(cont.path):
        print(cont, "Current Position: {},".format(scn['cube'].position), "Next waypoint:", cont.path[0])
        sleep(1)

print(cont)
sleep(1)
