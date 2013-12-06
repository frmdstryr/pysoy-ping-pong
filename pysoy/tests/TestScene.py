#!/usr/bin/env python3

''' Tests for soy.scenes.Scene 
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
import copy

S = soy.scenes.Scene
Si = soy.atoms.Size
B = soy.bodies.Box
P = soy.atoms.Position

class TestScene(unittest.TestCase):
  def setUp(self):
    self.scene = S()
    self.other_scene = S()
  
  def test_len(self):
    self.scene['box_1'] = B()
    self.scene['box_2'] = B()
    self.scene['box_3'] = B()

    self.assertEqual(len(self.scene), 3);

    del(self.scene['box_1'])
    self.assertEqual(len(self.scene), 2);

    del(self.scene['box_2'])
    del(self.scene['box_3'])
    self.assertEqual(len(self.scene), 0);

  def test_search(self):
    self.assertNotIn('box', self.scene)
    self.scene['box'] = B()
    self.assertIn('box', self.scene)
    del(self.scene['box'])
    self.assertNotIn('box', self.scene)
  
  
  def test_keys(self):
    self.assertEqual(self.scene.keys(), [])
    
    self.scene['box_1'] = B()
    self.scene['box_2'] = B()
    self.scene['box_3'] = B()

    keys = self.scene.keys()

    self.assertIn('box_1', keys)
    self.assertIn('box_2', keys)
    self.assertIn('box_3', keys)

    del(self.scene['box_1'])
    del(self.scene['box_2'])
    del(self.scene['box_3'])

    keys = self.scene.keys()

    self.assertNotIn('box_1', keys)
    self.assertNotIn('box_2', keys)
    self.assertNotIn('box_3', keys)
    self.assertEqual(self.scene.keys(), [])
  
  def test_values(self):
    self.assertEqual(self.scene.values(), [])

    a = B()
    b = B()
    c = B()

    self.scene['box_1'] = a
    self.scene['box_2'] = b
    self.scene['box_3'] = c

    values = self.scene.values()
    
    self.assertIn(a, values)
    self.assertIn(b, values)
    self.assertIn(c, values)
    self.assertEqual(len(self.scene), 3)

    del(self.scene['box_1'])
    del(self.scene['box_2'])
    del(self.scene['box_3'])

    values = self.scene.values()
    
    self.assertNotIn(a, values)
    self.assertNotIn(b, values)
    self.assertNotIn(c, values)

    self.assertEqual(self.scene.values(), [])

  
  def test_move(self):
    self.scene['box'] = B()
    self.other_scene['box'] = copy.copy(self.scene['box'])
    del(self.scene['box'])
    
    with self.assertRaises(KeyError):
      temp = self.scene['box']
    
    self.assertIsInstance(self.other_scene['box'], B)

  def test_del_without_bodies(self):
    scene = S()
    del(scene)

    with self.assertRaises(NameError):
        test = scene

  def test_del_with_bodies(self):
    scene = S()

    scene['box_1'] = B()
    scene['box_2'] = B()
    scene['box_3'] = B()

    a = scene['box_1']
    b = scene['box_2']
    c = scene['box_3']

    del(scene)
    with self.assertRaises(NameError):
        test = scene

    self.assertIsInstance(a, B)
    self.assertIsInstance(b, B)
    self.assertIsInstance(c, B)
  
  def test_pos_of_bodies(self):
    self.scene['box'] = B()
    self.scene['box'].position = P((0, -5, 10))
    
    self.assertEqual(self.scene['box'].position, P((0, -5, 10)))

    self.scene['box'].position.z -= 9
    self.assertEqual(self.scene['box'].position, P((0, -5, 1)))


def TestSceneSuite():
  return unittest.TestLoader().loadTestsFromTestCase(TestScene)

if __name__=='__main__':
  unittest.main()
