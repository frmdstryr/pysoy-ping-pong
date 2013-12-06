/*
 *  libsoy - soy.textures.Bumpmap
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
    soy.atoms

class soy.textures.Bumpmap : soy.textures.Texture
    
    _texel_objs: dict of int, weak soy.atoms.Vector?
    _mutex : Mutex

    init
        _texel_objs = new dict of int, unowned soy.atoms.Vector?
        _mutex = Mutex()
        channels = 3
        translucent = false

    construct from_png (filename : string) raises IOError, MemoryError
        super.from_png(filename)

    construct emboss (texture : soy.textures.Texture)
        // Sobel operation
        var tex = texture.texels
        var width = texture.size.width
        var height = texture.size.height
        self.resize(3,(int)width,(int)height)
        for var i=0 to (height-1)
            for var j=0 to (width-1)
                var ul = tex[(int)(fmax(0,i-1)*width+fmax(0,j-1))]
                var u = tex[(int)(fmax(0,i-1)*width+j)]
                var ur = tex[(int)(fmax(0,i-1)*width+fmin(width-1,j+1))]
                var l = tex[(int)(i*width+fmax(0,j-1))]
                var r = tex[(int)(i*width+fmin(width-1,j+1))]
                var dl = tex[(int)(fmin(height-1,i+1)*width+fmax(0,j-1))]
                var d = tex[(int)(fmin(height-1,i+1)*width+j)]
                var dr = tex[(int)(fmin(height-1,i+1)*width+fmin(width-1,j+1))]
                var x = ul-ur+2*l-2*r+dl-dr
                var y = ul+2*u+ur-dl-2*d-dr
                var z = 0.5f
                var mag = sqrtf(x*x+y*y+z*z)
                self.texels[(int)(i*width+j)*3] = (uchar)((x/mag+1)*127.5f)
                self.texels[(int)(i*width+j)*3+1] = (uchar)((y/mag+1)*127.5f)
                self.texels[(int)(i*width+j)*3+2] = (uchar)((z/mag+1)*127.5f)

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def new get (index : int) : Vector?
        ret : soy.atoms.Vector? = null

        // Return null if requested index is out of bounds
        if index < 0 or index >= (self.size.width * self.size.height)
            return null

        // Return existing Color object if there is one
        if self._texel_objs.has_key(index)
            ret = _texel_objs[index]

        // Otherwise create a new object
        else
            var x = (texels[index*3] - 127)   / 128.0f
            var y = (texels[index*3+1] - 127) / 128.0f
            var z = (texels[index*3+2] - 127) / 128.0f
            ret = new soy.atoms.Vector(x, y, z)
        
        // Set event callbacks
        ret.on_set.connect(self._texel_set)
        ret.weak_ref(self._texel_weak)

        // Store weak reference and return owned Color object
        self._texel_objs[index] = ret
        return (owned) ret


    def new set (index : int, value : Object)
        vector : soy.atoms.Vector

        if not (value isa soy.atoms.Vector)
            return

        vector = (soy.atoms.Vector) value

        // clamp x y z of vector to be in range [-1:1]
        if vector.x > 1.0f
            vector.x = 1.0f
        else if vector.x < -1.0f
            vector.x = -1.0f

        if vector.y > 1.0f
            vector.y = 1.0f
        else if vector.y < -1.0f
            vector.y = -1.0f

        if vector.z > 1.0f
            vector.z = 1.0f
        else if vector.z < -1.0f
            vector.z = -1.0f

        // Disconnect old texel Color object
        if self._texel_objs.has_key(index)
            var old = self._texel_objs[index]
            old.on_set.disconnect(self._texel_set)
            old.weak_unref(self._texel_weak)

        // Store weak reference
        self._texel_objs[index] = vector

        // Set callbacks
        vector.on_set.connect(self._texel_set)
        vector.weak_ref(self._texel_weak)

        // Update local storage
        //
        // This code is a bit repetitive, but its hard to consolidate it
        // without slowing it down considerably.  Remember that users will use
        // this API for generating textures in their own code, so even small
        // hits to speed here will be multiplied by the size of their Texture

        texels[index*3]   = (uchar) ((char) (vector.x * 128.0f))
        texels[index*3+1] = (uchar) ((char) (vector.y * 128.0f))
        texels[index*3+2] = (uchar) ((char) (vector.z * 128.0f))

        // Flag for updating
        self._mutex.lock()
        self.updated = true
        self._mutex.unlock()

    def _texel_set(vector : soy.atoms.Vector)
        //
        // Iterate over texels with a Vector object, update each match using
        // correct byte/channel mapping
        //

        for index in self._texel_objs.keys
            if self._texel_objs[index] is vector
                texels[index*3]   = (uchar) ((char) (vector.x * 128.0f))
                texels[index*3+1] = (uchar) ((char) (vector.y * 128.0f))
                texels[index*3+2] = (uchar) ((char) (vector.z * 128.0f))

        // Flag for updating
        self._mutex.lock()
        self.updated = true
        self._mutex.unlock()


    def _texel_weak(vector : Object)
        // We can't remove keys from _texel_objs while we iterate over it, so
        // we instead build a list of keys that need to be garbage collected
        var garbage = new list of int
        for index in self._texel_objs.keys
            if self._texel_objs[index] is vector
                garbage.add(index)
        // Now we can remove them
        for index in garbage
            self._texel_objs.unset(index)
