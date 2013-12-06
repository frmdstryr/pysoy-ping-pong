/*
 *  libsoy - soy.fields.Shockwave
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
    ode

class soy.fields.Shockwave : soy.fields.Field
    /*
    soy.fields.Shockwave

    Models a constant-rate expanding shockwave.
    */

    _space : ode.spaces.HashSpace
    _t0 : float
    _inner : float
    _outer : float

    /*
    construct(scene : soy.scenes.Scene)
        super(scene)
        self._space = new ode.spaces.HashSpace(null)
        self.geom = new geoms.Sphere(scene.space, (Real) 0.0f)
    */

    init
        self._space = new ode.spaces.HashSpace(null)
        self.geom = new geoms.Sphere(scene.space, (Real) 0.0f)

    def activate()
        // Multiple use of shockwaves are not supported yet.
        assert(self._t0 != 0)

        self._t0 = 0
        self._inner = 0
        self._outer = 0


    // This function is applied once per physics cycle for each combination of affected body and field.
    def override exert(other : soy.bodies.Body) : bool
        depth, force, dx, dy, dz, d : float

        // Find position of other & depth in outer shell
        depth = self.pointDepth(
            other.position.x,
            other.position.y,
            other.position.z)

        // If it's within the interval
        if depth > 0 and depth < self.length
            // No current energy use yet, but calculate the force
            force = 1 / (12.56637061f * powf((float)self._outer * self.swvel - depth, 2))

            // Find build a force vector from the scalar
            dx = other.position.x - self.position.x
            dy = other.position.y - self.position.y
            dz = other.position.z - self.position.z
            d = sqrtf(powf(dx, 2) + powf(dy, 2) + powf(dz, 2))
            dx = force * dx / d
            dy = force * dy / d
            dz = force * dz / d

            // Apply the force vector either at the center of pressure or the generic center
            if other.tags.has_key("cpx") and other.tags.has_key("cpy") and other.tags.has_key("cpz")
                other.addForceAtRelPos(dx, dy, dz,
                                       other.tags["cpx"],
                                       other.tags["cpy"],
                                       other.tags["cpz"])
            else
                other.addForce(dx, dy, dz)
        return true


    // This function is called by the physics cycle for each field before
    // any calls to _exert.  It is used for any initialization or cleanup that
    // the Field requires.
    def override give(data : int)
        // Timestep
        self._inner = self._outer
        self._outer = (float)self.scene.time - self._t0

        // If it has gone to the limit, end
        if self._inner * self.swvel > self.radius
            ((ode.geoms.Sphere) self.geom).SetRadius(0)
            self._t0 = 0

    //
    // Properties

    // Shockwave velocity
    // Velocity of the shockwave
    // Units: m/s
    _swvel : float
    prop swvel : float
        get
            return self._swvel
        set
            self._swvel = value

    // Shockwave energy
    // Total energy of the shockwave
    // Units: joules
    _energy : float
    prop energy : float
        get
            return self._energy
        set
            self._energy = value

    // Shockwave radius
    // Effective radius of the explosion
    _radius : float
    prop radius : float
        get
            return self._radius
        set
            self._radius = value

    // Shockwave length
    // Thickness of wafe
    _length : float
    prop length : float
        get
            return self._length
        set
            self._length = value
