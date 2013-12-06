/*
 *  libsoy - soy.bodies.Portal
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
    ode


class soy.bodies.Portal : soy.bodies.Body
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating

    construct (position : soy.atoms.Position?, size : soy.atoms.Size?)
        super(position, size, 0.0f)


    def override create_geom (geom_param : Object?, geom_scalar : float)
        _width = _height = _depth = 1.0f

        geom = new ode.geoms.Box(null, (Real) _width, (Real) _height,
                                 (Real) 0.01f)

        // set size if provided
        if geom_param is not null
            self.size = (soy.atoms.Size) geom_param
        geom.SetCategoryBits(GeomBody)
        geom.SetData((void*) self)

        body.SetData((void*) self)

        // Copy position and orientation from geom
        pos : weak ode.Vector3 = geom.GetPosition()
        body.SetPosition(pos.x, pos.y, pos.z)
        body.SetRotation(geom.GetRotation())

        self.geom.SetBody(self.body)

        // Set mass of the body
        self.set_mass (self.density)


    def override set_mass (density : float)
        if body is null
            return

        if density is not 0 and self.volume() != 0.0f
            mass : ode.Mass = new ode.Mass()
            mass.SetBox(density, (Real) _width, (Real) _height, (Real) 1.0f)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)


    def override render ( alpha_stage : bool, camera : soy.bodies.Camera,
                          level : int )
        if _target is null or _target.scene is null
            return

        // save current matrix
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()

        // Lock so body can't be changed during render
        mutex.lock()

        // set modelview matrix
        self.mult_model_matrix()

        // Update ebo/vbo as needed
        if _updated
            _update_portal()

        // Re-bind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 3), null)

        glEnable(GL_STENCIL_TEST)
        //glColorMask((GLboolean) 0, (GLboolean) 0, (GLboolean) 0, (GLboolean) 0)
        //glDepthMask((GLboolean) 0)
        glStencilFunc(GL_NEVER, 1, (GLuint) 0xffffffff)
        glStencilOp(GL_REPLACE, GL_KEEP, GL_KEEP)
        glStencilMask((GLuint) 0xffffffff)
        glClear(GL_STENCIL_BUFFER_BIT)

        // Render portal geometry for stencil
        glDrawElements(GL_TRIANGLES, (GLsizei) (6), GL_UNSIGNED_BYTE,
                                                                    (GLvoid*) 0)

        //glColorMask((GLboolean) 1, (GLboolean) 1, (GLboolean) 1, (GLboolean) 1)
        //glDepthMask((GLboolean) 1)
        glStencilMask((GLuint) 0x00000000)
        glStencilFunc(GL_EQUAL, 1, (GLuint) 0xffffffff)
        tpos : unowned ode.Vector3 = _target.body.GetPosition()
        cpos : unowned ode.Vector3 = camera.body.GetPosition()
        trot : unowned ode.Matrix3 = _target.body.GetRotation()
        equation : array of GLfloat = {
            (GLfloat) (-trot.m2),
            (GLfloat) (-trot.m6),
            (GLfloat) (-trot.ma),
            (GLfloat) ((tpos.x-cpos.x)*trot.m2+(tpos.y-cpos.y)*trot.m6+
                       (tpos.z-cpos.z)*trot.ma)
        }
        // rotate by target portal
        mtx : array of GLfloat[16] = new array of GLfloat[16]
        glMatrixMode (GL_MODELVIEW)
        glLoadIdentity()

        mtx[0]  = (GLfloat) trot.m0
        mtx[1]  = (GLfloat) trot.m1
        mtx[2]  = (GLfloat) trot.m2
        mtx[3]  = 0.0f
        mtx[4]  = (GLfloat) trot.m4
        mtx[5]  = (GLfloat) trot.m5
        mtx[6]  = (GLfloat) trot.m6
        mtx[7]  = 0.0f
        mtx[8]  = (GLfloat) trot.m8
        mtx[9]  = (GLfloat) trot.m9
        mtx[10] = (GLfloat) trot.ma
        mtx[11] = 0.0f
        mtx[12] = (GLfloat) (-cpos.x)
        mtx[13] = (GLfloat) (-cpos.y)
        mtx[14] = (GLfloat) (-cpos.z)
        mtx[15] = 1.0f

        glLoadMatrixf(mtx)

        glClipPlanef(GL_CLIP_PLANE0, equation)
        glEnable(GL_CLIP_PLANE0)
        // workaround to prevent deadlock
        mutex.unlock()
        // TODO: get aspect from camera
        _target.scene.render(camera.lens, 1.333f, 1.0f, 256.0f, camera, level+1)
        mutex.lock()

        glDisable(GL_CLIP_PLANE0)
        glDisable(GL_STENCIL_TEST)

        // Render axis
        renderAxis()

        // Rendering done, unlock
        mutex.unlock()

        // Restore matrix
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()

    def _update_portal()

        // on first pass
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        elements : array of GLubyte = {
            0, 1, 2,
            2, 1, 3
        }

        vertices : array of GLfloat = new array of GLfloat[12]

        for var i=0 to 1
            for var j=0 to 1
                vertices[(i*2+j)*3] = (_width/2) * (j*2-1)
                vertices[(i*2+j)*3+1] = (_height/2) * (i*2-1)
                vertices[(i*2+j)*3+2] = 0

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (6 * sizeof(GLubyte)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (12 * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false

    def override volume ( ) : float
        return (self._width * self._height * self._depth)


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // Size Property
    _width  : GLfloat
    _height : GLfloat
    _depth  : GLfloat
    _size_obj : weak soy.atoms.Size?

    def _size_set(size : soy.atoms.Size)
        // Set size while locked to avoid potential rendering weirdness
        mutex.lock()
        _width = (GLfloat) size.width
        _height = (GLfloat) size.height
        _depth = (GLfloat) size.depth
        _updated = true
        mutex.unlock()

        if scene is not null
            soy.scenes._stepLock.writer_lock()
        ((geoms.Box) self.geom).SetLengths((Real) _width,
                                           (Real) _height,
                                           (Real) _depth)
        self.set_mass (self.density)

        if scene is not null
            soy.scenes._stepLock.writer_unlock()

    def _size_weak(size : Object)
        _size_obj = null

    prop size : soy.atoms.Size
        owned get
            value : soy.atoms.Size? = self._size_obj
            if value is null
                value = new soy.atoms.Size((float) _width,
                                           (float) _height,
                                           (float) _depth)
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
    // target property
    _target : soy.bodies.Portal?
    prop target : soy.bodies.Portal?
        get
            return _target
        set
            mutex.lock()
            _target = value
            mutex.unlock()
