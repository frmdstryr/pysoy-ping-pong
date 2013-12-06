#!/usr/bin/env python

'''Tests for soy.models.Mesh

    This currently tests the ability to create a mesh from Vertex and Face
    objects and that the order of those objects remain predictable.

    Additional tests for Mesh are required including material add/del,
    Face removal when a Vertex it uses is removed, VertexList and FaceList 
    slicing, merging two Mesh objects via add/sub, multiplying a Mesh to 
    repeat a pattern such a mirroring, and other features we have not yet 
    added but which will require a high degree of testing due to their complex 
    and bug-prone nature.
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

P = soy.atoms.Position
V = soy.atoms.Vertex
R = soy.atoms.Vector
F = soy.atoms.Face

quad_vertices = [
        ( 1,-1, 0),
        ( 1, 1, 0),
        (-1, 1, 0),
        (-1,-1, 0)
        ]

quad2_vertices = [
        ( 1,-1,-1),
        ( 1, 1,-1),
        (-1, 1,-1),
        (-1,-1,-1)
        ]

quad_faces = [
        (0,1,2),
        (2,3,0)
        ]

quad_faces_alternate = [
        (1,2,3),
        (3,0,1)
        ]

def copy_c_array(array):
  arr = []
  for i in range(len(array)):
    arr.append(array[i])
  return arr


class TestMesh(unittest.TestCase):
  def setUp(self):
    self.mesh = soy.models.Mesh()
    self.material = soy.materials.Colored()

  def test_addition_mesh(self):
    P1 = lambda x : P(x)
    V1 = lambda x : V(x,R((1,1,1)),x,R((1,1,1)))
    F1 = lambda x : F(*x, material=self.material)

    verts = list(map(V1, map(P1, quad_vertices)))

    face_vert = [ list(map(lambda x : verts[x], y)) for y in quad_faces]
    faces = map(F1, face_vert)
    
    for face in faces:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),2)
        
    verts2 = list(map(V1, map(P1, quad2_vertices)))
    face_vert2 = [ list(map(lambda x : verts2[x], y)) for y in quad_faces]
    faces2 = map(F1, face_vert2)

    for face in faces2:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),4)

  def test_modification_mesh(self):
    P1 = lambda x : P(x)
    V1 = lambda x : V(x,R((1,1,1)),x,R((1,1,1)))
    F1 = lambda x : F(*x, material=self.material)

    verts = list(map(V1, map(P1, quad_vertices)))
    face_vert = [ list(map(lambda x : verts[x], y)) for y in quad_faces]
    faces = map(F1, face_vert)
        
    verts2 = list(map(V1, map(P1, quad2_vertices)))
    face_vert2 = [ list(map(lambda x : verts2[x], y)) for y in quad_faces]
    faces2 = map(F1, face_vert2)
    
    for face in faces:
        self.mesh.append(face)
    for face in faces2:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),4)

    face_vert3 = [ list(map(lambda x : verts[x], x)) for x in quad_faces_alternate]
    faces3 = list(map(F1, face_vert3))

    for i in range(2,4):
        # TODO: modification is throwing GObject warnings
        self.mesh[i] = faces3[i-2]

  def test_substraction_mesh(self):
    P1 = lambda x : P(x)
    V1 = lambda x : V(x,R((1,1,1)),x,R((1,1,1)))
    F1 = lambda x : F(*x, material=self.material)

    verts = list(map(V1, map(P1, quad_vertices)))
    face_vert = [ list(map(lambda x : verts[x], y)) for y in quad_faces]
    faces = map(F1, face_vert)
    
    for face in faces:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),2)

    verts2 = list(map(V1, map(P1, quad2_vertices)))
    face_vert2 = [ map(lambda x : verts2[x], y) for y in quad_faces]
    faces2 = list(map(F1,face_vert2))

    for i in range(2):
        self.mesh[i] = faces2[i]

    self.assertEqual(len(self.mesh),2)

  def test_reuse_mesh(self):
    P1 = lambda x : P(x)
    V1 = lambda x : V(x,R((1,1,1)),x,R((1,1,1)))
    F1 = lambda x : F(*x, material=self.material)

    verts = list(map(V1, map(P1, quad_vertices)))
    face_vert = [ map(lambda x : verts[x], y) for y in quad_faces]
    faces = map(F1, face_vert)

    for face in faces:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),2)

    verts2 = list(map(V1, map(P1, quad_vertices)))
    face_vert2 = [ map(lambda x : verts2[x], x) for x in quad_faces_alternate]
    faces2 = map(F1, face_vert2)
    
    for face in faces2:
        self.mesh.append(face)

    self.assertEqual(len(self.mesh),4)


def TestMeshSuite() :
  return unittest.TestLoader().loadTestsFromTestCase(TestMesh)


if __name__=='__main__':
  unittest.main()
