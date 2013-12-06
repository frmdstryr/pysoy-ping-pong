/*
 *  libsoy - soy.atoms.Vector
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


class soy.atoms.Vector : Object
    event on_set (vector : Vector)

    construct (x : float = 0.0f, y : float = 0.0f, z : float = 0.0f)
        self._x = x
        self._y = y
        self._z = z

    def new set (x : float = 0.0f, y : float = 0.0f, z : float = 0.0f)
        self._x = x
        self._y = y
        self._z = z
        self.on_set(self)

    ////////////////////////////////////////////////////////////////////////
    // Methods

    // returns the dot product v1.x*v2.x + v1.y*v2.y + v1.z*v2.z
    def dot(other : soy.atoms.Vector) : float
        return (self.x * other.x) + (self.y * other.y) + (self.z * other.z)

    // get the orthagonal vector between v1 and v2
    def cross(other : soy.atoms.Vector) : soy.atoms.Vector
        return new soy.atoms.Vector(self.y*other.z - self.z*other.y,
                                    self.z*other.x - self.x*other.z,
                                    self.x*other.y - self.y*other.x)

    // add each individual component
    def add(other : soy.atoms.Vector)
        self.x += other.x
        self.y += other.y
        self.z += other.z

    // subtract by component
    def subtract(other : soy.atoms.Vector)
        self.x -= other.x
        self.y -= other.y
        self.z -= other.z

    // returns the euclidean distance from origin to (x, y, z)
    def magnitude() : float
        return sqrtf(self.x*self.x + self.y*self.y + self.z*self.z)

    // returns a vector that is in the same direction but magnitude 1
    def normalize()
        length : float = self.magnitude()
        self.x /= length
        self.y /= length
        self.z /= length

    // returns the angle given by arccos((A dot B) / (|A|*|B|))
    def angle_between(other : soy.atoms.Vector) : float
        return acosf(self.dot(other) / (self.magnitude() * other.magnitude()))


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
        if not (left isa soy.atoms.Vector) or not (right isa soy.atoms.Vector)
            return false

        _x : bool = ((soy.atoms.Vector) left).x == ((soy.atoms.Vector) right).x
        _y : bool = ((soy.atoms.Vector) left).y == ((soy.atoms.Vector) right).y
        _z : bool = ((soy.atoms.Vector) left).z  == ((soy.atoms.Vector) right).z

        return (_x & _y & _z)


    def static cmp_ne (left : Object, right : Object) : bool
        return not cmp_eq(left, right)
