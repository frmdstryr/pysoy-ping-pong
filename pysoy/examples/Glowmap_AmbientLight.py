#!/usr/bin/env python3

import soy
from time import sleep

_on=1
size=4
room = soy.scenes.Room(3.0)
room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
client = soy.Client()
projector = soy.widgets.Projector(room['cam'])
client.window.append(projector)
c1cm = soy.textures.Texture()
c1gm = soy.textures.Texture()
c1cm.size=soy.atoms.Size((size,size))
c1gm.size=soy.atoms.Size((size,size))
c1tex = soy.materials.Textured(colormap=c1cm,glowmap=c1gm)
for x in range(size):
    c1cm[x]=soy.atoms.Color('red')
for y in range((int)(size*size/2)):
    c1gm[y]=soy.atoms.Color('blue')

room['cube1'] = soy.bodies.Box(soy.atoms.Position((-3, 0.25, 0)),
                               material=c1tex)
room['cube1'].addTorque(0.05, 0.10, 0.03)
room['cube1'].addForce(0.05, 0, 0)

time = 0

if __name__ == '__main__' :
    while client.window:
        sleep(0.1)
        if time < 5:
            time += 0.1
        else:
            _on, room.ambient = (0,soy.atoms.Color('black')) if _on else (1,soy.atoms.Color((127,127,127,255)))
            time = 0
