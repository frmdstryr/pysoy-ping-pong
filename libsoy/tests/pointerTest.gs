/*
 *  libsoy tests - pointerTest (pointerTest.gs)
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

// Simple test program for testing pointer (mouse) input
// An empty scene is created.
// The background color is changed to green from red when button is pressed 
// and back to red when it is released.
// Mouse coordinates are printed to the command-line when it is moved.  

window : widgets.Window

def key_press_handler(e : events.Key)
    case keyval_name(e.keyval)
        when "Escape"
            Posix.raise(15) // call SIGINT

def motion_handler(e : events.Motion)            
    print("pointer pos x, y : %f, %f", e.x,e.y)

def button_press_handler(e : events.Button)
    case e.button
        when 1 // left button
            window.background.green = 1.0f

def button_release_handler(e : events.Button)
    case e.button
        when 1 // left button
            window.background.green = 0.0f

def scroll_handler(e : events.Scroll)
    case e.direction
        when soy.ScrollDirection.Up
            print("Scrolled up")
        when soy.ScrollDirection.Down
            print("Scrolled down")

init
    // Now create a window to display the scene.
    window = new soy.widgets.Window(null, "Pointer test", null)
    window.background.red = 0.6f

    // Handle keyboard input
    var kc = new soy.controllers.Keyboard(window)
    kc.key_press.connect(key_press_handler)
    
    // Handle pointer input
    var pc = new soy.controllers.Pointer(window)
    pc.motion.connect(motion_handler)
    pc.button_press.connect(button_press_handler)
    pc.button_release.connect(button_release_handler)
    pc.scroll.connect(scroll_handler)
    
    while true // Run forever
        GLib.Thread.usleep(1000000)

