/*
 *  libsoy - soy.fields.Wind
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

class soy.fields.Wind : soy.fields.Field
    /*
    soy.fields.Wind

    Affects bodies according to their tags "cd" and "cpx", "cpy" and "cpz".
    */

    /*
    construct(scene : soy.scenes.Scene)
        super(scene)
    */

    // This function is applied once per physics cycle for each combination of affected body and field.
    def override exert(other : soy.bodies.Body) : bool
        if other.tags.has_key("cd")
            var dx = self.wind.x - other.velocity.x
            var dy = self.wind.y - other.velocity.y
            var dz = self.wind.z - other.velocity.z
            var d2 = dx*dx+dy*dy+dz*dz
            if d2 != 0
                var f = 0.5f * self._viscosity * d2 * (float)other.tags["cd"]
                var r = f / Math.sqrtf(d2)
                if other.tags.has_key("cpx") and other.tags.has_key("cpy") and other.tags.has_key("cpz")
                    other.addForce(r*dx,r*dy,r*dz)
        return true

    //
    // Properties

    // Wind vector
    // Affects relative velocity of body and wind.
    _wind_obj : weak soy.atoms.Vector

    def _wind_weak(wind : Object)
        _wind_obj = null
    
    prop wind : soy.atoms.Vector
        owned get
            value : soy.atoms.Vector? = self._wind_obj
            if value is null
                value = new soy.atoms.Vector()
                value.weak_ref(self._wind_weak)
                self._wind_obj = value
            return value
        set
            if _wind_obj != null
                _wind_obj.weak_unref(self._wind_weak)
            _wind_obj = value
            value.weak_ref(self._wind_weak)

    // Wind viscosity
    // Viscosity of the fluid,
    // affects how draw is calculated.
    // FIXME: this property could be merged with Body's density prop
    _viscosity : float
    prop viscosity : float
        get
            return self._viscosity
        set
            self._viscosity = value
