#!/usr/bin/env python3

import soy
from time import sleep

room = soy.scenes.Room(5.0)
room['cam'] = soy.bodies.Camera()
room['cam'].position.z = 15
room['light'] = soy.bodies.Light()
room['light'].position = soy.atoms.Position((-2, 3, 5))
a = soy.controllers.Keyboard()

client = soy.Client()
client.window.append(soy.widgets.Projector(room['cam']))

room['cube'] = soy.bodies.Box()
room['cube'].position.x = -3
room['cube'].size = soy.atoms.Size((1,1,1))
room['cube'].material = soy.materials.Colored('green')
room['cube'].addTorque(0.00005,  0.000000,  0.00003)
room['cube'].addForce(0.01, 0, 0)

room['sphere'] = soy.bodies.Sphere()
room['sphere'].radius = 1.0
room['sphere'].position.x = 3
room['sphere'].material = soy.materials.Colored('orange')
room['sphere'].addTorque(0.005,  0.00,  0.03)

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
