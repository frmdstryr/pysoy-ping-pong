#!/usr/bin/env python3

import soy
import random
from time import sleep

map = soy.textures.Texture()
map.channels = 1
map.size = soy.atoms.Size((16, 16, 16))

for i in range(len(map)):
	value = (int)(random.random()*255)
	map[i] = soy.atoms.Color((value,value,value,255))

mat = soy.materials.Colored('blue')

sce = soy.scenes.Landscape(map, mat, 1, soy.atoms.Size((32, 8, 32)), soy.atoms.Position((0,0,0)))
sce['box'] = soy.bodies.Box()
sce['box'].size = soy.atoms.Size((1,1,1))
sce['box'].position = soy.atoms.Position((0,15,0))
sce['box'].material = soy.materials.Colored('red')
sce['box'].addTorque(5,5,5)
sce['box'].addForce(0,-250,0)

sce['cam'] = soy.bodies.Camera(soy.atoms.Position((0,30,30)))
sce['cam'].rotation = soy.atoms.Rotation((0, 0, 0.7))
sce['light'] = soy.bodies.Light(soy.atoms.Position((-30, 40, 60)))


client = soy.Client()
client.window.append(soy.widgets.Projector(sce['cam']))

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
