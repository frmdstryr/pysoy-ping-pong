#!/usr/bin/env python3

import soy
from time import sleep

room = soy.scenes.Room(10.0)
client = soy.Client()

room['cam_l'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
room['cam_r'] = soy.bodies.Camera(soy.atoms.Position((0, 15, 0)))
room['cam_r'].rotation = soy.atoms.Rotation((0,0,1.6))

room['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))
room['billboard'] = soy.bodies.Billboard(soy.atoms.Position((0, 0, 0)),
                               size=soy.atoms.Size((2,2)),material=soy.materials.Colored('gold'))

room['cube1'] = soy.bodies.Box(soy.atoms.Position((-3, 0.25, 0)),
                               material=soy.materials.Colored('red'))
room['cube1'].addTorque(10, 20, 30)

room['cube2'] = soy.bodies.Box(soy.atoms.Position((2, 1, 3)),
                               material=soy.materials.Colored('green'))
room['cube2'].addTorque(30, 20, 10)

room['cube3'] = soy.bodies.Box(soy.atoms.Position((2, -2.25, -3)),
                               material=soy.materials.Colored('blue'))
room['cube3'].addTorque(20, 30, 10)

hbox = soy.widgets.HBox()
client.window.append(hbox)
hbox.append(soy.widgets.Projector(room['cam_l']))
hbox.append(soy.widgets.Projector(room['cam_r']))

if __name__ == '__main__' :
  while client.window :
    sleep(.1)
