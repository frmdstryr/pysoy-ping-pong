#!/usr/bin/env python

import soy
from time import sleep

def main():
    sce = soy.scenes.Scene()

    cam = soy.bodies.Camera(sce)
    cam.position = (0.0, 0.0, 10.0)

    def camera_impl_move( vec):
        def move_camera():
            cam.position = (cam.position[0] + vec[0], cam.position[1] + vec[1], cam.position[2] + vec[2])
        return move_camera

    def camera_set_rot( vec):
        def rot_camera():
            cam.rotation = vec
        return rot_camera



    lig = soy.bodies.Light(sce)
    lig.position = (-10.0,10.0,2.0)

    spike_mat=soy.materials.StainlessSteel()
    spike_mat.shadeless = True

    aura_mat=soy.materials.Copper()
    aura_mat.shadeless = True

    center_mat = soy.materials.VelvetyRed()
    center_mat.shadeless = True

    sun = soy.models.Sun(spike_mat=spike_mat,
            aura_mat=aura_mat, circle_verts=32,
            center_mat = center_mat)

    sun_b = soy.bodies.Body(sce, mesh= sun )

    sun.aura_size = (sun.aura_size[0]/2, sun.aura_size[1]/2)
    sun.center_size = (sun.center_size[0]/2, sun.center_size[0]/2)

    sun.num_spikes = 15


    #axis_b.rotation = (1.0,0.5,0.2)


    scr = soy.Screen()
    win = soy.Window(scr, 'Sun example', size=(1024,768))

    pro = soy.widgets.Projector(win, camera=cam)

    key = soy.controllers.Keyboard(win)
    key['q'] = soy.actions.Quit()
    key[ 1 ] = soy.actions.Quit() # 9 = esc key


    key['w'] =  camera_impl_move( (0,0,-0.1) )
    key['s'] =  camera_impl_move( (0,0,0.1) )

    key['a'] =  camera_impl_move( (-0.1,0,0) )
    key['d'] =  camera_impl_move( (0.1,0,0) )

    key['z'] = camera_set_rot( (0, 0.3, 0))
    key['x'] = camera_set_rot( (0, 0, 0))
    key['c'] = camera_set_rot( (0, -0.3, 0))


    wcn = soy.controllers.Window(win)
    wcn['close'] = soy.actions.Quit()

    while True:
        sleep(.1)

if __name__=='__main__':
    main()

