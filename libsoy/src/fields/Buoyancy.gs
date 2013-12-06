/*
 *  libsoy - soy.fields.Buoyancy
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

class soy.fields.Buoyancy : soy.fields.Field
    /*
    soy.fields.Buoyancy
    */

    _affected : list of soy.bodies.Body

    /*
    construct(scene : soy.scenes.Scene)
        super(scene)
        self._affected = new list of soy.bodies.Body
        self.density = 0
    */

    init
        self._affected = new list of soy.bodies.Body
        self._viscosity = 0

    // This function is applied once per physics cycle for each combination of affected body and field.
    def override exert(other : soy.bodies.Body) : bool
        radius, submersion : float
        // Volume-less bodies are not affected
        if other.volume() == 0.0f
            return false

        // Shaped fields partially submerge shapes
        radius = 1.0f // other.shape.radius() FIXME
        submersion = (self.pointDepth(
                      (float)other.position.x,
                      (float)other.position.y,
                      (float)other.position.z) +
                      radius) / (radius*2)
        other.tags["bmass"] = other.density * other.volume() - submersion * other.volume() * self._viscosity
        self._affected.add(other)
        return true


    def override give(data : int)
        if data == 0
            for body in self._affected
                body.tags.unset("bmass")
            self._affected.clear()

    //
    // Properties

    // Buoyancy viscosity
    // Viscosity of the bouyant fluid
    // FIXME: this property could be merged with Body's density prop
    _viscosity : float
    prop viscosity : float
        get
            return self._viscosity
        set
            self._viscosity = value
