/*
 *  libsoy - soy.widgets.Projector
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
    GLib
    GL
    soy.atoms

class soy.widgets.Projector : soy.widgets.Widget
    _aspect    : float

    construct (camera : soy.bodies.Camera? = null)
        self._camera = camera

    def override add (parent : soy.widgets.Container)
        self.size = parent.size

    def override remove ()
        self.size = new soy.atoms.Size(0, 0, 0)

    def override render (x: int, y : int, width : int, height : int)

        aspect : float = 0.0f

        if self._camera is null
            return

        if self._aspect != 0.0f
            aspect = self._aspect
        else
            aspect = (float) width / (float) height

        glViewport((GLint) x, (GLint) y, (GLint) width, (GLint) height)

        self._camera.project(aspect)


    _camera : soy.bodies.Camera
    prop camera : soy.bodies.Camera
        get
            return self._camera
        set
            self._camera = value

