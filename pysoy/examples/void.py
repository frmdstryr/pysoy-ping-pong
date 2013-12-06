#!/usr/bin/env python3

import soy
import blocks
from time import sleep

room = soy.scenes.Room(3.0)
room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
room['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))

client = soy.Client()
client.window.append(soy.widgets.Projector(room['cam']))

while client.window :
  sleep(.1)
