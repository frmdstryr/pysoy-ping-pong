#!/usr/bin/env python3

import soy
from random import random

def srand() :
  return random()-.5

def blocks(sce, color, positionX, positionY, positionZ):
  cubemap = soy.textures.Cubemap("checkered", soy.atoms.Color(color))
  sce[color] = soy.bodies.Box()
  sce[color].material = soy.materials.Textured()
  sce[color].material.colormap = cubemap
  sce[color].rotation = soy.atoms.Rotation((srand(), srand(), srand()))
  sce[color].addTorque(10, 10, 10)
  sce[color].addForce(1, 1, 1)
  sce[color].radius = 0.1
  sce[color].position = soy.atoms.Position((positionX, positionY, positionZ))
