/*
 *  libsoy - soy.fields.Monopole
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

class soy.fields.Monopole : soy.fields.Field
    /*
    soy.fields.Monopole

    Monopoles are invisible fields that either attract or repulse other
    bodies in the entire scene based on an inverse square law.
    */

    _affected : list of soy.bodies.Body

    /*
    construct(scene : soy.scenes.Scene)
        super(scene)
        self._affected = new list of soy.bodies.Body
        self.multiplier = 0
    */

    init
        self._affected = new list of soy.bodies.Body
        self.multiplier = 0

    // This function is applied once per physics cycle for each combination of affected body and field.
    def override exert(other : soy.bodies.Body) : bool
        self._affected.add(other)
        return false

    def override commit()
        for other in self._affected
            var xd = other.position.x - self.position.x
            var yd = other.position.y - self.position.y
            var zd = other.position.z - self.position.z

            // calculate direct distances
            var d2 = xd*xd + yd*yd + zd*zd
            if d2 != 0
                var d = Math.sqrtf(d2)
                // get other mass
                var mm2 = other.density * other.volume()
                if other.tags.has_key("bmass")
                    mm2 = other.tags["bmass"]
                // calculate force
                var f = self.multiplier * self.density * self.volume() * mm2 / d2
                // apply force as a vector
                other.addForce(f * xd/d, f*yd/d, f*zd/d)
        self._affected.clear()

    //
    // Properties

    // Monopole's multiplier
    // This is how much force will be applied.
    _multiplier : float
    prop multiplier : float
        get
            return self._multiplier
        set
            self._multiplier = value
