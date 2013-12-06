/*
 *  libsoy tests - vboxTest (vboxTest.gs)
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

init
    bigger : soy.atoms.Size = new soy.atoms.Size(640, 480, 0)
    small : soy.atoms.Size = new soy.atoms.Size(320,240,0)
    // Simple Scenes, just containers of bodies, lights and cameras.
    var scene = new soy.scenes.Room(4.0)
    var scene2 = new soy.scenes.Room(4.0)

    // Our objects here are Cubes.
    var cube = new soy.bodies.Body( scene )
    var cube2 = new soy.bodies.Body( scene2 )

    cube.addForce(0.0f,0.0f,0.0f)
    cube.addTorque(0.3f,0.0f,0.0f)
    cube2.addForce(0.0f,0.0f,0.0f)
    cube2.addTorque(0.3f,0.3f,0.0f)

    cube.model = new soy.models.Cube(null)
    cube.shape = new soy.shapes.Box(1,1,1)
    cube2.model = new soy.models.Cube(null)
    cube2.shape = new soy.shapes.Box(1,1,1)

    // Let there be Light.
    var light  = new soy.bodies.Light.with_position(scene, {0, 4, 5})
    var light2  = new soy.bodies.Light.with_position(scene2, {0, 4, 5})

    // And cameras!
    var camera = new soy.bodies.Camera.with_position(scene, {0,-2,10}, {0,0,0})
    var camera2 = new soy.bodies.Camera.with_position(scene2, {0,2,10}, {0,0,0})

    // Now create a window to display the scenes.
    var window = new soy.widgets.Window(null, "Cube", null)
    window.background.red = 0.6f
    window.size = bigger

    // Create a vertical box inside the window 
    var vbox = new soy.widgets.VBox(window)
    vbox.size = bigger

    // Connect each camera to the VBox via a projector.
    var projector = new soy.widgets.Projector(vbox, camera)
    var projector2 = new soy.widgets.Projector(vbox, camera2)
    //projector.size = bigger
    //projector2.size = bigger
    
    print "VBox size: %fx%f", vbox.size.width, vbox.size.height
    print "Proj1 size: %fx%f", projector.size.width, projector.size.height
    print "Proj2 size: %fx%f", projector2.size.width, projector2.size.height
    
    vbox.size = new soy.atoms.Size(window.size.width, window.size.height, 0.0)
    Thread.usleep(1000000)
    print "VBox resized"
    print "VBox size: %fx%f", vbox.size.width, vbox.size.height
    print "Proj1 size: %fx%f", projector.size.width, projector.size.height
    print "Proj2 size: %fx%f", projector2.size.width, projector2.size.height
    
    Thread.usleep(1000000)
    window.size = small
    print "Window resized"
    print "VBox size: %fx%f", vbox.size.width, vbox.size.height
    print "Proj1 size: %fx%f", projector.size.width, projector.size.height
    print "Proj2 size: %fx%f", projector2.size.width, projector2.size.height

    while true // Spin forever
        GLib.Thread.usleep(1000000)

