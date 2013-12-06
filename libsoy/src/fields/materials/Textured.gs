/*
 *  libsoy - soy.materials.Textured
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

class soy.materials.Textured : soy.materials.Colored
    // This simplifies rendering code
    _ids : static array of GLenum = {
        GL_TEXTURE0,
        GL_TEXTURE1,
        GL_TEXTURE2,
        GL_TEXTURE3,
        GL_TEXTURE4
    }

    // Maximum Texture Units
    _max_textures : static int

    // This is used to render bumpmaps
    _normalisation_cubemap : static soy.textures.Cubemap

    // A dummy texture used for primarycombiner
    _dummy : static soy.textures.Texture

    // This ensures the texture property isn't changed while rendering it.
    _mutex : Mutex


    init
        _mutex = Mutex()


    construct (name : string? = null,
               bumpmap : soy.textures.Texture?,
               colormap : soy.textures.Texture?,
               glowmap : soy.textures.Texture?)
        super(name)
        _bumpmap = bumpmap
        if bumpmap is null
            needsTSLVs = false
        else
            needsTSLVs = true
        _colormap = colormap
        _glowmap = glowmap

        if _colormap is not null
            translucent = _colormap.translucent


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override render (step : int, tslvs : GLvoid*,
                         texmatrix : ode.Matrix3? = null) : bool
        id : int = 0
        units : int

        // Universal render setup
        if step == 0
            // Lock mutex so the texture can't be changed until we're done
            _mutex.lock()

            // Get maximum texture units, we may need this later
            if _max_textures == 0
                glGetIntegerv(GL_MAX_TEXTURE_UNITS, out _max_textures)

            // Enable colors and shading
            self.enable_colors()
            self.enable_shades()

        units = ((int) (_bumpmap is not null) * 3 +
                 (int) (_colormap is not null) + (int) (_glowmap is not null))

        // Prepare for translation
        if texmatrix is not null
            glMatrixMode(GL_TEXTURE)

        // Render bumpmap
        if step == 0 and _bumpmap is not null
            self.enable_bumpmap(id++, texmatrix)
            self.enable_normalisation_cubemap(id++, texmatrix, tslvs)

            // Return now if we need a second pass
            if units > _max_textures
                return true

            // Modulate dot3 lighting with material color
            // This is only needed with single-pass rendering
            self.enable_primary_combiner(id++)

        // Render colormap and glowmap
        if step == 0
            // Enable colormap if available
            if _colormap is not null
                self.enable_colormap(id++, texmatrix)

            // Enable glowmap if available
            if _glowmap is not null
                self.enable_glowmap(id++, texmatrix)

            // Pass complete
            return true

        // Two-pass, second pass
        if step == 1 and units > _max_textures
            // Cleanup from step 0
            disable_texture(id++, texmatrix, _bumpmap)
            disable_texture(id++, texmatrix, _normalisation_cubemap)

            // Setup blending
            glEnable(GL_BLEND)
            glBlendFunc(GL_DST_COLOR, GL_ZERO)
            glEnable(GL_POLYGON_OFFSET_FILL)
            glPolygonOffset(0,-2)

            // Enable colormap if available
            if _colormap is not null
                self.enable_colormap(id++, texmatrix)

            // Enable glowmap if available
            if _glowmap is not null
                self.enable_glowmap(id++, texmatrix)

            return true

        // Cleanup from bumpmap rendering
        if _bumpmap is not null
            // Single-pass rendering cleanup
            if units <= _max_textures
                disable_texture(id++, texmatrix, _bumpmap)
                disable_texture(id++, texmatrix, _normalisation_cubemap)
                // Disable primary combiner
                glActiveTexture(id++)
                _dummy.disable()

            // Two-pass rendering cleanup
            else
                glDisable(GL_BLEND)
                glDisable(GL_POLYGON_OFFSET_FILL)
                glPolygonOffset(0,0)

        // Cleanup colormap and glowmap rendering
        if _colormap is not null
            // Disable colormap
            disable_texture(id++, texmatrix, _colormap)

        if _glowmap is not null
            // Disable glowmap
            disable_texture(id++, texmatrix, _glowmap)

        // Lock mutex so the texture can't be changed until we're done
        _mutex.unlock()
        return false


    def enable_bumpmap (id : int, texmatrix : ode.Matrix3?)
        // Enable Texture
        glActiveTexture(_ids[id])
        glClientActiveTexture(_ids[id])
        glEnableClientState(GL_TEXTURE_COORD_ARRAY)
        if texmatrix is not null
            glPushMatrix()
            var _mtx = new array of GLfloat[16]
            _mtx[0]  = (GLfloat) texmatrix.m0
            _mtx[1]  = (GLfloat) texmatrix.m4
            _mtx[2]  = (GLfloat) texmatrix.m8
            _mtx[3]  = (GLfloat) 0.0
            _mtx[4]  = (GLfloat) texmatrix.m1
            _mtx[5]  = (GLfloat) texmatrix.m5
            _mtx[6]  = (GLfloat) texmatrix.m9
            _mtx[7]  = (GLfloat) 0.0
            _mtx[8]  = (GLfloat) texmatrix.m2
            _mtx[9]  = (GLfloat) texmatrix.m6
            _mtx[10] = (GLfloat) texmatrix.ma
            _mtx[11] = (GLfloat) 0.0
            _mtx[12] = (GLfloat) texmatrix.m3
            _mtx[13] = (GLfloat) texmatrix.m7
            _mtx[14] = (GLfloat) texmatrix.mb
            _mtx[15] = (GLfloat) 1.0
            glLoadMatrixf(_mtx)

        if _bumpmap isa soy.textures.Cubemap
            glTexCoordPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                              null)
        else
            glTexCoordPointer(2, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                              (GLvoid*) (sizeof(GLfloat) * 6))
        glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, (GLint) GL_COMBINE)
        glTexEnvi(GL_TEXTURE_ENV, GL_SRC0_RGB,    (GLint) GL_TEXTURE)
        glTexEnvi(GL_TEXTURE_ENV, GL_COMBINE_RGB, (GLint) GL_REPLACE)
        _bumpmap.enable()


    def enable_normalisation_cubemap (id : int, texmatrix : ode.Matrix3?,
                                      tslvs : GLvoid*)
        // Enable Texture
        glActiveTexture(_ids[id])
        glClientActiveTexture(_ids[id])
        glEnableClientState(GL_TEXTURE_COORD_ARRAY)
        if texmatrix is not null
            glPushMatrix()

        glTexCoordPointer(3,  GL_FLOAT,  0, tslvs)
        _normalisation_cubemap.enable()
        glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, (GLint) GL_COMBINE)
        glTexEnvi(GL_TEXTURE_ENV, GL_SRC0_RGB,  (GLint) GL_TEXTURE)
        glTexEnvi(GL_TEXTURE_ENV, GL_SRC1_RGB,  (GLint) GL_PREVIOUS)
        glTexEnvi(GL_TEXTURE_ENV, GL_COMBINE_RGB,  (GLint) GL_DOT3_RGB)
        glTexParameteri(GL_TEXTURE_CUBE_MAP_OES,
                        GL_TEXTURE_MAG_FILTER, (GLint) GL_LINEAR)
        glTexParameteri(GL_TEXTURE_CUBE_MAP_OES,
                        GL_TEXTURE_MIN_FILTER, (GLint) GL_LINEAR)
        glTexParameteri(GL_TEXTURE_CUBE_MAP_OES,
                        GL_TEXTURE_WRAP_S, (GLint) GL_CLAMP_TO_EDGE)
        glTexParameteri(GL_TEXTURE_CUBE_MAP_OES,
                        GL_TEXTURE_WRAP_T, (GLint) GL_CLAMP_TO_EDGE)


    def enable_primary_combiner (id : int)
        glActiveTexture(_ids[id])
        glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, (GLint) GL_COMBINE)
        glTexEnvi(GL_TEXTURE_ENV, GL_SRC0_RGB,    (GLint) GL_PRIMARY_COLOR)
        glTexEnvi(GL_TEXTURE_ENV, GL_SRC1_RGB,    (GLint) GL_PREVIOUS)
        glTexEnvi(GL_TEXTURE_ENV, GL_COMBINE_RGB, (GLint) GL_MODULATE)
        _dummy.enable()


    def enable_colormap (id : int, texmatrix : ode.Matrix3?)
        // Enable Texture
        glActiveTexture(_ids[id])
        glClientActiveTexture(_ids[id])
        glEnableClientState(GL_TEXTURE_COORD_ARRAY)
        if texmatrix is not null
            glPushMatrix()
            var _mtx = new array of GLfloat[16]
            _mtx[0]  = (GLfloat) texmatrix.m0
            _mtx[1]  = (GLfloat) texmatrix.m4
            _mtx[2]  = (GLfloat) texmatrix.m8
            _mtx[3]  = (GLfloat) 0.0
            _mtx[4]  = (GLfloat) texmatrix.m1
            _mtx[5]  = (GLfloat) texmatrix.m5
            _mtx[6]  = (GLfloat) texmatrix.m9
            _mtx[7]  = (GLfloat) 0.0
            _mtx[8]  = (GLfloat) texmatrix.m2
            _mtx[9]  = (GLfloat) texmatrix.m6
            _mtx[10] = (GLfloat) texmatrix.ma
            _mtx[11] = (GLfloat) 0.0
            _mtx[12] = (GLfloat) texmatrix.m3
            _mtx[13] = (GLfloat) texmatrix.m7
            _mtx[14] = (GLfloat) texmatrix.mb
            _mtx[15] = (GLfloat) 1.0
            glLoadMatrixf(_mtx)

        translucent = _colormap.translucent

        if _colormap isa soy.textures.Cubemap
            glTexCoordPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                              null)
        else
            glTexCoordPointer(2, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                              (GLvoid*) (sizeof(GLfloat) * 6))

        if _colormap.translucent
            glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
            glEnable(GL_BLEND)

        glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, (GLint) GL_MODULATE)
        _colormap.enable()


    def enable_glowmap (id : int, texmatrix : ode.Matrix3?)
        // Enable Texture
        glActiveTexture(_ids[id])
        glClientActiveTexture(_ids[id])
        glEnableClientState(GL_TEXTURE_COORD_ARRAY)
        if texmatrix is not null
            glPushMatrix()
            var _mtx = new array of GLfloat[16]
            _mtx[0]  = (GLfloat) texmatrix.m0
            _mtx[1]  = (GLfloat) texmatrix.m4
            _mtx[2]  = (GLfloat) texmatrix.m8
            _mtx[3]  = (GLfloat) 0.0
            _mtx[4]  = (GLfloat) texmatrix.m1
            _mtx[5]  = (GLfloat) texmatrix.m5
            _mtx[6]  = (GLfloat) texmatrix.m9
            _mtx[7]  = (GLfloat) 0.0
            _mtx[8]  = (GLfloat) texmatrix.m2
            _mtx[9]  = (GLfloat) texmatrix.m6
            _mtx[10] = (GLfloat) texmatrix.ma
            _mtx[11] = (GLfloat) 0.0
            _mtx[12] = (GLfloat) texmatrix.m3
            _mtx[13] = (GLfloat) texmatrix.m7
            _mtx[14] = (GLfloat) texmatrix.mb
            _mtx[15] = (GLfloat) 1.0
            glLoadMatrixf(_mtx)

        glEnable(GL_BLEND)
        glBlendFunc(GL_ONE, GL_ONE)
        if _glowmap isa soy.textures.Cubemap
            glTexCoordPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                              null)
        else
            glTexCoordPointer(2, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                              (GLvoid*) (sizeof(GLfloat) * 6))
        glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, (GLint) GL_ADD)
        _glowmap.enable()


    def static disable_texture(id : int, texmatrix : ode.Matrix3?,
                               texture : soy.textures.Texture)
        glActiveTexture(_ids[id])
        glClientActiveTexture(_ids[id])
        glDisableClientState(GL_TEXTURE_COORD_ARRAY)
        if texmatrix is not null
            glPopMatrix()
        texture.disable()


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // bumpmap property
    _bumpmap : soy.textures.Texture?

    prop bumpmap : soy.textures.Texture?
        get
            return _bumpmap
        set
            _mutex.lock()
            _bumpmap = value
            if value is null
                needsTSLVs = false
            else
                needsTSLVs = true
            _mutex.unlock()

    //
    // colormap property
    _colormap : soy.textures.Texture?

    prop colormap : soy.textures.Texture?
        get
            return _colormap
        set
            _mutex.lock()
            _colormap = value
            _mutex.unlock()

    //
    // glowmap property
    _glowmap : soy.textures.Texture?

    prop glowmap : soy.textures.Texture?
        get
            return _glowmap
        set
            _mutex.lock()
            _glowmap = value
            _mutex.unlock()

    ////////////////////////////////////////////////////////////////////////
    // Static

    init static
        // generate normalisation cubemap
        _normalisation_cubemap = new soy.textures.Cubemap()
        _normalisation_cubemap.up = new soy.textures.Texture()
        _normalisation_cubemap.down = new soy.textures.Texture()
        _normalisation_cubemap.left = new soy.textures.Texture()
        _normalisation_cubemap.right = new soy.textures.Texture()
        _normalisation_cubemap.front = new soy.textures.Texture()
        _normalisation_cubemap.back = new soy.textures.Texture()
        _normalisation_cubemap.up.resize(3,32,32)
        _normalisation_cubemap.down.resize(3,32,32)
        _normalisation_cubemap.left.resize(3,32,32)
        _normalisation_cubemap.right.resize(3,32,32)
        _normalisation_cubemap.front.resize(3,32,32)
        _normalisation_cubemap.back.resize(3,32,32)
        var ptru = _normalisation_cubemap.up.texels
        var ptrd = _normalisation_cubemap.down.texels
        var ptrl = _normalisation_cubemap.left.texels
        var ptrr = _normalisation_cubemap.right.texels
        var ptrf = _normalisation_cubemap.front.texels
        var ptrb = _normalisation_cubemap.back.texels
        for var i=0 to 31
            for var j=0 to 31
                var a = i-15.5f
                var b = j-15.5f
                var c = 16.0f
                var magnitude = sqrtf(a*a+b*b+c*c)
                a = a/magnitude
                b = b/magnitude
                c = c/magnitude

                ptru[0] = (uchar)(255*(b+1)/2)
                ptru[1] = (uchar)(255*(c+1)/2)
                ptru[2] = (uchar)(255*(a+1)/2)
                ptrd[0] = (uchar)(255*(b+1)/2)
                ptrd[1] = (uchar)(255*(-c+1)/2)
                ptrd[2] = (uchar)(255*(-a+1)/2)
                ptrl[0] = (uchar)(255*(-c+1)/2)
                ptrl[1] = (uchar)(255*(-a+1)/2)
                ptrl[2] = (uchar)(255*(b+1)/2)
                ptrr[0] = (uchar)(255*(c+1)/2)
                ptrr[1] = (uchar)(255*(-a+1)/2)
                ptrr[2] = (uchar)(255*(-b+1)/2)
                ptrf[0] = (uchar)(255*(b+1)/2)
                ptrf[1] = (uchar)(255*(-a+1)/2)
                ptrf[2] = (uchar)(255*(c+1)/2)
                ptrb[0] = (uchar)(255*(-b+1)/2)
                ptrb[1] = (uchar)(255*(-a+1)/2)
                ptrb[2] = (uchar)(255*(-c+1)/2)
                ptru += 3
                ptrd += 3
                ptrl += 3
                ptrr += 3
                ptrf += 3
                ptrb += 3
        // dummy texture
        _dummy = new soy.textures.Texture()
        _dummy.resize(3,1,1)

