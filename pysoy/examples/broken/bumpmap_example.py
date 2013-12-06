#!/usr/bin/env python

import soy
import cmath
from time import sleep, time

V = soy.atoms.Vertex
F = soy.atoms.Face

def calculate_trig_normal(v1,v2,v3):
  v_1 = (v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2])
  v_2 = (v3[0]-v1[0], v3[1]-v1[1], v3[2]-v1[2])
  cross_a = (v_1[1] * v_2[2] - v_1[2] * v_2[1],
             v_1[2] * v_2[0] - v_1[0] * v_2[2],
             v_1[0] * v_2[1] - v_1[1] * v_2[0])
  lgt = abs( cmath.sqrt( cross_a[0]**2 + cross_a[1]**2 + cross_a[2]**2))
  return (cross_a[0] / lgt, cross_a[1]  / lgt, cross_a[2] / lgt)

def create_quad_mesh(mat):
  mesh = soy.models.Mesh(material=mat)

  scale=1

  quad_vertices = [
    ( 1*scale, 1*scale, 0),
    ( 1*scale,-1*scale, 0),
    (-1*scale,-1*scale, 0),
    (-1*scale, 1*scale, 0)]
  quad_faces = [
    (0,1,2),
    (2,3,0)]

  V1 = lambda x,y : V(mesh, position=x, normal=y, texcoord=x, tangent=(0,1,0))
  F1 = lambda x : F(mesh, verts=x, material=mat)

  for f in quad_faces:
    v1 = quad_vertices[ f[0] ]
    v2 = quad_vertices[ f[1] ]
    v3 = quad_vertices[ f[2] ]
    n = calculate_trig_normal(v1,v2,v3)

    vv1 = V1(v1,n)
    vv2 = V1(v2,n)
    vv3 = V1(v3,n)

    face = F1([vv1,vv3,vv2])

  return mesh
    

def main():
  sce = soy.scenes.Scene()

  cam = soy.bodies.Camera(sce)
  cam.position = (0.0, 0.0, 15.0)
    
  lig = soy.bodies.Light(sce)
  lig.position = (-5, -5, -5)

  #decal_tex = soy.transports.File('media/decal.soy')['gimp']
  #normal_tex = soy.transports.File('media/normal_map.soy')['gimp']
  decal_tex = soy.transports.File('media/marble.soy')['gimp']
  normal_tex = soy.transports.File('media/fieldstone-dot3.soy')['gimp']
  decal_mat = soy.materials.Material(diffuse=soy.colors.blue)
  #decal_mat.normal = normal_tex
  #print decal_mat.color

  test_mesh = create_quad_mesh(decal_mat)
  test_mesh_b = soy.bodies.Body(sce, mesh=test_mesh)
  test_mesh_b.rotation = (4.0,.0,1)

  scr = soy.Screen()
  win = soy.Window(scr, title='Bumpmap example', 
                   size = (1024,768), background=soy.colors.gray)
  pro = soy.widgets.Projector(win, camera=cam)

  key = soy.controllers.Keyboard(win)
  key[ 1 ] = soy.actions.Quit()

  wcn = soy.controllers.Window(win)
  wcn['close'] = soy.actions.Quit()

  while True:
    sleep(0.3)
    #lig.position = (20*abs(cmath.sin(time())) - 10, 1, -2)
    #test_mesh_b.position = (10*abs(cmath.sin( time()))- 6, 10*abs(cmath.sin( time()))- 6, 2)

if __name__=='__main__':
  main()
