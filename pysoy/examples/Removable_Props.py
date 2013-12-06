#!/usr/bin/env python3

import soy
from time import sleep

_on=1
size=4
room = soy.scenes.Room(3.0)
room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
room['light'] = soy.bodies.Light(soy.atoms.Position((-2,3,5)))
client = soy.Client()
client.window.append(soy.widgets.Projector(room['cam']))
c1cm = soy.textures.Texture()
c2cm = soy.textures.Texture()
c1gm = soy.textures.Texture()
c1cm.size=soy.atoms.Size((size,size))
c2cm.size=soy.atoms.Size((size,size))
c1gm.size=soy.atoms.Size((size,size))
for x in list(range(size)) + list(range(size,size*size)):
    c1cm[x]=soy.atoms.Color('red')
for x in list(range(size)) + list(range(size,size*size)): 
    c2cm[x]=soy.atoms.Color('green')
for y in range((int)(size*size/2)):
    c1gm[y]=soy.atoms.Color('blue')
c1tex = soy.materials.Textured(glowmap=c1gm)

print ('props '+str(c1tex) + str(dir(c1tex)))

room['cube1'] = soy.bodies.Box(soy.atoms.Position((-3, 0.25, 0)),
                               material=c1tex)
room['cube1'].addTorque(0.05, .10, .03)
room['cube1'].addForce(0.05, 0, 0)
if __name__ == '__main__' :
    while client.window :
        sleep(5)
        if _on == 1:
            _on = 0
            c1tex.colormap = c2cm
        elif _on == 0:
            _on = 1
            del(c1tex.colormap)
