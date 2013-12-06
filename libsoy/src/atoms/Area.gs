/*
 *  libsoy - soy.atoms.Area
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


class soy.atoms.Area : Object
    event on_set (area : Area)

    construct (x1 : float, y1 : float, x2 : float, y2 : float)
        self._x1 = x1
        self._y1 = y1
        self._x2 = x2
        self._y2 = y2

    def new set (x1 : float, y1 : float, x2 : float, y2 : float)
        self._x1 = x1
        self._y1 = y1
        self._x2 = x2
        self._y2 = y2
        self.on_set(self)

    ////////////////////////////////////////////////////////////////////////
    // Properties

    _x1 : float
    prop x1 : float
        get
            return self._x1
        set
            self._x1 = value
            self.on_set(self)

    _y1 : float
    prop y1 : float
        get
            return self._y1
        set
            self._y1 = value
            self.on_set(self)

    _x2 : float
    prop x2 : float
        get
            return self._x2
        set
            self._x2 = value
            self.on_set(self)

    _y2 : float
    prop y2 : float
        get
            return self._y2
        set
            self._y2 = value
            self.on_set(self)

