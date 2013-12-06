#!/usr/bin/env python3

'''Tests for soy.atoms.Color

    These tests verify the sanity of Color comparison, math, and str() output.
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
              '$Date: 2008-02-15 03:16:28 -0500 (Fri, 15 Feb 2008) $'[7:-20]+ \
              'by '+'$Author: ArcRiley $'[9:-2]
__version__ = 'Trunk (r'+'$Rev: 898 $'[6:-2]+')'

import soy
import unittest

c = soy.atoms.Color

class TestColor(unittest.TestCase):

  def testEqual(self):
    msg = "compared Color to Color"
    self.assertTrue(c("white") == c((255, 255, 255, 255)), msg)
    self.assertTrue(c("yellow") == c((255, 255, 0, 255)), msg)
    self.assertTrue(c("cyan") == c((0, 255, 255, 255)), msg)
    self.assertTrue(c("black") == c((0, 0, 0, 255)), msg)

    # TODO: fix these in Color.c/Color.gs?
    # or maybe just don't support this
    #msg = "compared Color to tuple"
    #self.assertTrue(c("yellow") == (255, 255, 0), msg)
    #self.assertTrue(c("yellow") == (255, 255, 0, 255), msg)

    self.assertFalse(soy.atoms.Color("black") == 0,
                'comparing Color to non-Color should return False')

  def testNotEqual(self):
    self.assertTrue(c('black') != c((255,255,255)))
    self.assertTrue(c('black') != c((0,0,0,0)))

  def testLess(self):
    self.assertTrue(c('black').luma < c('white').luma,
                    'black should be less than white, check alpha compare')
    self.assertTrue(c('clear').luma < c((1, 1, 1)).luma,
                    "clear ('#0000').luma should be less than (1, 1, 1).luma")

  def testLessEqual(self):
    self.assertTrue(c('black').luma <= c('white').luma,
                    'all channels can be < with <= operator')
    self.assertTrue(c((2, 2, 2)).luma <= c((2, 2, 2)).luma,
                    'both colors can be == with <= operator')
    self.assertTrue(c((2, 2, 2, 0)).luma <= c((2, 2, 2, 2)).luma,
                    'each channel can be <= with <= operator')

  def testGreater(self):
    self.assertTrue(c('white').luma > c('black').luma,
                    'white should be > than black, check alpha compare')

  def testGreaterEqual(self):
    self.assertTrue(c('white').luma >= c('black').luma,
                    'all channels can be > with >= operator')
    self.assertTrue(c((2, 2, 2)).luma >= c((2, 2, 2, 2)).luma,
                    'both colors can be == with >= operator')
    self.assertTrue(c((2, 3, 4)).luma >= c((2, 2, 2)).luma,
                    'each channel can be >= with >= operator')

  def testAdd(self):
    self.assertTrue((c('blue') + c('red')) ==
                    c((255, 0, 255)),
                    'blue + red should == purple')
    self.assertTrue((c('forestgreen') + c('darkviolet')) ==
                    c((182, 139, 245, 255)),
                    'forest green + dark violet should == "182, 139, 245, 255"')
    self.assertTrue(str((c('white') + c('white'))) ==
                    '(255, 255, 255, 255)',
                    'white + white should == "(255, 255, 255, 255)"')

  def testSubtract(self) :
    self.assertTrue((c('white') - c('blue')) == c('yellow'),
                    'white - blue should == yellow')
    self.assertTrue((c('black') - c('red')) ==
                    c((0, 0, 0, 255)),
                    'black - red should == Color((0, 0, 0, 255))')

  def testMultiply(self):
    self.assertTrue((c((127, 50, 84, 255)) * c((255, 127, 63, 127))) ==
                    c((127, 25, 21, 255)),
                    "Multiplication (127, 50, 84, 255)*(255, 127, 63, 127) " +
                    "= (127, 25, 21, 255)")

  def testDivide(self):
    self.assertTrue((c((127, 50, 84, 255)) / c((255, 127, 63, 127))) ==
                    c((127, 101, 255, 255)),
                    "Division (127, 50, 84, 255)/(255, 127, 63, 127) " +
                    "= (127, 101, 255, 255)")
    self.assertTrue((c((127, 50, 84, 255)) / c((0, 127, 63, 127))) ==
                    c((255, 101, 255, 255)),
                    "Division (127, 50, 84, 255)/(0, 127, 63, 127) " +
                    "= (255, 101, 255, 255)")

  def testHex(self):
    self.assertTrue(soy.atoms.Color('white') == soy.atoms.Color('#ffffff'),
                    "white == '#ffffff', tested __richcmp__ with same hex")
    self.assertTrue(soy.atoms.Color('white') == soy.atoms.Color('#fff'),
                    "white == '#fff', compared 12bit to 24bit hex values")
    self.assertTrue(soy.atoms.Color('#3f3') == 
                    soy.atoms.Color((51, 255, 51)),
                    "'#3f3' == (51, 255, 51), nonwhite hex/tuple compared")
    self.assertTrue(soy.atoms.Color('#3f3f') ==
                    soy.atoms.Color((51, 255, 51, 255)),
                    "'#3f3f' == (255, 51, 255, 51), alpha hex/tuple compared")
    self.assertTrue((soy.atoms.Color('#0123') + soy.atoms.Color('#fed')) ==
                    soy.atoms.Color('white'),
                    '#0123 + #edc should == white, value alpha adding bug?')
    self.assertTrue((soy.atoms.Color('#2eee') + soy.atoms.Color('#6000')) ==
                    soy.atoms.Color('#8eef'),
                    '#2eee + #6000 should == #8eee, dual alpha adding bug?')
    self.assertTrue((soy.atoms.Color('#8fff') - soy.atoms.Color('#8000')) ==
                    soy.atoms.Color('#0fff'),
                    '#8fff - #8000 should == #0fff, bug with alpha?')
    self.assertTrue(soy.atoms.Color('white').hex == '#ffffffff',
                    "white.hex should == '#ffff'")
    self.assertTrue(soy.atoms.Color('blue').hex == '#0000ffff',
                    "blue.hex should == '#0000ffff'")
    self.assertTrue(soy.atoms.Color('clear').hex == '#00000000',
                    "clear.hex should == '#00000000'")
    self.assertTrue(soy.atoms.Color((63, 127, 127, 255)).hex == '#3f7f7fff',
                    "(63, 127, 127, 255).hex should == '#3f7f7fff'")

    color = c("white")
    color.hex = "#ffeeddcc"
    self.assertEqual(color.hex, "#ffeeddcc")
    color.hex = "#123456"
    self.assertEqual(color.hex, "#123456ff")
    color.hex = "#fedc"
    self.assertEqual(color.hex, "#ffeeddcc")
    color.hex = "#123"
    self.assertEqual(color.hex, "#112233ff")

  def testCompare(self):
    self.assertTrue(soy.atoms.Color('white') >= soy.atoms.Color('blue'))
    self.assertTrue(soy.atoms.Color('white') >= soy.atoms.Color('white'))
    self.assertFalse(soy.atoms.Color('blue') >= soy.atoms.Color('white'))
    self.assertTrue(soy.atoms.Color('blue') <= soy.atoms.Color('white'))
    self.assertTrue(soy.atoms.Color('white') <= soy.atoms.Color('white'))
    self.assertFalse(soy.atoms.Color('white') <= soy.atoms.Color('blue'))
    self.assertTrue(soy.atoms.Color('blue') < soy.atoms.Color('white'))
    self.assertFalse(soy.atoms.Color('white') < soy.atoms.Color('white')) 
    self.assertFalse(soy.atoms.Color('white') < soy.atoms.Color('blue'))
    self.assertTrue(soy.atoms.Color('white') > soy.atoms.Color('blue'))
    self.assertFalse(soy.atoms.Color('white') > soy.atoms.Color('white'))
    self.assertFalse(soy.atoms.Color('blue') > soy.atoms.Color('white'))

    """
    TODO: Fix or remove these.
    self.assertTrue((soy.atoms.Color('white')*2.0).hex == '#fff * 2.00',
                    "white * 2.0 should == '#fff * 2.00'")
    self.assertTrue((soy.atoms.Color('red')*3.0).hex == '#f00 * 3.00',
                    "red * 3.0 should == '#f00 * 3.00'")
    self.assertTrue((soy.atoms.Color('white')*-2.0).hex == '#fff * -2.00',
                    "white * -2.0 should == '#fff * -2.00'")
    self.assertTrue((soy.atoms.Color('red')*-3.0).hex == '#f00 * -3.00',
                    "red * -3.0 should == '#f00 * -3.00'")
    # This next one needs to match code format
    #self.assertTrue(soy.atoms.Color(-.5, 2.0, .5).hex"""

def TestColorSuite() :
  return unittest.TestLoader().loadTestsFromTestCase(TestColor)


if __name__=='__main__':
  unittest.main()
