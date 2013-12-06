/*
 *  libsoy - soy.fields.Field
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
    ode

class soy.fields.Field : soy.bodies.Body
    /*
    soy.fields.Field

    Fields are optionally visible generic objects in 3d space that apply
    forces and other changes to other bodies.
    */

    /*
    construct(scene : soy.scenes.Scene)
        super(scene)
        self.scene.fields[self.body] = self
    */

    construct ( ) // TODO position
        super(null, null, 0.0f)


    def apply() : bool
        return true

    // This function is applied once per physics cycle for each combination of affected body and field.
    def virtual exert(other : soy.bodies.Body) : bool
        return true

    // This function is called by the physics cycle for each field before
    // any calls to _exert.  It is used for any initialization or cleanup that
    // the Field requires.
    def virtual give(data : int)
        return

    // This function is to called by the physics cycle after every call _exert
    // has been done.
    def virtual commit()
        return
