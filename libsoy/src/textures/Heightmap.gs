/*
 *  libsoy - soy.textures.Heightmap
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

class soy.textures.Heightmap : soy.textures.Texture
    
    _mutex : Mutex

    init
        _mutex = Mutex()
        translucent = false

    construct ()
        channels = 1


    construct from_png (filename : string) raises IOError, MemoryError
        super.from_png(filename)

        c : int = self.channels
        o : int
        total : int = ((int)self.size.width * (int)self.size.height) - 1
        for var n = 0 to total
            o = n*c
            texels[n] = (texels[o] + texels[o+1] + texels[o+2]) / 3

        self.channels = 1

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def new get (index : int) : int
        // Return -1 if requested index is out of bounds
        if index < 0 or index >= (self.size.width * self.size.height)
            return -1

        return texels[index]


    def new set (index : int, value : int)
        texels[index] = (uchar) value

        // Flag for updating
        self._mutex.lock()
        self.updated = true
        self._mutex.unlock()
