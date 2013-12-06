/*
 *  libsoy - soy.materials.Wireframed
 *  Copyright (C) 2013 Copyleft Games Group
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
    GL

// This is the successor from a soy.materials.Colored class
class soy.materials.Wireframed : soy.materials.Colored

    // All "garbage" remained on care of the parent
    construct (name : string? = null)
        super(name)

    // Here only the drawing way is redefined
    prop override draw_mode : GLenum?
        get
            return GL_LINES
