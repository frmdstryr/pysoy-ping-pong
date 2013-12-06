#!/usr/bin/env python

''' Tests for soy.atoms.Face 
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
pos = soy.atoms.Position
ver = soy.atoms.Vertex
fac = soy.atoms.Face

class TestFace(unittest.TestCase):
  def setUp(self):
    self.v1 = ver(pos((0, 0, 0)), vec((0, 1, 0)), pos((0, 0, 0)), vec((0, 1, 0)))
    self.v2 = ver(pos((1, 1, 1)), vec((1, 2, 1)), pos((1, 1, 1)), vec((1, 2, 1)))
    self.v3 = ver(pos((2, 2, 2)), vec((2, 3, 2)), pos((2, 2, 2)), vec((2, 3, 2)))
    self.f = fac(self.v1, self.v2, self.v3)

  def test_init(self):
    self.assertEqual(len(self.f), 3)
    self.assertEqual(self.f[0], self.v1)
    self.assertEqual(self.f[1], self.v2)
    self.assertEqual(self.f[2], self.v3)

  def test_cmp_eq(self):
    self.assertEqual(self.f, fac(self.v1, self.v2, self.v3))
    self.assertEqual(self.f, 
                     fac(ver(pos((0, 0, 0)), vec((0, 1, 0)), pos((0, 0, 0)), vec((0, 1, 0))),
                         ver(pos((1, 1, 1)), vec((1, 2, 1)), pos((1, 1, 1)), vec((1, 2, 1))),
                         ver(pos((2, 2, 2)), vec((2, 3, 2)), pos((2, 2, 2)), vec((2, 3, 2)))))

def TestFaceSuite() :
  return unittest.TestLoader().loadTestsFromTestCase(TestFace)

if __name__=='__main__':
  unittest.main()
