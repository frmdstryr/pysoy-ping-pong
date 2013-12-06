#!/usr/bin/env python3

''' Tests for soy.textures.Texture 
'''
__credits__ = '''
    Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program; if not, see http://www.gnu.org/licenses
'''
__author__  = 'PySoy Group'
__date__    = 'Last change on '+ \
              '$Date:$'[7:-20]+ \
              'by '+'$Author:$'[9:-2]
__version__ = 'Trunk (r'+'$Rev:$'[6:-2]+')'

import soy
import unittest

class TestTexture(unittest.TestCase):
  def test_svg(self):
    t = soy.textures.Texture('TestTexture_image.svg')

  def test_png(self):
    t = soy.textures.Texture('../examples/media/decal.png')
    t.channels = 1

    with self.assertRaises(IOError):
      t = soy.textures.Texture('unknown.png')

    with self.assertRaises(IOError):
      t = soy.textures.Texture('unknown.svg')

  def test_size(self):
    t = soy.textures.Texture()

    self.assertEqual(t.size.width, 0)
    self.assertEqual(t.size.height, 0)
    self.assertEqual(t.size.depth, 0)
    self.assertEqual(len(t), 0)

    t.size = soy.atoms.Size((2,4,0))

    self.assertEqual(t.size.width, 2)
    self.assertEqual(t.size.height, 4)
    self.assertEqual(t.size.depth, 0)
    self.assertEqual(len(t), 2*4)

    t.size = soy.atoms.Size((128,256,0))

    self.assertEqual(len(t), 128*256)

    # These changes are to test if segfault happens
    t.channels = 4
    t.channels = 3
    t.channels = 2
    t.channels = 1

  def test_smooth(self):
    t = soy.textures.Texture()
    self.assertEqual(t.smooth, True)

    t.smooth = False
    self.assertEqual(t.smooth, False)

  def test_wrap(self):
    t = soy.textures.Texture()
    self.assertEqual(t.wrap, True)

    t.wrap = False
    self.assertEqual(t.wrap, False)

  def test_aspect(self):
    t = soy.textures.Texture()

    self.assertEqual(t.aspect, 0)

    t.size = soy.atoms.Size((2, 3, 0))

    self.assertEqual(t.aspect, 2.0/3.0)
  
  def test_channels(self):
    t = soy.textures.Texture()
    self.assertEqual(t.channels, 3)

    t.size = soy.atoms.Size((1,1,0))

    t.channels = 1
    self.assertEqual(t.channels, 1)

    t[0] = soy.atoms.Color('yellow')
    self.assertEqual(t[0].red, t[0].green)
    self.assertEqual(t[0].green, t[0].blue)
    self.assertEqual(t[0].alpha, 255)

    t.channels = 2
    self.assertEqual(t.channels, 2)

    a = soy.atoms.Color('black')
    a.luma = 14
    a.alpha = 16
    t[0] = a
    self.assertEqual(t[0].luma, 14)
    self.assertEqual(t[0].alpha, 16)

    t.channels = 3
    self.assertEqual(t.channels, 3)

    a = soy.atoms.Color('magenta')
    a.alpha = 128
    t[0] = a
    self.assertEqual(t[0].red, a.red)
    self.assertEqual(t[0].green, a.green)
    self.assertEqual(t[0].blue, a.blue)
    self.assertNotEqual(t[0].alpha, a.alpha)

    t.channels = 4
    self.assertEqual(t.channels, 4)

    a = soy.atoms.Color('magenta')
    a.alpha = 128
    self.assertEqual(t[0].red, a.red)
    self.assertEqual(t[0].green, a.green)
    self.assertEqual(t[0].blue, a.blue)
    self.assertEqual(t[0].alpha, a.alpha)

    with self.assertRaises(ValueError):
      t.channels = -5

    with self.assertRaises(ValueError):
      t.channels = 100

  def test_colors(self):
    t = soy.textures.Texture()
    t2 = soy.textures.Texture()
    t.size = soy.atoms.Size((5,5,0))
    t2.size = soy.atoms.Size((5,5,0))

    c = soy.atoms.Color('blue')

    t[0] = c
    t[1] = c
    t2[2] = c

    self.assertEqual(t[0], t[1])
    self.assertEqual(t[0], t2[2])
    c.blue = 0
    c.red = 255

    self.assertEqual(t[0].red, 255)
    self.assertEqual(t[0].blue, 0)

    self.assertEqual(t[1].red, 255)
    self.assertEqual(t[1].blue, 0)

    self.assertEqual(t2[2].red, 255)
    self.assertEqual(t2[2].blue, 0)

    with self.assertRaises(IndexError):
    	t[25] = c


def TestTextureSuite():
  return unittest.TestLoader().loadTestsFromTestCase(TestTexture)

if __name__=='__main__':
  unittest.main()
