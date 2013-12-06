/*
 *  libsoy tests - simple (simple.gs)
 *  Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

[indent=4]
uses
    soy
    ode

// Theres six lines to getting a basic 3D scene up and running.
// First you need a scene, to group a collection of 3d objects and concepts together.
// inside that scene, a light, a camera, and at least one visible object is required (if you want to see anything)
// Next an area where the output of the rendered scene is to be displayed, for example a Window
// Finally the output of the camera has to be connected to the window, via a Projector.

init
    // Simple Scene, just a container of bodies, lights and cameras.
    var scene = new soy.scenes.Room(2.0)

    // Our object here is a Cube.
    var cube = new soy.bodies.Body( scene )

    cube.addForce(0.1f,0.0f,0.0f)
    cube.addTorque(0.1f,0.0f,0.0f)

    cube.model = new soy.models.Box(1,1,1)
    cube.shape = new soy.shapes.Box(1,1,1)
    cube.position = new soy.atoms.Position(40,40,40)
    // Second cube object
    var cube2 = new soy.bodies.Body( scene )

    cube2.addForce(0.0f,0.0f,0.2f)
    cube2.addTorque(0.0f,0.0f,0.0f)

    cube2.model = new soy.models.Cube(null)
    cube2.shape = new soy.shapes.Box(1,1,1)
    cube2.position = new soy.atoms.Position(150,2000,1000)

    // Joint

    var joint = new soy.joints.Universal(scene,cube,cube2,{1,3,5},{4,3,3},{6,7,8})
    //var joint = new soy.joints.Ball(scene,cube,cube2,{1,2,4})

    // Let there be Light.
    var light  = new soy.bodies.Light.with_position(scene, {0, 4, 5})

    // And a camera!
    var camera = new soy.bodies.Camera.with_position(scene, {0,0,10}, {0,0,0})

    // Now create a window to display the scene.
    var window = new soy.widgets.Window(null, "Cube", null)
    window.background.red = 0.6f

    // Connect the camera to the window via a projector.
    var projector = new soy.widgets.Projector(window, camera)

    while true // Spin forever
        //print("fps : %f", camera.fps)
        print("cube pos y : %f", cube.position.y)
        GLib.Thread.usleep(1000000)

