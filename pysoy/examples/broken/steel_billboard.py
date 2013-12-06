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

    lava = soy.transports.File('media/lava.soy')['gimp']
    lavam = soy.materials.Material(lava)
    bil = soy.models.Billboard(material=lavam)
    axis_b = soy.bodies.Body(sce, mesh= bil )
    axis_b.rotation = (1.0,0.5,0.2)

    def multiply_size( mul):
        def m():
            st = bil.size
            bil.size = ( st[0]*mul[0], st[1]*mul[1])
        return m

    scr = soy.Screen()
    win = soy.Window(scr, 'Billboard example', size=(1024,768))

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

    key['r'] = multiply_size( (1.1,1.0))
    key['f'] = multiply_size( (1.0/1.1,1.0))

    key['t'] = multiply_size( (1.0,1.1))
    key['g'] = multiply_size( (1.0,1.0/1.1))



    wcn = soy.controllers.Window(win)
    wcn['close'] = soy.actions.Quit()

    while True:
        sleep(.1)

if __name__=='__main__':
    main()

