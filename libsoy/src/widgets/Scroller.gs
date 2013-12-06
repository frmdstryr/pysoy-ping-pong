/*
 *  libsoy - soy.widgets.Scroller
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

class soy.widgets.Scroller : soy.widgets.Container
    parent : soy.widgets.Container?
    scrollbarSize : soy.atoms.Size
    scrollPosition : soy.atoms.Position
    scrollbarThickness : int = 10
    drag : bool
    xstartdrag : float
    ystartdrag : float
    xpos_startdrag : float
    ypos_startdrag : float


    construct ()
        drag = false

    def override add (parent : soy.widgets.Container)
        self.parent = parent

    def override remove ()
        self.parent = null

    def hit_mouse(x: float, y :float) : bool
        if (x > self.scrollPosition.x and \
        x < (self.scrollPosition.x + self.scrollbarSize.width) and \
        y >= self.scrollPosition.y and \
        y <= (self.scrollPosition.y + self.scrollbarSize.height) )
            return true
        return false


    def virtual motion_handler(e : events.Motion)
        return


    def button_press_handler(e : events.Button)
        case e.button
            when 1 // left button
                if hit_mouse(e.x, self.convertY(e.y))
                    drag = true
                    self.xstartdrag = (float) e.x
                    self.xpos_startdrag = self.scrollPosition.x
                    self.ypos_startdrag = self.scrollPosition.y
                    self.ystartdrag = self.convertY(e.y)


    def button_release_handler(e : events.Button)
        case e.button
            when 1 // left button
                if drag
                    drag = false


    //convert y coordinate from mouse coord system to openGL coor system.
    def convertY (y : float) : float
        return self.parent.height - (float) y


    def virtual scroll_handler(e : events.Scroll)
        return


    _controller : soy.controllers.Pointer
    prop controller : soy.controllers.Pointer
        get
            return _controller
        set
            _controller = value
            //_controller.motion.connect(motion_handler)
            //_controller.button_press.connect(button_press_handler)
            //_controller.button_release.connect(button_release_handler)
            //_controller.scroll.connect(scroll_handler)
