#!/usr/bin/env python

''' Tests for soy.atoms.Axis 
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

ax = soy.atoms.Axis

class TestAxis(unittest.TestCase):
  def setUp(self):
    self.p = ax((1,1,1))
    self.p2 = ax((2,2,2))

  def test_compare(self):
    self.assertEqual(self.p, self.p)

  def test_add(self):
    self.assertEqual(self.p+self.p, ax((2,2,2)))
    self.assertEqual(self.p+1, ax((2,2,2)))

  def test_sub(self):
    self.assertEqual(self.p-self.p, ax((0,0,0)))
    self.assertEqual(self.p-1, ax((0,0,0)))

  def test_mul(self):
    self.assertEqual(self.p*self.p2, ax((2,2,2)))
    self.assertEqual(self.p*2, ax((2,2,2)))
    
  def test_div(self):
    self.assertEqual(self.p2/self.p2, ax((1,1,1)))
    self.assertEqual(self.p2/2, ax((1,1,1)))

  def test_inplace_add(self):
    p = ax((1,1,1))
    p += p
    self.assertEqual(p, ax((2,2,2)))

    p = ax((1,1,1))
    p += 1
    self.assertEqual(p, ax((2,2,2)))

  def test_inplace_sub(self):
    p = ax((1,1,1))
    p -= p
    self.assertEqual(p, ax((0,0,0)))

    p = ax((1,1,1))
    p -= 1
    self.assertEqual(p, ax((0,0,0)))

  def test_inplace_mul(self):
    p = ax((1,1,1))
    p *= self.p2
    self.assertEqual(p, ax((2,2,2)))

    p = ax((1,1,1))
    p *= 2
    self.assertEqual(p, ax((2,2,2)))            


  def test_inplace_div(self):
    p = ax((2,2,2))
    p /= self.p2
    self.assertEqual(p, ax((1,1,1)))

    p = ax((2,2,2))
    p /= 2
    self.assertEqual(p, ax((1,1,1)))            

def TestAxisSuite() :
  return unittest.TestLoader().loadTestsFromTestCase(TestAxis)

if __name__=='__main__':
  unittest.main()
