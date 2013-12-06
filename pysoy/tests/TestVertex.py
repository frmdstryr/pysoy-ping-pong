#!/usr/bin/env python

''' Tests for soy.atoms.Vertex 
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

pos = soy.atoms.Position
vec = soy.atoms.Vector
ver = soy.atoms.Vertex


class TestVertex(unittest.TestCase):
  def setUp(self):
    self.v = ver(pos((0, 0, 0)), vec((0, 1, 0)), pos((0, 0, 0)), vec((0, 1, 0)))

  def test_init(self):
    self.assertEqual(self.v.position, pos((0,0,0)))
    self.assertEqual(self.v.normal, vec((0,1,0)))
    self.assertEqual(self.v.texcoord, pos((0,0,0)))
    self.assertEqual(self.v.tangent, vec((0,1,0)))

  def test_cmp_eq(self):
    self.assertEqual(self.v, ver(pos((0, 0, 0)), vec((0, 1, 0)), pos((0, 0, 0)), vec((0, 1, 0))))

  def test_cmp_ne(self):
    self.assertNotEqual(self.v, ver(pos((1, 0.5, 2)), vec((3, 0.1, 0)), pos((0, 0, 0)), vec((0, 1, 0))))

  def test_cmp_not_implemented(self):
    with self.assertRaises(NotImplementedError):
      self.v < ver(pos((1, 0.5, 2)), vec((3, 0.1, 0)), pos((0, 0, 0)), vec((0, 1, 0)))

    with self.assertRaises(NotImplementedError):
      self.v > ver(pos((1, 0.5, 2)), vec((3, 0.1, 0)), pos((0, 0, 0)), vec((0, 1, 0)))

    with self.assertRaises(NotImplementedError):
      self.v <= ver(pos((1, 0.5, 2)), vec((3, 0.1, 0)), pos((0, 0, 0)), vec((0, 1, 0)))

    with self.assertRaises(NotImplementedError):
      self.v >= ver(pos((1, 0.5, 2)), vec((3, 0.1, 0)), pos((0, 0, 0)), vec((0, 1, 0)))

def TestVertexSuite() :
  return unittest.TestLoader().loadTestsFromTestCase(TestVertex)

if __name__=='__main__':
  unittest.main()
