#!/usr/bin/env python3
import doctest
import soy

room = soy.scenes.Room(3.0)

"""
Spinning Cube & Sphere: Part 1 of the PySoy Primer
"""

def step1():
    """ Getting Started

    So, you've downloaded PySoy, managed to install it? Ready to actually do
    something with it? How would you like to create a simple scene and put
    a cube and a sphere inside? This should be a good way to start using PySoy.
    You will learn how to create a window, scene, bodies, then how to add light
    and a camera so you can see the stuff in the window. And finally, you'll
    add forces to the bodies you've created and see some action...

    Open a text editor and start a new file. In this tutorial, save it as 
    pysoy_primer.py. Import the soy module and the sleep method from the 
    built-in time module in Python. We will also make a Client. In this client,
    there is a Window. This is the window that will show up. You will see when 
    it appears that the title you set will be the title of the window. We set 
    the background to white. Also, we make a scene to put our objects in. This
    scene is the 3-d space in which we will put things in. The scene is a 
    soy.scenes.Room, so we call it "room".

    >>> import soy
    >>> from time import sleep
    >>> room = soy.scenes.Room(3.0)
    >>> client = soy.Client()
    >>> client.window.background = soy.atoms.Color('white')
    >>> client.window.title = "PySoy Primer Part 1" 
    """
    client.window.background = soy.atoms.Color('white')
    client.window.title = "PySoy Primer Part 1"

def step2():
    """At the end of the file, add the following lines. This is so that 
    everything in your script continues to exist. This should remain at
    the end of your file at all times.

    >>> if __name__ == '__main__' :
    >>>    while client.window :
    >>>	       sleep(.1)

    Run the script using python3:

    python3 pysoy_primer.py
    """
def step3():
    """Creating our Cube

    In PySoy, 3d shapes are known as Bodies. We will create an instance of a
    subclass of Bodies known as Box, placing it in the scene we created 
    earlier. We will place the cube slightly to the left. So, position will be 
    soy.atoms.Position((-1, 0, 0)). The parameters of Position represent x, y, 
    and z axes respectively. We set the size to 2 unit of length, width, and 
    thickness. We also tell PySoy that we want our cube to be using a Texture. 
    A checkered cubemap. And, of course, we set the colors of the checkered 
    cubemap. The parameters of the Cubemap are - pattern, color1, color2, 
    scaleX, scaleY, and size (scaleX and scaleY define the scaling we want to
    do with the checkered pattern - 1 means 2x2 texture, 2 means 4x4, and so 
    on; size - doesn't really matter what you set it to, it is there to make 
    sure that cubemap makes all sides of the same size). We set a small radius
    - that gives our cube rounded edges.

    >>> gold = soy.atoms.Color('gold')
    >>> firebrick = soy.atoms.Color('firebrick')

    >>> cubemap = soy.textures.Cubemap("checkered", [gold, firebrick], 1,1,1)
    >>> room['cube'] = soy.bodies.Box()
    >>> room['cube'].position = soy.atoms.Position((-1, 0, 0))
    >>> room['cube'].material = soy.materials.Textured()
    >>> room['cube'].material.colormap = cubemap
    >>> room['cube'].size = soy.atoms.Size((2, 2, 2))
    >>> room['cube'].radius = 0.1
    Run pysoy_primer.py again. Don't worry if your cube does not show up in 
    your window yet. We simply know it exists in the blackness that is your 
    scene.
    """

    gold = soy.atoms.Color('gold')
    firebrick = soy.atoms.Color('firebrick')

    cubemap = soy.textures.Cubemap("checkered",
                               [gold, firebrick], 1,1,1)
    room['cube'] = soy.bodies.Box()
    room['cube'].position = soy.atoms.Position((-1, 0, 0))
    room['cube'].material = soy.materials.Textured()
    room['cube'].material.colormap = cubemap
    room['cube'].size = soy.atoms.Size((2, 2, 2))
    room['cube'].radius = 0.1

