#!/usr/bin/env python3

import soy 
from time import sleep

room = soy.scenes.Room(3.0)
room2 = soy.scenes.Room(3.0)

room['cam'] = soy.bodies.Camera()
room['cam'].position.z = 15

room2['cam'] = soy.bodies.Camera()
room2['cam'].position.z = 15

room['light'] = soy.bodies.Light()
room['light'].position = soy.atoms.Position((-2, 3, 5))

room2['light'] = soy.bodies.Light()
room2['light'].position = soy.atoms.Position((-2, 3, 5))

client = soy.Client()

hbox = soy.widgets.HBox()
hbox2 = soy.widgets.HBox()
client.window.append(hbox)
client.window.append(hbox2)

projector = soy.widgets.Projector(room['cam'])
projector2 = soy.widgets.Projector(room2['cam'])

hbox.append(projector)
hbox2.append(projector2)

#kc = soy.controllers.Controller(win)
#wcn['close'] = soy.actions.Quit()
#key = soy.controllers.Keyboard(win)
#key['q'] = soy.quit()
#key[ 1 ] = soy.quit() #escape key

room['cube'] = soy.bodies.Box()
room2['cube'] = soy.bodies.Box()

room['cube'].position.x = -3
room2['cube'].position.x = 3

room['cube'].material = soy.materials.Colored()
room2['cube'].material = soy.materials.Colored()

room['cube'].material.ambient = soy.atoms.Color('red')
room['cube'].material.diffuse = soy.atoms.Color('red')
room['cube'].material.specular = soy.atoms.Color('pink')

room2['cube'].material.ambient = soy.atoms.Color('blue')
room2['cube'].material.diffuse = soy.atoms.Color('blue')
room2['cube'].material.specular = soy.atoms.Color('cyan')

room['cube'].addTorque(0.05,  0.10,  0.03)
room2['cube'].addTorque(0.03, -0.08, -0.05)

room['cube'].addForce(.05,0,0)
room2['cube'].addForce(-.05,0,0)

print(room)

projector.size = soy.atoms.Size((180,320,0))
projector2.size = soy.atoms.Size((180,320,0))

print(projector)
print (projector.size)
print (client.window.size)
if __name__ == '__main__' :
	while True:
		sleep(10)


