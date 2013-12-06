#!/usr/bin/env python3

import soy
from time import sleep

room = soy.scenes.Room(3.0)
room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
room['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))

client = soy.Client()
client.window.append(soy.widgets.Projector(room['cam']))

for color in ('red', 'orangered', 'orange', 'yellow', 'greenyellow', 'green',
              'turquoise', 'blue', 'purple', 'maroon') :
    room[color] = soy.bodies.Box(material=soy.materials.Colored(color))

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
