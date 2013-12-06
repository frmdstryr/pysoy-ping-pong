/*
 *  libsoy - soy.widgets.Branch
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
    soy.atoms
    Gee
    GL
    GLib

class soy.widgets.Branch : soy.widgets.Container

    _children : list of Branch?
    name : string
    collapsed : bool
    _verts : static array of GLfloat
    _faces : static array of GLushort
    _vbuffer : GLuint // Vertex Buffer
    _ibuffer : GLuint // Index Buffer
    _branchHeight : int = 20
    _branchWidth : int = 200
    _branchPosX : int
    _branchPosY : int
    _indentLength : int = 20
    _parent : soy.widgets.Container
    _shouldRender : bool
    _YDisp : int
    parent : soy.widgets.Container?


    construct (name : string?)
        self.name = name
        self._children = new list of Branch?
        self.collapsed = false
        self._branchPosX = 0
        self._branchPosY = (int)self.convertY(0.0f)
        self._shouldRender = true
        self.parent = null


    def override add (parent : soy.widgets.Container)
        self.parent = parent
        if parent isa soy.widgets.Branch
            ((Branch)parent)._children.add(self)


    def override remove ()
        if self.parent isa soy.widgets.Branch
            ((Branch)parent)._children.remove(self)
        self.parent = null


    def remove_branch (oldBranch : soy.widgets.Branch)
        self._children.remove(oldBranch)


    def display()
        if self.collapsed
            print "+ %s", self.name
            return
        else
            print "- %s", self.name
            for child in self._children
                child.display()


    //convert y coordinate from mouse coord system to openGL coor system.
    def convertY (y : float) : float
        return self._parent.height - y - self._branchHeight


    def _calc_disp(rootY : int, y : int) : int
        self._YDisp = y
        for child in self._children
            child._branchPosX = self._branchPosX + self._indentLength
            if child._shouldRender
                self._YDisp += self._branchHeight + 5
                child._branchPosY = rootY - _YDisp
                self._YDisp += child._calc_disp(rootY,self._YDisp)
                // this might cause problems later on, maybe?
                // i thnk it should be called exactly how Container calls it.
                child.render(0,0,0,0)
        return self._YDisp - y


    def override render (x: int, y : int, width : int, height : int)
        if self.collapsed
            for child in self._children
                child._shouldRender = false
        else
            for child in self._children
                child._shouldRender = true


        if not self._shouldRender
            return

        var p = self._parent
        if not (p isa soy.widgets.Branch)
            self._calc_disp(self._branchPosY, 0)


        // These verts form a 1x1 square with 2 tris (A and B) :
        //          3----2
        //          | B/ |
        //          | /A |
        //          0----1
        //
        //               px    py          tx    ty
        _verts  = {0.0f, 0.0f, 0.0f, 0.0f, 0.0f,  // 0,0
                        1.0f, 0.0f, 0.0f, 1.0f, 0.0f,  // 1,0
                        1.0f, 1.0f, 0.0f, 1.0f, 1.0f,  // 1,1
                        0.0f, 1.0f, 0.0f, 0.0f, 1.0f}  // 0,1

        _faces = { 0, 1, 2, 2, 3, 0 }

        if _vbuffer == 0 or _ibuffer == 0
            //
            ///////////////////////////////////////
            // The Vertex and Index buffers are not initialized
            //
            // Generate, Bind, and upload to the vertex buffer
            glGenBuffers(1, out _vbuffer);
            glBindBuffer(GL_ARRAY_BUFFER, _vbuffer);
            glBufferData(GL_ARRAY_BUFFER, (GL.GLsizei) (sizeof(GLfloat) * 20),
                         _verts, GL_STATIC_DRAW);

            // Generate, Bind, and upload to the index buffer
            glGenBuffers(1, out _ibuffer);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ibuffer);
            glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                         (GL.GLsizei) (sizeof(GLushort) * 6), _faces,
                         GL_STATIC_DRAW);
        else
            //
            // Just use the buffers that have been previously created
            glBindBuffer(GL_ARRAY_BUFFER, _vbuffer);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ibuffer);

        glViewport((GLint) _branchPosX, (GLint) _branchPosY,
                   (GLint) _branchWidth, (GLint) _branchHeight)
        //
        // Reset the projection and modelview matrix, set ortho rendering
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        // FIXME glOrtho(0.0, 1.0, 1.0, 0.0, -1, 1)
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()

        glDisableClientState(GL_NORMAL_ARRAY) // We're not going to use Normals

        // Verticies and Texcoord are packed (20 stride)
        glVertexPointer(3, GL_FLOAT, 20, (void *)0)
        // Texcoords are found after the verticies (3 floats, 4 bytes each =
        //                                          12 bytes offset)
        // glTexCoordPointer(2, GL_FLOAT, 20,(void *) 12)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_SHORT,(void *) 0)

        // FIXME glColor3f((GLfloat)0.6,1,0)

