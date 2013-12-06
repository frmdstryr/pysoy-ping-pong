#!/usr/bin/env python3
import soy
#import blocks
from time import sleep

sce = soy.scenes.Room(3.0)
sce['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
sce['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))

colors = [
  'red',
  'blue',
  'gold',
  'deeppink',
  'firebrick',
  'goldenrod',
  'green',
  'darkslategray'
]
n = 1
for color in colors:
    bk = {}
    bk[color] = blocks.blocks(sce, color, n, 1, 1)
    n=n+1
        

client = soy.Client()
client.window.append(soy.widgets.Projector(sce['cam']))
client.window.background = soy.atoms.Color('white')

if __name__ == '__main__' :
  while client.window :
    sleep(.1)
