#!/usr/bin/env python3

''' Tests for soy.atoms.Rotation
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

rot = soy.atoms.Rotation

class TestRotation(unittest.TestCase):
    def setUp(self):
        self.r = rot((1,2,3))

    def test_compare(self):
        self.assertEqual(self.r, self.r)

    def test_add(self):
        self.assertEqual(self.r + self.r, rot((2,4,6)))
        self.assertEqual(self.r + 1, rot((2,3,4)))

    def test_sub(self):
        self.assertEqual(self.r - self.r, rot((0,0,0)))
        self.assertEqual(self.r - 1, rot((0,1,2)))

    def test_mul(self):
        self.assertEqual(self.r * self.r, rot((1,4,9)))
        self.assertEqual(self.r * 2, rot((2,4,6)))

    def test_div(self):
        self.assertEqual(self.r / self.r, rot((1,1,1)))
        self.assertEqual(rot((2,4,8)) / 2, rot((1,2,4)))

    def test_inplace_add(self):
        r = rot((1,2,3))
        r += r
        self.assertEqual(r, rot((2,4,6)))

        r = rot((1,2,3))
        r += 1
        self.assertEqual(r, rot((2,3,4)))

    def test_inplace_sub(self):
        r = rot((1,2,3))
        r -= r
        self.assertEqual(r, rot((0,0,0)))

        r = rot((1,2,3))
        r -= 1
        self.assertEqual(r, rot((0,1,2)))

    def test_inplace_mul(self):
        r = rot((1,2,3))
        r *= 2
        self.assertEqual(r, rot((2,4,6)))            

    def test_inplace_div(self):
        r = rot((2,4,6))
        r /= 2
        self.assertEqual(r, rot((1,2,3)))            
    
def TestRotationSuite() :
    return unittest.TestLoader().loadTestsFromTestCase(TestRotation)

if __name__=='__main__':
    unittest.main()
