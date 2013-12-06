/*
 *  libsoy - soy.bodies.Sphere
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


class soy.bodies.Sphere : soy.bodies.Body
    _ebo : GLuint   // Element Buffer Object
    _vbo : GLuint   // Vertex Buffer Object
    _updated : bool // Buffers need updating
    _vercache : array of GLfloat // copy of vertex array

    construct (position : soy.atoms.Position?, radius : float,
               material : soy.materials.Material?)
        super(position, null, radius)

        // Set default material
        if material is null
            if default_material is null
                default_material = new soy.materials.Material()
            self.material = default_material

        // Use the provided material
        else
            self.material = material

        _updated = true


    def override create_geom (geom_param : Object?, geom_scalar : float)
        _radius = geom_scalar
        geom = new ode.geoms.Sphere(null, (Real) _radius)
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
            mass.SetSphere(density, _radius)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // Material property
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
    _radius  : GLfloat
    prop radius : float
        get
            return self._radius
        set
            if scene is not null
                soy.scenes._stepLock.writer_lock()
            self._radius = value
            ((geoms.Sphere) self.geom).SetRadius((Real) value)
            if scene is not null
                soy.scenes._stepLock.writer_unlock()
            self.set_mass (self.density)
            _updated = true

    //
    // Collision Radius Property
    prop override readonly col_radius : float
        get
            return self._radius

    ////////////////////////////////////////////////////////////////////////
    // Methods

    /*def override pointDepth(x : float, y : float, z : float) : float
        return (float) ((geoms.Sphere) self.geom).PointDepth((Real) x, (Real) y,
                                                           (Real) z)
    */

    // TODO modify for bisection
    def override volume() : float
        return (float) (4 / 3 * Math.pow(self._radius, 3) * 3.1416)


    def override render ( alpha_stage : bool, camera : soy.bodies.Camera,
                          level : int )
        if alpha_stage is not self._material.translucent
            return

        i : int = 0
        offset : int = 0

        // save current matrix
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()

        // Lock against changes during render
        mutex.lock()

        // set model's matrix
        self.mult_model_matrix()

        // Update ebo/vbo as needed
        if _updated
            _update_sphere()
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
        while self._material.render(i, (GLvoid*) offset)
            glDrawElements(GL_TRIANGLES, (GLsizei) (3*24*ceil(_radius*8)*ceil(
                      _radius*8)), GL_UNSIGNED_SHORT, (GLvoid*) 0)
            i += 1

        // Render axis
        renderAxis()

        // Release lock
        mutex.unlock()

        // Restore matrix
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()


    // TODO: textures, buffer it better
    def _update_sphere()
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        // dimensional subdivisions
        sub : int = (int) ceil(radius*8)

        // elements: 4*(total subdivided squares)
        //
        // _____
        // |\ /|
        // | X | for each square
        // |/_\|
        //
        var elenum = (int) (24*sub*sub)

        // vertices: (vertices on corners of squares)+
        //                                  (total subdivided squares [centers])
        var vernum = (int) (6*(sub+1)*(sub+1)+elenum/4)

        elements : array of GLushort = new array of GLushort[elenum*3]
        position : array of GLfloat = new array of GLfloat[vernum*3]
        normal : array of GLfloat = new array of GLfloat[vernum*3]
        texcoord : array of GLfloat = new array of GLfloat[vernum*2]
        tangent : array of GLfloat = new array of GLfloat[vernum*3]

        var radius = _radius

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
        _gen_face(radius, radius, radius, 0.625f, 0.25f, eoffset, voffset, 0, 2,
                  elements, position, normal, texcoord, tangent)
        voffset += (int) ((sub+1)*(sub+1)+sub*sub)
        eoffset += (int) (4*sub*sub)
        _gen_face(radius, -radius, -radius, 0.625f, 0.75f, eoffset, voffset, 0,
                  2, elements, position, normal, texcoord, tangent)
        voffset += (int) ((sub+1)*(sub+1)+sub*sub)
        eoffset += (int) (4*sub*sub)
        _gen_face(-radius, radius, radius, 0.125f, 0.5f, eoffset, voffset, 0, 1,
                  elements, position, normal, texcoord, tangent)
        voffset += (int) ((sub+1)*(sub+1)+sub*sub)
        eoffset += (int) (4*sub*sub)
        _gen_face(radius, radius, -radius, 0.625f, 0.5f, eoffset, voffset, 0, 1,
                  elements, position, normal, texcoord, tangent)
        voffset += (int) ((sub+1)*(sub+1)+sub*sub)
        eoffset += (int) (4*sub*sub)
        _gen_face(radius, radius, radius, 0.375f, 0.5f, eoffset, voffset, 2, 1,
                  elements, position, normal, texcoord, tangent)
        voffset += (int) ((sub+1)*(sub+1)+sub*sub)
        eoffset += (int) (4*sub*sub)
        _gen_face(-radius, radius, -radius, 0.875f, 0.5f, eoffset, voffset, 2,
                  1, elements, position, normal, texcoord, tangent)
        var vertices = packArrays(position, normal, texcoord, tangent)

        _vercache = vertices

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizei) (3 * elenum * sizeof(
                     GLushort)), elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (14 * vernum * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        // Reset updated flag
        _updated = false

    def _gen_face(px : float, py : float, pz : float, tx : float, ty : float,
                  eoffset : int, voffset : int, axis1 : int, axis2 : int,
                  elements : array of GLushort, position : array of GLfloat,
                  normal : array of GLfloat, texcoord : array of GLfloat,
                  tangent : array of GLfloat)
        // px,py,pz: position of upper-left vertex (unfolded, cubized)
        // tx,ty: texcoord of upper-left vertex (unfolded, cubized)
        // axis1 : the horizontal axis (unfolded)
        // axis2 : the vertical axis (unfolded)
        // (0 = x, 1 = y, 2 = z)

        // array for easier indexing with axis1/axis2
        pfarray : array of GLfloat = {px,py,pz}

        // the normal axis
        axis3 : int = 3-axis1-axis2

        // get subdivisions
        sub : int = (int) ceil(8*fabsf(pfarray[axis1]))

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

        for var i=0 to (sub-1)
            for var j=0 to (sub-1)
                // flat side
                elements[eoffset*3+(i*sub+j)*12] = (GLushort) (voffset+j+i*(
                                                                        sub+1))
                elements[eoffset*3+(i*sub+j)*12+1] = (GLushort) (voffset+(sub+
                                                           1)*(sub+1)+j+i*sub)
                elements[eoffset*3+(i*sub+j)*12+2] = (GLushort) (voffset+j+i*(
                                                                      sub+1)+1)
                elements[eoffset*3+(i*sub+j)*12+3] = (GLushort) (voffset+j+i*(
                                                                      sub+1)+1)
                elements[eoffset*3+(i*sub+j)*12+4] = (GLushort) (voffset+(sub+
                                                           1)*(sub+1)+j+i*sub)
                elements[eoffset*3+(i*sub+j)*12+5] = (GLushort) (voffset+j+(i+1
                                                                   )*(sub+1)+1)
                elements[eoffset*3+(i*sub+j)*12+6] = (GLushort) (voffset+j+(i+1
                                                                   )*(sub+1)+1)
                elements[eoffset*3+(i*sub+j)*12+7] = (GLushort) (voffset+(sub+
                                                           1)*(sub+1)+j+i*sub)
                elements[eoffset*3+(i*sub+j)*12+8] = (GLushort) (voffset+j+(i+1
                                                                     )*(sub+1))
                elements[eoffset*3+(i*sub+j)*12+9] = (GLushort) (voffset+j+(i+1
                                                                     )*(sub+1))
                elements[eoffset*3+(i*sub+j)*12+10] = (GLushort) (voffset+(sub
                                                          +1)*(sub+1)+j+i*sub)
                elements[eoffset*3+(i*sub+j)*12+11] = (GLushort) (voffset+j+i*(
                                                                        sub+1))

        // flip position values through axes ("final locations" for vertices)
        pfarray[axis1] *= -1
        pfarray[axis2] *= -1

        for var i=0 to sub
            for var j=0 to sub
                // transition to "final location", prevent rounding errors
                if px != pfarray[0] and axis1 is 0
                    position[(voffset+i*(sub+1)+j)*3] = px*-((float)j/sub-
                                                                         0.5f)*2
                else if px != pfarray[0] and axis2 is 0
                    position[(voffset+i*(sub+1)+j)*3] = px*-((float)i/sub-
                                                                         0.5f)*2
                else
                    position[(voffset+i*(sub+1)+j)*3] = px
                if py != pfarray[1] and axis1 is 1
                    position[(voffset+i*(sub+1)+j)*3+1] = py*-((float)j/sub-
                                                                         0.5f)*2
                else if py != pfarray[1] and axis2 is 1
                    position[(voffset+i*(sub+1)+j)*3+1] = py*-((float)i/sub-
                                                                         0.5f)*2
                else
                    position[(voffset+i*(sub+1)+j)*3+1] = py
                if pz != pfarray[2] and axis1 is 2
                    position[(voffset+i*(sub+1)+j)*3+2] = pz*-((float)j/sub-
                                                                         0.5f)*2
                else if pz != pfarray[2] and axis2 is 2
                    position[(voffset+i*(sub+1)+j)*3+2] = pz*-((float)i/sub-
                                                                         0.5f)*2
                else
                    position[(voffset+i*(sub+1)+j)*3+2] = pz
                texcoord[(voffset+i*(sub+1)+j)*2] = (GLfloat) (tx+(0.25f*j/sub-
                                                                        0.125f))
                texcoord[(voffset+i*(sub+1)+j)*2+1] = (GLfloat) (ty+(0.25f*i/sub
                                                                       -0.125f))
        // generate centers
        for var i=0 to (sub-1)
            for var j=0 to (sub-1)
                // transition to "final location", prevent rounding errors
                if px != pfarray[0] and axis1 is 0
                    position[(voffset+(sub+1)*(sub+1)+i*sub+j)*3] = px*-(
                                                           (j+0.5f)/sub-0.5f)*2
                else if px != pfarray[0] and axis2 is 0
                    position[(voffset+(sub+1)*(sub+1)+i*sub+j)*3] = px*-(
                                                           (i+0.5f)/sub-0.5f)*2
                else
                    position[(voffset+(sub+1)*(sub+1)+i*sub+j)*3] = px
                if py != pfarray[1] and axis1 is 1
                    position[(voffset+(sub+1)*(sub+1)+i*sub+j)*3+1] = (py
                                                       *-((j+0.5f)/sub-0.5f)*2)
                else if py != pfarray[1] and axis2 is 1
                    position[(voffset+(sub+1)*(sub+1)+i*sub+j)*3+1] = (py
                                                       *-((i+0.5f)/sub-0.5f)*2)
                else
                    position[(voffset+(sub+1)*(sub+1)+i*sub+j)*3+1] = py
                if pz != pfarray[2] and axis1 is 2
                    position[(voffset+(sub+1)*(sub+1)+i*sub+j)*3+2] = (pz
                                                       *-((j+0.5f)/sub-0.5f)*2)
                else if pz != pfarray[2] and axis2 is 2
                    position[(voffset+(sub+1)*(sub+1)+i*sub+j)*3+2] = (pz
                                                       *-((i+0.5f)/sub-0.5f)*2)
                else
                    position[(voffset+(sub+1)*(sub+1)+i*sub+j)*3+2] = pz
                texcoord[(voffset+(sub+1)*(sub+1)+i*sub+j)*2] = (GLfloat
                   ) (tx+(0.25f*(j+0.5f)/sub-0.125f))
                texcoord[(voffset+(sub+1)*(sub+1)+i*sub+j)*2+1] = (GLfloat
                   ) (ty+(0.25f*(i+0.5f)/sub-0.125f))

        // Cube to sphere formula from:
        // http://mathproofs.blogspot.com/2005/07/mapping-cube-to-sphere.html
        for var i=voffset to (voffset+((sub+1)*(sub+1)+sub*sub)-1)
            position[i*3] /= radius
            position[i*3+1] /= radius
            position[i*3+2] /= radius
            var tempx = position[i*3]*sqrtf(1-position[i*3+1]*position[i*3+1]/
                        2.0f-position[i*3+2]*position[i*3+2]/2.0f+position[i*3+1
                        ]*position[i*3+1]*position[i*3+2]*position[i*3+2]/3.0f)
            var tempy = position[i*3+1]*sqrtf(1-position[i*3]*position[i*3]/2.0f
                        -position[i*3+2]*position[i*3+2]/2.0f+position[i*3]*
                        position[i*3]*position[i*3+2]*position[i*3+2]/3.0f)
            var tempz = position[i*3+2]*sqrtf(1-position[i*3]*position[i*3]/2.0f
                        -position[i*3+1]*position[i*3+1]/2.0f+position[i*3]*
                        position[i*3]*position[i*3+1]*position[i*3+1]/3.0f)
            position[i*3] = tempx*radius
            position[i*3+1] = tempy*radius
            position[i*3+2] = tempz*radius
            normal[i*3] = tempx
            normal[i*3+1] = tempy
            normal[i*3+2] = tempz
            if axis3 is 1
                // top/bottom (tangent +z/-z)
                if tempz != 0
                    var sign = tempy*tempz/(fabsf(tempy)*fabsf(tempz))
                    tangent[i*3] = -sign*tempx
                    tangent[i*3+1] = -sign*tempy
                    tangent[i*3+2] = sign*(tempx*tempx+
                         tempy*tempy)/tempz
                else
                    tangent[i*3] = 0
                    tangent[i*3+1] = 0
                    tangent[i*3+2] = tempy/fabsf(tempy)
            else // sides (tangent +y)
                if tempy != 0
                    var sign = tempy/fabsf(tempy)
                    tangent[i*3] = -sign*tempx
                    tangent[i*3+1] = sign*((tempx*tempx+
                        tempz*tempz)/tempy)
                    tangent[i*3+2] = -sign*tempz
                else
                    tangent[i*3] = 0
                    tangent[i*3+1] = 1
                    tangent[i*3+2] = 0
            // normalize
            var magnitude = sqrtf((tangent[i*3]*tangent[i*3])+(tangent[i*3+1]*
                            tangent[i*3+1])+(tangent[i*3+2]*tangent[i*3+2]))
            tangent[i*3] = tangent[i*3] / magnitude
            tangent[i*3+1] = tangent[i*3+1] / magnitude
            tangent[i*3+2] = tangent[i*3+2] / magnitude
