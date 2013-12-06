#!/usr/bin/env python

''' Tests for soy._datatypes.BodyPosition 
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

class TestBodyPosition(unittest.TestCase):
  def setUp(self):
    self.B = soy._datatypes.BodyPosition((1,1,1))

  def test_add(self):
    self.assertEqual(self.B+1, soy._datatypes.BodyPosition((2,2,2)))
    self.assertEqual(self.B+1.1, soy._datatypes.BodyPosition((2.1,2.1,2.1)))

  def test_sub(self):
    self.assertEqual(self.B-1, soy._datatypes.BodyPosition((0,0,0)))
    self.assertEqual(self.B-1.1, soy._datatypes.BodyPosition((-.1,-.1,-.1)))
    self.assertEqual(1-self.B, soy._datatypes.BodyPosition((0,0,0)))
    self.assertEqual(1.1-self.B, soy._datatypes.BodyPosition((.1,.1,.1)))
  
  def test_mul(self):
    self.assertEqual(self.B*2, soy._datatypes.BodyPosition((2,2,2)))
    self.assertEqual(self.B*-2.2, soy._datatypes.BodyPosition((-2.2,-2.2,-2.2)))
  
  def test_div(self):
    self.assertEqual(self.B/2, soy._datatypes.BodyPosition((.5,.5,.5)))
    self.assertEqual(self.B/.5, soy._datatypes.BodyPosition((2,2,2)))
  
  def test_mod(self):
    self.assertEqual(self.B%2, soy._datatypes.BodyPosition((1,1,1)))
    self.assertEqual(self.B%.5, soy._datatypes.BodyPosition((0,0,0)))
    
def TestBodyPositionSuite() :
  return unittest.TestLoader().loadTestsFromTestCase(TestBodyPosition)

if __name__=='__main__':
  unittest.main()
