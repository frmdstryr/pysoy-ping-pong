/*
 *  libsoy - soy.controllers.graph.AbstractGraph
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
    Gee

class soy.controllers.graph.AbstractGraph : Object
    _scene  : soy.scenes.Scene
    _radius : float
    _has_radius : bool
    _size   : soy.atoms.Size?

    construct(scene : soy.scenes.Scene, radius : float = -1.0f, size : soy.atoms.Size? = null)
        self._scene = scene
        self._has_radius = (radius > 0.0f)
        if !self._has_radius
            self._radius = -1.0f
        else
            self._radius = radius
        self._size = size 

    def virtual check_collisions(start : soy.atoms.Position, ends : array of soy.atoms.Position) : array of bool
        if not(self.size is null)
            return self.scene.check_collisions_with_size(start, ends, self.size)
        else if self._has_radius 
            return self.scene.check_collisions_with_radius(start, ends, self.radius)
        else
            return self.scene.check_collisions(start, ends)

    prop readonly size : soy.atoms.Size?
        get
            return self._size

    prop readonly scene : soy.scenes.Scene 
        get
            return self._scene

    prop readonly radius : float
        get
            return self._radius
