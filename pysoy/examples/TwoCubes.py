#!/usr/bin/env python3

import soy
from time import sleep

room = soy.scenes.Room(3.0)
room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
room['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))

client = soy.Client()
client.window.append(soy.widgets.Projector(room['cam']))

#kc = soy.controllers.Controller(win)
#wcn['close'] = soy.actions.Quit()
#key = soy.controllers.Keyboard(win)
#key['q'] = soy.quit()
#key[ 1 ] = soy.quit() #escape key

firebrick = soy.atoms.Color('firebrick')
goldenrod = soy.atoms.Color('goldenrod')

cubemap = soy.textures.Cubemap("checkered",
                               [firebrick, goldenrod], 1,2,3)

room['cube1'] = soy.bodies.Box(soy.atoms.Position((-3, 0.25, 0)),
                               material=soy.materials.Colored('deeppink'))
room['cube1'].material.diffuse.alpha = 128
room['cube1'].addTorque(0.05, 0.10, 0.03)
room['cube1'].addForce(0.05, 0, 0)
room['cube1'].radius = 0.1

room['cube2'] = soy.bodies.Box(soy.atoms.Position((3, -0.25, 0)),
                               material=soy.materials.Textured())
room['cube2'].material.colormap = cubemap
room['cube2'].addTorque(0.03, -0.08, -0.05)
room['cube2'].addForce(-0.05, 0, 0)
room['cube2'].size = soy.atoms.Size((1.5, 1.5, 1.5))
room['cube2'].radius = 0.1

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
