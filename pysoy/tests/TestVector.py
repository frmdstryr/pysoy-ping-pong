#!/usr/bin/env python

''' Tests for soy.atoms.Vector
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

vec = soy.atoms.Vector


class TestVector(unittest.TestCase):
  def setUp(self):
    self.p = vec((1,1,1))
    self.p2 = vec((2,2,2))

  def test_compare(self):
    self.assertEqual(self.p, self.p)

  def test_add(self):
    self.assertEqual(self.p+self.p, vec((2,2,2)))

  def test_sub(self):
    self.assertEqual(self.p-self.p, vec((0,0,0)))

  def test_mul(self):
    self.assertEqual(self.p*2, vec((2,2,2)))

  def test_div(self):
    self.assertEqual(self.p2/self.p2, vec((1,1,1)))
    self.assertEqual(self.p2/2, vec((1,1,1)))

  def test_inplace_add(self):
    p = vec((1,1,1))
    p += p
    self.assertEqual(p, vec((2,2,2)))

  def test_inplace_sub(self):
    p = vec((1,1,1))
    p -= p
    self.assertEqual(p, vec((0,0,0)))

  def test_inplace_mul(self):
    p = vec((1,1,1))
    p *= 2
    self.assertEqual(p, vec((2,2,2)))


  def test_inplace_div(self):
    p = vec((2,2,2))
    p /= self.p2
    self.assertEqual(p, vec((1,1,1)))

    p = vec((2,2,2))
    p /= 2
    self.assertEqual(p, vec((1,1,1)))

  def test_length(self):
    self.assertEqual(len(self.p), 3)

  def test_item(self):
    self.assertEqual(self.p[1], 1)

  def test_assignment(self):
    p = vec((1, 1, 1))
    p[1] = 2
    self.assertEqual(p[1], 2)

  def test_dot(self):
    self.assertEqual(self.p.dot(self.p2), 6)
    self.assertEqual(self.p.dot((1, 2, 4)), 7)

  def test_cross(self):
    self.assertEqual(self.p.cross(self.p2), soy.atoms.Vector((0, 0, 0)))
    self.assertEqual(self.p.cross((2, 2, 2)), soy.atoms.Vector((0, 0, 0)))
    self.assertEqual(self.p2.cross((3,4,5)), soy.atoms.Vector((2, -4, 2,)))

  def test_magnitude(self):
    p = vec((1, 2, 2))
    self.assertEqual(p.magnitude(), 3)

  def test_normalize(self):
    p = vec((0, 2, 0))
    p.normalize()
    self.assertEqual(p, soy.atoms.Vector((0, 1, 0)))
    p = vec((3, 4, 5))
    p.normalize()
    self.assertEqual(p, soy.atoms.Vector((0.4242640687119285, 0.565685424949238, 0.7071067811865475)))
    
  def test_angle_between(self):
    self.assertEqual(self.p.angle_between(self.p2), 0)
    p2 = vec((1, 2, 3))
    self.assertAlmostEqual(self.p.angle_between(p2), 0.38759666)

def TestVectorSuite() :
  return unittest.TestLoader().loadTestsFromTestCase(TestVector)

if __name__=='__main__':
  unittest.main()
