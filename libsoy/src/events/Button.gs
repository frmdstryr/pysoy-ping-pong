/*
 *  libsoy - soy.events.Button
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

struct soy.events.Button
    // Event type
    type : soy.EventType
    // Soy window
    window : soy.widgets.Window
    // The time of the event in milliseconds.
    time : uint32
    // The x coordinate of the pointer relative to the window.
    x : float 
    // The y coordinate of the pointer relative to the window.
    y : float 
    // The x coordinate of the pointer relative to the root of the screen.
    x_root : float 
    // The y coordinate of the pointer relative to the root of the screen.
    y_root : float 
    // The button which was pressed or released, numbered from 1 to 5. 
    // Normally button 1 is the left mouse button, 2 is the middle button, 
    // and 3 is the right button. On 2-button mice, the middle button can often
    // be simulated by pressing both mouse buttons together.    
    button :  uint 
    //wiimote button
    wiibutton : string
