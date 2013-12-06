/*
 *  libsoy - soy.controllers.Pointer
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


class soy.controllers.Pointer : soy.controllers.Controller
    /*
    Soy Pointer Controller

    This class controls pointer input, which is usually the mouse.
    */

    ////////////////////////////////////////////////////////////////////////
    // Events
    event button_press (e : soy.events.ButtonPress)
    event button_release (e : soy.events.ButtonRelease)     

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override tp_repr ( ) : string
        return "Pointer"

    def motion (x : int, y : int)
        _x = x
        _y = y
        if _position_obj != null
            _position_obj.set(x, y)

    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // position property
    _x : int
    _y : int
    _position_obj : weak soy.atoms.Position?

    def _position_set (position : soy.atoms.Position)
        _x = (int) position.x
        _y = (int) position.y
        // TODO move pointer position

    def _position_weak (position : Object)
        self._position_obj = null

    prop position : soy.atoms.Position
        owned get
            value : soy.atoms.Position? = self._position_obj
            if value is null
                value = new soy.atoms.Position((float) self._x,
                                               (float) self._y, 0.0f)
                value.on_set.connect(self._position_set)
                value.weak_ref(self._position_weak)
                self._position_obj = value
            return value

        set
            self._position_set(value)
            if _position_obj != null
                _position_obj.on_set.disconnect(self._position_set)
                _position_obj.weak_unref(self._position_weak)
            _position_obj = value
            value.on_set.connect(self._position_set)
            value.weak_ref(self._position_weak)
