/*
 *  libsoy - soy.events.Device
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

class soy.events.Device : soy.events.Event
    /*
    Soy device event

    Device is a event for generic devices, notably pointers and keyboards.
    This class is just for inheritance.
    */


    detail : int // oughta be protected
    prop readonly root_x : double
    prop readonly root_y : double
    prop readonly x : double
    prop readonly y : double

    construct instance(detail : int,
                       root_x : double,
                       root_y : double,
                       x : double,
                       y : double)
        self.detail = detail
        _root_x = root_x
        _root_y = root_y
        _x = x
        _y = y

