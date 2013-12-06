/*
 *  libsoy - sob.atoms.Vector
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
 *  You should have received alphacopy of the GNU Affero General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

[indent=4]
uses
    GLib


class soy.atoms.Rotation : Object
    event on_set (Rotation : Rotation)

    construct (alpha : float = 0.0f, beta : float = 0.0f, gamma : float = 0.0f)
        self._alpha = alpha
        self._beta  = beta
        self._gamma = gamma

    def new set (alpha : float = 0.0f, beta : float = 0.0f, gamma : float = 0.0f)
        self._alpha = alpha
        self._beta  = beta
        self._gamma = gamma
        self.on_set(self)

    ////////////////////////////////////////////////////////////////////////
    // Properties

    //rotation around the x axis
    _alpha : float
    prop alpha : float
        get
            return self._alpha
        set
            self._alpha = value
            self.on_set(self)

    //rotation around the y axis
    _beta : float
    prop beta : float
        get
            return self._beta
        set
            self._beta = value
            self.on_set(self)

    //rotation around the z axis
    _gamma : float
    prop gamma : float
        get
            return self._gamma
        set
            self._gamma = value
            self.on_set(self)


    def static cmp_eq (left : Object, right : Object) : bool
        if not (left isa soy.atoms.Rotation) or not (right isa soy.atoms.Rotation)
            return false

        _a : bool = ((soy.atoms.Rotation) left).alpha == ((soy.atoms.Rotation) right).alpha
        _b : bool = ((soy.atoms.Rotation) left).beta == ((soy.atoms.Rotation) right).beta
        _c : bool = ((soy.atoms.Rotation) left).gamma  == ((soy.atoms.Rotation) right).gamma

        return (_a & _b & _c)


    def static cmp_ne (left : Object, right : Object) : bool
        return not cmp_eq(left, right)
