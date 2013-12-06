/*
 *  libsoy - soy.atoms.Vertex
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


class soy.atoms.Vertex : Object
    event on_set (vertex : Vertex)

    construct (position : Position, normal : Vector,
               texcoord : Position, tangent : Vector)
        // Store position
        self._px = (float) position.x
        self._py = (float) position.y
        self._pz = (float) position.z
        self._position_obj = position
        position.on_set.connect(self._position_set)
        position.weak_ref(self._position_weak)

        // Store normal
        self._nx = (float) normal.x
        self._ny = (float) normal.y
        self._nz = (float) normal.z
        self._normal_obj = normal
        normal.on_set.connect(self._normal_set)
        normal.weak_ref(self._normal_weak)

        // Store texcoord
        self._tx = (float) texcoord.x
        self._ty = (float) texcoord.y
        self._tz = (float) texcoord.z
        self._texcoord_obj = texcoord
        texcoord.on_set.connect(self._texcoord_set)
        texcoord.weak_ref(self._texcoord_weak)

        // Store tangent
        self._ux = (float) tangent.x
        self._uy = (float) tangent.y
        self._uz = (float) tangent.z
        self._tangent_obj = tangent
        tangent.on_set.connect(self._tangent_set)
        tangent.weak_ref(self._tangent_weak)


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // position Property
    _px : float
    _py : float
    _pz : float
    _position_obj : weak soy.atoms.Position?

    def _position_set(position : soy.atoms.Position)
        _px = (float) position.x
        _py = (float) position.y
        _pz = (float) position.z
        self.on_set(self)

    def _position_weak(position : Object)
        self._position_obj = null

    prop position : soy.atoms.Position
        owned get
            value : soy.atoms.Position? = self._position_obj
            if value is null
                value = new soy.atoms.Position((float) self._px,
                                               (float) self._py,
                                               (float) self._pz)
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

    //
    // normal Property
    _nx : float
    _ny : float
    _nz : float
    _normal_obj : weak soy.atoms.Vector?

    def _normal_set(normal : soy.atoms.Vector)
        _nx = (float) normal.x
        _ny = (float) normal.y
        _nz = (float) normal.z
        self.on_set(self)

    def _normal_weak(normal : Object)
        self._normal_obj = null

    prop normal : soy.atoms.Vector
        owned get
            value : soy.atoms.Vector? = self._normal_obj
            if value is null
                value = new soy.atoms.Vector((float) self._nx,
                                             (float) self._ny,
                                             (float) self._nz)
                value.on_set.connect(self._normal_set)
                value.weak_ref(self._normal_weak)
                self._normal_obj = value
            return value
        set
            self._normal_set(value)
            if _normal_obj != null
                _normal_obj.on_set.disconnect(self._normal_set)
                _normal_obj.weak_unref(self._normal_weak)
            _normal_obj = value
            value.on_set.connect(self._normal_set)
            value.weak_ref(self._normal_weak)

    //
    // texcoord Property
    _tx : float
    _ty : float
    _tz : float
    _texcoord_obj : weak soy.atoms.Position?

    def _texcoord_set(texcoord : soy.atoms.Position)
        _tx = (float) texcoord.x
        _ty = (float) texcoord.y
        _tz = (float) texcoord.z
        self.on_set(self)

    def _texcoord_weak(texcoord : Object)
        self._texcoord_obj = null

    prop texcoord : soy.atoms.Position
        owned get
            value : soy.atoms.Position? = self._texcoord_obj
            if value is null
                value = new soy.atoms.Position((float) self._tx,
                                               (float) self._ty,
                                               (float) self._tz)
                value.on_set.connect(self._texcoord_set)
                value.weak_ref(self._texcoord_weak)
                self._texcoord_obj = value
            return value
        set
            self._texcoord_set(value)
            if _texcoord_obj != null
                _texcoord_obj.on_set.disconnect(self._texcoord_set)
                _texcoord_obj.weak_unref(self._texcoord_weak)
            _texcoord_obj = value
            value.on_set.connect(self._texcoord_set)
            value.weak_ref(self._texcoord_weak)

    //
    // tangent Property
    _ux : float
    _uy : float
    _uz : float
    _tangent_obj : weak soy.atoms.Vector?

    def _tangent_set(tangent : soy.atoms.Vector)
        _ux = (float) tangent.x
        _uy = (float) tangent.y
        _uz = (float) tangent.z
        self.on_set(self)

    def _tangent_weak(tangent : Object)
        self._tangent_obj = null

    prop tangent : soy.atoms.Vector
        owned get
            value : soy.atoms.Vector? = self._tangent_obj
            if value is null
                value = new soy.atoms.Vector((float) self._ux,
                                             (float) self._uy,
                                             (float) self._uz)
                value.on_set.connect(self._tangent_set)
                value.weak_ref(self._tangent_weak)
                self._tangent_obj = value
            return value
        set
            self._tangent_set(value)
            if _tangent_obj != null
                _tangent_obj.on_set.disconnect(self._tangent_set)
                _tangent_obj.weak_unref(self._tangent_weak)
            _tangent_obj = value
            value.on_set.connect(self._tangent_set)
            value.weak_ref(self._tangent_weak)


    def static cmp_eq (left : Object, right : Object) : bool
        if not (left isa soy.atoms.Vertex) or not (right isa soy.atoms.Vertex)
            return false

        _pos : bool = soy.atoms.Position.cmp_eq(((soy.atoms.Vertex) left).position,
                                                ((soy.atoms.Vertex) right).position)
        _nor : bool = soy.atoms.Vector.cmp_eq(((soy.atoms.Vertex) left).normal,
                                                ((soy.atoms.Vertex) right).normal)
        _tex : bool = soy.atoms.Position.cmp_eq(((soy.atoms.Vertex) left).texcoord,
                                                ((soy.atoms.Vertex) right).texcoord)
        _tan : bool = soy.atoms.Vector.cmp_eq(((soy.atoms.Vertex) left).tangent,
                                                ((soy.atoms.Vertex) right).tangent)

        return (_pos & _nor & _tex & _tan)


    def static cmp_ne (left : Object, right : Object) : bool
        return not cmp_eq(left, right)
