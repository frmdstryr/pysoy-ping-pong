#!/usr/bin/env python

''' Tests for soy.atoms.Area 
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

area = soy.atoms.Area

class TestArea(unittest.TestCase):
  def setUp(self):
    self.a = area((0.0, 0.5, 1.0, 1.5))

  def test_props(self):
    self.assertEqual(self.a.x1, 0.0)
    self.assertEqual(self.a.y1, 0.5)
    self.assertEqual(self.a.x2, 1.0)
    self.assertEqual(self.a.y2, 1.5)

    self.a.x1 += 2.0
    self.a.y1 += 2.0
    self.a.x2 += 2.0
    self.a.y2 += 2.0
    self.assertEqual(self.a.x1, 2.0)
    self.assertEqual(self.a.y1, 2.5)
    self.assertEqual(self.a.x2, 3.0)
    self.assertEqual(self.a.y2, 3.5)

def TestAreaSuite() :
  return unittest.TestLoader().loadTestsFromTestCase(TestArea)

if __name__=='__main__':
  unittest.main()
