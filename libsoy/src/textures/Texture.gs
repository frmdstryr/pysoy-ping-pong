/*
 *  libsoy - soy.textures.Texture
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

exception IOError
    FILE_NOT_FOUND
    READ_ERROR

exception MemoryError
    OUT_OF_MEMORY

class soy.textures.Texture : Object //soy._internals.Loadable

    translucent : bool
    _textureID : GLuint
    texels    : uchar*
    mipmaps   : uchar*
    _texel_objs: dict of int, weak soy.atoms.Color?
    _isAnimated: int
    _scaleX    : GLfloat
    _scaleY    : GLfloat
    _translateX: GLfloat
    _translateY: GLfloat
    updated   : bool
    _formats: static array of GLenum = {0, GL_LUMINANCE, GL_LUMINANCE_ALPHA,
                                        GL_RGB, GL_RGBA}
    _mutex : Mutex


    init
        _texel_objs = new dict of int, unowned soy.atoms.Color?
        _animate = new array of GLfloat[3]
        _mutex = Mutex()
        _scaleX = 0.0f
        _translateX = 0.0f
        _smooth = true
        _wrap = true
        translucent = false


    construct ()
        _chans = 3

    construct pattern (name : string, colorArray : array of soy.atoms.Color,
                       xScale:int=1, yScale:int=1, size:int=0)
        case name
            when "checkered"
                if xScale < 1 or yScale < 1
                    return

                h : int = (int) pow(2, yScale)
                w : int = (int) pow(2, xScale)
                side : int = size is 0 ? (xScale > yScale ? w : h) : (int) pow(2, size)

                self.resize(4, side, side)

                a, b : soy.atoms.Color
                if colorArray.length is 0
                    a = new soy.atoms.Color.named("white")
                    b = new soy.atoms.Color.named("black")
                else if colorArray.length is 1
                    a = colorArray[0]
                    b = new soy.atoms.Color.named("black")
                else if colorArray.length is 2
                    a = colorArray[0]
                    b = colorArray[1]
                else
                    a = colorArray[0]
                    b = colorArray[1]
                    print("The color array is too long.")
                    //TODO Handle arrays with more than two colors.

                if a.alpha is not 255 or b.alpha is not 255
                    translucent = true

                self.smooth = false
                self.wrap = false
                updated = true


                i, j, k : int
                k = 0

                // if no resize needs to be done, simply
                // set each next color to a ot b respectively
                if w is side and w is h
                    for i = 0 to (h - 1) // for each row
                        for j = 0 to (w - 1) // for each column
                            // check which color we need for the next element
                            if ((i%2 is 0) and (j%2 is 0)) or ((i%2 is 1) and (j%2 is 1))
                                self[k] = a
                            else
                                self[k] = b
                            k += 1
                    return // return, the remaining of the function is if we need resizing

                l, m, n, o, p : int // some variable declarations
                l = side/h-1 // (how much texels needs to be set on y axis for each actual texel)-1
                m = side/w-1 // (how much texels needs to be set on x axis for each actual texel)-1

                check : bool // another caching var
                for i = 0 to (h - 1) // for each row
                    for j = 0 to (w - 1) // for each column of the row
                        // the actual texture is bigger than i*j, so we must "simulate" that they
                        // are the same. Here we will iterate over a particular sqare of texels, and
                        // set them to the same color, which makes the illusion that it is one texel

                        // this is the check for what color we need for this element
                        check = ((i%2 is 0) and (j%2 is 0)) or ((i%2 is 1) and (j%2 is 1))

                        // this formula finds out the first element of the "fake" texel
                        k = i*side*(l+1) + j*(m+1)

                        for n = 0 to l // for each row of the "fake" texel
                            p = k // save where `k` was here
                            for o = 0 to m // for each column of the "fake" texel
                                self[k++] = check ? a : b // set the texel to the actual color
                            // restore k and add the size of one row
                            // (e.g. go to where the next row of the "fake" texels needs to be)
                            k = side + p
            when "palette"
                if colorArray.length is not 2 and colorArray.length is not 4
                    return

                if colorArray[0].alpha is not 255 or colorArray[1].alpha is not 255
                    translucent = true

                if colorArray.length is 2
                    self.resize(4, 256, 1)

                    xs : float* = malloc(sizeof(float) * 256)
                    for var i = 1 to 256
                        xs[i-1] = (float) i

                    reds   : uchar* = malloc(256)
                    greens : uchar* = malloc(256)
                    blues  : uchar* = malloc(256)
                    alphas : uchar* = malloc(256)

                    generate_lerped_colors(reds, xs,
                                           colorArray[0].red,
                                           colorArray[1].red,
                                           256, 256)
                    generate_lerped_colors(greens, xs,
                                           colorArray[0].green,
                                           colorArray[1].green,
                                           256, 256)
                    generate_lerped_colors(blues, xs,
                                           colorArray[0].blue,
                                           colorArray[1].blue,
                                           256, 256)
                    generate_lerped_colors(alphas, xs,
                                           colorArray[0].alpha,
                                           colorArray[1].alpha,
                                           256, 256)

                    for var i = 0 to 255
                        self[i] = new soy.atoms.Color(reds[i], greens[i], blues[i], alphas[i])

                    free(reds)
                    free(greens)
                    free(blues)
                    free(alphas)
                    free(xs)

                    self._scaleX = 0.5f
                    self._scaleY = 0.5f

                    self._translateX = 0.5f
                    self._translateY = 0.5f

                    self._smooth = true
                    self._wrap = false
                    self.updated = true

                else
                    if colorArray[2].alpha is not 255 or colorArray[3].alpha is not 255
                        translucent = true

                    self.resize(4, 64, 64)

                    i, j, k : int
                    k = 0
                    y : float

                    xs : float* = malloc(sizeof(float) * 64)

                    for i = 1 to 64 
                        xs[i-1] = (float) i

                    reds   : uchar* = malloc(64 * 64)
                    blues  : uchar* = malloc(64 * 64)
                    greens : uchar* = malloc(64 * 64)
                    alphas : uchar* = malloc(64 * 64)

                    for i = 0 to 63
                        var offset = 64 * i
                        y = i / 64.0f
                        generate_palette_color(reds + offset, xs,
                                               (float) colorArray[0].red,
                                               (float) colorArray[1].red,
                                               (float) colorArray[2].red,
                                               (float) colorArray[3].red,
                                               y, 64, 1, 64)
                        generate_palette_color(greens + offset, xs,
                                               (float) colorArray[0].green,
                                               (float) colorArray[1].green,
                                               (float) colorArray[2].green,
                                               (float) colorArray[3].green,
                                               y, 64, 1, 64)
                        generate_palette_color(blues + offset, xs,
                                               (float) colorArray[0].blue,
                                               (float) colorArray[1].blue,
                                               (float) colorArray[2].blue,
                                               (float) colorArray[3].blue,
                                               y, 64, 1, 64)
                        generate_palette_color(alphas + offset, xs,
                                               (float) colorArray[0].alpha,
                                               (float) colorArray[1].alpha,
                                               (float) colorArray[2].alpha,
                                               (float) colorArray[3].alpha,
                                               y, 64, 1, 64)

                    for i = 0 to 63
                        for j = 0 to 63
                            self[k] = new soy.atoms.Color(reds[k], greens[k],
                                                          blues[k], alphas[k])
                            k++

                    free(reds)
                    free(blues)
                    free(greens)
                    free(alphas)
                    free(xs)

                    // the above accomplishes the below in assembly
                    //x, y, r, g, b : float

//                    for i = 1 to 128
//                        y = (i-0.5f) / 128.0f
//                        for j = 1 to 128
//                            x = (j-0.5f) / 128.0f

//                            r =  colorArray[0].red*(1-x)*(1-y) + colorArray[1].red*x*(1-y)
//                            r += colorArray[2].red*(1-x)*y + colorArray[3].red*x*y
                            
//                            g =  colorArray[0].green*(1-x)*(1-y) + colorArray[1].green*x*(1-y)
//                            g += colorArray[2].green*(1-x)*y + colorArray[3].green*x*y
                            
//                            b =  colorArray[0].blue*(1-x)*(1-y) + colorArray[1].blue*x*(1-y)
//                            b += colorArray[2].blue*(1-x)*y + colorArray[3].blue*x*y
                            
//                            self[k++] = new soy.atoms.Color((uchar) r, (uchar) g, (uchar) b)

                self._wrap = false
                self._smooth = true
                self.updated = true
            when "rainbow"
                self.resize(3, 128, 1)

                i : int
                delta : float = 360.0f / 128.0f
                h, t : float

                r, g, b : uchar
                r = g = b = 0

                for i = 0 to 127
                    h = (i * delta) / 360.0f

                    t = h + 1.0f/3.0f
                    if t < 0.0f
                        t += 1.0f
                    else if t > 1.0f
                        t -= 1.0f

                    if t < 1.0f/6.0f
                        r = (uchar) (6.0f * t * 255.0f)
                    else if t < 0.5f
                        r = (uchar) 255
                    else if t < 2.0f/3.0f
                        r = (uchar) ((2.0f/3.0f - t) * 6.0f * 255.0f)

                    t = h
                    if t < 0.0f
                        t += 1.0f
                    else if t > 1.0f
                        t -= 1.0f

                    if t < 1.0f/6.0f
                        g = (uchar) (6.0f * t * 255.0f)
                    else if t < 0.5f
                        g = (uchar) 255
                    else if t < 2.0f/3.0f
                        g = (uchar) ((2.0f/3.0f - t) * 6 * 255.0f)

                    t = h - 1.0f/3.0f
                    if t < 0.0f
                        t += 1.0f
                    else if t > 1.0f
                        t -= 1.0f

                    if t < 1.0f/6.0f
                        b = (uchar) (6.0f * t * 255.0f)
                    else if t < 0.5f
                        b = (uchar) 255
                    else if t < 2.0f/3.0f
                        b = (uchar) ((2.0f/3.0f - t) * 6 * 255.0f)

                    self[i] = new soy.atoms.Color(r, g, b)

    construct from_png (filename : string) raises IOError, MemoryError
        surface : Cairo.ImageSurface
        surface = new Cairo.ImageSurface.from_png(filename)
        status : Cairo.Status = surface.status()

        if status == Cairo.Status.SUCCESS
            self._copySurface(surface)
            self.translucent = _chans % 2 is 0 

        if status == Cairo.Status.NO_MEMORY
            raise new MemoryError.OUT_OF_MEMORY ("Out of memory")

        if status == Cairo.Status.FILE_NOT_FOUND
            raise new IOError.FILE_NOT_FOUND ("No such file: '" + filename + "'")

        if status == Cairo.Status.READ_ERROR
            raise new IOError.READ_ERROR ("Could not read file: '" + filename + "'")


    construct from_svg (filename : string) raises IOError, MemoryError, Error
        if not File.new_for_path(filename).query_exists()
            raise new IOError.FILE_NOT_FOUND ("No such file: '" + filename + "'")

        context : Cairo.Context
        handle : Rsvg.Handle
        surface : Cairo.ImageSurface

        handle = new Rsvg.Handle.from_file(filename)
        surface = new Cairo.ImageSurface(Cairo.Format.ARGB32, handle.width,
                                     handle.height)
        status : Cairo.Status = surface.status()

        if status == Cairo.Status.SUCCESS
            context = new Cairo.Context(surface)
            handle.render_cairo(context)
            self._copySurface(surface)
            self.translucent = _chans % 2 is 0 

        if status == Cairo.Status.NO_MEMORY
            raise new MemoryError.OUT_OF_MEMORY ("Out of memory")

        if status == Cairo.Status.FILE_NOT_FOUND
            raise new IOError.FILE_NOT_FOUND ("No such file: '" + filename + "'")

        if status == Cairo.Status.READ_ERROR
            raise new IOError.READ_ERROR ("Could not read file: '" + filename + "'")

    construct from_svg_string (data : array of uint8) raises MemoryError, Error
        context : Cairo.Context
        handle : Rsvg.Handle
        surface : Cairo.ImageSurface

        handle = new Rsvg.Handle.from_data(data)
        surface = new Cairo.ImageSurface(Cairo.Format.ARGB32, handle.width,
                                     handle.height)
        status : Cairo.Status = surface.status()

        if status == Cairo.Status.SUCCESS
            context = new Cairo.Context(surface)
            handle.render_cairo(context)
            self._copySurface(surface)
            self.translucent = _chans % 2 is 0

        if status == Cairo.Status.NO_MEMORY
            raise new MemoryError.OUT_OF_MEMORY ("Out of memory")

    ////////////////////////////////////////////////////////////////////////
    // Properties

    _animate : array of GLfloat
    prop animate : array of GLfloat
        get
            return _animate


    _aspect    : float
    prop aspect : float
        get
            return _aspect


    //
    // Channels Property
    _chans : int
    prop channels : int
        get
            return _chans
        set
            if value < 1 or value > 4
                return
            resize(value, self._width, self._height)

    //
    // Size Property
    _width     : GLsizei
    _height    : GLsizei
    _size_obj : weak soy.atoms.Size?

    def _size_set(size : soy.atoms.Size)
        resize(self._chans,
               (GLsizei) Math.lround(size.width),
               (GLsizei) Math.lround(size.height))

    def _size_weak(size : Object)
        self._size_obj = null

    prop size : soy.atoms.Size
        owned get
            value : soy.atoms.Size? = self._size_obj
            if value is null
                value = new soy.atoms.Size((float) self._width,
                                           (float) self._height)
                value.on_set.connect(self._size_set)
                value.weak_ref(self._size_weak)
                self._size_obj = value
            return value
        set
            self._size_set(value)
            if _size_obj != null
                _size_obj.on_set.disconnect(self._size_set)
                _size_obj.weak_unref(self._size_weak)
            _size_obj = value
            value.on_set.connect(self._size_set)
            value.weak_ref(self._size_weak)

    //
    // Smooth Property
    _smooth : bool
    prop smooth : bool
        get
            return self._smooth
        set
            self._smooth = value
            self.updated = true

    //
    // Wrap Property
    _wrap : bool
    prop wrap : bool
        get
            return self._wrap
        set
            self._wrap = value
            self.updated = true


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def new get (index : int) : Color?
        ret : soy.atoms.Color? = null

        // Return null if requested index is out of bounds
        if index < 0 or index >= (self._width * self._height)
            return null

        // Return existing Color object if there is one
        if self._texel_objs.has_key(index)
            ret = _texel_objs[index]

        // Otherwise create a new object based on number of channels
        else if self._chans == 1
            var l = texels[index]
            ret = new soy.atoms.Color(l, l, l, 255)
        else if self._chans == 2
            var l = texels[index*2]
            var a = texels[index*2+1]
            ret = new soy.atoms.Color(l, l, l, a)
        else if self._chans == 3
            var r = texels[index*3]
            var g = texels[index*3+1]
            var b = texels[index*3+2]
            ret = new soy.atoms.Color(r, g, b, 255)
        else // if self._chans == 4
            var r = texels[index*4]
            var g = texels[index*4+1]
            var b = texels[index*4+2]
            var a = texels[index*4+3]
            ret = new soy.atoms.Color(r, g, b, a)

        // Set event callbacks
        ret.on_set.connect(self._texel_set)
        ret.weak_ref(self._texel_weak)

        // Store weak reference and return owned Color object
        self._texel_objs[index] = ret
        return (owned) ret


    def new set (index : int, value : Object)
        color : soy.atoms.Color

        if not (value isa soy.atoms.Color)
            return

        color = (soy.atoms.Color) value

        // Disconnect old texel Color object
        if self._texel_objs.has_key(index)
            var old = self._texel_objs[index]
            old.on_set.disconnect(self._texel_set)
            old.weak_unref(self._texel_weak)

        // Store weak reference
        self._texel_objs[index] = color

        // Set callbacks
        color.on_set.connect(self._texel_set)
        color.weak_ref(self._texel_weak)

        // Update local storage
        //
        // This code is a bit repetitive, but its hard to consolidate it
        // without slowing it down considerably.  Remember that users will use
        // this API for generating textures in their own code, so even small
        // hits to speed here will be multiplied by the size of their Texture

        // Luma
        if self._chans == 1
            texels[index] = color.luma
        // Luma+Alpha
        else if self._chans == 2
            texels[index*2] = color.luma
            texels[index*2+1] = color.alpha
        // RGB
        else if self._chans == 3
            texels[index*3] = color.red
            texels[index*3+1] = color.green
            texels[index*3+2] = color.blue
        // RGB+Alpha
        else // self._chans == 4
            texels[index*4] = color.red
            texels[index*4+1] = color.green
            texels[index*4+2] = color.blue
            texels[index*4+3] = color.alpha

        // Flag for updating
        self._mutex.lock()
        self.updated = true
        self._mutex.unlock()


    def _copySurface (surface : Cairo.ImageSurface)
        chans : int
        width : int
        height : int
        stride : int
        data : uchar*

        // Ensure all pending drawing operations are finished
        surface.flush()

        // Determine number of channels
        if surface.get_format() == Cairo.Format.RGB24
            chans = 3
        else // Cairo.Format.ARGB32
            chans = 4

        // Get surface width, height, and stride
        width = surface.get_width()
        height = surface.get_height()
        stride = surface.get_stride()

        // Get pointer to data
        data = (void*) surface.get_data()

        // Allocate texels
        self.resize(chans, squareup(width), squareup(height))

        // Switch on datatype
        if _chans == 3
            // Copy to texels, row by row
            for var y = 0 to (height-1)
                for var x = 0 to (width-1)
                    var src = (y * stride) + (x * 4)
                    var dst = ((y * _width) + x) * _chans
                    texels[dst  ] = *(data+src+2)
                    texels[dst+1] = *(data+src+1)
                    texels[dst+2] = *(data+src  )

        else // RGBA
            surface2rgba(texels, _width*_chans, data, stride, width, height)

//        var tmpWidth = _width >> 1
//        var tmpHeight = _height >> 1
//        var size = 0

//        // create array to hold mipmaps
//        while tmpWidth != 0 and tmpHeight != 0
//            // chans will always be 4 because of dummy alpha
//            size += 4 * tmpWidth * tmpHeight
//            tmpWidth >>= 1
//            tmpHeight >>= 1

//        mipmaps = malloc(size)

//        // reset tmp variables to help with creation
//        tmpWidth = _width >> 1
//        tmpHeight = _height >> 1
//        var firstMipmap = true
//        var offset = 0

//        while tmpWidth != 0 and tmpHeight != 0
//            // call horizontal then vertical to get correct mipmap
//            // the # of chans is always 4 because of dummy alpha

//            var tmpMipmap = malloc(tmpWidth * tmpHeight * 4)

//            // only the first mipmap will use data directly from surface
//            // src stride is 8 chans because tmpWidth has already been reduced by 2
//            // src stride in vertical must be twice the normal stride to work correctly
//            // the first parameter is the width to get the next value vertically
//            if firstMipmap
//                mipmap_horizontal(tmpMipmap, tmpWidth * 4,
//                                  data, tmpWidth * 8,
//                                  tmpWidth, tmpHeight)
//                mipmap_vertical(mipmaps, tmpWidth * 4,
//                                tmpMipmap, tmpWidth * 8,
//                                tmpWidth, tmpWidth * 2, tmpHeight)
//                offset += tmpWidth * tmpHeight
//                firstMipmap = false
//            else
//                // use last mipmap as src
//                mipmap_horizontal(tmpMipmap, tmpWidth * 4,
//                                  mipmaps + offset, tmpWidth * 8,
//                                  tmpWidth, tmpHeight)
//                offset += tmpWidth * tmpHeight
//                mipmap_vertical(mipmaps + offset, tmpWidth * 8,
//                                tmpMipmap, tmpWidth * 8,
//                                tmpWidth, tmpWidth * 2, tmpHeight)

        // Calculate aspect ratio
        _aspect = (float) width / (float) height

        // Calc ratio between texture and actual size
        // This is used for texcoord translation so the image acts like the
        // full texture, when actually it's just scaled all the texcoords
        _scaleX = (float) width / (float) _width
        _scaleY = (float) height / (float) _height

        // Disable scaling for 1:1 ratio
        if _scaleX == 1.0f and _scaleY == 1.0f
            _scaleX = 0.0f


    def _texel_set(color : soy.atoms.Color)
        //
        // Iterate over texels with a Color object, update each match using
        // correct byte/channel mapping
        //

        // Luma
        if self._chans == 1
            for index in self._texel_objs.keys
                if self._texel_objs[index] is color
                    texels[index] = color.luma

        // Luma+Alpha
        else if self._chans == 2
            for index in self._texel_objs.keys
                if self._texel_objs[index] is color
                    texels[index*2] = color.luma
                    texels[index*2+1] = color.alpha
        // RGB
        else if self._chans == 3
            for index in self._texel_objs.keys
                if self._texel_objs[index] is color
                    texels[index*3] = color.red
                    texels[index*3+1] = color.green
                    texels[index*3+2] = color.blue
        // RGB+Alpha
        else // self._chans == 4
            for index in self._texel_objs.keys
                if self._texel_objs[index] is color
                    texels[index*4] = color.red
                    texels[index*4+1] = color.green
                    texels[index*4+2] = color.blue
                    texels[index*4+3] = color.alpha

        // Flag for updating
        self._mutex.lock()
        self.updated = true
        self._mutex.unlock()


    def _texel_weak(color : Object)
        // We can't remove keys from _texel_objs while we iterate over it, so
        // we instead build a list of keys that need to be garbage collected
        var garbage = new list of int
        for index in self._texel_objs.keys
            if self._texel_objs[index] is color
                garbage.add(index)
        // Now we can remove them
        for index in garbage
            self._texel_objs.unset(index)


    def resize(c : int, x : int, y : int)
        //
        // This function is called to allocate or free self.texels
        // It will also set ._chans ._width and ._height
        //
        size : int // long int?

        // Lock against rendering
        self._mutex.lock()

        size = c * x * y 
        
        // If this is a request to free texels
        if size is 0
            if self._width is not 0
                free(self.texels)
                self.texels = null

        else
            // Have we already alloc'ed?
            if self._width is not 0
                if _chans is not c or _width is not x or _height is not y
                    /* FIXME
                    temp : uchar* = malloc(size)
                    // Reallocate for new size
                    // Hold onto the origin for us, incase we lose it

                    oldSize : int = self._chans * self._width * self._height
                    // Record old texels size

                    for index : int = 0 to (oldSize - 1)
                        temp[index] = self.texels[index]
                    // Shift existing values into new storage layout

                    free(self.texels) */
                    self.texels = realloc(self.texels, size)
            else
                // Allocate a new texel buffer
                self.texels = malloc0(size)

        // We're all done, set the object's new channels and size
        self._chans = c
        self._width = (GLsizei) x
        self._height = (GLsizei) y
        self.updated = true
        self._mutex.unlock()


    def inline update(target : GLenum)
        glTexImage2D(target, 0, (GLint) _formats[_chans],
                     _width, _height, 0,
                     _formats[_chans], GL_UNSIGNED_BYTE,
                     (GL.GLvoid*) self.texels)

        /* currently broken
        //mipmaps 
        var tmpWidth  = _width >> 1
        var tmpHeight = _height >> 1
        var offset = 0
        var level = 0

        while tmpWidth != 0 and tmpHeight != 0
            glTexImage2D(target, ++level, (GLint) GL_RGBA,
                         tmpWidth, tmpHeight, 0,
                         GL_RGBA, GL_UNSIGNED_BYTE,
                         (GL.GLvoid*) mipmaps + offset)
            offset += tmpWidth * tmpHeight * 4
            level++
        */

    def bind(target : GLenum)
        glBindTexture(target, _textureID)

    def virtual enable ()
        _i : int
        _anim : array of float = new array of float[3]

        // Don't bother with empty texture
        if texels == null
            // But delete it if it was previously created
            if _textureID is not 0
                glDeleteTextures(1, {_textureID})
            return

        // Lock to prevent resizing while we render
        _mutex.lock()

        // Enable our texture
        glEnable(GL_TEXTURE_2D)

        // If we haven't generated this texture yet, do so now
        if _textureID is 0
            // Generate a new _textureID
            glGenTextures(1, out _textureID)

            // Flag the new texture for updating so it'll be processed below
            self.updated = true

        // Bind the texture
        glBindTexture(GL_TEXTURE_2D, _textureID)

        // If the texture needs updating
        if self.updated
            self.update(GL_TEXTURE_2D)

            // Update complete, clear the flag
            self.updated = false

        // Set filter parameters
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER,
                        (GLint) GL_LINEAR)
        if self._smooth
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER,
                            (GLint) GL_LINEAR)
        else
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER,
                            (GLint) GL_NEAREST)

        // Set wrap parameters
        if self._wrap
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S,
                            (GLint) GL_REPEAT)
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T,
                            (GLint) GL_REPEAT)
        else
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S,
                            (GLint) GL_CLAMP_TO_EDGE)
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T,
                            (GLint) GL_CLAMP_TO_EDGE)

        // Translate the texture matrix to animation state if needed
        if _isAnimated is 1
            var tv = GLib.TimeVal()
            var _it = ((float) tv.tv_sec) + ((float) tv.tv_usec) / 1000000.0f
            for _i = 0 to 3
                _anim[_i] = _it * _animate[_i]
                _anim[_i] = _anim[_i] - _anim[_i]
            glMatrixMode(GL_TEXTURE)
            glTranslatef((float)_anim[0], (float) _anim[1], (float) _anim[2])

        // Scale the texture matrix if needed
        if _scaleX is not 0
            glMatrixMode(GL_TEXTURE)
            glScalef(_scaleX, _scaleY, 1)

        // Translate the texture matrix if needed
        if _translateX is not 0
            glMatrixMode(GL_TEXTURE)
            glTranslatef(_translateX, _translateY, 1)


    def virtual disable ()
        if texels == null
            return
        glDisable(GL_TEXTURE_2D)

        // undo animation and/or scale
        if _isAnimated is not 0 or _scaleX is not 0 or _translateX is not 0
            glMatrixMode(GL_TEXTURE)
            glLoadIdentity()
        _mutex.unlock()


    def load (_vdata : void*, _size : int)
        //
        // This function is called by a soy.transports.Transport for each .soy
        // packet that's loaded.  We store the next packet number in self._state
        // which is set to -1 if there's an error or we're finished.
        //
        // _i = iterator
        //
        //_i : int
        _data :array of uchar  //= new array of uchar[]
        _data = (array of uchar) _vdata

        // Process this packet.
        // TODO


    ////////////////////////////////////////////////////////////////////////
    // Static Methods

    def static squareup(_v : int) : int
        //
        // This handy hack courtesy Sean Anderson, see:
        // http://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
        //
        _v = _v - 1
        _v = _v | _v >> 1
        _v = _v | _v >> 2
        _v = _v | _v >> 4
        _v = _v | _v >> 8
        _v = _v | _v >> 16
        return _v + 1


    def static extern surface2rgba (dst : uchar*,
                                    dst_stride : int,
                                    src : uchar*,
                                    src_stride : int,
                                    n : int, m : int)

    // takes a destination array to put the uchar sized colors in of size n
    // currently uses a lot of workarounds to lacking features in orc
    // such as requiring an array containing the set [0, n] 
    // and requiring float parameters instead of float constants
    def static extern generate_palette_color (dst     : uchar*,
                                              xs      : float*,
                                              c1      : float,
                                              c2      : float,
                                              c3      : float,
                                              c4      : float,
                                              y       : float,
                                              divisor : float,
                                              bound   : float,
                                              n       : int)
    // applies the formula (c1 + (c2-c1)*(xs[i] / divisor)) to get the 
    // linear interpolation between c1 and c2 at (xs[i] / divisor)
    // c1 must be > c2
    def static extern generate_lerped_colors (dst     : uchar*,
                                              xs      : float*,
                                              c1      : float,
                                              c2      : float,
                                              divisor : float,
                                              n : int)
                                              
                                              


//    // horizontal averaging of bits
//    def static extern mipmap_horizontal (dst : uchar*,
//                                         dst_stride : int,
//                                         src : uchar*,
//                                         src_stride : int,
//                                         n : int, m : int)

//    // vertical averaging of bits. src_stride should be doubled in parameters
//    def static extern mipmap_vertical (dst : uchar*,
//                                       dst_stride : int,
//                                       src : uchar*,
//                                       src_stride : int,
//                                       p1 : int, n : int, m : int)
