#!/usr/bin/env python3

import soy
from time import sleep

client = soy.Client()
room = soy.scenes.Room(8)
room.walls = soy.materials.Colored('red')
room['cam'] = soy.bodies.Camera((0,0,20))
client.window.append(soy.widgets.Projector(room['cam']))

room['light'] = soy.bodies.Light((-2, 3, 5))


room['portal'] = soy.bodies.Portal()
room['portal'].position = soy.atoms.Position((0, 0, -3))
room['portal'].size = soy.atoms.Size((1,1,0.1))
room['portal2'] = soy.bodies.Portal()
room['portal2'].position = soy.atoms.Position((0, 0, 3))
room['portal2'].size = soy.atoms.Size((1,1,0.1))
room['portal'].rotation = soy.atoms.Rotation((0,0,3.14))
room['portal'].target = room['portal2']

room['cube'] = soy.bodies.Box(soy.atoms.Position((0, 0, 0)),
                               material=soy.materials.Colored('green'))
room['cube'].addTorque(10, 20, 30)

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
