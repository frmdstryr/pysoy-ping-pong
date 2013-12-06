/*
 *  libsoy - soy.scenes.Room
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
    GL
    Gee
    ode
    GLib.Math

class soy.scenes.Room : soy.scenes.Scene
    planes : array of geoms.Geom
    mutex : Mutex
    _sub : int
    _size : float
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating

    init
        mutex = Mutex()

    construct (size : float)
        // This is a scene which has 6 planes facing towards the center creating
        // a sort of room, which keeps objects within an area.
        planes = new array of geoms.Geom[6]
        planes[0] = new ode.geoms.Plane(super.space,  1.0f,  0.0f,  0.0f, -size)
        planes[1] = new ode.geoms.Plane(super.space,  0.0f,  1.0f,  0.0f, -size)
        planes[2] = new ode.geoms.Plane(super.space,  0.0f,  0.0f,  1.0f, -size)
        planes[3] = new ode.geoms.Plane(super.space, -1.0f,  0.0f,  0.0f, -size)
        planes[4] = new ode.geoms.Plane(super.space,  0.0f, -1.0f,  0.0f, -size)
        planes[5] = new ode.geoms.Plane(super.space,  0.0f,  0.0f, -1.0f, -size)
        for var i = 0 to 5
            planes[i].SetCategoryBits(1)
        _sub = (int) ceil(size*2)
        _size = size
        _updated = true

    def override render_extra ()
        if _walls is not null
            i : int = 0

            // save current matrix
            glMatrixMode(GL_MODELVIEW)
            glPushMatrix()

            // lock so cant be changed during a render
            mutex.lock()

            // update ebo/vbo if its needed
            if _updated
                _update_walls()

            // rebind buffers when not updating
            else
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
                glBindBuffer(GL_ARRAY_BUFFER, _vbo)

            glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11), null)
            glNormalPointer(   GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                            (GLvoid*) (sizeof(GLfloat) * 3))

            // Turn on lights
            j : GLenum = GL_LIGHT0
            for light in lights
                light.on(j)
                j++

            while self._walls.render(i, null)
                glDrawElements(GL_TRIANGLES, (GLsizei) 3 * 4 * 6 * _sub * _sub,
                               GL_UNSIGNED_SHORT, (GLvoid*) 0)
                i += 1

            // unlock mutex for writing, rendering done
            mutex.unlock()

            // restore matrix
            glMatrixMode(GL_MODELVIEW)
            glPopMatrix()

    def _update_walls()

        // on first pass
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        elements : array of GLushort = new array of GLushort[_sub*_sub*4*6*3]

        for var k=0 to 5
            for var i=0 to (_sub-1)
                for var j=0 to (_sub-1)
                    elements[((i+k*_sub)*_sub+j)*12] = j+i*(_sub+1)+k*((1+_sub)*
                                                             (1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+1] = j+i*_sub+(_sub+1)*(_sub
                                             +1)+k*((1+_sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+2] = j+i*(_sub+1)+_sub+1+k*(
                                                    (1+_sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+3] = j+i*(_sub+1)+_sub+1+k*(
                                                    (1+_sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+4] = j+i*_sub+(_sub+1)*(_sub
                                             +1)+k*((1+_sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+5] = j+i*(_sub+1)+_sub+2+k*(
                                                    (1+_sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+6] = j+i*(_sub+1)+_sub+2+k*(
                                                    (1+_sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+7] = j+i*_sub+(_sub+1)*(_sub
                                             +1)+k*((1+_sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+8] = j+i*(_sub+1)+1+k*((1+
                                                       _sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+9] = j+i*(_sub+1)+1+k*((1+
                                                       _sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+10] = j+i*_sub+(_sub+1)*(
                                         _sub+1)+k*((1+_sub)*(1+_sub)+_sub*_sub)
                    elements[((i+k*_sub)*_sub+j)*12+11] = j+i*(_sub+1)+k*((1+
                                                       _sub)*(1+_sub)+_sub*_sub)

        vertices : array of GLfloat = new array of GLfloat[(_sub*_sub+(1+_sub)*(
                                                                  1+_sub))*11*6]

        // back

        var voffset = 0

        for var i=0 to _sub
            for var j=0 to _sub
                vertices[(i*(_sub+1)+j)*11] = 2*(_size * j / (float) _sub
                                                                       ) - _size
                vertices[(i*(_sub+1)+j)*11+1] = 2*(_size * i / (float) _sub
                                                                       ) - _size
                vertices[(i*(_sub+1)+j)*11+2] = -_size
                vertices[(i*(_sub+1)+j)*11+3] = 0
                vertices[(i*(_sub+1)+j)*11+4] = 0
                vertices[(i*(_sub+1)+j)*11+5] = 1
                vertices[(i*(_sub+1)+j)*11+6] = j / (float) _sub
                vertices[(i*(_sub+1)+j)*11+7] = i / (float) _sub
                vertices[(i*(_sub+1)+j)*11+8] = 0
                vertices[(i*(_sub+1)+j)*11+9] = 1
                vertices[(i*(_sub+1)+j)*11+10] = 0

        voffset += (1+_sub)*(1+_sub)

        for var i=0 to (_sub-1)
            for var j=0 to (_sub-1)
                vertices[(i*_sub+j+voffset)*11] = 2*(_size * (j+0.5f) / (float)
                                                                   _sub) - _size
                vertices[(i*_sub+j+voffset)*11+1] = 2*(_size * (i+0.5f) / (float
                                                                 ) _sub) - _size
                vertices[(i*_sub+j+voffset)*11+2] = -_size
                vertices[(i*_sub+j+voffset)*11+3] = 0
                vertices[(i*_sub+j+voffset)*11+4] = 0
                vertices[(i*_sub+j+voffset)*11+5] = 1
                vertices[(i*_sub+j+voffset)*11+6] = (j+0.5f) / (float) _sub
                vertices[(i*_sub+j+voffset)*11+7] = (i+0.5f) / (float) _sub
                vertices[(i*_sub+j+voffset)*11+8] = 0
                vertices[(i*_sub+j+voffset)*11+9] = 1
                vertices[(i*_sub+j+voffset)*11+10] = 0

        voffset += _sub*_sub

        // front

        for var i=0 to _sub
            for var j=0 to _sub
                vertices[(i*(_sub+1)+j+voffset)*11] = -2*(_size * j / (float)
                                                                   _sub) + _size
                vertices[(i*(_sub+1)+j+voffset)*11+1] = 2*(_size * i / (float)
                                                                   _sub) - _size
                vertices[(i*(_sub+1)+j+voffset)*11+2] = _size
                vertices[(i*(_sub+1)+j+voffset)*11+3] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+4] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+5] = -1
                vertices[(i*(_sub+1)+j+voffset)*11+6] = 1.0f-(j / (float) _sub)
                vertices[(i*(_sub+1)+j+voffset)*11+7] = i / (float) _sub
                vertices[(i*(_sub+1)+j+voffset)*11+8] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+9] = 1
                vertices[(i*(_sub+1)+j+voffset)*11+10] = 0

        voffset += (1+_sub)*(1+_sub)

        for var i=0 to (_sub-1)
            for var j=0 to (_sub-1)
                vertices[(i*_sub+j+voffset)*11] = -2*(_size * (j+0.5f) / (float)
                                                                   _sub) + _size
                vertices[(i*_sub+j+voffset)*11+1] = 2*(_size * (i+0.5f) / (float
                                                                 ) _sub) - _size
                vertices[(i*_sub+j+voffset)*11+2] = _size
                vertices[(i*_sub+j+voffset)*11+3] = 0
                vertices[(i*_sub+j+voffset)*11+4] = 0
                vertices[(i*_sub+j+voffset)*11+5] = -1
                vertices[(i*_sub+j+voffset)*11+6] = 1.0f-((j+0.5f) / (float)
                                                                           _sub)
                vertices[(i*_sub+j+voffset)*11+7] = (i+0.5f) / (float) _sub
                vertices[(i*_sub+j+voffset)*11+8] = 0
                vertices[(i*_sub+j+voffset)*11+9] = 1
                vertices[(i*_sub+j+voffset)*11+10] = 0

        voffset += _sub*_sub

        // right

        for var i=0 to _sub
            for var j=0 to _sub
                vertices[(i*(_sub+1)+j+voffset)*11] = _size
                vertices[(i*(_sub+1)+j+voffset)*11+1] = 2*(_size * i / (float)
                                                                   _sub) - _size
                vertices[(i*(_sub+1)+j+voffset)*11+2] = 2*(_size * j / (float)
                                                                   _sub) - _size
                vertices[(i*(_sub+1)+j+voffset)*11+3] = -1
                vertices[(i*(_sub+1)+j+voffset)*11+4] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+5] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+6] = j / (float) _sub
                vertices[(i*(_sub+1)+j+voffset)*11+7] = i / (float) _sub
                vertices[(i*(_sub+1)+j+voffset)*11+8] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+9] = 1
                vertices[(i*(_sub+1)+j+voffset)*11+10] = 0

        voffset += (1+_sub)*(1+_sub)

        for var i=0 to (_sub-1)
            for var j=0 to (_sub-1)
                vertices[(i*_sub+j+voffset)*11] = _size
                vertices[(i*_sub+j+voffset)*11+1] = 2*(_size * (i+0.5f) / (float
                                                                 ) _sub) - _size
                vertices[(i*_sub+j+voffset)*11+2] = 2*(_size * (j+0.5f) / (float
                                                                 ) _sub) - _size
                vertices[(i*_sub+j+voffset)*11+3] = -1
                vertices[(i*_sub+j+voffset)*11+4] = 0
                vertices[(i*_sub+j+voffset)*11+5] = 0
                vertices[(i*_sub+j+voffset)*11+6] = (j+0.5f) / (float) _sub
                vertices[(i*_sub+j+voffset)*11+7] = (i+0.5f) / (float) _sub
                vertices[(i*_sub+j+voffset)*11+8] = 0
                vertices[(i*_sub+j+voffset)*11+9] = 1
                vertices[(i*_sub+j+voffset)*11+10] = 0

        voffset += _sub*_sub

        // left

        for var i=0 to _sub
            for var j=0 to _sub
                vertices[(i*(_sub+1)+j+voffset)*11] = -_size
                vertices[(i*(_sub+1)+j+voffset)*11+1] = -2*(_size * i / (float)
                                                                   _sub) + _size
                vertices[(i*(_sub+1)+j+voffset)*11+2] = 2*(_size * j / (float)
                                                                   _sub) - _size
                vertices[(i*(_sub+1)+j+voffset)*11+3] = 1
                vertices[(i*(_sub+1)+j+voffset)*11+4] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+5] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+6] = 1.0f-(j / (float) _sub)
                vertices[(i*(_sub+1)+j+voffset)*11+7] = i / (float) _sub
                vertices[(i*(_sub+1)+j+voffset)*11+8] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+9] = 1
                vertices[(i*(_sub+1)+j+voffset)*11+10] = 0

        voffset += (1+_sub)*(1+_sub)

        for var i=0 to (_sub-1)
            for var j=0 to (_sub-1)
                vertices[(i*_sub+j+voffset)*11] = -_size
                vertices[(i*_sub+j+voffset)*11+1] = -2*(_size * (i+0.5f) / (
                                                            float) _sub) + _size
                vertices[(i*_sub+j+voffset)*11+2] = 2*(_size * (j+0.5f) / (
                                                            float) _sub) - _size
                vertices[(i*_sub+j+voffset)*11+3] = 1
                vertices[(i*_sub+j+voffset)*11+4] = 0
                vertices[(i*_sub+j+voffset)*11+5] = 0
                vertices[(i*_sub+j+voffset)*11+6] = 1.0f-((j+0.5f) / (float)
                                                                           _sub)
                vertices[(i*_sub+j+voffset)*11+7] = (i+0.5f) / (float) _sub
                vertices[(i*_sub+j+voffset)*11+8] = 0
                vertices[(i*_sub+j+voffset)*11+9] = 1
                vertices[(i*_sub+j+voffset)*11+10] = 0

        voffset += _sub*_sub

        // top

        for var i=0 to _sub
            for var j=0 to _sub
                vertices[(i*(_sub+1)+j+voffset)*11] = 2*(_size * j / (float)
                                                                   _sub) - _size
                vertices[(i*(_sub+1)+j+voffset)*11+1] = _size
                vertices[(i*(_sub+1)+j+voffset)*11+2] = 2*(_size * i / (float)
                                                                   _sub) - _size
                vertices[(i*(_sub+1)+j+voffset)*11+3] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+4] = -1
                vertices[(i*(_sub+1)+j+voffset)*11+5] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+6] = j / (float) _sub
                vertices[(i*(_sub+1)+j+voffset)*11+7] = i / (float) _sub
                vertices[(i*(_sub+1)+j+voffset)*11+8] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+9] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+10] = 1

        voffset += (1+_sub)*(1+_sub)

        for var i=0 to (_sub-1)
            for var j=0 to (_sub-1)
                vertices[(i*_sub+j+voffset)*11] = 2*(_size * (j+0.5f) / (float)
                                                                   _sub) - _size
                vertices[(i*_sub+j+voffset)*11+1] = _size
                vertices[(i*_sub+j+voffset)*11+2] = 2*(_size * (i+0.5f) / (float
                                                                 ) _sub) - _size
                vertices[(i*_sub+j+voffset)*11+3] = 0
                vertices[(i*_sub+j+voffset)*11+4] = -1
                vertices[(i*_sub+j+voffset)*11+5] = 0
                vertices[(i*_sub+j+voffset)*11+6] = (j+0.5f) / (float) _sub
                vertices[(i*_sub+j+voffset)*11+7] = (i+0.5f) / (float) _sub
                vertices[(i*_sub+j+voffset)*11+8] = 0
                vertices[(i*_sub+j+voffset)*11+9] = 0
                vertices[(i*_sub+j+voffset)*11+10] = 1

        voffset += _sub*_sub

        // bottom

        for var i=0 to _sub
            for var j=0 to _sub
                vertices[(i*(_sub+1)+j+voffset)*11] = 2*(_size * j / (float)
                                                                   _sub) - _size
                vertices[(i*(_sub+1)+j+voffset)*11+1] = -_size
                vertices[(i*(_sub+1)+j+voffset)*11+2] = -2*(_size * i / (float)
                                                                   _sub) + _size
                vertices[(i*(_sub+1)+j+voffset)*11+3] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+4] = 1
                vertices[(i*(_sub+1)+j+voffset)*11+5] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+6] = j / (float) _sub
                vertices[(i*(_sub+1)+j+voffset)*11+7] = 1.0f - (i / (float)
                                                                           _sub)
                vertices[(i*(_sub+1)+j+voffset)*11+8] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+9] = 0
                vertices[(i*(_sub+1)+j+voffset)*11+10] = -1

        voffset += (1+_sub)*(1+_sub)

        for var i=0 to (_sub-1)
            for var j=0 to (_sub-1)
                vertices[(i*_sub+j+voffset)*11] = 2*(_size * (j+0.5f) / (float)
                                                                   _sub) - _size
                vertices[(i*_sub+j+voffset)*11+1] = -_size
                vertices[(i*_sub+j+voffset)*11+2] = -2*(_size * (i+0.5f) / (
                                                            float) _sub) + _size
                vertices[(i*_sub+j+voffset)*11+3] = 0
                vertices[(i*_sub+j+voffset)*11+4] = 1
                vertices[(i*_sub+j+voffset)*11+5] = 0
                vertices[(i*_sub+j+voffset)*11+6] = (j+0.5f) / (float) _sub
                vertices[(i*_sub+j+voffset)*11+7] = 1.0f - ((i+0.5f) / (float)
                                                                           _sub)
                vertices[(i*_sub+j+voffset)*11+8] = 0
                vertices[(i*_sub+j+voffset)*11+9] = 0
                vertices[(i*_sub+j+voffset)*11+10] = -1

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (3 * 4 * 6 * _sub * _sub
                     * sizeof(GLushort)), elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (11 * 6 * ((1+_sub) * (1+_sub) +
                     _sub * _sub) * sizeof(GLfloat)), vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false

    // walls property
    _walls : soy.materials.Material
    prop walls : soy.materials.Material
        get
            return _walls
        set
            mutex.lock()
            _walls = value
            mutex.unlock()
