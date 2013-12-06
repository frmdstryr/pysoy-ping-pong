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
    Posix

cube : soy.bodies.Box

init
    // Simple Scene, just a container of bodies, lights and cameras.
    var scene = new soy.scenes.Room(4.0f)
    
    var cam = new soy.bodies.Camera(scene)
    cam.position.z = 15
    
    var light = new soy.bodies.Light(scene)
    light.position = new soy.atoms.Position(-2, 3, 5)
    
    var window = new soy.widgets.Window(null)
    
    //new soy.widgets.Projector(window, cam)
    
    // Our object here is a Cube.
    /*cube = new soy.bodies.Box( scene )
    cube.size = new soy.atoms.Size(1.0f,1.0f,1.0f)
    cube.addForce(0.0f,0.0f,0.0f)
    cube.addTorque(0.3f,0.0f,0.0f)    
    
    while true // Spin forever
        //print("fps : %f", camera.fps)
        //print("cube pos x, y : %f, %f", cube.position.x, cube.position.y)
        GLib.Thread.usleep(1000000)
*/
