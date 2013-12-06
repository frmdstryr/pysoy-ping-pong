/*
 *  libsoy - soy.bodies.Light
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

class soy.bodies.Light : soy.bodies.Body
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    VERTICES : GLuint = 40 // not including center - 
    //TODO calculate number of vertices needed (>256)

    init
        _ambient = {0.0f, 0.0f, 0.0f, 1.0f}
        _diffuse = {0.5f, 0.5f, 0.5f, 1.0f}
        _specular = {1.0f, 1.0f, 1.0f, 1.0f}
        _radius = 180.0f

    construct (position : soy.atoms.Position?, size : float, 
               texture : soy.textures.Texture?)
        super(position, null, 0.0f)
        _updated = true
        _texture = texture
        _size = size

    final
        if self.scene is not null and self.scene.lights.contains(self)
            soy.scenes._stepLock.writer_lock()
            self.scene.lights.remove(self)
            soy.scenes._stepLock.writer_unlock()

    def override add_extra ()
        scene.lights.add(self)

    def override remove_extra ()
        scene.lights.remove(self)

    def off(id : GLenum)
        glDisable(id)

    def on(id : GLenum)
        //
        // enable the light of the given id
        glEnable(id)
        glLightfv(id, GL_AMBIENT, _ambient)
        glLightfv(id, GL_DIFFUSE, _diffuse)
        glLightfv(id, GL_SPECULAR, _specular)
        glLightfv(id, GL_POSITION, getPositionf())
        //
        // for spotlights
        //glLightf (id, GL_SPOT_CUTOFF, self._radius)
        //if self._radius != 180.0 :
        //   TODO, Ticket #947 :
        //   gl.glLightf (_id, gl.GL_SPOT_EXPODENT, [[0-128, default 0]])
        //   gl.glLightfv(_id, gl.GL_SPOT_DIRECTION, [[direction, as per Body]])

    def override render ( alpha_stage : bool, camera : soy.bodies.Camera,
                          level : int )
        if _size is 0 or _texture is null
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
            _update_light()

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

        // Render with texture
        glActiveTexture(GL_TEXTURE0)
        glClientActiveTexture(GL_TEXTURE0)
        glEnableClientState(GL_TEXTURE_COORD_ARRAY)
        glTexCoordPointer(2, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                        (GLvoid*) (sizeof(GLfloat) * 6))
        glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_REPLACE)
        _texture.enable()
        glDrawElements(GL_TRIANGLE_FAN, (GLsizei) (VERTICES*3), 
                       GL_UNSIGNED_BYTE, (GLvoid*) 0)
        glActiveTexture(GL_TEXTURE0)
        glClientActiveTexture(GL_TEXTURE0)
        glDisableClientState(GL_TEXTURE_COORD_ARRAY)
        _texture.disable()

        // Render axis
        renderAxis()

        // Rendering done, unlock
        mutex.unlock()

        // Restore matrix
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()

    def override set_mass (density : float)
        if density is not 0 and self.volume() != 0.0f
            mass : ode.Mass = new ode.Mass()
            mass.SetSphere(density, _size)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)

    def _update_light()
        // on first pass
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        // index array of vertex array
        elements : array of GLubyte = new array of GLubyte[VERTICES*3]

        for var i=0 to (VERTICES-1)
            elements[i*3] = 0
            elements[i*3+1] = i+1
            elements[i*3+2] = i+2
        elements[(VERTICES-1)*3+2] = 1 // make it loop

        // interleaved (vertex, normal, texcoord) array
        vertices : array of GLfloat = new array of GLfloat[(1+VERTICES)*11] // count center

        for var i=1 to VERTICES
            var angle = 2.0f * PI * (i-1) / VERTICES
            var x = (GLfloat)cos(angle)
            var y = (GLfloat)sin(angle)
            vertices[i*11] = _size * x
            vertices[i*11+1] = _size * y
            vertices[i*11+2] = 0
            vertices[i*11+3] = 0
            vertices[i*11+4] = 0
            vertices[i*11+5] = 1
            vertices[i*11+6] = 0.5f * x + 0.5f
            vertices[i*11+7] = -0.5f * y + 0.5f
            vertices[i*11+8] = 0
            vertices[i*11+9] = 1
            vertices[i*11+10] = 0

        // add the center vertex
        vertices[0] = 0
        vertices[1] = 0
        vertices[2] = 0
        vertices[3] = 0
        vertices[4] = 0
        vertices[5] = 1
        vertices[6] = 0.5f
        vertices[7] = 0.5f
        vertices[8] = 1
        vertices[9] = 0
        vertices[10] = 0

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, 
                     (GLsizei) (3 * VERTICES * sizeof(GLubyte)),
                     elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, 
                     (GLsizei) (11 * (VERTICES+1) * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // ambient Property
    _ambient : array of GLfloat
    _ambient_obj : weak soy.atoms.Color?

    def _ambient_set(color : soy.atoms.Color)
        _ambient = color.get4f()

    def _ambient_weak(ambient : Object)
        self._ambient_obj = null

    prop ambient : soy.atoms.Color
        owned get
            value : soy.atoms.Color? = self._ambient_obj
            if value is null
                value = new soy.atoms.Color.new4f(self._ambient)
                value.on_set.connect(self._ambient_set)
                value.weak_ref(self._ambient_weak)
                self._ambient_obj = value
            return value
        set
            self._ambient_set(value)
            if _ambient_obj != null
                _ambient_obj.on_set.disconnect(self._ambient_set)
                _ambient_obj.weak_unref(self._ambient_weak)
            _ambient_obj = value
            value.on_set.connect(self._ambient_set)
            value.weak_ref(self._ambient_weak)

    //
    // diffuse Property
    _diffuse : array of GLfloat
    _diffuse_obj : weak soy.atoms.Color?

    def _diffuse_set(diffuse : soy.atoms.Color)
        _diffuse = diffuse.get4f()

    def _diffuse_weak(diffuse : Object)
        self._diffuse_obj = null

    prop diffuse : soy.atoms.Color
        owned get
            value : soy.atoms.Color? = self._diffuse_obj
            if value is null
                value = new soy.atoms.Color.new4f(self._diffuse)
                value.on_set.connect(self._diffuse_set)
                value.weak_ref(self._diffuse_weak)
                self._diffuse_obj = value
            return value
        set
            self._diffuse_set(value)
            if _diffuse_obj != null
                _diffuse_obj.on_set.disconnect(self._diffuse_set)
                _diffuse_obj.weak_unref(self._diffuse_weak)
            _diffuse_obj = value
            value.on_set.connect(self._diffuse_set)
            value.weak_ref(self._diffuse_weak)

    //
    // specular Property
    _specular : array of GLfloat
    _specular_obj : weak soy.atoms.Color?

    def _specular_set(specular : soy.atoms.Color)
        _specular = specular.get4f()

    def _specular_weak(specular : Object)
        self._specular_obj = null

    prop specular : soy.atoms.Color
        owned get
            value : soy.atoms.Color? = self._specular_obj
            if value is null
                value = new soy.atoms.Color.new4f(self._specular)
                value.on_set.connect(self._specular_set)
                value.weak_ref(self._specular_weak)
                self._specular_obj = value
            return value
        set
            self._specular_set(value)
            if _specular_obj != null
                _specular_obj.on_set.disconnect(self._specular_set)
                _specular_obj.weak_unref(self._specular_weak)
            _specular_obj = value
            value.on_set.connect(self._specular_set)
            value.weak_ref(self._specular_weak)

    //
    // radius Property
    _radius : float
    prop radius : float
        get
            return _radius
        set
            if value < 0.0f
                _radius = 0.0f
            else if value > 180.0f
                _radius = 180.0f
            else
                _radius = value

    //
    // size Property
    _size : GLfloat
    prop size : float
        get
            return self._size
        set
            if scene is not null
                soy.scenes._stepLock.writer_lock()
            self._size = value
            if scene is not null
                soy.scenes._stepLock.writer_unlock()

            self.set_mass (self.density)

    //
    // texture Property
    _texture : soy.textures.Texture
    prop texture : soy.textures.Texture
        get
            return self._texture
        set
            if scene is not null
                soy.scenes._stepLock.writer_lock()
            self._texture = value
            if scene is not null
                soy.scenes._stepLock.writer_unlock()
