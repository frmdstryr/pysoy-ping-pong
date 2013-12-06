/*
 *  libsoy - soy.widgets.VBox
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
    soy.atoms


class soy.widgets.VBox : soy.widgets.Container

    def override add (parent : soy.widgets.Container)
        self.size = parent.size

    def override remove ()
        self.size = new soy.atoms.Size(0, 0, 0)

    def override render (x: int, y : int, width : int, height : int)
        // Render each child widget in order
        var _x = x
        var _y = y
        for widget in self.children
            widget.render(_x, _y, widget.width, widget.height)
            _y += widget.height


    def override resize_children (x: int, y : int, width : int, height : int)
        var childy = 0
        var totalHeight = 0.0f

        for widget in self.children
            totalHeight += widget.height

        // Resize each child widget in order
        for widget in self.children
            var childheight = 0
            if totalHeight > 0
                childheight = (int) ((widget.height/totalHeight) * height)
            //widget.resize(x, childy, width, childheight)
            widget.size = new soy.atoms.Size(width, childheight)
            childy += childheight

