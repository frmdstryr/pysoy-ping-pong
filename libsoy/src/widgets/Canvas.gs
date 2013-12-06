/*
 *  libsoy - soy.widgets.Canvas
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
    soy.atoms
    soy.textures

class soy.widgets.Canvas : soy.widgets.Widget
    alignWidth   : int
    alignHeight  : int
    aspect       : float
    marginTop    : int
    marginLeft   : int
    marginRight  : int
    marginBottom : int

    // These verts form a 1x1 square with 2 tris (A and B) :
    //          3----2
    //          | B/ |
    //          | /A |
    //          0----1
    //
    //                                    px    py          tx    ty
    _verts : static array of GLfloat =  {0.0f, 0.0f, 0.0f, 0.0f, 1.0f,  // 0,0
                                         1.0f, 0.0f, 0.0f, 1.0f, 1.0f,  // 1,0
                                         1.0f, 1.0f, 0.0f, 1.0f, 0.0f,  // 1,1
                                         0.0f, 1.0f, 0.0f, 0.0f, 0.0f}  // 0,1

    //                                   face A    face B
    _faces : static array of GLushort = { 0, 1, 2, 2, 3, 0 }

    vbuffer : GLuint // Vertex Buffer
    ibuffer : GLuint // Index Buffer

    construct (texture : soy.textures.Texture?)
        self._texture = texture


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override add (parent : soy.widgets.Container)
        self.size = parent.size

    def override remove ()
        self.size = new soy.atoms.Size(0, 0, 0)
    
    def override render (x: int, y : int, width : int, height : int)
#if !WINDOWS
        // don't bother rendering w/o a texture
        if _texture == null
            return

        // Setup and Use VBOs
        if vbuffer == 0 or ibuffer == 0
            //
            ///////////////////////////////////////
            // The Vertex and Index buffers are not initialized
            //
            // Generate, Bind, and upload to the vertex buffer
            glGenBuffers(1, out vbuffer);
            glBindBuffer(GL_ARRAY_BUFFER, vbuffer);
            glBufferData(GL_ARRAY_BUFFER, (GL.GLsizei) sizeof(GLfloat) * 20, _verts,
                         GL_STATIC_DRAW);

            // Generate, Bind, and upload to the index buffer
            glGenBuffers(1, out ibuffer);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ibuffer);
            glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                         (GL.GLsizei) sizeof(GLushort) * 6, _faces, GL_STATIC_DRAW);
            
        else
            //
            // Just use the buffers that have been previously created
            glBindBuffer(GL_ARRAY_BUFFER, vbuffer);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ibuffer);

        //
        // Set the viewport to the current Widget position and size
        //TODO: This needs to calculate the actual dimensions instead of using the
        //       size fractions passed to this function
        glViewport((GLint) x, (GLint) y, (GLint) width, (GLint) height)
        //
        // Reset the projection and modelview matrix, set ortho rendering
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        glOrthof(0.0f, 1.0f, 0.0f, 1.0f, -1.0f, 1.0f)
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()

        glDisableClientState(GL_NORMAL_ARRAY) //  We're not going to use Normals

        self._texture.enable()

        // Verticies and Texcoord are packed (20 stride)
        glVertexPointer(3, GL_FLOAT, 20, (void *)0)
        // Texcoords are found after the verticies (3 floats, 4 bytes each = 12 bytes offset)
        glTexCoordPointer(2, GL_FLOAT, 20,(void *) 12)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_SHORT,(void *) 0)

        self._texture.disable()

        glEnableClientState(GL_NORMAL_ARRAY) // But remember to enable them for later...

        glBindBuffer(GL_ARRAY_BUFFER, 0);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
#else
        print "Canvas: glext functions not currently supported on Windows"
#endif


    ////////////////////////////////////////////////////////////////////////
    // Properties

    prop texture : soy.textures.Texture

