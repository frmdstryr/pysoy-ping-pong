#!/usr/bin/env python3

import soy
from time import sleep

room = soy.scenes.Scene()
room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 5)))
room['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))

client = soy.Client()
client.window.append(soy.widgets.Projector(room['cam']))

firebrick = soy.atoms.Color('firebrick')
goldenrod = soy.atoms.Color('goldenrod')

material = soy.materials.Textured()
material.bumpmap = soy.textures.Bumpmap("media/normal_map.png")
material.colormap = colormap=soy.textures.Cubemap("checkered",
										[firebrick, goldenrod])

room['cube'] = soy.bodies.Box()
room['cube'].material = material
room['cube'].addTorque(5, 5, 5)
room['cube'].radius = 0.1


if __name__ == '__main__' :
	while client.window :
		sleep(.1)
