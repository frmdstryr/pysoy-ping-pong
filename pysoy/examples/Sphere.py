#!/usr/bin/env python3

import soy
from time import sleep

client = soy.Client()
room = soy.scenes.Room(8)

room['cam'] = soy.bodies.Camera((0,0,10))
client.window.append(soy.widgets.Projector(room['cam']))

room['light'] = soy.bodies.Light((-2, 3, 5))

room['sphere'] = soy.bodies.Sphere()
room['sphere'].material = soy.materials.Colored('cornflowerblue')
room['sphere'].radius = 3.0

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
