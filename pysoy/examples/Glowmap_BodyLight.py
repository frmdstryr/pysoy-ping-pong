#!/usr/bin/env python3

import soy
from time import sleep
_LIGHT= soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))

# Get the starting initial light settings
_LIGHT_diffuse = _LIGHT.diffuse
_LIGHT_ambient = _LIGHT.ambient
_LIGHT_specular = _LIGHT.specular

_NOCOLOR = soy.atoms.Color((0,0,0,0))

_on=1
size=4
room = soy.scenes.Room(3.0)
room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
room['light'] = _LIGHT
room.ambient = soy.atoms.Color('black')
client = soy.Client()
projector = soy.widgets.Projector(room['cam'])
client.window.append(projector)
c1cm = soy.textures.Texture()
c1gm = soy.textures.Texture()
c1cm.size=soy.atoms.Size((size,size))
c1gm.size=soy.atoms.Size((size,size))
c1tex = soy.materials.Textured(colormap=c1cm,glowmap=c1gm)

for x in range(size*size):
    c1cm[((int)(x/size))*size]=soy.atoms.Color('red')
    c1cm[((int)(x/size))*size + 1]=soy.atoms.Color('red')
for y in range(size*2,size*size):
    c1gm[y]=soy.atoms.Color('blue')

room['cube1'] = soy.bodies.Box(soy.atoms.Position((-3, 0.25, 0)),
                               material=c1tex)
room['cube1'].addTorque(0.05, 0.10, 0.03)
room['cube1'].addForce(0.05, 0, 0)

time = 0

if __name__ == '__main__' :
    while client.window:
        sleep(0.1)
        if time < 2:
            time += 0.1
        else:
            if _on:
                # hack to disable the lighting since there is no python binding
                # for this at the moment
                room['light'].ambient = _NOCOLOR
                room['light'].diffuse = _NOCOLOR
                room['light'].specular = _NOCOLOR
                _on = 0
            else:
                room['light'].diffuse = _LIGHT_diffuse
                room['light'].specular = _LIGHT_specular
                room['light'].ambient = _LIGHT_ambient
                _on = 1
            time = 0
