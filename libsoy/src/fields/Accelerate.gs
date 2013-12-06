/*
 *  libsoy - soy.fields.Accelerate
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

class soy.fields.Accelerate : soy.fields.Field
    /*
    soy.fields.Accelerate

    Accelerate is a field that adds constant acceleration to all bodies in the entire scene.
    */

    _affected : list of soy.bodies.Body

    /*
    construct(scene : soy.scenes.Scene, x : float = 0.0f, y : float = 0.0f, z : float = 0.0f)
        super(scene)
        self._affected = new list of soy.bodies.Body
        self.acceleration = new soy.atoms.Vector(x, y, z)
    */

    construct(x : float = 0.0f, y : float = 0.0f, z : float = 0.0f)
        self._affected = new list of soy.bodies.Body
        self.acceleration = new soy.atoms.Vector(x, y, z)

    // This function is applied once per physics cycle for each combination of affected body and field.
    def override exert(other : soy.bodies.Body) : bool
        self._affected.add(other)
        return false

    def override commit()
        for other in self._affected
            var m = other.density * other.volume()
            other.addForce(m*self.acceleration.x, m*self.acceleration.y, m*self.acceleration.z)
        self._affected.clear()

    //
    // Properties

    // Acceleration
    // unit: m/s^2
    _acceleration : soy.atoms.Vector
    prop acceleration : soy.atoms.Vector
        get
            return self._acceleration
        set
            self._acceleration = value

