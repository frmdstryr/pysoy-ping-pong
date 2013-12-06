#!/usr/bin/env python3

''' Tests for soy.joints.Fixed 
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
import math
from time import sleep
S = soy.scenes.Scene
B = soy.bodies.Box
F = soy.joints.Fixed

class TestFixed(unittest.TestCase):
  def setUp(self):
    self.scene = S()

  def test_connect(self):
    self.scene['box1'] = B()
    self.scene['box2'] = B()
    self.scene['box3'] = B()
    j = F(self.scene['box1'], self.scene['box2'])
    j1 = F(self.scene['box1'], self.scene['box3'])
    j2 = F(self.scene['box2'], self.scene['box3'])
    self.assertIsInstance(j, F)
    self.assertIsInstance(j1, F)
    self.assertIsInstance(j2, F)

  def test_disconnect(self):
    self.scene['box1'] = B(soy.atoms.Position((-5, 0, 0)))
    self.scene['box2'] = B(soy.atoms.Position((0, 0, 0)))
    j = soy.joints.Fixed(self.scene['box1'], self.scene['box2'])
    d1 = math.sqrt((self.scene['box1'].position.x - self.scene['box2'].position.x) *
                   (self.scene['box1'].position.x - self.scene['box2'].position.x)+(self.scene['box1'].position.y - self.scene['box2'].position.y )*
                   (self.scene['box1'].position.y - self.scene['box2'].position.y )+(self.scene['box1'].position.z - self.scene['box2'].position.z)*
                   (self.scene['box1'].position.z - self.scene['box2'].position.z ))
    del(j)
    self.assertIn('box1', self.scene)
    self.assertIn('box2', self.scene)
    try: j
    except NameError:
        j = 0
    else:
        self.assertNotIsInstance(j, F)
    n = 0
    self.scene['box1'].position = soy.atoms.Position((-4, 0, 0))
    while (n < 1):
        sleep(.1)
        d2 = math.sqrt((self.scene['box1'].position.x - self.scene['box2'].position.x) *
                             (self.scene['box1'].position.x - self.scene['box2'].position.x)+(self.scene['box1'].position.y - self.scene['box2'].position.y )*
                             (self.scene['box1'].position.y - self.scene['box2'].position.y )+(self.scene['box1'].position.z - self.scene['box2'].position.z)*
                             (self.scene['box1'].position.z - self.scene['box2'].position.z ))
        n = n + 1
    self.assertEqual(d1, d2+1)

  def test_del_bodies_with_j(self):
    self.scene['box1'] = B()
    self.scene['box2'] = B()
    j = soy.joints.Fixed(self.scene['box1'], self.scene['box2'])
    del(self.scene['box1'])
    del(self.scene['box2'])
    self.assertIsInstance(j, F)
    self.assertNotIn('box1', self.scene)
    self.assertNotIn('box2', self.scene)

  def test_move(self):
    self.scene['box1'] = B(soy.atoms.Position((-5, 0, 0)))
    self.scene['box2'] = B(soy.atoms.Position((0, 0, 0)))
    j = soy.joints.Fixed(self.scene['box1'], self.scene['box2'])
    d1 = math.sqrt((self.scene['box1'].position.x - self.scene['box2'].position.x) *
                         (self.scene['box1'].position.x - self.scene['box2'].position.x)+(self.scene['box1'].position.y - self.scene['box2'].position.y )*
                         (self.scene['box1'].position.y - self.scene['box2'].position.y )+(self.scene['box1'].position.z - self.scene['box2'].position.z)*
                         (self.scene['box1'].position.z - self.scene['box2'].position.z ))
    n = 0
    while (n < 1):
        self.scene['box1'].rotation = soy.atoms.Rotation((2, 2, 2))
        d2 = math.sqrt((self.scene['box1'].position.x - self.scene['box2'].position.x) *
                             (self.scene['box1'].position.x - self.scene['box2'].position.x)+(self.scene['box1'].position.y - self.scene['box2'].position.y )*
                             (self.scene['box1'].position.y - self.scene['box2'].position.y )+(self.scene['box1'].position.z - self.scene['box2'].position.z)*
                             (self.scene['box1'].position.z - self.scene['box2'].position.z ))
        n = n + 1
    self.assertEqual(d2, d1)


def TestFixedSuite():
  return unittest.TestLoader().loadTestsFromTestCase(TestFixed)

if __name__=='__main__':
  unittest.main()

