#!/usr/bin/env python

import soy
import cmath
from time import sleep, time

def calculate_trig_normal(v1,v2,v3):
    v_1 = (v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2])
    v_2 = (v3[0]-v1[0], v3[1]-v1[1], v3[2]-v1[2])
    cross_a = (v_1[1] * v_2[2] - v_1[2] * v_2[1],
               v_1[2] * v_2[0] - v_1[0] * v_2[2],
               v_1[0] * v_2[1] - v_1[1] * v_2[0])
    lgt = abs( cmath.sqrt( cross_a[0]**2 + cross_a[1]**2 + cross_a[2]**2))
    return (cross_a[0] / lgt, cross_a[1]  / lgt, cross_a[2] / lgt)
    


def create_bottom_mesh():
    V = soy.atoms.Vertex
    F = soy.atoms.Face
    #SIMPLE BOX:
    bottom_vertices = [
            (-5,-1.5, 5),
            ( 5,-1.5, 5),
            (-5, 1.5, 5),
            ( 5, 1.5, 5),
            (-5,-1.5,-5),
            ( 5,-1.5,-5),
            (-5, 1.5,-5),
            ( 5, 1.5,-5),
            ]
    bottom_normals = [
            ( 0, 0, 1), #FRONT
            ( 0, 1, 0), #BOTTOM
            ( 1, 0, 0), #RIGHT
            (-1, 0, 0), #LEFT
            ( 0, 0,-1), #BACK
            ]

    bottom_indices = [
            ( 2, 1, 0), #FRONT
            ( 3, 1, 2),
            ( 0, 1, 4), #BOTTOM
            ( 4, 1, 5),
            ( 1, 3, 7), #RIGHT
            ( 1, 7, 5),
            ( 0, 6, 2), #LEFT
            ( 0, 4, 6),
            ( 4, 7, 6), #BACK
            ( 4, 5, 7)
            ]

    bottom_faces = [
            #TRIG1, TRIG2, NORMAL
            ( 0, 1, 0), #FRONT
            ( 2, 3, 1), #BOTTOM
            ( 4, 5, 2), #RIGHT
            ( 6, 7, 3), #LEFT
            ( 8, 9, 4), #BACK
            ]

    #lava = soy.transports.File('media/lava.soy')['gimp']
    #lavam = soy.materials.Material(lava)
    bottom = soy.models.Mesh(material=soy.materials.stainlessSteel)

    V1 = lambda x : V(bottom, position=x[0])
    F1 = lambda x : F(bottom, verts=x, material=soy.materials.stainlessSteel)

    #verts = map(V1, bottom_vertices)
    #face_vert = [ map( lambda x: verts[x], x) for x in bottom_indices]
    #faces = map(F1, face_vert)

    for f in bottom_faces:
        normal = bottom_normals[ f[2] ]

        V2 = lambda x : V(bottom, position=x, normal=normal)
        tri1   = [ bottom_vertices[x] for x in bottom_indices[f[0]] ]
        tri2   = [ bottom_vertices[x] for x in bottom_indices[f[1]] ]

        tri1_v = map(V2, tri1)
        tri2_v = map(V2, tri2)

        F1(tri1_v)
        F1(tri2_v)

    return bottom

def create_simple_test_mesh(mat=soy.materials.stainlessSteel):
    V = soy.atoms.Vertex
    F = soy.atoms.Face

    mesh_vertices = [
            (0,0,0),
            (0,10,0),
            (1,0,0),
            (0,0,-1)
            ]

    mesh_indices = [
            (0,1,2),
            (0,2,3),
            (3,1,0),
            (1,3,2)
            ]

    mesh = soy.models.Mesh(material=mat)

    V1 = lambda x,y : V(mesh, position=x, normal=y)
    F1 = lambda x : F(mesh, verts=x, material=mat)

    #verts = 
    for f in mesh_indices:
        v1 = mesh_vertices[ f[0] ]
        v2 = mesh_vertices[ f[1] ]
        v3 = mesh_vertices[ f[2] ]
        n = calculate_trig_normal(v1,v2,v3)

        vv1 = V1(v1,n)
        vv2 = V1(v2,n)
        vv3 = V1(v3,n)

        face = F1([vv1,vv3,vv2])

    return mesh

class T: #empty class to hold camera data by-reference
    def __init__(self):
        self.move_forward = False
        self.move_backward = False
        self.move_left = False
        self.move_right = False
        self.move_up = False
        self.move_down = False

        self.forward_vel = 0.5
        self.side_vel = 0.3

def set_variable_field(var, field, val):
    def mth():
        setattr(var,field,val)
    return mth

