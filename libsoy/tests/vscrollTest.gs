/*
 *  libsoy tests - vscrollTest (vscrollTest.gs)
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

init
    verybig : soy.atoms.Size = new soy.atoms.Size(1024, 768, 0)
    bigger : soy.atoms.Size = new soy.atoms.Size(640, 480, 0)
    small : soy.atoms.Size = new soy.atoms.Size(320,240,0)
    var window = new soy.widgets.Window(null)
    window.size = verybig
    vscroll : soy.widgets.VScroll = new soy.widgets.VScroll(window)
   
    // A gradient Texture
    var texture = new soy.textures.Texture()
    texture.channels = 1
    texture.size = new soy.atoms.Size(256.0f, 1.0f, 0.0f)
    for var _x = 0 to 255
        texture[_x].luma = (uchar) (255-_x) / 255
    texture[127] = new soy.atoms.Color.named("black")

    var canvas1 = new soy.widgets.Canvas(vscroll, texture)
    canvas1.size = bigger

    var canvas2 = new soy.widgets.Canvas(vscroll, texture)
    canvas2.size = small
    
    vscroll.size.width = 640
    vscroll.size.height = 480
    // OK so here we are in user code, and the user can decide to use a mouse, or a wiimote to control the widget like this:
    vscroll.controller = new soy.controllers.Pointer(window)
    // Or for a Wiimote:
    //vscroll.pointerController = soy.controllers.Wiimote(window)
    print "Initial VScroll Size: %.2fx%.2f", vscroll.size.width, vscroll.size.height
    print "Initial Children's size: %.2fx%.2f   and    %.2fx%.2f", canvas1.size.width, canvas1.size.height, canvas2.size.width, canvas2.size.height

    Thread.usleep(5000000)
    vscroll.size.width = 320
    vscroll.size.height = 240
    
    print "Resized VScroll to %.2fx%.2f", vscroll.size.width, vscroll.size.height
    print "Children's size after Resize: %.2fx%.2f   and    %.2fx%.2f", canvas1.size.width, canvas1.size.height, canvas2.size.width, canvas2.size.height
    while true
        pass //spin