def step4():
    """Light, Camera, Action!

    To make our cube show up, we need light to see it, a camera to watch it, 
    and a projector to project what the camera sees onto the window, and of 
    course we must position them properly, to be able to see what is happening.
    We still have a pure black window and that's just not very interesting. So,
    add these lines just under the line with which you created the scene.

    >>> room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
    >>> room['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))

    Then add this under the line with which you give your window a title.

    >>> client.window.append(soy.widgets.Projector(room['cam']))

    This last line attaches the "output" of the camera, which exists in the 3d
    scene, to the black window you have open. This way, what the camera "sees" 
    is what will be drawn inside the window. Anything inside your scene now is 
    rendered and outputted to the Window.

    Run pysoy_primer.py again. You should be able to see your first PySoy cube.
    """
    room['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 0, 15)))
    room['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))

    client.window.append(soy.widgets.Projector(room['cam']))

def step5():
    """Sphere

    You want more? Let's add a sphere! What we do is very similar to what we 
    did with cube, but there are some differences. Here, instead of 
    soy.bodies.Box, we use soy.bodies.Sphere. Also we set the "size" of the 
    sphere by setting its radius. Also we add a new cubemap to use for our 
    sphere. For it, we don't set any colors, we will use the default ones - 
    when you specify 0 colors, PySoy automatically sets the checkered pattern
    to use black and white. If you set 1 color only, PySoy will use that color
    and black. We position our sphere on soy.atoms.Position((1, 0, 0)), 
    opposite to the cube.

    >>> cubemap2 = soy.textures.Cubemap("checkered")

    >>> room['sphere'] = soy.bodies.Sphere()
    >>> room['sphere'].radius = 1.0
    >>> room['sphere'].position = soy.atoms.Position((1, 0, 0))
    >>> room['sphere'].material = soy.materials.Textured()
    >>> room['sphere'].material.colormap = cubemap2

    Run python3 pysoy_primer.py
    Now you've got a Sphere, too! However, our cube and sphere are kind of 
    boring, not doing anything but "existing." Let's do something about it.
    """

    cubemap2 = soy.textures.Cubemap("checkered")

    room['sphere'] = soy.bodies.Sphere()
    room['sphere'].radius = 1.0
    room['sphere'].position = soy.atoms.Position((1, 0, 0))
    room['sphere'].material = soy.materials.Textured()
    room['sphere'].material.colormap = cubemap2

def step6():
    """Cube Rotation

    Rotation in PySoy is done with the addTorque method.. we just have to 
    specify our rotation speeds for each direction (x, y, z)

    #Rotate the cube 1 unit in the X axis, 1 unit in the Y axis and 1 unit in 
    #the Z axis
    >>> room['cube'].addTorque(1, 1, 1)

    #Rotate the sphere 1 unit in the X axis, 1 unit in the Y axis and 1 unit in
    #the Z axis
    >>> room['sphere'].addTorque(1,  1,  1)

    Enjoy the slowly spinning cube and sphere. :) It will take a few seconds 
    for you to realize the amazingness of their three dimensions. Set these 
    torque values higher and watch your cube and sphere spin faster. :)

    Add some force to make these old fellas move.

    #Give force to the cube - 1 unit in the X axis, 0 units in the Y axis and
    #0 units in the Z axis
    >>> room['cube'].addForce(1, 0, 0)

    #Give force to the sphere -  -1 unit in the X axis, 0 units in the Y axis
    #and 0 units in the Z axis
    >>> room['sphere'].addForce(-1, 0, 0)

    As you can notice, these values are really low; crank them up (and Torque
    values, too) to get some real action. :)

    You can also see the source code in the examples directory 
    (pysoy_primer1.py).
    """
#Rotate the cube 1 unit in the X axis, 1 unit in the Y axis and 1 unit in the
#Z axis

    room['cube'].addTorque(1, 1, 1)

#Rotate the sphere 1 unit in the X axis, 1 unit in the Y axis and 1 unit in 
#the Z axis

    room['sphere'].addTorque(1,  1,  1)

#Give force to the cube - 1 unit in the X axis, 0 units in the Y axis and 0 
#units in the Z axis
    room['cube'].addForce(1, 0, 0)

#Give force to the sphere -  -1 unit in the X axis, 0 units in the Y axis and
#0 units in the Z axis
    room['sphere'].addForce(-1, 0, 0)


client = soy.Client()
step1()
step2()
step3()
step4()
step5()
step6()
