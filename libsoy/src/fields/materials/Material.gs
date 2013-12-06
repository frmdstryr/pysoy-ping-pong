/*
 *  libsoy - soy.materials.Material
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
    Gee

class soy.materials.Material : Object
    needsTSLVs : bool
    translucent : bool

    init
        needsTSLVs = false
        translucent = false


    def virtual render (step : int, tslvs : GLvoid*,
                        texmatrix : ode.Matrix3? = null) : bool
        // This Colored is always 1-pass
        if step == 0

            glShadeModel(GL_FLAT)

            // lit Colored colors and settings
            glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT, {1.0f, 1.0f, 1.0f, 1.0f})
            glMaterialfv(GL_FRONT_AND_BACK, GL_DIFFUSE, {1.0f, 1.0f, 1.0f, 1.0f})
            glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, {1.0f, 1.0f, 1.0f, 1.0f})
            glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, {0.0f, 0.0f, 0.0f, 1.0f})
            glMaterialf (GL_FRONT_AND_BACK, GL_SHININESS, 0.0f)

            // disable what we're not using and return
            glClientActiveTexture(GL_TEXTURE3)
            glDisableClientState(GL_TEXTURE_COORD_ARRAY)
            glClientActiveTexture(GL_TEXTURE2)
            glDisableClientState(GL_TEXTURE_COORD_ARRAY)
            glClientActiveTexture(GL_TEXTURE1)
            glDisableClientState(GL_TEXTURE_COORD_ARRAY)
            glClientActiveTexture(GL_TEXTURE0)
            glDisableClientState(GL_TEXTURE_COORD_ARRAY)
            return true

        // false means "don't need to be called again"
        return false

    // Way of drawing of models
    prop virtual draw_mode : GLenum?
        get
            return GL_TRIANGLES
