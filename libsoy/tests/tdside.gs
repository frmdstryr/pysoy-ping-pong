/*
 *  libsoy tests - tdside (tdside.gs)
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
    Posix

scene : soy.scenes.TDSide
cube : soy.bodies.Body
box : soy.bodies.Body
sphere : soy.bodies.Body

def key_press_handler(e : events.Key)
    case keyval_name(e.keyval)
        when "Escape"
            Posix.raise(15) // call SIGINT
    
def key_down_handler(e : events.Key)
    case keyval_name(e.keyval)
        when "Up"
            scene.set_vel_y(cube, 0.003)
        when "Down"
            scene.set_vel_y(cube, -0.003)
        when "Left"
            scene.set_vel_x(cube, -0.003)
        when "Right"
            scene.set_vel_x(cube, 0.003)

def key_release_handler(e : events.Key)
    case keyval_name(e.keyval)
        default
            pass

init
    scene = new soy.scenes.TDSide()
    
    var camera = new soy.bodies.Camera.with_position(scene, {0,0,15}, {0,0,0})
    cube = new soy.bodies.Body(scene)
    box = new soy.bodies.Body(scene)
    sphere = new soy.bodies.Body(scene)

    cube.model = new soy.models.Cube(null)
    cube.shape = new soy.shapes.Box(1,1,1)
    cube.position.x = -2
    cube.addForce(0,-0.1,0)

    box.model = new soy.models.Box(25.0f, 1.0f, 1.0f, null)
    box.shape = new soy.shapes.Box(25,1,1)
    box.position.x = 0
    box.position.y = -3
    //box.toggle_immovable()

    sphere.model = new soy.models.Sphere(0.7, 25, null)
    sphere.shape = new soy.shapes.Sphere(0.7f)
    sphere.position.x = 2
    sphere.position.y = 3
    sphere.mass.sphere(5000, 0.7)

    scene.set2d(cube)
    scene.set2d(box)
    //scene.set2d(sphere)

    scene.plane2ds[cube].setXParam(ode.Param.FMax, 1)
    scene.plane2ds[cube].setYParam(ode.Param.FMax, 1)

    //scene.tdgravity = new soy.atoms.Vector(0, -1.0, 0)

    var light  = new soy.bodies.Light.with_position(scene, {0, 4, 5})
    var window = new soy.widgets.Window(null, "TDSide test", null)
    window.size = new soy.atoms.Size(800, 600, 0)

    // Handle keyboard input
    var kc = new soy.controllers.Keyboard(window)
    kc.key_press.connect(key_press_handler)
    kc.key_down.connect(key_down_handler)
    kc.key_release.connect(key_release_handler)
        
    // Connect the camera to the window via a projector.
    var projector = new soy.widgets.Projector(window, camera)

    while true
        GLib.Thread.usleep(1000000)

