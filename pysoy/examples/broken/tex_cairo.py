#!/usr/bin/env python
from PIL import Image
import soy, cairo

class TexCairo(object):  # Maybe inherit from soy.textures.Image
  def __init__(self):
    self.WIDTH	= 400 
    self.HEIGHT	= 400
    self.test()

  def setup(self):
    """Setup Cairo"""
    self.surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, self.WIDTH, self.HEIGHT)
    self.ctx = cairo.Context(self.surface)

    # Set thickness of brush
    self.ctx.set_line_width(15)

  def draw(self):
    """Draw out the triangle using absolute coordinates"""
    self.ctx.set_source_rgba(.4, 1, 1, 1)
    self.ctx.fill()
    self.ctx.move_to(200, 100)
    self.ctx.line_to(300, 300)
    self.ctx.rel_line_to(-200, 0)
    self.ctx.close_path()
  def applyInk(self):
    """Apply the ink"""
    self.ctx.stroke()

  def output(self):
    self.surface.write_to_png("triangle.png")

  def create_PIL(self):
    """Instantiates a PIL image"""
    self.PIL_image	= Image.frombuffer( 'RGBA', 
                                        (self.WIDTH, self.HEIGHT),
                                        self.surface.get_data_as_rgba(), 
                                        "raw", 'RGBA', 0, 1)

  def factory(self):
    return soy.textures.Image(self.PIL_image)

  ###
  def test(self):
    self.setup()
    self.draw()
    self.applyInk()
    self.output()
    self.create_PIL()


import pyramid
from time import sleep

img = TexCairo()
lava = img.factory()

luma = img.factory()
pym = pyramid.Pyramid(luma)

scr = soy.Screen()
win = soy.Window(scr, 'Textured Pyramid')

sce = soy.scenes.Scene()
cam = soy.bodies.Camera(sce)
cam.position = (0.0, 0.0, 5.0)

ca1 = soy.widgets.Canvas(win, aspect=0.0, texture=lava)
pro = soy.widgets.Projector(win, camera=cam)
pyr = soy.bodies.Body(sce, mesh=pym)
pyr.rotation = (1.0, 1.0, 0.0)

if __name__ == '__main__' :
  while True:
    sleep(10)
