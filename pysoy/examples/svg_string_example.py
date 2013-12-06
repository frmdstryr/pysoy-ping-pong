#!/usr/bin/env python3

import soy
from time import sleep

client = soy.Client()
room = soy.scenes.Room(8)

room['cam'] = soy.bodies.Camera((0,0,5))
client.window.append(soy.widgets.Projector(room['cam']))

room['light'] = soy.bodies.Light((0, 0, 10))
room['cube'] = soy.bodies.Box((0,0,0),(2,2,2))

tex = soy.textures.Texture('<svg width="300" height="300"> \
   <rect width="300" height="300" style="stroke: none; fill: #ffffff"/> \
   <circle cx="80" cy="90" r="60" style="stroke: none; fill: #0000ff"/> \
   <circle cx="230" cy="70" r="50" style="stroke: none; fill: #ff00ff"/> \
   <circle cx="150" cy="220" r="70" style="stroke: none; fill: #ff0000"/> \
</svg>')

room['cube'].material = soy.materials.Textured(colormap=tex)
room['cube'].addTorque(50,100,150)
room['cube'].radius = 0.1

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
