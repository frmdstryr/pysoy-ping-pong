/*
 *  libsoy - soy.atoms.Axis
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
    GLib.Math


class soy.atoms.Axis : Object
    event on_set (vector : Axis)

    construct (x : float = 0.0f, y : float = 0.0f, z : float = 0.0f)
        self._x = x
        self._y = y
        self._z = z

    def new set (x : float = 0.0f, y : float = 0.0f, z : float = 0.0f)
        self._x = x
        self._y = y
        self._z = z
        self.on_set(self)

    construct normalize(axis : soy.atoms.Axis)
        _magnitude : float
        _magnitude = (float) sqrt((x*x) + (y*y) + (z*z))
        self._x = axis.x / _magnitude
        self._y = axis.y / _magnitude
        self._z = axis.z / _magnitude


    ////////////////////////////////////////////////////////////////////////
    // Properties

    _x : float
    prop x : float
        get
            return self._x
        set
            self._x = value
            self.on_set(self)


    _y : float
    prop y : float
        get
            return self._y
        set
            self._y = value
            self.on_set(self)


    _z : float
    prop z : float
        get
            return self._z
        set
            self._z = value
            self.on_set(self)


    def static cmp_eq (left : Object, right : Object) : bool
        if not (left isa soy.atoms.Axis) or not (right isa soy.atoms.Axis)
            return false

        _x : bool = ((soy.atoms.Axis) left).x == ((soy.atoms.Axis) right).x
        _y : bool = ((soy.atoms.Axis) left).y == ((soy.atoms.Axis) right).y
        _z : bool = ((soy.atoms.Axis) left).z  == ((soy.atoms.Axis) right).z

        return (_x & _y & _z)


    def static cmp_ne (left : Object, right : Object) : bool
        return not cmp_eq(left, right)
