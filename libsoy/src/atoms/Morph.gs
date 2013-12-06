/*
 *  libsoy - soy.atoms.Face
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
    GL

class soy.atoms.Morph : Object
    event on_set(morph : Morph) 

    _mtrx_orig : GLfloat*
    _length : GLsizei

    construct (a : soy.bodies.Mesh, b : soy.bodies.Mesh)
        self._delta = 0.0f
        self._gen_buffer(a,b)
        self._gen_mtrx(a,b)

    construct with_delta (a : soy.bodies.Mesh, b : soy.bodies.Mesh, delta : float)
        self._delta = delta
        self._gen_buffer(a,b)
        self._gen_mtrx(a,b)

    //this is how we will handle animation -- Keyframe refers to some sort of soy.atoms.Keyframe
    //construct with_keyframe (a : soy.bodies.Mesh, b : soy.bodies.Mesh, delta : float, keyframe : Keyframe)

    _delta : float
    prop delta : float
        get
            return _delta
        set
            if value <= 1.0 and value >= 0.0
                _delta = value 
                self._update_mtrx()
                self.on_set(self)

    _mtrx : GLfloat*
    prop matrix : GLfloat*
         get 
            return _mtrx

    def _gen_buffer (a : soy.bodies.Mesh, b : soy.bodies.Mesh)
        buffer_size : ulong 

        if a.length != b.length
            return //error -- meshes should be the same size
        buffer_size = a.length * 36 * sizeof(GLfloat)

        if buffer_size is 0
            if self._mtrx is not null
                free(self._mtrx)
                self._mtrx = null
            if self._mtrx_orig is not null
                free(self._mtrx_orig)
                self._mtrx_orig = null
        else
            if self._mtrx is not null    
                self._mtrx = (GLfloat*) realloc(self._mtrx,buffer_size)
            else
                self._mtrx = (GLfloat*) malloc0(buffer_size)
            if self._mtrx_orig is not null
                self._mtrx_orig = (GLfloat*) realloc(self._mtrx_orig,buffer_size)
            else
                self._mtrx_orig = (GLfloat*) malloc0(buffer_size)

        // we are referencing an individual component of each vertex -- each vertex has 12 components, and there are 3 vertices per face -- so the length of our array is 36 times the number of faces in the mesh
        self._length = (GLsizei) a.length * 36

    def _gen_mtrx (a : soy.bodies.Mesh, b : soy.bodies.Mesh)
        verts_a : GLfloat* = a.get_raw_verts()
        verts_b : GLfloat* = b.get_raw_verts()
        diff : GLfloat
        for var i = 0 to self._length
            diff = (GLfloat) (verts_b[i] - verts_a[i])
            self._mtrx_orig[i] = diff
            self._mtrx[i] = (GLfloat) (diff * self._delta)

    def _update_mtrx()
        for var i = 0 to self._length
            self._mtrx[i] = (GLfloat) (self._mtrx_orig[i] * self._delta)
