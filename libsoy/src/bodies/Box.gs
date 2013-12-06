/*
 *  libsoy - soy.bodies.Box
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
    soy.atoms


class soy.bodies.Box : soy.bodies.Body
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    _vercache : array of GLfloat // copy of vertex array

    construct (position : soy.atoms.Position?, size : soy.atoms.Size?,
               material : soy.materials.Material?)
        super(position, size, 0.0f)

        // Setup for first render pass
        _ebo = 0
        _updated = true

        // Set default material
        if material is null
            if default_material is null
                default_material = new soy.materials.Material()
            _material = default_material

        // Use the provided material
        else
            _material = material


    def override create_geom (geom_param : Object?, geom_scalar : float)
        // Set default size
        _width = _height = _depth = 1.0f

        geom = new ode.geoms.Box(null, (Real) _width, (Real) _height,
                                 (Real) _depth)

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
        if density is not 0 and self.volume() != 0.0f
            mass : ode.Mass = new ode.Mass()
            mass.SetBox(density, _width, _height, _depth)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // Material Property
    _material : soy.materials.Material
    prop material : soy.materials.Material?
        get
            if _material is default_material
                return null
            return _material
        set
            mutex.lock()
            // Use default material
            if value is null
                if default_material is null
                    default_material = new soy.materials.Material()
                _material = default_material

            // Use the provided material
            else
                _material = value
            mutex.unlock()

    //
    // Radius Property
    _radius : GLfloat
    prop radius : float
        get
            return self._radius
        set
            mutex.lock()
            self._radius = value
            _updated = true
            mutex.unlock()

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
    // Collision Radius Property
    prop override readonly col_radius : float
        get
            return sqrtf(_width*_width + _height*_height + _depth*_depth)/2

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override pointDepth (x : float, y : float, z : float) : float
        return (float) ((geoms.Box) self.geom).PointDepth((Real) x, (Real) y,
                                                          (Real) z)


    // TODO modify for bisection
    def override volume ( ) : float
        return (self._width * self._height * self._depth)


    def override render ( alpha_stage : bool, camera : soy.bodies.Camera,
                          level : int )
        if alpha_stage is not self._material.translucent
            return
        
        i : int = 0
        offset : int = 0

        // save current matrix
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()

        // Lock so body can't be changed during render
        mutex.lock()

        // set modelview matrix
        self.mult_model_matrix()

        // Update ebo/vbo as needed
        if _updated
            _update_box()

        // Re-bind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11), null)
        glNormalPointer(   GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                        (GLvoid*) (sizeof(GLfloat) * 3))

        // calculate tslvs
        if _material.needsTSLVs
            calculateTSLV(_vercache)
            offset = (int) (tslvs.length * sizeof(GLfloat) * 11/3)
            glBufferSubData(GL_ARRAY_BUFFER, (GLsizei) offset,
                            (GLsizei) (tslvs.length * sizeof(GLfloat)), tslvs)

        // Render
        var r = 0
        if _radius > 0
            r = (int) (32*6+64*(ceil(_width*2)+ceil(_height*2)+ceil(_depth*2)))
        while self._material.render(i, (GLvoid*) offset)
            glDrawElements(GL_TRIANGLES, (GLsizei) (3*(8*(ceil(_width*2)*ceil(
                      _depth*2)+ceil(_width*2)*ceil(_height*2)+ceil(_height*2)*
                      ceil(_depth*2))+r)), GL_UNSIGNED_SHORT, (GLvoid*) 0)
            i += 1

        // Render axis
        renderAxis()

        // Rendering done, unlock
        mutex.unlock()

        // Restore matrix
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()


    def _update_box()
        ////////////////////////////////////////////////////////////////////
        //
        // Box Unfolding
        //
        //                    C--------A                 +y
        //                    | +z     |                 |
        //                    | |      |                 |____+x
        //                    | |___+x |                 /
        //                    |  top   |              +z/     E-------G
        //  A--------C--------E--------G--------A            /|      /|
        //  | +y     | +y     | +y     | +y     |           C-------A |
        //  | |      | |      | |      | |      |           | |     | |
        //  | |___-x | |___-z | |___+x | |___+z |           | F-----|-H
        //  |  front |  left  |  back  |  right |           |/      |/
        //  B--------D--------F--------H--------B           D-------B
        //         .          | -z     |
        //        /|\         | |      |
        //         |          | |___+x |
        //         |          | bottom |
        //      Tangent       D--------B
        //
        // Each side needs its own vertices for correct 2d texcoords.
        //
        // Cubemaps use vertex positions, while 2d textures use specified
        // (tx, ty) values for each face, but both use the same tangent values
        // for bumpmapping. As a result the box must be laid out as above
        // with 2d texcoords starting at (0,0) at lower left for each face.
        // Ie, for face CDEF, C=(0,1), D=(0,0), E=(1,1), F=(0,1)

        // on first pass
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        // calculate half values since box is centered around 0, 0, 0
        width : GLfloat = _width/2
        height : GLfloat = _height/2
        depth : GLfloat = _depth/2

        // dimensional subdivisions (every 0.5 by 0.5)
        wsub : int = (int) ceil(width*4)
        hsub : int = (int) ceil(height*4)
        dsub : int = (int) ceil(depth*4)

        // elements: 4*(total subdivided squares)
        //
        // _____
        // |\ /|
        // | X | for each square
        // |/_\|
        //
        var elenum = (int) (8*(wsub*dsub+wsub*hsub+hsub*dsub))

        // vertices: (vertices on corners of squares)+
        //                                  (total subdivided squares [centers])
        var vernum = (int) (2*((wsub+1)*(dsub+1)+(wsub+1)*(hsub+1)+(hsub+1)*(
                     dsub+1))+elenum/4)

        // add elements and vertices for rounded corners and edges
        if _radius > 0
            elenum += 32*6+64*(wsub+hsub+dsub)
            vernum += 16*6+16*(wsub*2+1+hsub*2+1+dsub*2+1)

        elements : array of GLushort = new array of GLushort[elenum*3]
        position : array of GLfloat = new array of GLfloat[vernum*3]
        normal : array of GLfloat = new array of GLfloat[vernum*3]
        texcoord : array of GLfloat = new array of GLfloat[vernum*2]
        tangent : array of GLfloat = new array of GLfloat[vernum*3]

        // generate faces
        //
        // order:
        //
        // top
        // bottom
        // front
        // back
        // right
        // left
        //
        var voffset = 0
        var eoffset = 0
        _gen_face(width, height, depth, 0, 1, 0, (GLfloat) (_radius*PI/(8*width-
                  8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*depth-8*
                  _radius+2*_radius*PI))), 0, 0, 1, eoffset, voffset, 0, 2,
                  elements, position, normal, texcoord, tangent)
        voffset += (int) ((ceil(width*4)+1)*(ceil(depth*4)+1)+ceil(width*4)*
                                                                  ceil(depth*4))
        eoffset += (int) (4*ceil(width*4)*ceil(depth*4))
        if _radius > 0
            eoffset += 32+16*(wsub+dsub)
            voffset += 16+4*(wsub*2+1+dsub*2+1)
        _gen_face(width, -height, -depth, 0, -1, 0, (GLfloat) (_radius*PI/(8*
                  width-8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*
                  depth-8*_radius+2*_radius*PI))), 0, 0, -1, eoffset, voffset, 0
                  , 2, elements, position, normal, texcoord, tangent)
        voffset += (int) ((ceil(width*4)+1)*(ceil(depth*4)+1)+ceil(width*4)*
                                                                  ceil(depth*4))
        eoffset += (int) (4*ceil(width*4)*ceil(depth*4))
        if _radius > 0
            eoffset += 32+16*(wsub+dsub)
            voffset += 16+4*(wsub*2+1+dsub*2+1)
        _gen_face(-width, height, depth, 0, 0, 1, (GLfloat) (_radius*PI/(8*width
                  -8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*height-
                  8*_radius+2*_radius*PI))), 0, 1, 0, eoffset, voffset, 0, 1,
                  elements, position, normal, texcoord, tangent)
        voffset += (int) ((ceil(width*4)+1)*(ceil(height*4)+1)+ceil(width*4)*
                                                                 ceil(height*4))
        eoffset += (int) (4*ceil(width*4)*ceil(height*4))
        if _radius > 0
            eoffset += 32+16*(wsub+hsub)
            voffset += 16+4*(wsub*2+1+hsub*2+1)
        _gen_face(width, height, -depth, 0, 0, -1, (GLfloat) (_radius*PI/(8*
                  width-8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*
                  height-8*_radius+2*_radius*PI))), 0, 1, 0, eoffset, voffset, 0
                  , 1, elements, position, normal, texcoord, tangent)
        voffset += (int) ((ceil(width*4)+1)*(ceil(height*4)+1)+ceil(width*4)*
                                                                 ceil(height*4))
        eoffset += (int) (4*ceil(width*4)*ceil(height*4))
        if _radius > 0
            eoffset += 32+16*(wsub+hsub)
            voffset += 16+4*(wsub*2+1+hsub*2+1)
        _gen_face(width, height, depth, 1, 0, 0, (GLfloat) (_radius*PI/(8*depth-
                  8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*height-8
                  *_radius+2*_radius*PI))), 0, 1, 0, eoffset, voffset, 2, 1,
                  elements, position, normal, texcoord, tangent)
        voffset += (int) ((ceil(height*4)+1)*(ceil(depth*4)+1)+ceil(height*4)*
                                                                  ceil(depth*4))
        eoffset += (int) (4*ceil(height*4)*ceil(depth*4))
        if _radius > 0
            eoffset += 32+16*(hsub+dsub)
            voffset += 16+4*(hsub*2+1+dsub*2+1)
        _gen_face(-width, height, -depth, -1, 0, 0, (GLfloat) (_radius*PI/(8*
                  depth-8*_radius+2*_radius*PI)), (GLfloat) (1-(_radius*PI/(8*
                  height-8*_radius+2*_radius*PI))), 0, 1, 0, eoffset, voffset, 2
                  , 1, elements, position, normal, texcoord, tangent)
        var vertices = packArrays(position, normal, texcoord, tangent)

        _vercache = vertices

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (3 * elenum * sizeof(
                     GLushort)), elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (15 * vernum * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false


    def _gen_face(px : float, py : float, pz : float, nx : float, ny : float,
                  nz : float, tx : float, ty : float, ux : float, uy : float,
                  uz : float, eoffset : int, voffset : int, axis1 : int,
                  axis2 : int, elements : array of GLushort,
                  position : array of GLfloat, normal : array of GLfloat,
                  texcoord : array of GLfloat, tangent : array of GLfloat)
        // px,py,pz: position of upper-left vertex (unfolded)
        // nx,ny,nz: normal
        // tx,ty: texcoord of upper-left vertex (unfolded)
        // ux,uy,uz: tangent
        // axis1 : the horizontal axis (unfolded)
        // axis2 : the vertical axis (unfolded)
        // (0 = x, 1 = y, 2 = z)
        //
        // Texcoord explanation/diagram:
        //
        // s = side
        // r = radius
        //
        //
        //         (surface area)
        //  pi*r/4      s-2r      pi*r/4
        //    ________________________
        //   |  |                  |  |
        //    ________________________
        //  ,\  |                  |  /,
        // /  \ |r                r| /  \
        // |___\|__________________|/___|
        //   r                        r
        // |____________________________|
        //               s

        // array for easier indexing with axis1/axis2
        pfarray : array of GLfloat = {px,py,pz}

        // the normal axis
        axis3 : int = 3-axis1-axis2

        // get subdivisions (every 0.5 by 0.5)
        xsub : int = (int) ceil(4*fabsf(pfarray[axis1]))
        ysub : int = (int) ceil(4*fabsf(pfarray[axis2]))

        // make tris (go around the centers of each square)
        //
        //  example:
        //
        //  0______1______2
        //   |\   /|\   /|
        //   | \ / | \ / |
        //   |  9  |  10 |
        //   | / \ | / \ |
        //  3|/___\4/___\|5
        //   |\   /|\   /|
        //   | \ / | \ / |
        //   |  11 |  12 |
        //   | / \ | / \ |
        //  6|/___\7/___\|8
        //
        // (0,9,1),(1,9,4),(4,9,3),(3,9,0), [first square]
        // (1,10,2),(2,10,5),(5,10,4),(4,10,1), [second square]
        // (3,11,4),(4,11,7),(7,11,6),(6,11,3), [third square]
        // (4,12,5),(5,12,8),(8,12,7),(7,12,4) [fourth square]

        for var i=0 to (ysub-1)
            for var j=0 to (xsub-1)
                // flat side
                elements[eoffset*3+(i*xsub+j)*12] = (GLushort) (voffset+j+i*(
                                                                        xsub+1))
                elements[eoffset*3+(i*xsub+j)*12+1] = (GLushort) (voffset+(xsub+
                                                           1)*(ysub+1)+j+i*xsub)
                elements[eoffset*3+(i*xsub+j)*12+2] = (GLushort) (voffset+j+i*(
                                                                      xsub+1)+1)
                elements[eoffset*3+(i*xsub+j)*12+3] = (GLushort) (voffset+j+i*(
                                                                      xsub+1)+1)
                elements[eoffset*3+(i*xsub+j)*12+4] = (GLushort) (voffset+(xsub+
                                                           1)*(ysub+1)+j+i*xsub)
                elements[eoffset*3+(i*xsub+j)*12+5] = (GLushort) (voffset+j+(i+1
                                                                   )*(xsub+1)+1)
                elements[eoffset*3+(i*xsub+j)*12+6] = (GLushort) (voffset+j+(i+1
                                                                   )*(xsub+1)+1)
                elements[eoffset*3+(i*xsub+j)*12+7] = (GLushort) (voffset+(xsub+
                                                           1)*(ysub+1)+j+i*xsub)
                elements[eoffset*3+(i*xsub+j)*12+8] = (GLushort) (voffset+j+(i+1
                                                                     )*(xsub+1))
                elements[eoffset*3+(i*xsub+j)*12+9] = (GLushort) (voffset+j+(i+1
                                                                     )*(xsub+1))
                elements[eoffset*3+(i*xsub+j)*12+10] = (GLushort) (voffset+(xsub
                                                          +1)*(ysub+1)+j+i*xsub)
                elements[eoffset*3+(i*xsub+j)*12+11] = (GLushort) (voffset+j+i*(
                                                                        xsub+1))

        // subtract radius from position values
        if axis1 is 0 or axis2 is 0
            px = px - (fabsf(px)/px)*_radius
        if axis1 is 1 or axis2 is 1
            py = py - (fabsf(py)/py)*_radius
        if axis1 is 2 or axis2 is 2
            pz = pz - (fabsf(pz)/pz)*_radius

        // flip position values through axes ("final locations" for vertices)
        pfarray[axis1] *= -1
        pfarray[axis2] *= -1

        for var i=0 to ysub
            for var j=0 to xsub
                // transition to "final location", prevent rounding errors
                if px != pfarray[0] and axis1 is 0
                    position[(voffset+i*(xsub+1)+j)*3] = px*-((float)j/xsub-
                                                                         0.5f)*2
                else if px != pfarray[0] and axis2 is 0
                    position[(voffset+i*(xsub+1)+j)*3] = px*-((float)i/ysub-
                                                                         0.5f)*2
                else
                    position[(voffset+i*(xsub+1)+j)*3] = px
                if py != pfarray[1] and axis1 is 1
                    position[(voffset+i*(xsub+1)+j)*3+1] = py*-((float)j/xsub-
                                                                         0.5f)*2
                else if py != pfarray[1] and axis2 is 1
                    position[(voffset+i*(xsub+1)+j)*3+1] = py*-((float)i/ysub-
                                                                         0.5f)*2
                else
                    position[(voffset+i*(xsub+1)+j)*3+1] = py
                if pz != pfarray[2] and axis1 is 2
                    position[(voffset+i*(xsub+1)+j)*3+2] = pz*-((float)j/xsub-
                                                                         0.5f)*2
                else if pz != pfarray[2] and axis2 is 2
                    position[(voffset+i*(xsub+1)+j)*3+2] = pz*-((float)i/ysub-
                                                                         0.5f)*2
                else
                    position[(voffset+i*(xsub+1)+j)*3+2] = pz
                normal[(voffset+i*(xsub+1)+j)*3] = nx
                normal[(voffset+i*(xsub+1)+j)*3+1] = ny
                normal[(voffset+i*(xsub+1)+j)*3+2] = nz
                texcoord[(voffset+i*(xsub+1)+j)*2] = (GLfloat) (tx+j*((fabsf(
                         pfarray[axis1])*4-4*_radius)/(fabsf(pfarray[axis1])*4-4
                         *_radius+PI*_radius))/xsub)
                texcoord[(voffset+i*(xsub+1)+j)*2+1] = (GLfloat) (-(ty-i*((fabsf
                          (pfarray[axis2])*4-4*_radius)/(fabsf(pfarray[axis2])*4-
                          4*_radius+PI*_radius))/ysub))+1.0f
                tangent[(voffset+i*(xsub+1)+j)*3] = ux
                tangent[(voffset+i*(xsub+1)+j)*3+1] = uy
                tangent[(voffset+i*(xsub+1)+j)*3+2] = uz
        // generate centers
        for var i=0 to (ysub-1)
            for var j=0 to (xsub-1)
                // transition to "final location", prevent rounding errors
                if px != pfarray[0] and axis1 is 0
                    position[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3] = px*-(
                                                           (j+0.5f)/xsub-0.5f)*2
                else if px != pfarray[0] and axis2 is 0
                    position[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3] = px*-(
                                                           (i+0.5f)/ysub-0.5f)*2
                else
                    position[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3] = px
                if py != pfarray[1] and axis1 is 1
                    position[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+1] = (py
                                                       *-((j+0.5f)/xsub-0.5f)*2)
                else if py != pfarray[1] and axis2 is 1
                    position[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+1] = (py
                                                       *-((i+0.5f)/ysub-0.5f)*2)
                else
                    position[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+1] = py
                if pz != pfarray[2] and axis1 is 2
                    position[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+2] = (pz
                                                       *-((j+0.5f)/xsub-0.5f)*2)
                else if pz != pfarray[2] and axis2 is 2
                    position[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+2] = (pz
                                                       *-((i+0.5f)/ysub-0.5f)*2)
                else
                    position[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+2] = pz
                normal[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3] = nx
                normal[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+1] = ny
                normal[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+2] = nz
                texcoord[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*2] = (GLfloat
                   ) (tx+(j+0.5f)*((fabsf(pfarray[axis1])*4-4*_radius)/(fabsf(
                   pfarray[axis1])*4-4*_radius+PI*_radius))/xsub)
                texcoord[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*2+1] = (GLfloat
                   ) (-(ty-(i+0.5f)*((fabsf(pfarray[axis2])*4-4*_radius)/(fabsf(
                   pfarray[axis2])*4-4*_radius+PI*_radius))/ysub))+1.0f
                tangent[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3] = ux
                tangent[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+1] = uy
                tangent[(voffset+(xsub+1)*(ysub+1)+i*xsub+j)*3+2] = uz

        if _radius > 0
            // TODO: subdivide fully
            // Note: All the for loops are here to make subdivision
            //       implementation easier.
            var reoffset = eoffset + 4*xsub*ysub
            var rvoffset = voffset + (xsub+1)*(ysub+1) + xsub*ysub
            // edge order:
            // up
            // down
            // left
            // right

            // edge faces

            // up/down
            for var i=0 to 1 // up or down
                for var j=0 to (xsub-1) // parallel to flat side
                    for var k=0 to 1 // perpendicular to flat side
                        elements[reoffset*3+k*12+j*24+i*xsub*24] = (GLushort) (
                                                rvoffset-1+k+j*2+i*2*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+i*xsub*24+1] = (GLushort
                                    ) (rvoffset+(xsub+1)*2+k+j*2+i*2*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+i*xsub*24+2] = (GLushort
                                               ) (rvoffset+k+j*2+i*2*(xsub*2+1))

                        elements[reoffset*3+k*12+j*24+i*xsub*24+3] = (GLushort
                                               ) (rvoffset+k+j*2+i*2*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+i*xsub*24+4] = (GLushort
                                    ) (rvoffset+(xsub+1)*2+k+j*2+i*2*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+i*xsub*24+5] = (GLushort
                                             ) (rvoffset+2+k+j*2+i*2*(xsub*2+1))

                        elements[reoffset*3+k*12+j*24+i*xsub*24+6] = (GLushort
                                             ) (rvoffset+2+k+j*2+i*2*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+i*xsub*24+7] = (GLushort
                                    ) (rvoffset+(xsub+1)*2+k+j*2+i*2*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+i*xsub*24+8] = (GLushort
                                             ) (rvoffset+1+k+j*2+i*2*(xsub*2+1))

                        elements[reoffset*3+k*12+j*24+i*xsub*24+9] = (GLushort
                                             ) (rvoffset+1+k+j*2+i*2*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+i*xsub*24+10] = (GLushort
                                    ) (rvoffset+(xsub+1)*2+k+j*2+i*2*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+i*xsub*24+11] = (GLushort
                                             ) (rvoffset-1+k+j*2+i*2*(xsub*2+1))

            // left/right
            for var i=0 to 1 // left or right
                for var j=0 to (ysub-1) // parallel to flat side
                    for var k=0 to 1 // perpendicular to flat side
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24] = (
                                 GLushort) (rvoffset-1+k+j*2+i*2*(ysub*2+1)+4*(
                                 xsub*2+1))
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+1] = (
                                 GLushort) (rvoffset+(ysub+1)*2+k+j*2+i*2*(ysub*
                                 2+1)+4*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+2] = (
                                 GLushort) (rvoffset+k+j*2+i*2*(ysub*2+1)+4*(
                                 xsub*2+1))
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+3] = (
                                 GLushort) (rvoffset+k+j*2+i*2*(ysub*2+1)+4*(
                                 xsub*2+1))
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+4] = (
                                 GLushort) (rvoffset+(ysub+1)*2+k+j*2+i*2*(
                                 ysub*2+1)+4*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+5] = (
                                 GLushort) (rvoffset+2+k+j*2+i*2*(ysub*2+1)+4*(
                                 xsub*2+1))
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+6] = (
                                 GLushort) (rvoffset+2+k+j*2+i*2*(ysub*2+1)+4*(
                                 xsub*2+1))
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+7] = (
                                 GLushort) (rvoffset+(ysub+1)*2+k+j*2+i*2*(ysub*
                                 2+1)+4*(xsub*2+1))
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+8] = (
                                 GLushort) (rvoffset+1+k+j*2+i*2*(ysub*2+1)+4*(
                                 xsub*2+1))
                        elements[reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+9] = (
                                 GLushort) (rvoffset+1+k+j*2+i*2*(ysub*2+1)+4*(
                                 xsub*2+1))
                        elements[(reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+10
                                 )] = (GLushort) (rvoffset+(ysub+1)*2+k+j*2+i*2*
                                 (ysub*2+1)+4*(xsub*2+1))
                        elements[(reoffset*3+k*12+j*24+2*xsub*24+i*ysub*24+11
                                 )] = (GLushort) (rvoffset-1+k+j*2+i*2*(ysub*2+1
                                 )+4*(xsub*2+1))


            // connect faces to flat side
            for var i=0 to (xsub-1)
                // top
                elements[reoffset*3+i*24] = (GLushort) (voffset+i)
                elements[reoffset*3+i*24+8] = (GLushort) (voffset+i+1)
                elements[reoffset*3+i*24+9] = (GLushort) (voffset+i+1)
                elements[reoffset*3+i*24+11] = (GLushort) (voffset+i)
                // bottom
                elements[reoffset*3+i*24+xsub*24] = (GLushort) (voffset+(xsub+1)
                                                                   *ysub+xsub-i)
                elements[reoffset*3+i*24+xsub*24+8] = (GLushort) (voffset+(xsub+
                                                               1)*ysub+xsub-i-1)
                elements[reoffset*3+i*24+xsub*24+9] = (GLushort) (voffset+(xsub+
                                                               1)*ysub+xsub-i-1)
                elements[reoffset*3+i*24+xsub*24+11] = (GLushort) (voffset+(xsub
                                                                +1)*ysub+xsub-i)

            for var i=0 to (ysub-1)
                // left
                elements[reoffset*3+i*24+2*xsub*24] = (GLushort) (voffset+(ysub-
                                                                    i)*(xsub+1))
                elements[reoffset*3+i*24+2*xsub*24+8] = (GLushort) (voffset+(
                                                             ysub-i-1)*(xsub+1))
                elements[reoffset*3+i*24+2*xsub*24+9] = (GLushort) (voffset+(
                                                             ysub-i-1)*(xsub+1))
                elements[reoffset*3+i*24+2*xsub*24+11] = (GLushort) (voffset+(
                                                               ysub-i)*(xsub+1))
                // right
                elements[reoffset*3+i*24+2*xsub*24+ysub*24] = (GLushort) (
                                                        voffset+xsub+i*(xsub+1))
                elements[reoffset*3+i*24+2*xsub*24+ysub*24+8] = (GLushort) (
                                                    voffset+xsub+(i+1)*(xsub+1))
                elements[reoffset*3+i*24+2*xsub*24+ysub*24+9] = (GLushort) (
                                                    voffset+xsub+(i+1)*(xsub+1))
                elements[reoffset*3+i*24+2*xsub*24+ysub*24+11] = (GLushort) (
                                                        voffset+xsub+i*(xsub+1))

            // edge vertices

            // top/bottom
            for var k=0 to 1 // top or bottom
                for var i=0 to xsub // parallel to flat side
                    for var j=0 to 1 // perpendicular to flat side
                        position[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3] = px
                        position[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+1] = py
                        position[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+2] = pz
                        position[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis1] *= (1-
                                                      2*((float)i/xsub))*(1-2*k)
                        position[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis2] += (
                                 position[(rvoffset+k*2*(xsub*2+1)+i*2+j)*3+
                                 axis2]/fabsf(position[(rvoffset+k*2*(xsub*2+1)+
                                 i*2+j)*3+axis2]))*_radius*(sinf((float)PI/(8-4*
                                 j)))
                        position[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis2] *= (1-
                                                                            2*k)
                        position[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis3] -= (
                                 position[(rvoffset+k*2*(xsub*2+1)+i*2+j)*3+
                                 axis3]/fabsf(position[(rvoffset+k*2*(xsub*2+1)+
                                 i*2+j)*3+axis3]))*_radius*(1-cosf((float)PI/(8-
                                 4*j)))
                        normal[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis2] = sinf((
                               float)PI/(8-4*j))*(1-2*k)*(py/fabsf(py))
                        normal[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis3] = cosf((
                               float)PI/(8-4*j))*(pz/fabsf(pz))
                        texcoord[(rvoffset+i*2+k*2*(xsub*2+1)+j)*2] = (k+(1-2*k)
                                 *((float)i/xsub)+(1-2*k)*(1-2*((float)i/xsub))*
                                 ((float)PI*_radius/(fabsf(pfarray[axis1])*8-8*
                                 _radius+2*(float)PI*_radius)))
                        texcoord[(rvoffset+i*2+k*2*(xsub*2+1)+j)*2+1] = -(1-k+(1
                                 -j)*(2*k-1)*((float)PI*_radius/(fabsf(pfarray[
                                 axis2])*16-16*_radius+4*(float)PI*_radius)))+(
                                 1.0f)
                        tangent[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3] = ux
                        tangent[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+1] = uy
                        tangent[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+2] = uz
                        tangent[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis2] = cosf(
                                (float)PI/(8-4*j))*tangent[(rvoffset+i*2+k*2*(
                                xsub*2+1)+j)*3+axis2]/fabsf(tangent[(rvoffset+i*
                                2+k*2*(xsub*2+1)+j)*3+axis2])
                        tangent[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis3] = -sinf(
                                (float)PI/(8-4*j))*normal[(rvoffset+i*2+k*2*(
                                xsub*2+1)+j)*3+axis3]/fabsf(normal[(rvoffset+i
                                *2+k*2*(xsub*2+1)+j)*3+axis3])*(1-2*k)
                // centers
                for var j=0 to (xsub-1) // parallel to flat side
                    for var i=0 to 1 // perpendicular to flat side
                        position[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3
                                 )] = (position[(rvoffset+k*2*(xsub*2+1)-1+i+j*2
                                 )*3]+position[(rvoffset+k*2*(xsub*2+1)+2+i+j*2)
                                 *3])/2
                        position[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3+1
                                 )] = (position[(rvoffset+k*2*(xsub*2+1)-1+i+j*2
                                 )*3+1]+position[(rvoffset+k*2*(xsub*2+1)+2+i+j*
                                 2)*3+1])/2
                        position[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3+2
                                 )] = (position[(rvoffset+k*2*(xsub*2+1)-1+i+j*2
                                 )*3+2]+position[(rvoffset+k*2*(xsub*2+1)+2+i+j*
                                 2)*3+2])/2
                        normal[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3+
                               axis2)] = sinf((1+2*i)*(float)PI/16)*(1-2*k)*(py/
                               fabsf(py))
                        normal[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3+
                               axis3)] = cosf((1+2*i)*(float)PI/16)*(pz/fabsf(pz
                               ))
                        texcoord[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*2
                                 )] = k+(1-2*k)*((float)(j+0.5f)/xsub)+(1-2*k)*(
                                 1-2*((float)(j+0.5f)/xsub))*((float)PI*_radius/
                                 (fabsf(pfarray[axis1])*8-8*_radius+2*(float)PI*
                                 _radius))
                        texcoord[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*2+1
                                 )] = -(1-k+(2*k-1)*((3-2*i)*(float)PI*_radius/(
                                 fabsf(pfarray[axis2])*32-32*_radius+8*(float)PI
                                 *_radius)))+1.0f
                        tangent[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3
                                                                         )] = ux
                        tangent[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3+1
                                                                         )] = uy
                        tangent[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3+2
                                                                         )] = uz
                        tangent[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3+
                                axis2)] = cosf((1+2*i)*(float)PI/16)*tangent[((
                                rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3+
                                axis2)]/fabsf(tangent[((rvoffset+k*2*(xsub*2+1)+
                                2*(xsub+1)+i+j*2)*3+axis2)])
                        tangent[((rvoffset+k*2*(xsub*2+1)+2*(xsub+1)+i+j*2)*3+
                                axis3)] = -sinf((1+2*i)*(float)PI/16)*normal[(
                                rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis3]/fabsf(
                                normal[(rvoffset+i*2+k*2*(xsub*2+1)+j)*3+axis3]
                                )*(1-2*k)
            for var i=0 to (xsub-1)
                position[(rvoffset+2*(xsub+1)+i*2)*3] = (position[(voffset+i)*3]
                                                +position[(rvoffset+2+i*2)*3])/2
                position[(rvoffset+2*(xsub+1)+i*2)*3+1] = (position[(voffset+i)*
                                          3+1]+position[(rvoffset+2+i*2)*3+1])/2
                position[(rvoffset+2*(xsub+1)+i*2)*3+2] = (position[(voffset+i)*
                                          3+2]+position[(rvoffset+2+i*2)*3+2])/2
                position[(rvoffset+1*2*(xsub*2+1)+2*(xsub+1)+i*2)*3] = (position
                         [(voffset+(xsub+1)*ysub+xsub-i)*3]+position[(rvoffset+1
                         *2*(xsub*2+1)+2+i*2)*3])/2
                position[(rvoffset+1*2*(xsub*2+1)+2*(xsub+1)+i*2)*3+1] = (
                         position[(voffset+(xsub+1)*ysub+xsub-i)*3+1]+position[(
                         rvoffset+1*2*(xsub*2+1)+2+i*2)*3+1])/2
                position[(rvoffset+1*2*(xsub*2+1)+2*(xsub+1)+i*2)*3+2] = (
                         position[(voffset+(xsub+1)*ysub+xsub-i)*3+2]+position[(
                         rvoffset+1*2*(xsub*2+1)+2+i*2)*3+2])/2
            // left/right
            for var k=0 to 1 // left or right
                for var i=0 to ysub // parallel to flat side
                    for var j=0 to 1 // perpendicular to flat side
                        position[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3
                                                                         )] = px
                        position[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3
                                                                       +1)] = py
                        position[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3
                                                                       +2)] = pz
                        position[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3
                                 +axis1)] += (position[(rvoffset+4*(xsub*2+1)+k*
                                 2*(ysub*2+1)+i*2+j)*3+axis1]/fabsf(position[(
                                 rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+i*2+j)*3+
                                 axis1]))*_radius*(sinf((float)PI/(8-4*j)))
                        position[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3
                                 +axis1)] *= 1-2*k
                        position[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3
                                 +axis2)] *= -(1-2*((float)i/ysub))*(1-2*k)
                        position[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3
                                 +axis3)] -= (position[(rvoffset+4*(xsub*2+1)+k*
                                 2*(ysub*2+1)+i*2+j)*3+axis3]/fabsf(position[(
                                 rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+i*2+j)*3+
                                 axis3]))*_radius*(1-cosf((float)PI/(8-4*j)))
                        normal[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3+
                               axis1)] = sinf((float)PI/(8-4*j))*(1-2*k)*(px/
                               fabsf(px))
                        normal[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3+
                               axis3)] = cosf((float)PI/(8-4*j))*(pz/fabsf(pz))
                        texcoord[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*2
                                 )] = k+(1-j)*(1-2*k)*((float)PI*_radius/(fabsf(
                                 pfarray[axis1])*16-16*_radius+4*(float)PI*
                                 _radius))
                        texcoord[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*2
                                 +1)] = -(k+(1-2*k)*((float)i/ysub)+(1-2*k)*(1-2
                                 *((float)i/ysub))*((float)PI*_radius/(fabsf(
                                 pfarray[axis2])*8-8*_radius+2*(float)PI*_radius
                                 )))+1.0f
                        tangent[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3
                                )] = ux
                        tangent[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3+
                                1)] = uy
                        tangent[((rvoffset+4*(xsub*2+1)+i*2+k*2*(ysub*2+1)+j)*3+
                                2)] = uz
                // centers
                for var j=0 to (ysub-1) // parallel to flat side
                    for var i=0 to 1 // perpendicular to flat side
                        position[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1
                                 )+i+j*2)*3] = (position[(rvoffset+4*(xsub*2+1)+
                                 k*2*(ysub*2+1)-1+i+j*2)*3]+position[(rvoffset+4
                                 *(xsub*2+1)+k*2*(ysub*2+1)+2+i+j*2)*3])/2
                        position[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1
                                 )+i+j*2)*3+1] = (position[(rvoffset+4*(xsub*2+1
                                 )+k*2*(ysub*2+1)-1+i+j*2)*3+1]+position[(
                                 rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2+i+j*2)*3
                                 +1])/2
                        position[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1
                                 )+i+j*2)*3+2] = (position[(rvoffset+4*(xsub*2+1
                                 )+k*2*(ysub*2+1)-1+i+j*2)*3+2]+position[(
                                 rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2+i+j*2)*3
                                 +2])/2
                        texcoord[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1
                                 )+i+j*2)*2] = k+(1-2*k)*((3-2*i)*(float)PI*
                                 _radius/(fabsf(pfarray[axis1])*32-32*_radius+8*
                                (float)PI*_radius))
                        texcoord[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1
                                 )+i+j*2)*2+1] = -(k+(1-2*k)*((float)(j+0.5f)/
                                 ysub)+(1-2*k)*(1-2*((float)(j+0.5f)/ysub))*((
                                 float) PI*_radius/(fabsf(pfarray[axis2])*8-8*
                                 _radius+2*(float)PI*_radius)))+1.0f
                        normal[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1)+
                               i+j*2)*3+axis1] = sinf((1+2*i)*(float)PI/16)*(1-2
                               *k)*(px/fabsf(px))
                        normal[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1)+
                               i+j*2)*3+axis3] = cosf((1+2*i)*(float)PI/16)*(pz/
                               fabsf(pz))
                        tangent[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1)
                                +i+j*2)*3] = ux
                        tangent[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1)
                                +i+j*2)*3+1] = uy
                        tangent[(rvoffset+4*(xsub*2+1)+k*2*(ysub*2+1)+2*(ysub+1)
                                +i+j*2)*3+2] = uz
            // fix centers next to edge
            for var i=0 to (ysub-1)
                position[(rvoffset+4*(xsub*2+1)+2*(ysub+1)+i*2)*3] = (position[(
                         voffset+(ysub-i)*(xsub+1))*3]+position[(rvoffset+4*(
                         xsub*2+1)+2+i*2)*3])/2
                position[(rvoffset+4*(xsub*2+1)+2*(ysub+1)+i*2)*3+1] = (position
                         [(voffset+(ysub-i)*(xsub+1))*3+1]+position[(rvoffset+4*
                         (xsub*2+1)+2+i*2)*3+1])/2
                position[(rvoffset+4*(xsub*2+1)+2*(ysub+1)+i*2)*3+2] = (position
                         [(voffset+(ysub-i)*(xsub+1))*3+2]+position[(rvoffset+4*
                         (xsub*2+1)+2+i*2)*3+2])/2
                position[((rvoffset+4*(xsub*2+1)+2*(ysub*2+1)+2*(ysub+1)+i*2)*3
                         )] = (position[(voffset+xsub+i*(xsub+1))*3]+position[(
                         rvoffset+4*(xsub*2+1)+2*(ysub*2+1)+2+i*2)*3])/2
                position[((rvoffset+4*(xsub*2+1)+2*(ysub*2+1)+2*(ysub+1)+i*2)*3+
                         1)] = (position[(voffset+xsub+i*(xsub+1))*3+1]+position
                         [(rvoffset+4*(xsub*2+1)+2*(ysub*2+1)+2+i*2)*3+1])/2
                position[((rvoffset+4*(xsub*2+1)+2*(ysub*2+1)+2*(ysub+1)+i*2)*3+
                         2)] = (position[(voffset+xsub+i*(xsub+1))*3+2]+position
                         [(rvoffset+4*(xsub*2+1)+2*(ysub*2+1)+2+i*2)*3+2])/2

            reoffset += 16*(xsub+ysub)
            rvoffset += 4*(xsub*2+1+ysub*2+1)

            // corner order:
            // upper-left
            // upper-right
            // lower-left
            // lower-right

            // corner faces

            // preserve vertex order by splitting up corner cases
            // upper-left, lower-right
            for var i=0 to 1
                for var j=0 to 1
                    for var k=0 to 1
                        elements[reoffset*3+k*6+j*12+i*3*24] = (GLushort) (
                                                         rvoffset+j*2+k+i*3*4-3)
                        elements[reoffset*3+k*6+j*12+i*3*24+1] = (GLushort) (
                                                         rvoffset+j*2+k+i*3*4-1)
                        elements[reoffset*3+k*6+j*12+i*3*24+2] = (GLushort) (
                                                           rvoffset+j*2+k+i*3*4)
                        elements[reoffset*3+k*6+j*12+i*3*24+3] = (GLushort) (
                                                           rvoffset+j*2+k+i*3*4)
                        elements[reoffset*3+k*6+j*12+i*3*24+4] = (GLushort) (
                                                         rvoffset+j*2+k+i*3*4-2)
                        elements[reoffset*3+k*6+j*12+i*3*24+5] = (GLushort) (
                                                         rvoffset+j*2+k+i*3*4-3)

            // upper-right, lower-left
            for var i=0 to 1
                for var j=0 to 1
                    for var k=0 to 1
                        elements[reoffset*3+k*6+j*12+(i+1)*24] = (GLushort) (
                                                       rvoffset+j*2+k+(i+1)*4-3)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+1] = (GLushort) (
                                                       rvoffset+j*2+k+(i+1)*4-2)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+2] = (GLushort) (
                                                         rvoffset+j*2+k+(i+1)*4)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+3] = (GLushort) (
                                                         rvoffset+j*2+k+(i+1)*4)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+4] = (GLushort) (
                                                       rvoffset+j*2+k+(i+1)*4-1)
                        elements[reoffset*3+k*6+j*12+(i+1)*24+5] = (GLushort) (
                                                       rvoffset+j*2+k+(i+1)*4-3)

            // connect faces to edges
            elements[reoffset*3] = (GLushort) voffset
            elements[reoffset*3+1] = (GLushort) rvoffset-4*(xsub*2+1+ysub*2+1)
            elements[reoffset*3+4] = (GLushort) rvoffset-4*(ysub*2+1)+2*ysub
            elements[reoffset*3+5] = (GLushort) voffset
            elements[reoffset*3+1*6] = (GLushort) rvoffset-4*(ysub*2+1)+2*ysub
            elements[reoffset*3+1*6+4] = (GLushort) (rvoffset-4*(ysub*2+1)+2*
                                                                         ysub+1)
            elements[reoffset*3+1*6+5] = (GLushort) rvoffset-4*(ysub*2+1)+2*ysub
            elements[reoffset*3+2*6] = (GLushort) rvoffset-4*(xsub*2+1+ysub*2+1)
            elements[reoffset*3+2*6+1] = (GLushort) rvoffset-4*(xsub*2+1+ysub*2+
                                                                            1)+1
            elements[reoffset*3+2*6+5] = (GLushort) rvoffset-4*(xsub*2+1+ysub*2+
                                                                              1)

            elements[reoffset*3+4*6] = (GLushort) (voffset+xsub)
            elements[reoffset*3+4*6+1] = (GLushort) rvoffset-2*(ysub*2+1)
            elements[reoffset*3+4*6+4] = (GLushort) rvoffset-4*(xsub*2+1+ysub*2+
                                                                       1)+2*xsub
            elements[reoffset*3+4*6+5] = (GLushort) (voffset+xsub)
            elements[reoffset*3+5*6] = (GLushort) rvoffset-2*(ysub*2+1)
            elements[reoffset*3+5*6+1] = (GLushort) rvoffset-2*(ysub*2+1)+1
            elements[reoffset*3+5*6+5] = (GLushort) rvoffset-2*(ysub*2+1)
            elements[reoffset*3+6*6] = (GLushort) rvoffset-4*(xsub*2+1+ysub*2+1
                                                                        )+2*xsub
            elements[reoffset*3+6*6+4] = (GLushort) rvoffset-4*(xsub*2+1+ysub*2+
                                                                     1)+2*xsub+1
            elements[reoffset*3+6*6+5] = (GLushort) rvoffset-4*(xsub*2+1+ysub*2+
                                                                       1)+2*xsub

            elements[reoffset*3+8*6] = (GLushort) (voffset+(xsub+1)*ysub)
            elements[reoffset*3+8*6+1] = (GLushort) rvoffset-4*(ysub*2+1)
            elements[reoffset*3+8*6+4] = (GLushort) rvoffset-4*(ysub*2+1)-2*(
                                                                xsub*2+1)+2*xsub
            elements[reoffset*3+8*6+5] = (GLushort) (voffset+(xsub+1)*ysub)
            elements[reoffset*3+9*6] = (GLushort) rvoffset-4*(ysub*2+1)
            elements[reoffset*3+9*6+1] = (GLushort) rvoffset-4*(ysub*2+1)+1
            elements[reoffset*3+9*6+5] = (GLushort) rvoffset-4*(ysub*2+1)
            elements[reoffset*3+10*6] = (GLushort) rvoffset-4*(ysub*2+1)-2*(
                                                                xsub*2+1)+2*xsub
            elements[reoffset*3+10*6+4] = (GLushort) rvoffset-4*(ysub*2+1)-2*(
                                                              xsub*2+1)+2*xsub+1
            elements[reoffset*3+10*6+5] = (GLushort) rvoffset-4*(ysub*2+1)-2*(
                                                                xsub*2+1)+2*xsub

            elements[reoffset*3+12*6] = (GLushort) (voffset+(xsub+1)*ysub+xsub)
            elements[reoffset*3+12*6+1] = (GLushort) rvoffset-4*(ysub*2+1)-2*(
                                                                       xsub*2+1)
            elements[reoffset*3+12*6+4] = (GLushort) (rvoffset-2*(ysub*2+1)+2*
                                                                           ysub)
            elements[reoffset*3+12*6+5] = (GLushort) (voffset+(xsub+1)*ysub+
                                                                           xsub)
            elements[reoffset*3+13*6] = (GLushort) rvoffset-2*(ysub*2+1)+2*ysub
            elements[reoffset*3+13*6+4] = (GLushort) (rvoffset-2*(ysub*2+1)+2*
                                                                         ysub+1)
            elements[reoffset*3+13*6+5] = (GLushort) (rvoffset-2*(ysub*2+1)+2*
                                                                           ysub)
            elements[reoffset*3+14*6] = (GLushort) rvoffset-4*(ysub*2+1)-2*(xsub
                                                                           *2+1)
            elements[reoffset*3+14*6+1] = (GLushort) rvoffset-4*(ysub*2+1)-2*(
                                                                     xsub*2+1)+1
            elements[reoffset*3+14*6+5] = (GLushort) rvoffset-4*(ysub*2+1)-2*(
                                                                       xsub*2+1)

            // TODO: generate this
            var tempa = 0.3574042230063865f
            var tempb = 0.8628582981894548f
            var tempc = 0.660402692386501f
            var tempd = 0.35740252905837294f
            tempnormal : array of float = {
            -tempa,     tempa,      tempb,
            -tempc,     tempd,      tempc,
            -tempd,     tempc,      tempc,
            -sqrtf(3)/3, sqrtf(3)/3, sqrtf(3)/3}
            tempnormalindex : array of int = {
             0,  2,  1, // axes - top/bottom
             0,  1,  2, // axes - front/back
             2,  1,  0, // axes - right/left
            -1,  1,  1, // signs - top
            -1, -1, -1, // signs - bottom
             1,  1,  1, // signs - front
            -1,  1, -1, // signs - back
             1,  1, -1, // signs - right
            -1,  1,  1} // signs - left

            // corner vertices
            for var i=0 to 1 // vertical flip over side
                for var j=0 to 1 // horizontal flip over side
                    for var k=0 to 1 // vertical in corner
                        for var l=0 to 1 // horizontal in corner
                            normalindex : int = (int) (2*fabsf(nz)+4*fabsf(nx)+(
                                              1-(fabsf(nx+ny+nz)/(nx+ny+nz)))/2)
                            position[(rvoffset+l+k*2+j*4+i*8)*3+axis1] = (
                                     position[(rvoffset-(4-2*j)*(2*ysub+1)+l)*3+
                                     axis1])
                            position[(rvoffset+l+k*2+j*4+i*8)*3+axis2] = (
                                     position[(rvoffset-(4-2*i)*(2*xsub+1)-4*(2*
                                     ysub+1)+k)*3+axis2])
                            position[(rvoffset+l+k*2+j*4+i*8)*3+axis3] = fminf(
                                     fabsf(position[(rvoffset-(4-2*j)*(2*ysub+1)
                                     +l)*3+axis3]),fabsf(position[(rvoffset-(4-2
                                     *i)*(2*xsub+1)-4*(2*ysub+1)+k)*3+axis3]))*(
                                     fabsf(position[(rvoffset-(4-2*j)*(2*ysub+1)
                                     -4*(2*ysub+1)+l)*3+axis3])/position[(
                                     rvoffset-(4-2*j)*(2*ysub+1)-4*(2*ysub+1)+l)
                                     *3+axis3])
                            normal[(rvoffset+l+k*2+j*4+i*8)*3] = (
                                   tempnormalindex[9+normalindex*3]*tempnormal[(
                                   k*2+l)*3+tempnormalindex[3*(normalindex/2)]])
                            normal[(rvoffset+l+k*2+j*4+i*8)*3+1] = (
                                   tempnormalindex[9+normalindex*3+1]*
                                   tempnormal[(k*2+l)*3+tempnormalindex[1+3*(
                                   normalindex/2)]])
                            normal[(rvoffset+l+k*2+j*4+i*8)*3+2] = (
                                   tempnormalindex[9+normalindex*3+2]*
                                   tempnormal[(k*2+l)*3+tempnormalindex[2+3*(
                                   normalindex/2)]])
                            normal[(rvoffset+l+k*2+j*4+i*8)*3+axis1] *= (1-2*j)
                            normal[(rvoffset+l+k*2+j*4+i*8)*3+axis2] *= (1-2*i)
                            texcoord[(rvoffset+l+k*2+j*4+i*8)*2] = texcoord[(
                                     rvoffset-(4-2*j)*(2*ysub+1)+l)*2]
                            texcoord[(rvoffset+l+k*2+j*4+i*8)*2+1] = texcoord[(
                                     rvoffset-(4-2*i)*(2*xsub+1)-4*(2*ysub+1)+k
                                     )*2+1]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3] = tangent[(
                                    rvoffset-4*(xsub*2+1+ysub*2+1)+i*2*(xsub*2+1
                                    )+k)*3]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3+1] = tangent[(
                                    rvoffset-4*(xsub*2+1+ysub*2+1)+i*2*(xsub*2+1
                                    )+k)*3+1]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3+2] = tangent[(
                                    rvoffset-4*(xsub*2+1+ysub*2+1)+i*2*(xsub*2+1
                                    )+k)*3+2]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3+axis1] = fabsf(
                                    tangent[(rvoffset-4*(xsub*2+1+ysub*2+1)+i*2*
                                    (xsub*2+1)+k)*3+axis3])*sinf((l+1)*(float)PI
                                    /8)*(1-2*j)*(1-2*i)*fabsf(pfarray[axis1]
                                    )/pfarray[axis1]
                            tangent[(rvoffset+l+k*2+j*4+i*8)*3+axis3] = (
                                    tangent[(rvoffset-4*(xsub*2+1+ysub*2+1)+i*2*
                                    (xsub*2+1)+k)*3+axis3]*cosf((l+1)*(float)PI/
                                    8))
