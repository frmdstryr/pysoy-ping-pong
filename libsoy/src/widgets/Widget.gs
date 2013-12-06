/*
 *  libsoy - soy.widgets.Widget
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
    soy.atoms
    
class soy.widgets.Widget : Object

    def virtual add (parent : soy.widgets.Container)
        return

    def virtual remove ()
        return

    def virtual render (x: int, y : int, width : int, height : int)
        return

    def virtual resize(x: int, y : int, width : int, height : int)
        return
    
    //
    // size Property
    width : int
    height : int
    resized : bool
    _size_obj : weak soy.atoms.Size?

    def _size_set(size : soy.atoms.Size)
        self.width = (int) Math.lround(size.width)
        self.height = (int) Math.lround(size.height)
        self.resize(0, 0, self.width, self.height)
        self.resized = true

    def _size_weak(size : Object)
        self._size_obj = null

    prop size : soy.atoms.Size
        owned get
            value : soy.atoms.Size? = self._size_obj
            if value is null
                value = new soy.atoms.Size((float) self.width,
                                           (float) self.height)
                value.on_set.connect(self._size_set)
                value.weak_ref(self._size_weak)
                self._size_obj = value
            return value
        set
            self._size_set(value)
            if _size_obj != null
                _size_obj.on_set.disconnect(self._size_set)
                _size_obj.weak_unref(self._size_weak)
            _size_obj = value
            value.on_set.connect(self._size_set)
            value.weak_ref(self._size_weak)
