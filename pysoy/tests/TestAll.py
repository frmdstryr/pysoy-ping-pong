#!/usr/bin/env python3

'''Test everything

    This script provides the convience of running every test at once.
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

import unittest

import TestColor
import TestMesh
import TestAxis
import TestVector
import TestVertex
import TestPosition
import TestFace
import TestArea
import TestRotation
import TestScene
import TestTexture
import TestFixed

TestAll = unittest.TestSuite()
TestAll.addTests((
  # NOTE: There's a rare occurring memory handling bug in soy.atoms (probably). 
  #       I'm unable to debug or fix this.
  #       Run TestAll.py for details.  ~~fzzbt
  TestColor.TestColorSuite(),
  #TestMesh.TestMeshSuite(), # this still needs some work
  TestAxis.TestAxisSuite(),
  TestVector.TestVectorSuite(),
  TestVertex.TestVertexSuite(),
  TestPosition.TestPositionSuite(),
  TestFace.TestFaceSuite(),
  TestArea.TestAreaSuite(),
  TestRotation.TestRotationSuite(),
  TestScene.TestSceneSuite(),
  TestSize.TestSizeSuite(),
  TestTexture.TestTextureSuite(),
  TestFixed.TextFixedSuite()
))

if __name__=='__main__':
  runner = unittest.TextTestRunner()
  runner.run(TestAll)