def main():
    sce = soy.scenes.Scene()

    cam = soy.bodies.Camera(sce)
    cam.position = (0.0, 3.0, 10.0)

    camera_data = T()

    def camera_add_rot( vec):
        def rot_camera():
            cam.rotation = (cam.rotation[0] + vec[0], cam.rotation[1]+vec[1], cam.rotation[2]+vec[2])
        return rot_camera

    lig = soy.bodies.Light(sce)
    lig.position = (-10.0,1.0,-2.0)

    water = soy.transports.File('media/water.soy')['gimp']

    water_mat = soy.materials.Material(colorMap=water)
    water_mat.ambient = soy.colors.blue
    water_mat.diffuse = soy.colors.blue
    water_mat.specular = soy.colors.black

    liquid = soy.models.Liquid(material=water_mat)
    liquid_b = soy.bodies.Body(sce, mesh=liquid)
    liquid_b.position = (0, -1, 0)

    liquid.size = (10, 3, 10)

    bottom = create_bottom_mesh()
    bottom_b = soy.bodies.Body(sce, mesh=bottom)
    bottom_b.position = (0,-1,0)

    test_mesh = create_simple_test_mesh()
    test_mesh_b = soy.bodies.Body(sce, mesh=test_mesh)
    test_mesh_b.position = (0, -6, 0)


    scr = soy.Screen()
    win = soy.Window(scr, 'Liquid example', size=(1024,768))

    pro = soy.widgets.Projector(win, camera=cam)

    key = soy.controllers.Keyboard(win)
    key[ 1 ] = soy.actions.Quit() # 9 = esc key


    key2 = soy.controllers.Keyboard2(win)

    key2['w'] = ( set_variable_field(camera_data, 'move_forward', True),
            set_variable_field(camera_data, 'move_forward', False))
    key2['s'] = ( set_variable_field(camera_data, 'move_backward', True),
            set_variable_field(camera_data, 'move_backward', False))

    key2['q'] = ( set_variable_field(camera_data, 'move_left', True),
            set_variable_field(camera_data, 'move_left', False))
    key2['e'] = ( set_variable_field(camera_data, 'move_right', True),
            set_variable_field(camera_data, 'move_right', False))

    key2['r'] = ( set_variable_field(camera_data, 'move_up', True),
            set_variable_field(camera_data, 'move_up', False))
    key2['f'] = ( set_variable_field(camera_data, 'move_down', True),
            set_variable_field(camera_data, 'move_down', False))

    key2['a'] =  ( camera_add_rot( (0, 0.9, 0)), camera_add_rot( (0,-0.9, 0)) )
    key2['d'] =  ( camera_add_rot( (0,-0.9, 0)), camera_add_rot( (0, 0.9, 0)) )

    key2['z'] =  ( camera_add_rot( ( 0.9, 0, 0)), camera_add_rot( (-0.9, 0, 0)) )
    key2['x'] =  ( camera_add_rot( (-0.9, 0, 0)), camera_add_rot( ( 0.9, 0, 0)) )


    wcn = soy.controllers.Window(win)
    wcn['close'] = soy.actions.Quit()


    while True:
        sleep(.03)
        test_mesh_b.position = (0, 10*abs(cmath.sin( time()))- 6, 0)
        if camera_data.move_forward:
            cam.position = (
                    cam.position[0] - camera_data.forward_vel * cam.direction[0],
                    cam.position[1] - camera_data.forward_vel * cam.direction[1],
                    cam.position[2] - camera_data.forward_vel * cam.direction[2],
                    )
        if camera_data.move_backward:
            cam.position = (
                    cam.position[0] + camera_data.forward_vel * cam.direction[0],
                    cam.position[1] + camera_data.forward_vel * cam.direction[1],
                    cam.position[2] + camera_data.forward_vel * cam.direction[2],
                    )
        if camera_data.move_left:
            cam.position = (
                    cam.position[0] - camera_data.side_vel * cam.right[0],
                    cam.position[1] - camera_data.side_vel * cam.right[1],
                    cam.position[2] - camera_data.side_vel * cam.right[2],
                    )
        if camera_data.move_right:
            cam.position = (
                    cam.position[0] + camera_data.side_vel * cam.right[0],
                    cam.position[1] + camera_data.side_vel * cam.right[1],
                    cam.position[2] + camera_data.side_vel * cam.right[2],
                    )

        if camera_data.move_down:
            cam.position = (
                    cam.position[0] - camera_data.side_vel * cam.up[0],
                    cam.position[1] - camera_data.side_vel * cam.up[1],
                    cam.position[2] - camera_data.side_vel * cam.up[2],
                    )
        if camera_data.move_up:
            cam.position = (
                    cam.position[0] + camera_data.side_vel * cam.up[0],
                    cam.position[1] + camera_data.side_vel * cam.up[1],
                    cam.position[2] + camera_data.side_vel * cam.up[2],
                    )

if __name__=='__main__':
    main()

