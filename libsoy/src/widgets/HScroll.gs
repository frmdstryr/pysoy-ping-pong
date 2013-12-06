/*
 *  libsoy - soy.widgets.HScroll
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


class soy.widgets.HScroll : soy.widgets.Scroller
    _viewPort : soy.atoms.Size
    _hasBar : bool
    _verts : static array of GLfloat
    _faces : static array of GLushort
    _vbuffer : GLuint // Vertex Buffer
    _ibuffer : GLuint // Index Buffer
    _totalWidth : float
    _scrollWidth : float
    _testpos : soy.atoms.Position


    construct ()
        _viewPort = new soy.atoms.Size(self.size.width, self.size.height)
        _hasBar = false
        _testpos = new soy.atoms.Position()
        self.scrollPosition = new soy.atoms.Position()


    def override render (x: int, y : int, width : int, height : int)
#if !WINDOWS
        // Render each child widget in order
        var _x = x
        var _y = y
        for widget in self.children
            widget.render(_x, _y, widget.width, widget.height)
            _x += widget.width

        if not _hasBar
            return

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
            glBufferData(GL_ARRAY_BUFFER, (GL.GLsizei) sizeof(GLfloat) * 20,
                         _verts, GL_STATIC_DRAW);

            // Generate, Bind, and upload to the index buffer
            glGenBuffers(1, out _ibuffer);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ibuffer);
            glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                         (GL.GLsizei) sizeof(GLushort) * 6, _faces,
                         GL_STATIC_DRAW);

        else
            //
            // Just use the buffers that have been previously created
            glBindBuffer(GL_ARRAY_BUFFER, _vbuffer);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ibuffer);

        //viewport of the entire scrollbar
        glViewport((GLint) 0, (GLint) 0, (GLint) _viewPort.width, (GLint) self.scrollbarThickness)
        //
        // Reset the projection and modelview matrix, set ortho rendering
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        glOrthof(0.0f, 1.0f, 1.0f, 0.0f, -1.0f, 1.0f)
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()

        glDisableClientState(GL_NORMAL_ARRAY) //  We're not going to use Normals

        // Verticies and Texcoord are packed (20 stride)
        glVertexPointer(3, GL_FLOAT, 20, (void *)0)
        // Texcoords are found after the verticies (3 floats, 4 bytes each = 12 bytes offset)
        // glTexCoordPointer(2, GL_FLOAT, 20,(void *) 12)
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_SHORT,(void *) 0)

        glColor4f(0, 1, 0, 1)

        //viewport of the scroll itself
        var viewPort2Width = 0.0
        if self.size.width < _totalWidth
            viewPort2Width = self.size.width/ _totalWidth * self.size.width
        glViewport((GLint) self.scrollPosition.x, (GLint) 0,
                   (GLint) viewPort2Width, (GLint) self.scrollbarThickness)
        //glViewport((GLint) _testpos.x, (GLint) _testpos.y, (GLint) 10, (GLint) 10)

        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_SHORT,(void *) 0)
        glColor4f(1, 1, 1, 1)
#else
        print "HScroll: glext not currently supported on Windows"
#endif


    def override resize_children (x: int, y : int, width : int, height : int)
        _totalWidth = 0.0f
        for widget in self.children
            //increment total width with each child's width
            _totalWidth += widget.size.width
            //truncate children's height if it's greater than widget's
            if widget.size.height > self.size.height
                widget.size.height = self.size.height

        //if total content width is greater than widget's width, the bar is needed
        if _totalWidth > self.size.width
            _hasBar = true
            for widget in self.children
                //reduces the children's width, if needed, to fit the scrollbar
                if widget.size.height >= self.size.height - self.scrollbarThickness
                    widget.size.height -= self.scrollbarThickness

        // Change the viewPort only if widgets total size are greater than HScroll size
        var viewPortWidth = 0.0f
        if _hasBar
            viewPortWidth = self.size.width
        else
            viewPortWidth = _totalWidth

        var viewPortHeight = 0.0f
        if _hasBar
            viewPortHeight = self.size.height - self.scrollbarThickness
        else
            viewPortHeight = self.size.height


        _viewPort = new soy.atoms.Size(viewPortWidth, viewPortHeight)

        // The width of the scroll. Determined by the scrollbar width divided by
        // the total content width. If widget width is greater or equal than
        // total content width, scroll width is 0.
        if self.size.width >= _totalWidth
            _scrollWidth = 0
        else
            _scrollWidth =  (self.size.width / _totalWidth *
                                  self.size.width)

        //print "scroll Width: %f" , _scrollWidth
        //print "total Width: %f", _totalWidth
        //print "viewport Width: %f", _viewPort.width

        //left-bottom position. in the case of hscroll, position is at (0, max_height)
        //print ("parent height %f", self.parent.height)
        self.scrollPosition.x = 0.0f
        self.scrollPosition.y = 0.0f
        //print "Bar X, Y = %f, %f", 0.0, self.size.height
        //print "Bar width x height = %.2fx%.2f", _scrollWidth, self.scrollbarThickness
        self.scrollbarSize = new soy.atoms.Size(_scrollWidth,
                                                self.scrollbarThickness)


    def override motion_handler (e: events.Motion)
        _testpos.x = (float) e.x
        _testpos.y = (float) (-e.y + self.parent.height)
        if drag
            print "e.x: %f   e.y: %f", e.x, e.y
            var offset = (float) e.x - self.xstartdrag
            self.scrollPosition.x = self.xpos_startdrag + offset

            self.scrollPosition.x = float.max(self.scrollPosition.x, 0.0f)
            self.scrollPosition.x = float.min(self.scrollPosition.x,
                                              (_viewPort.width -
                                               _scrollWidth))


    def override scroll_handler(e : events.Scroll)
        case e.direction
            when soy.ScrollDirection.Left
                self.scrollPosition.x -= 10
                self.scrollPosition.x = float.max(self.scrollPosition.x, 0.0f)
            when soy.ScrollDirection.Right
                self.scrollPosition.x += 10
                self.scrollPosition.x = float.min(self.scrollPosition.x,
                                                  (_viewPort.width -
                                                   _scrollWidth))

