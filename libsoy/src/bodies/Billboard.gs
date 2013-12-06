/*
 *  libsoy - soy.bodies.Billboard
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
    GLib.Math
    ode

class soy.bodies.Billboard : soy.bodies.Body
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    _xsubdivisions : int // Number of X Subdivisions
    _ysubdivisions : int // Number of Y Subdivisions
    _vercache : array of GLfloat // copy of vertex array

    construct (position : soy.atoms.Position?, size : soy.atoms.Size?,
               material : soy.materials.Material?)
        super(position, size, 0.0f)
        _updated = true
        if size is null
            _width = 1.0f
            _height = 1.0f
            _xsubdivisions = 1
            _ysubdivisions = 1
        else
            _width = (GLfloat) size.width
            _height = (GLfloat) size.height
            _xsubdivisions = (int) ceil(size.width / 2)
            _ysubdivisions = (int) ceil(size.height / 2)
            _size_obj = size
        if material is null
            if default_material is null
                default_material = new soy.materials.Material()
            _material = default_material
        else
            _material = material


    def override render ( alpha_stage : bool, camera : soy.bodies.Camera,
                          level : int )
        if alpha_stage is not self._material.translucent
            return

        i : int = 0
        offset : int = 0

        // save current matrix
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()

        // Lock so body can't be changed during render
        mutex.lock()

        // set modelview matrix
        self.mult_model_matrix()

        // Update ebo/vbo as needed
        if _updated
            _update_billboard()

        // Re-bind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11), null)
        glNormalPointer(   GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                        (GLvoid*) (sizeof(GLfloat) * 3))

        // Make it face the camera
        var matrix = new array of float[16]
        glGetFloatv(GL_MODELVIEW_MATRIX, matrix)

        matrix = {1,          0,          0,          0,
                  0,          1,          0,          0,
                  0,          0,          1,          0,
                  matrix[12], matrix[13], matrix[14], 1}

        glLoadMatrixf(matrix)

        // calculate tslvs
        if _material.needsTSLVs
            calculateTSLV(_vercache)
            offset = (int) (tslvs.length * sizeof(GLfloat) * 11/3)
            glBufferSubData(GL_ARRAY_BUFFER, (GLsizei) offset,
                            (GLsizei) (tslvs.length * sizeof(GLfloat)), tslvs)

        // Render
        while self._material.render(i, (GLvoid*) offset)
            glDrawElements(GL_TRIANGLES, (GLsizei) (_xsubdivisions*
                           _ysubdivisions*6), GL_UNSIGNED_BYTE, (GLvoid*) 0)
            i += 1

        // Render axis
        renderAxis()

        // Rendering done, unlock
        mutex.unlock()

        // Restore matrix
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()


    def override set_mass (density : float)
        if density is not 0 and self.volume() is not 0.0f
            mass : ode.Mass = new ode.Mass()
            // TODO: this is temporary and must be fixed
            mass.SetBox(density, _width, _height, 0.1f)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)

    def _update_billboard()

        // on first pass
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        elements : array of GLubyte = new array of GLubyte[_xsubdivisions * _ysubdivisions * 6]

        for var i=0 to (_ysubdivisions-1)
            for var j=0 to (_xsubdivisions-1)
                elements[(i*_xsubdivisions+j)*6] = j+i*(_xsubdivisions+1)
                elements[(i*_xsubdivisions+j)*6+1] = j+i*(_xsubdivisions+1)+1
                elements[(i*_xsubdivisions+j)*6+2] = j+i*(_xsubdivisions+1)+_xsubdivisions+1
                elements[(i*_xsubdivisions+j)*6+3] = j+i*(_xsubdivisions+1)+_xsubdivisions+1
                elements[(i*_xsubdivisions+j)*6+4] = j+i*(_xsubdivisions+1)+1
                elements[(i*_xsubdivisions+j)*6+5] = j+i*(_xsubdivisions+1)+_xsubdivisions+2

        vertices : array of GLfloat = new array of GLfloat[(1+_xsubdivisions)*(1+_ysubdivisions)*14]

        for var i=0 to _ysubdivisions
            for var j=0 to _xsubdivisions
                vertices[(i*(_xsubdivisions+1)+j)*11] = (_width * j 
                                                / _xsubdivisions) - (_width/2)
                vertices[(i*(_xsubdivisions+1)+j)*11+1] = (_height * i 
                                                / _ysubdivisions) - (_height/2)
                vertices[(i*(_xsubdivisions+1)+j)*11+2] = 0
                vertices[(i*(_xsubdivisions+1)+j)*11+3] = 0
                vertices[(i*(_xsubdivisions+1)+j)*11+4] = 0
                vertices[(i*(_xsubdivisions+1)+j)*11+5] = 1
                vertices[(i*(_xsubdivisions+1)+j)*11+6] = j / _xsubdivisions
                vertices[(i*(_xsubdivisions+1)+j)*11+7] = i / _ysubdivisions
                vertices[(i*(_xsubdivisions+1)+j)*11+8] = 0
                vertices[(i*(_xsubdivisions+1)+j)*11+9] = 1
                vertices[(i*(_xsubdivisions+1)+j)*11+10] = 0

        _vercache = vertices

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (6 * _xsubdivisions 
                     * _ysubdivisions * sizeof(GLubyte)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (14 * (1+_xsubdivisions) 
                     * (1+_ysubdivisions) * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false

    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // Size Property
    _width  : GLfloat
    _height : GLfloat

    _size_obj : weak soy.atoms.Size?

    def _size_set(size : soy.atoms.Size)
        // Set size while locked to avoid potential rendering weirdness
        mutex.lock()
        _width = (GLfloat) size.width
        _height = (GLfloat) size.height
        _xsubdivisions = (int) ceil(size.width / 2)
        _ysubdivisions = (int) ceil(size.height / 2)
        _updated = true
        mutex.unlock()

    def _size_weak(size : Object)
        _size_obj = null

    prop size : soy.atoms.Size
        owned get
            value : soy.atoms.Size? = self._size_obj
            if value is null
                value = new soy.atoms.Size((float) _width,
                                           (float) _height,
                                           (float) 0.0f)
                value.on_set.connect(self._size_set)
                value.weak_ref(self._size_weak)
                self._size_obj = value
            return value
        set
            self._size_set(value)
            _size_obj = value
            value.on_set.connect(self._size_set)
            value.weak_ref(self._size_weak)

    //
    // material property
    _material : soy.materials.Material
    prop material : soy.materials.Material?
        get
            if _material is default_material
                return null
            return _material
        set
            mutex.lock()
            // Use default material
            if value is null
                if default_material is null
                    default_material = new soy.materials.Material()
                _material = default_material

            // Use the provided material
            else
                _material = value
            mutex.unlock()

