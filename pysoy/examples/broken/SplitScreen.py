#!/usr/bin/env python
#
# A Demonstration of a split-screen layout using the basic stacking widgets.
#

import soy
from time import sleep

# screen, window, and scene
scr = soy.Screen()
win = soy.Window(scr,'SplitScreen')
sce = soy.scenes.Scene()

# camera left
cam_l = soy.bodies.Camera(sce)
# camera right
cam_r = soy.bodies.Camera(sce)

# something to look at
cube = soy.shapes.Box(1,1,1)
mat = soy.materials.Material()
mat.shininess = 6
body = soy.bodies.Body(scene=sce,model=soy.models.Shape(mat),shape=cube)
body.rotation = (0.5,0.5,0.5)
oggfile = soy.transports.File('media/changeworld.ogg')
myvid = oggfile['video']

# shed some light on it
light = soy.bodies.Light(sce)

# Two stacks - The StackX for splitting the screen into
# two views of the same Scene.
# The StackZ piles our splitscreen cubes onto a video
# backdrop.
stackz = soy.widgets.StackZ(win)
vidcan = soy.widgets.Canvas(stackz,texture=myvid)
stackx = soy.widgets.StackX(stackz)
pro_l = soy.widgets.Projector(stackx, camera=cam_l)
pro_r = soy.widgets.Projector(stackx, camera=cam_r)


# set a different position for each camera
cam_l.position = (-0.4,0,3) # my left eye has a zoom lens :P
cam_r.position = (0.4,0,5)

light.position = (0.5,1.0,0.5)


wc = soy.controllers.Window(win)
wc['close'] = soy.actions.Quit()

if __name__ == '__main__' :
  while True :
    sleep(1)
