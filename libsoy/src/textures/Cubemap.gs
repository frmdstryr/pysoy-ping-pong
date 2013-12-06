/*
 *  libsoy - soy.textures.Cubemap
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
    soy.atoms
    GLib.Math


class soy.textures.Cubemap : soy.textures.Texture

    _texture   : GLuint
    _updated   : bool
    _mutex : Mutex


    init
        _mutex = Mutex()

    construct pattern (name : string, colorArray : array of soy.atoms.Color,
                       xScale:int=1, yScale:int=1, zScale:int=1)
        case name
            when "checkered"
                arr : array of soy.atoms.Color = new array of soy.atoms.Color[2]
                if colorArray.length is 0
                    arr[0] = new soy.atoms.Color.named("white")
                    arr[1] = new soy.atoms.Color.named("black")
                else if colorArray.length is 1
                    arr[0] = colorArray[0]
                    arr[1] = new soy.atoms.Color.named("black")
                else if colorArray.length is 2
                    arr[0] = colorArray[0]
                    arr[1] = colorArray[1]
                else
                    arr[0] = colorArray[0]
                    arr[1] = colorArray[1]
                    print("The color array is too long.")
                    //TODO Handle arrays with more than two colors.

                size : int = xScale > yScale ? xScale : yScale
                size = size > zScale ? size : zScale

                self._left = self._right = new soy.textures.Texture.pattern("checkered",
                                                            arr, zScale, yScale, size)
                self._up = self._down = new soy.textures.Texture.pattern("checkered",
                                                            arr, xScale, zScale, size)

                // swap colors, so the edges of the cubmap are the same color everywhere
                temp : soy.atoms.Color = arr[0]
                arr[0] = arr[1]
                arr[1] = temp

                self._front = self._back = new soy.textures.Texture.pattern("checkered",
                                                            arr, xScale, yScale, size)

                _updated = true
            when "palette"
                if colorArray.length is not 4
                    return

                colorArr : array of soy.atoms.Color = new array of soy.atoms.Color[4]

                self._front = new soy.textures.Texture.pattern("palette", colorArray)

                colorArr[0] = colorArray[2]
                colorArr[1] = colorArray[3]
                colorArr[2] = colorArray[0]
                colorArr[3] = colorArray[1]
                self._back = new soy.textures.Texture.pattern("palette", colorArr)

                colorArr[0] = colorArray[3]
                colorArr[1] = colorArray[0]
                colorArr[2] = colorArray[1]
                colorArr[3] = colorArray[2]
                self._left = new soy.textures.Texture.pattern("palette", colorArr)

                colorArr[0] = colorArray[1]
                colorArr[1] = colorArray[2]
                colorArr[2] = colorArray[3]
                colorArr[3] = colorArray[0]
                self._right = new soy.textures.Texture.pattern("palette", colorArr)

                colorArr[0] = colorArray[3]
                colorArr[1] = colorArray[2]
                colorArr[2] = colorArray[0]
                colorArr[3] = colorArray[1]
                self._up = new soy.textures.Texture.pattern("palette", colorArr)

                colorArr[0] = colorArray[2]
                colorArr[1] = colorArray[3]
                colorArr[2] = colorArray[1]
                colorArr[3] = colorArray[0]
                self._down = new soy.textures.Texture.pattern("palette", colorArr)

                _updated = true
            when "rainbow"
                // generate normalisation cubemap
                self._up = new soy.textures.Texture()
                self._down = new soy.textures.Texture()
                self._left = new soy.textures.Texture()
                self._right = new soy.textures.Texture()
                self._front = new soy.textures.Texture()
                self._back = new soy.textures.Texture()
                
                self._up.resize(3,32,32)
                self._down.resize(3,32,32)
                self._left.resize(3,32,32)
                self._right.resize(3,32,32)
                self._front.resize(3,32,32)
                self._back.resize(3,32,32)
                
                ptru : uchar* = self._up.texels
                ptrd : uchar* = self._down.texels
                ptrl : uchar* = self._left.texels
                ptrr : uchar* = self._right.texels
                ptrf : uchar* = self._front.texels
                ptrb : uchar* = self._back.texels

                i, j : int
                a, b, c, magnitude : float
                
                for i = 0 to 31
                    for j = 0 to 31
                        a = i-15.5f
                        b = j-15.5f
                        c = 16.0f
                        magnitude = sqrtf(a*a+b*b+c*c)
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

                self._up.wrap = false
                self._down.wrap = false
                self._left.wrap = false
                self._right.wrap = false
                self._front.wrap = false
                self._back.wrap = false

        translucent = _up.translucent or _down.translucent or _left.translucent
        translucent = translucent or _right.translucent or _front.translucent
        translucent = translucent or _back.translucent


    ////////////////////////////////////////////////////////////////////////
    // Properties

    _up : soy.textures.Texture?
    prop up : soy.textures.Texture?
        get
            return _up
        set
            _up = value

    _down : soy.textures.Texture?
    prop down : soy.textures.Texture?
        get
            return _down
        set
            _down = value

    _left : soy.textures.Texture?
    prop left : soy.textures.Texture?
        get
            return _left
        set
            _left = value

    _right : soy.textures.Texture?
    prop right : soy.textures.Texture?
        get
            return _right
        set
            _right = value

    _front : soy.textures.Texture?
    prop front : soy.textures.Texture?
        get
            return _front
        set
            _front = value

    _back : soy.textures.Texture?
    prop back : soy.textures.Texture?
        get
            return _back
        set
            _back = value


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def _enable_texture (texture : soy.textures.Texture, target : GLenum)
        texture.bind(target)
        texture.update(target)

    def _update_texture (texture : soy.textures.Texture, target : GLenum)
        texture.bind(target)

        glTexParameteri(GL_TEXTURE_CUBE_MAP_OES, GL_TEXTURE_MIN_FILTER,
                        (GLint) GL_LINEAR)
        if texture.smooth
            glTexParameteri(GL_TEXTURE_CUBE_MAP_OES, GL_TEXTURE_MAG_FILTER,
                            (GLint) GL_LINEAR)
        else
            glTexParameteri(GL_TEXTURE_CUBE_MAP_OES, GL_TEXTURE_MAG_FILTER,
                            (GLint) GL_NEAREST)

        // Set wrap parameters
        if texture.wrap
            glTexParameteri(GL_TEXTURE_CUBE_MAP_OES, GL_TEXTURE_WRAP_S,
                            (GLint) GL_REPEAT)
            glTexParameteri(GL_TEXTURE_CUBE_MAP_OES, GL_TEXTURE_WRAP_T,
                            (GLint) GL_REPEAT)
        else
            glTexParameteri(GL_TEXTURE_CUBE_MAP_OES, GL_TEXTURE_WRAP_S,
                            (GLint) GL_CLAMP_TO_EDGE)
            glTexParameteri(GL_TEXTURE_CUBE_MAP_OES, GL_TEXTURE_WRAP_T,
                            (GLint) GL_CLAMP_TO_EDGE)

    def override enable ()
        _mutex.lock()

        glEnable(GL_TEXTURE_CUBE_MAP_OES)

        if _texture is 0
            // Generate a new _texture
            glGenTextures(1, out _texture)

            // Bind the new texture and set its basic parameters
            glBindTexture(GL_TEXTURE_CUBE_MAP_OES, _texture)
            glTexParameteri(GL_TEXTURE_CUBE_MAP_OES, GL_TEXTURE_MAG_FILTER, (GLint)GL_LINEAR)
            glTexParameteri(GL_TEXTURE_CUBE_MAP_OES, GL_TEXTURE_MIN_FILTER, (GLint)GL_LINEAR)

            // flag the texture for updating here so it'll be processed below
            self._updated = true

        else
            // Bind the existing texture
            glBindTexture(GL_TEXTURE_CUBE_MAP_OES, _texture)


        if self._updated
            // connect each of the 6 faces
            if _right is not null
                _enable_texture(_right, GL_TEXTURE_CUBE_MAP_POSITIVE_X_OES)

            if _left is not null
                _enable_texture(_left, GL_TEXTURE_CUBE_MAP_NEGATIVE_X_OES)

            if _up is not null
                _enable_texture(_up, GL_TEXTURE_CUBE_MAP_POSITIVE_Y_OES)

            if _down is not null
                _enable_texture(_down, GL_TEXTURE_CUBE_MAP_NEGATIVE_Y_OES)

            if _front is not null
                _enable_texture(_front, GL_TEXTURE_CUBE_MAP_POSITIVE_Z_OES)

            if _back is not null
                _enable_texture(_back, GL_TEXTURE_CUBE_MAP_NEGATIVE_Z_OES)

            _updated = false

        self._update_texture(_right, GL_TEXTURE_CUBE_MAP_POSITIVE_X_OES)
        self._update_texture(_left, GL_TEXTURE_CUBE_MAP_NEGATIVE_X_OES)
        self._update_texture(_up, GL_TEXTURE_CUBE_MAP_POSITIVE_Y_OES)
        self._update_texture(_down, GL_TEXTURE_CUBE_MAP_NEGATIVE_Y_OES)
        self._update_texture(_front, GL_TEXTURE_CUBE_MAP_POSITIVE_Z_OES)
        self._update_texture(_back, GL_TEXTURE_CUBE_MAP_NEGATIVE_Z_OES)


    def override disable ()
        glDisable(GL_TEXTURE_CUBE_MAP_OES)

        _mutex.unlock()

