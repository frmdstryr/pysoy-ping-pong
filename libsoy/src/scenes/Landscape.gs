/*
 *  libsoy - soy.scenes.Landscape
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
    GLib.Math
    GL
    Gee
    ode


class soy.scenes.Landscape : soy.scenes.Scene
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    mutex : Mutex
    _vertArray : array of GLfloat
    _faceArray : array of GLushort
    _heightfieldData : ode.geoms.HeightfieldData
    _geomID : ode.geoms.Heightfield

    construct (heightmap : soy.textures.Texture, mat : soy.materials.Material,
               detail : int = 1,
               size : soy.atoms.Size?,
               position : soy.atoms.Position?)
        assert heightmap.channels is 1

        self._map = heightmap
        self._material = mat

        if size is null
            self._size = new soy.atoms.Size (1024, 16, 1024)
        else
            self._size = size

        if position is null
            self._pos = new soy.atoms.Position ()
        else
            self._pos = position

        // Setup for first render pass
        self._updated = true

        self.mutex = Mutex()

    ////////////////////////////////////////////////////////////////////////
    // Properties

    _material : soy.materials.Material
    prop material : soy.materials.Material
        get
            return _material
        set
            self._material = value

    _pos : soy.atoms.Position
    prop new position : soy.atoms.Position
        get
            return _pos
        set
            self._pos = value

    _size : soy.atoms.Size
    prop size : soy.atoms.Size
        get
            return _size
        set
            self._size = value

    _map : soy.textures.Texture
    prop heightmap : soy.textures.Texture
        get
            return _map
        set
            self._map = value
            self._updated = true


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def _update_landscape ()
        //
        // Each texel represents a vertex:
        // (3x3 texture, viewed from above)
        //
        // 0----1----2
        // |    |    |
        // |    |    |
        // 3----4----5
        // |    |    |
        // |    |    |
        // 6----7----8
        //

        // on the first pass
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        i, j, l, offset : int
        a, b, c : int
//        deltaCols, deltaRows : float *
//        maxDelta, minDelta : float

        v1 : array of double = new array of double[3]
        v2 : array of double = new array of double[3]
        normal : array of double = new array of double[3]
        normal2 : array of double = new array of double[3]
        u : array of double = new array of double[3]
        length : double

        self._heightfieldData = new ode.geoms.HeightfieldData()

        self._vertArray = new array of GLfloat[((int)_map.size.width) * ((int)_map.size.height) * 11]
        self._faceArray = new array of GLushort[((int)_map.size.width-1) * ((int)_map.size.height-1) * 6]

        self._heightfieldData.BuildByte(_map.texels,
                                        0,                          // copy?
                                        _size.width,                // width
                                        _size.depth,                // depth
                                        (int) _map.size.width,      // dataX
                                        (int) _map.size.height,     // dataY
                                        (Real) (1.0f / 255.0f *
                                                _size.height),      // scale
                                        0,                          // offset
                                        (Real) 4.0f,                // thick
                                        0                           // wrapped
                                       )

        self._geomID = new ode.geoms.Heightfield(space, _heightfieldData, 1)
        self._geomID.SetPosition(_pos.x, _pos.y, _pos.z)

        // Alloc _delta arrays
        //
        //   These are arrays for column and row edge deltas:
        //     . . . . . . . .    ._._._._._._._.
        //     | | | | | | | | < delta
        //     . . . . . . . .    ._._._._._._._.
        //     | | | | | | | |         ^delta
        //     . . . . . . . .    ._._._._._._._.
        //        deltaCols          deltaRows
        //
        //   They're used in determining edge collapses in LOD generation below.
//        deltaCols = new array of float[((int)_map.size.width) * ((int)_map.size.height)]
//        deltaRows = new array of float[((int)_map.size.width) * ((int)_map.size.height)]

        // Calculate positions and texcoords first
        for i = 0 to (_map.size.height - 1)
            for j = 0 to (_map.size.width - 1)
                l = (int)_map.size.width * i + j
                _vertArray[l * 11]     = (j / (_map.size.width - 1.0f) - 0.5f) * _size.width
                _vertArray[l * 11 + 1] = (_map.texels[l] / 255.0f) * _size.height
                _vertArray[l * 11 + 2] = (i / (_map.size.height - 1.0f) - 0.5f)  * _size.depth
                // all below need to be calculated CORRECTLY!
                _vertArray[l * 11 + 6] = j                         // * texture scale
                _vertArray[l * 11 + 7] = i                         // * texture scale
                // _vertArray[l].texcoord.z = _map.texels[l] / 255.0f

        // Normals and tangents calculated second because they depend on position
        for i = 0 to (_map.size.height - 1)
            for j = 0 to (_map.size.width - 1)
                normal[0] = 0.0
                normal[1] = 0.0
                normal[2] = 0.0
                normal2[0] = 0.0
                normal2[1] = 0.0
                normal2[2] = 0.0
                offset = (int)_map.size.width * i + j

                // for code cleanliness, get the four verticies first as:
                //
                // c-b   c = current vert
                // |\|   vector1 (b) = cb
                // a     vector2 (a) = ca
                a = offset + (int)_map.size.width
                b = offset + 1
                c = offset

                // check if we are at the boundaries
                v1[0] = _size.width / (_map.size.width - 1.0f)
                v1[2] = 0.0f
                if j is not (int)(_map.size.width-1)
                    v1[1] = _vertArray[b * 11 + 1] - _vertArray[c * 11 + 1]
                else
                    v1[1] = -_vertArray[c * 11 + 1]

                v2[0] = 0.0f
                v2[2] = _size.depth / (_map.size.height - 1.0f)
                if i is not (int)(_map.size.height-1)
                    v2[1] = _vertArray[a * 11 + 1] - _vertArray[c * 11 + 1]
                else
                    v2[1] = -_vertArray[c * 11 + 1]

                // While we are in this loop, calculate the delta map for LOD
                // deltaRows[offset] = _vertArray[offset * 11 + 1] - _vertArray[(offset+1) * 11 + 1]

                // perform cross products on the two vectors
                normal[0] = v2[1]*v1[2]-v2[2]*v1[1] // Calculate the x component of the normal
                normal[1] = v2[2]*v1[0]-v2[0]*v1[2] // Calculate the y component of the normal
                normal[2] = v2[0]*v1[1]-v2[1]*v1[0] // Calculate the z component of the normal

                //   a
                // |\|   vector1 (b) = cb
                // b c   vector2 (a) = ca
                //
                a = offset - (int)_map.size.width
                b = offset - 1
                c = offset

                // check if we are at the boundaries
                v1[0] = -_size.width / (_map.size.width - 1.0f)
                v1[2] = 0.0f
                if j is not (int)(_map.size.width-1)
                    v1[1] = _vertArray[b * 11 + 1] - _vertArray[c * 11 + 1]
                else
                    v1[1] = -_vertArray[c * 11 + 1]

                v2[0] = 0.0f
                v2[2] = -_size.depth / (_map.size.height - 1.0f)
                if i is not (int)(_map.size.height-1)
                    v2[1] = _vertArray[a * 11 + 1] - _vertArray[c * 11 + 1]
                else
                    v2[1] = -_vertArray[c * 11 + 1]

                // perform cross products on the two vectors
                normal2[0] = v2[1]*v1[2]-v2[2]*v1[1] // Calculate the x component of the normal
                normal2[1] = v2[2]*v1[0]-v2[0]*v1[2] // Calculate the y component of the normal
                normal2[2] = v2[0]*v1[1]-v2[1]*v1[0] // Calculate the z component of the normal

                // last thing of all, average the two together and set them as the normals!
                normal[0] += normal2[0]
                normal[1] += normal2[1]
                normal[2] += normal2[2]
                normal[0] /= 2
                normal[1] /= 2
                normal[2] /= 2
                length = sqrt(normal[0] *
                              normal[0] + normal[1] *
                              normal[1] + normal[2] *
                              normal[2])

                normal[0] /= length
                normal[1] /= length
                normal[2] /= length

                _vertArray[offset * 11 + 3] = (float) normal[0]
                _vertArray[offset * 11 + 4] = (float) normal[1]
                _vertArray[offset * 11 + 5] = (float) normal[2]
                // q = 90 degrees in the x direction
                // uy' = y*cos q - z*sin q
                // uz' = y*sin q + z*cos q
                // ux' = x
                // Rotate the whole normal, returns tangent

                u[0] = normal[0]
                u[1] = -(normal[2]-_vertArray[offset*11 + 2]) + _vertArray[offset*11 + 1]
                u[2] = (normal[1]-_vertArray[offset*11 + 1]) + _vertArray[offset*11 + 2]
                self._vertArray[offset * 11 + 8] = (float) u[0]
                self._vertArray[offset * 11 + 9] = (float) u[1]
                self._vertArray[offset * 11 + 10] = (float) u[2]

        // set up the face array to make all of the triangles
        l = 0

        // loop through all of the triangles in the grid
        for i = 0 to ((int)_map.size.height - 2)
            for j = 0 to ((int)_map.size.width - 2)
                // CCW winding order:
                //   a-c
                //   |/|   abc,cbd
                //   b-d
                _faceArray[l]   = (GLushort) (j + ( i    * ((int)_map.size.width)))
                _faceArray[l+1] = (GLushort) (j + ((i+1) * ((int)_map.size.width)))
                _faceArray[l+2] = (GLushort) (j + ( i    * ((int)_map.size.width)) + 1)
                _faceArray[l+3] = (GLushort) (j + ( i    * ((int)_map.size.width)) + 1)
                _faceArray[l+4] = (GLushort) (j + ((i+1) * ((int)_map.size.width)))
                _faceArray[l+5] = (GLushort) (j + ((i+1) * ((int)_map.size.width)) + 1)
                l += 6

        // Set a starting value for _maxDelta and _minDelta so it isn't blank
//        maxDelta = deltaRows[0]
//        minDelta = deltaRows[0]
        
        // Loop through _deltaRows to figure out what can be merged
//        for i = 0 to (((int)_map.size.width + 1) * ((int)_map.size.height + 1) - 1)
//            if deltaRows[i] > maxDelta
//                maxDelta = deltaRows[i]
//            if deltaRows[i] < minDelta
//                minDelta = deltaRows[i]

        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (((int)_map.size.width) *
                     ((int)_map.size.height) * 11 * sizeof(GLfloat)),
                     _vertArray,
                     GL_STATIC_DRAW)

        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (((int)_map.size.width-1)
                     * ((int)_map.size.height-1) * 6 * sizeof(GLushort)),
                     _faceArray,
                     GL_STATIC_DRAW)

        self._updated = false

    def override render_extra ()
        mutex.lock()
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()
        glTranslatef(_pos.x, _pos.y, _pos.z)

        if _updated
            _update_landscape()
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glVertexPointer  (3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11), null)                             // px py pz
        glNormalPointer  (   GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11), (GLvoid*) (sizeof(GLfloat) * 3))  // nx ny nz

        // Turn on lights
        j : GLenum = GL_LIGHT0
        for light in lights
            light.on(j)
            j++

        i : int = 0
        while _material.render(i, null)
            glDrawElements(GL_TRIANGLES, ((int)_map.size.width-1) * ((int)_map.size.height-1) * 6, GL_UNSIGNED_SHORT, (GLvoid*) 0)
            i += 1

        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()
        mutex.unlock()
