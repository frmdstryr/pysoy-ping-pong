#!/usr/bin/env python3

import soy
from time import sleep

mat = soy.materials.Textured(colormap=
        soy.textures.Texture('checkered', (soy.atoms.Color('black'),
                                           soy.atoms.Color('grey'))))
mat.colormap.wrap = True
world = soy.scenes.Planar(material=mat, step=6)
world['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 10, 15)))
world['cam'].rotation.gamma = .5
world['cam'].addForce(0,0,5)
world['light'] = soy.bodies.Light(soy.atoms.Position((0, 5, 0)))
world['light'].texture = soy.textures.Texture('rainbow', ())
world.scale = 2

world['cube1'] = soy.bodies.Box(soy.atoms.Position((-3, 1.1, 0)),
    material=soy.materials.Textured(
        colormap=soy.textures.Cubemap('checkered', [soy.atoms.Color('cyan')])))
world['cube1'].addTorque(0.05, 0.10, 0.03)
world['cube1'].addForce(0.05, 0, 0)

world['cube2'] = soy.bodies.Box(soy.atoms.Position((3, 15, 0)),
    material=soy.materials.Textured(
        colormap=soy.textures.Cubemap('rainbow', ())))
world['cube2'].addTorque(0.03, -0.08, -0.05)
world['cube2'].addForce(-0.05, 0, 0)
world['cube2'].size = soy.atoms.Size((3.6, 1.5, 1.0))


client = soy.Client()
client.window.append(soy.widgets.Projector(world['cam']))

world['cam'].addForce(0,0,5)

if __name__ == '__main__' :
	while client.window :
		sleep(.1)
