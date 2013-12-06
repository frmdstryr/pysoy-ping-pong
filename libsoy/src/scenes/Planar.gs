/*
 *  libsoy - soy.scenes.Planar
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


class soy.scenes.Planar : soy.scenes.Scene

    _offset : float
    _step : int
    _size : int = 200
    _planeID : ode.geoms.Plane
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    mutex : Mutex
    _vercache : array of GLfloat // copy of vertex array

    construct (offset : float, step : int,
               material : soy.materials.Material?)
        super()

        // Setup for first render pass
        _ebo = 0
        _updated = true

        self.scale = 1.0f
        mutex = Mutex()
        self.gravity = new soy.atoms.Vector(0.0f, -9.8f, 0.0f)
        self._offset = offset
        self._step = step

        self._planeID = new ode.geoms.Plane (self.space,
                                             0.0f, 1.0f, 0.0f, self._offset)
        self._planeID.SetCategoryBits(GeomScene)
        self._planeID.SetData((void*) self)

        // Set the material of the plane
        if material is not null
            self._material = material
        else
            self._material = new soy.materials.Material()

        self.rotation = new array of GLfloat[9] = {1.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 1.0f}
        self.position = new soy.atoms.Position()

    ////////////////////////////////////////////////////////////////////////
    // Properties

    _material : soy.materials.Material
    prop material : soy.materials.Material
        get
            return _material
        set
            self._material = value

    _scale : float
    prop scale : float
        get
            return _scale
        set
            self._scale = value
            _updated = true

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override render_extra ()
        i : int = 0
        tslvoffset : int = 0
        translate : ode.Matrix3 = new ode.Matrix3()

        // save current matrix
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()

        // Lock so body can't be changed during render
        mutex.lock()

        // Update ebo/vbo as needed
        if _updated
            _update_scene()

        // Re-bind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11), null)
        glNormalPointer(   GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                        (GLvoid*) (sizeof(GLfloat) * 3))
        glTexCoordPointer(2, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                          (GLvoid*) (sizeof(GLfloat) * 6))

        // Center under camera
        var matrix = new array of GLfloat[16]
        glGetFloatv(GL_MODELVIEW_MATRIX, matrix)
        glTranslatef(-(matrix[0]*matrix[12]+matrix[1]*matrix[13]+matrix[2]
                    *matrix[14]), 0, -(matrix[8]*matrix[12]+matrix[9]*matrix[13]
                    +matrix[10]*matrix[14]))
        position.x = (matrix[0]*matrix[12]+matrix[1]*matrix[13]+matrix[2]
                     *matrix[14])
        position.z = (matrix[8]*matrix[12]+matrix[9]*matrix[13]+matrix[10]
                     *matrix[14])

        // Translate texture
        translate.m0 = 1.0f
        translate.m5 = 1.0f
        translate.ma = 1.0f
        translate.m3 = -(matrix[ 0] * matrix[12] +
                        matrix[ 1] * matrix[13] +
                        matrix[ 2] * matrix[14])/_scale
        translate.m7 = -(matrix[ 8] * matrix[12] +
                        matrix[ 9] * matrix[13] +
                        matrix[10] * matrix[14])/_scale

        // Turn on lights
        j : GLenum = GL_LIGHT0
        for light in lights
            light.on(j)
            j++

        // calculate tslvs
        if _material.needsTSLVs
            calculateTSLV(_vercache)
            tslvoffset = (int) (tslvs.length * sizeof(GLfloat) * 11/3)
            glBufferSubData(GL_ARRAY_BUFFER, (GLsizei) tslvoffset,
                            (GLsizei) (tslvs.length * sizeof(GLfloat)), tslvs)

        // Render
        while self._material.render(i, (GLvoid*) tslvoffset, translate)
            glDrawElements(GL_TRIANGLES, (8+(_step-1)*16)*3, GL_UNSIGNED_BYTE,
                           (GLvoid*) 0)
            i += 1

        // Rendering done, unlock
        mutex.unlock()

        // restore matrix
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()

    def _update_scene ()
        // on first pass
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        elements : array of GLubyte = new array of GLubyte[(8+(_step-1)*16)*3]
        vertices : array of GLfloat = new array of GLfloat[(1+_step*8)*14]

        for var i=0 to 7
            elements[i*3] = 0
            elements[i*3+1] = i+2
            elements[i*3+2] = i+1

        elements[7*3+1] = 1

        for var i=1 to (_step-1)
            for var j=0 to 7
                elements[(i*8+j-4)*6] = (i-1)*8+j+1
                elements[(i*8+j-4)*6+1] = (i-1)*8+j+2
                elements[(i*8+j-4)*6+2] = i*8+j+1
                elements[(i*8+j-4)*6+3] = i*8+j+1
                elements[(i*8+j-4)*6+4] = (i-1)*8+j+2
                elements[(i*8+j-4)*6+5] = i*8+j+2
            elements[(i*8+7-4)*6+1] = (i-1)*8+1
            elements[(i*8+7-4)*6+4] = (i-1)*8+1
            elements[(i*8+7-4)*6+5] = i*8+1

        vertices[0] = 0.0f
        vertices[1] = _offset
        vertices[2] = 0.0f
        vertices[3] = 0.0f
        vertices[4] = 1.0f
        vertices[5] = 0.0f
        vertices[6] = 0.0f
        vertices[7] = 0.0f
        vertices[8] = 0.0f
        vertices[9] = 0.0f
        vertices[10] = -1.0f

        angle : float = 0
        radius : float = 2*_size/(float)(_step*(_step+1))
        for var i=0 to (_step-1)
            for var j=0 to 7
                vertices[(i*8+j+1)*11] = radius*cosf(angle+j*(float)PI/4)
                vertices[(i*8+j+1)*11+1] = _offset
                vertices[(i*8+j+1)*11+2] = radius*sinf(angle+j*(float)PI/4)
                vertices[(i*8+j+1)*11+3] = 0.0f
                vertices[(i*8+j+1)*11+4] = 1.0f
                vertices[(i*8+j+1)*11+5] = 0.0f
                vertices[(i*8+j+1)*11+6] = vertices[(i*8+j+1)*11]/_scale
                vertices[(i*8+j+1)*11+7] = vertices[(i*8+j+1)*11+2]/_scale
                vertices[(i*8+j+1)*11+8] = 0.0f
                vertices[(i*8+j+1)*11+9] = 0.0f
                vertices[(i*8+j+1)*11+10] = -1.0f
            angle += (float)PI/8
            angle %= (float)PI*2
            radius += 2*(i+2)*_size/(float)(_step*(_step+1))

        _vercache = vertices

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (8+(_step-1)*16)*3, elements,
                     GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) ((1+_step*8)*14 * sizeof(GLfloat
                     )), vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false

