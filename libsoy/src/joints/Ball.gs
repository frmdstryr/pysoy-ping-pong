/*
 *  libsoy - soy.joints.Ball
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
    ode
    GL
    soy.atoms
    GLib.Math


class soy.joints.Ball: soy.joints.Joint
    _jointRotThetaA : array of GLfloat
    _jointRotPhiA   : array of GLfloat
    _jointRotThetaB : array of GLfloat
    _jointRotPhiB   : array of GLfloat
    _inverseRotationA : array of GLfloat
    _inverseRotationB : array of GLfloat
    _eboA : GLuint // element buffer object
    _eboB : GLuint // element buffer object
    _vboA : GLuint // vertex buffer object
    _vboB : GLuint // vertex buffer object
    _updated : bool // do the buffers need updating?

    construct(bodyA : soy.bodies.Body, bodyB : soy.bodies.Body?,
              anchor : soy.atoms.Position, material : soy.materials.Material?)
        super(bodyA, bodyB, anchor, null, null, material)
        _updated = true


    def override gen_matrices ( )
        posA : unowned ode.Vector3 = bodyA.body.GetPosition()
        posARel : soy.atoms.Vector = new soy.atoms.Vector(
                                         anchor.x-(float)posA.x,
                                         anchor.y-(float)posA.y,
                                         anchor.z-(float)posA.z)

        radiusA : ode.Real = (ode.Real) sqrt(posARel.x*posARel.x +
                                            posARel.y*posARel.y +
                                            posARel.z*posARel.z)

        phiA   : ode.Real = (ode.Real) acos(posARel.y / radiusA)
        thetaA : ode.Real = (ode.Real) (atan2(posARel.z, posARel.x))

        _jointRotThetaA = new array of GLfloat[16]
        _jointRotPhiA   = new array of GLfloat[16]
        _inverseRotationA  = new array of GLfloat[16]
        _jointRotThetaB = new array of GLfloat[16]
        _jointRotPhiB   = new array of GLfloat[16]
        _inverseRotationB  = new array of GLfloat[16]

        _jointRotPhiA[0]  = (GLfloat) cos(phiA)
        _jointRotPhiA[1]  = (GLfloat) (-sin(phiA))
        _jointRotPhiA[2]  = (GLfloat) 0.0
        _jointRotPhiA[3]  = (GLfloat) 0.0
        _jointRotPhiA[4]  = (GLfloat) sin(phiA)
        _jointRotPhiA[5]  = (GLfloat) cos(phiA)
        _jointRotPhiA[6]  = (GLfloat) 0.0
        _jointRotPhiA[7]  = (GLfloat) 0.0
        _jointRotPhiA[8]  = (GLfloat) 0.0
        _jointRotPhiA[9]  = (GLfloat) 0.0
        _jointRotPhiA[10] = (GLfloat) 1.0
        _jointRotPhiA[11] = (GLfloat) 0.0
        _jointRotPhiA[12] = (GLfloat) 0.0
        _jointRotPhiA[13] = (GLfloat) 0.0
        _jointRotPhiA[14] = (GLfloat) 0.0
        _jointRotPhiA[15] = (GLfloat) 1.0

        _jointRotThetaA[0]  = (GLfloat) cos(thetaA)
        _jointRotThetaA[1]  = (GLfloat) 0.0
        _jointRotThetaA[2]  = (GLfloat) sin(thetaA)
        _jointRotThetaA[3]  = (GLfloat) 0.0
        _jointRotThetaA[4]  = (GLfloat) 0.0
        _jointRotThetaA[5]  = (GLfloat) 1.0
        _jointRotThetaA[6]  = (GLfloat) 0.0
        _jointRotThetaA[7]  = (GLfloat) 0.0
        _jointRotThetaA[8]  = (GLfloat) (-sin(thetaA))
        _jointRotThetaA[9]  = (GLfloat) 0.0
        _jointRotThetaA[10] = (GLfloat) cos(thetaA)
        _jointRotThetaA[11] = (GLfloat) 0.0
        _jointRotThetaA[12] = (GLfloat) 0.0
        _jointRotThetaA[13] = (GLfloat) 0.0
        _jointRotThetaA[14] = (GLfloat) 0.0
        _jointRotThetaA[15] = (GLfloat) 1.0

        rotationA : unowned ode.Matrix3 = bodyA.body.GetRotation()
        _inverseRotationA[0] = (GLfloat) rotationA.m0
        _inverseRotationA[1] = (GLfloat) rotationA.m1
        _inverseRotationA[2] = (GLfloat) rotationA.m2
        _inverseRotationA[3] = (GLfloat) 0.0
        _inverseRotationA[4] = (GLfloat) rotationA.m4
        _inverseRotationA[5] = (GLfloat) rotationA.m5
        _inverseRotationA[6] = (GLfloat) rotationA.m6
        _inverseRotationA[7] = (GLfloat) 0.0
        _inverseRotationA[8] = (GLfloat) rotationA.m8
        _inverseRotationA[9] = (GLfloat) rotationA.m9
        _inverseRotationA[10] = (GLfloat) rotationA.ma
        _inverseRotationA[11] = (GLfloat) 0.0
        _inverseRotationA[12] = (GLfloat) 0.0
        _inverseRotationA[13] = (GLfloat) 0.0
        _inverseRotationA[14] = (GLfloat) 0.0
        _inverseRotationA[15] = (GLfloat) 1.0

        if bodyB is not null
            posB : unowned ode.Vector3 = bodyB.body.GetPosition()
            posBRel : soy.atoms.Vector = new soy.atoms.Vector(
                                             anchor.x-(float)posB.x,
                                             anchor.y-(float)posB.y,
                                             anchor.z-(float)posB.z)

            radiusB : ode.Real = (ode.Real) sqrt(posBRel.x*posBRel.x +
                                                posBRel.y*posBRel.y +
                                                posBRel.z*posBRel.z)

            phiB   : ode.Real = (ode.Real) acos(posBRel.y / radiusB)
            thetaB : ode.Real = (ode.Real) (atan2(posBRel.z, posBRel.x))

            _jointRotPhiB[0]  = (GLfloat) cos(phiB)
            _jointRotPhiB[1]  = (GLfloat) (-sin(phiB))
            _jointRotPhiB[2]  = (GLfloat) 0.0
            _jointRotPhiB[3]  = (GLfloat) 0.0
            _jointRotPhiB[4]  = (GLfloat) sin(phiB)
            _jointRotPhiB[5]  = (GLfloat) cos(phiB)
            _jointRotPhiB[6]  = (GLfloat) 0.0
            _jointRotPhiB[7]  = (GLfloat) 0.0
            _jointRotPhiB[8]  = (GLfloat) 0.0
            _jointRotPhiB[9]  = (GLfloat) 0.0
            _jointRotPhiB[10] = (GLfloat) 1.0
            _jointRotPhiB[11] = (GLfloat) 0.0
            _jointRotPhiB[12] = (GLfloat) 0.0
            _jointRotPhiB[13] = (GLfloat) 0.0
            _jointRotPhiB[14] = (GLfloat) 0.0
            _jointRotPhiB[15] = (GLfloat) 1.0

            _jointRotThetaB[0]  = (GLfloat) cos(thetaB)
            _jointRotThetaB[1]  = (GLfloat) 0.0
            _jointRotThetaB[2]  = (GLfloat) sin(thetaB)
            _jointRotThetaB[3]  = (GLfloat) 0.0
            _jointRotThetaB[4]  = (GLfloat) 0.0
            _jointRotThetaB[5]  = (GLfloat) 1.0
            _jointRotThetaB[6]  = (GLfloat) 0.0
            _jointRotThetaB[7]  = (GLfloat) 0.0
            _jointRotThetaB[8]  = (GLfloat) (-sin(thetaB))
            _jointRotThetaB[9]  = (GLfloat) 0.0
            _jointRotThetaB[10] = (GLfloat) cos(thetaB)
            _jointRotThetaB[11] = (GLfloat) 0.0
            _jointRotThetaB[12] = (GLfloat) 0.0
            _jointRotThetaB[13] = (GLfloat) 0.0
            _jointRotThetaB[14] = (GLfloat) 0.0
            _jointRotThetaB[15] = (GLfloat) 1.0

            rotationB : unowned ode.Matrix3 = bodyB.body.GetRotation()
            _inverseRotationB[0] = (GLfloat) rotationB.m0
            _inverseRotationB[1] = (GLfloat) rotationB.m1
            _inverseRotationB[2] = (GLfloat) rotationB.m2
            _inverseRotationB[3] = (GLfloat) 0.0
            _inverseRotationB[4] = (GLfloat) rotationB.m4
            _inverseRotationB[5] = (GLfloat) rotationB.m5
            _inverseRotationB[6] = (GLfloat) rotationB.m6
            _inverseRotationB[7] = (GLfloat) 0.0
            _inverseRotationB[8] = (GLfloat) rotationB.m8
            _inverseRotationB[9] = (GLfloat) rotationB.m9
            _inverseRotationB[10] = (GLfloat) rotationB.ma
            _inverseRotationB[11] = (GLfloat) 0.0
            _inverseRotationB[12] = (GLfloat) 0.0
            _inverseRotationB[13] = (GLfloat) 0.0
            _inverseRotationB[14] = (GLfloat) 0.0
            _inverseRotationB[15] = (GLfloat) 1.0


    def override create ( )
        joint = new ode.joints.Ball(soy.scenes._world, null)


    def override setup (anchor : soy.atoms.Position?, axis1 : soy.atoms.Axis?,
                        axis2 : soy.atoms.Axis?)
        ((ode.joints.Ball) joint).SetAnchor((ode.Real) anchor.x,
                                            (ode.Real) anchor.y,
                                            (ode.Real) anchor.z)


    def override mult_model_matrix_A ( )
        var _mtx = new array of GLfloat[16]
        rotationA : unowned ode.Matrix3 = bodyA.body.GetRotation()
        positionA : unowned ode.Vector3 = bodyA.body.GetPosition()

        _mtx[0]  = (GLfloat) rotationA.m0
        _mtx[1]  = (GLfloat) rotationA.m4
        _mtx[2]  = (GLfloat) rotationA.m8
        _mtx[3]  = (GLfloat) 0.0
        _mtx[4]  = (GLfloat) rotationA.m1
        _mtx[5]  = (GLfloat) rotationA.m5
        _mtx[6]  = (GLfloat) rotationA.m9
        _mtx[7]  = (GLfloat) 0.0
        _mtx[8]  = (GLfloat) rotationA.m2
        _mtx[9]  = (GLfloat) rotationA.m6
        _mtx[10] = (GLfloat) rotationA.ma
        _mtx[11] = (GLfloat) 0.0
        _mtx[12] = (GLfloat) positionA.x
        _mtx[13] = (GLfloat) positionA.y
        _mtx[14] = (GLfloat) positionA.z
        _mtx[15] = (GLfloat) 1.0

        glMultMatrixf(_mtx)
        glMultMatrixf(_inverseRotationA)
        glMultMatrixf(_jointRotThetaA)
        glMultMatrixf(_jointRotPhiA)


    def override mult_model_matrix_B( )
        var _mtx = new array of GLfloat[16]
        rotationB : unowned ode.Matrix3 = bodyB.body.GetRotation()
        positionB : unowned ode.Vector3 = bodyB.body.GetPosition()

        _mtx[0]  = (GLfloat) rotationB.m0
        _mtx[1]  = (GLfloat) rotationB.m4
        _mtx[2]  = (GLfloat) rotationB.m8
        _mtx[3]  = (GLfloat) 0.0
        _mtx[4]  = (GLfloat) rotationB.m1
        _mtx[5]  = (GLfloat) rotationB.m5
        _mtx[6]  = (GLfloat) rotationB.m9
        _mtx[7]  = (GLfloat) 0.0
        _mtx[8]  = (GLfloat) rotationB.m2
        _mtx[9]  = (GLfloat) rotationB.m6
        _mtx[10] = (GLfloat) rotationB.ma
        _mtx[11] = (GLfloat) 0.0
        _mtx[12] = (GLfloat) positionB.x
        _mtx[13] = (GLfloat) positionB.y
        _mtx[14] = (GLfloat) positionB.z
        _mtx[15] = (GLfloat) 1.0

        glMultMatrixf(_mtx)
        glMultMatrixf(_inverseRotationB)
        glMultMatrixf(_jointRotThetaB)
        glMultMatrixf(_jointRotPhiB)


    def override render ( )
        i : int = 0

        // Do not render when material is not set
        if self.material is null
            return

        // save current matrix
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()

        // lock so cant be changed during a render
        mutex.lock()

        // update ebo/vbo if its needed
        if _updated
            _update_joint_A()

        // rebind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _eboA)
            glBindBuffer(GL_ARRAY_BUFFER, _vboA)

        // render part A
        self.mult_model_matrix_A()

        glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11), null)
        glNormalPointer(   GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                        (GLvoid*) (sizeof(GLfloat) * 3))

        while self.material.render(i, null)
            glDrawElements(GL_TRIANGLES, (GLsizei) (25 * (1 + 2*22) * 3),
                           GL_UNSIGNED_SHORT, null)
            i += 1

        // reset matrix
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()
        glPushMatrix()

        if bodyB is not null
            // update ebo/vbo if its needed
            if _updated
                _update_joint_B()

            // rebind buffers when not updating
            else
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _eboB)
                glBindBuffer(GL_ARRAY_BUFFER, _vboB)

            // render part B
            self.mult_model_matrix_B()

            glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11), null)
            glNormalPointer(   GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                            (GLvoid*) (sizeof(GLfloat) * 3))

            i = 0

            while self.material.render(i, null)
                glDrawElements(GL_TRIANGLES, (GLsizei) (25 * (3 + 4*16) * 3),
                               GL_UNSIGNED_SHORT, null)
                i += 1

        // unlock mutex for writing, rendering done
        mutex.unlock()

        // restore matrix
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()


    def _update_joint_A()
        // on the first pass
        if _eboA == 0
            glGenBuffers(1, out _eboA)
            glGenBuffers(1, out _vboA)

        posA : soy.atoms.Position = bodyA.position

        // constants to help drawing
        rb : GLfloat = 0.41f   // radius of ball
        rs : GLfloat = 0.25f   // radius of stick
        slices : GLint = 25 // number of slices
        stacks : GLint = 22 // number of stacks

        // distance in y-axis is yl
        yl : GLfloat = sqrtf((posA.x - anchor.x) * (posA.x - anchor.x) +
                              (posA.y - anchor.y) * (posA.y - anchor.y) +
                              (posA.z - anchor.z) * (posA.z - anchor.z))

        elements : array of GLushort = new array of GLushort[(
                                                        slices*(1+stacks*2))*3]
        vertices : array of GLfloat = new array of GLfloat[(
                                                        slices*(1+stacks)+1)*11]

        // cylinder faces
        for var i=0 to (slices-1)
            vertices[(i*2)*11] = rs * sinf(2*i*(float)PI/slices)
            vertices[(i*2)*11+1] = 0.0f
            vertices[(i*2)*11+2] = rs * cosf(2*i*(float)PI/slices)
            vertices[(i*2)*11+3] = sinf(2*i*(float)PI/slices)
            vertices[(i*2)*11+4] = 0.0f
            vertices[(i*2)*11+5] = cosf(2*i*(float)PI/slices)
            vertices[(i*2)*11+6] = -i/(float)(slices-1)+1
            vertices[(i*2)*11+7] = 0.0f
            vertices[(i*2)*11+8] = 0.0f
            vertices[(i*2)*11+9] = 1.0f
            vertices[(i*2)*11+10] = 0.0f
            vertices[(i*2+1)*11] = rs * sinf(2*i*(float)PI/slices)
            vertices[(i*2+1)*11+1] = yl-sqrtf(rb*rb-rs*rs)
            vertices[(i*2+1)*11+2] = rs * cosf(2*i*(float)PI/slices)
            vertices[(i*2+1)*11+3] = sinf(2*i*(float)PI/slices)
            vertices[(i*2+1)*11+4] = 0.0f
            vertices[(i*2+1)*11+5] = cosf(2*i*(float)PI/slices)
            vertices[(i*2+1)*11+6] = -i/(float)(slices-1)+1
            vertices[(i*2+1)*11+7] = 0.25f
            vertices[(i*2+1)*11+8] = 0.0f
            vertices[(i*2+1)*11+9] = 1.0f
            vertices[(i*2+1)*11+10] = 0.0f
            elements[(i*2)*3] = i*2
            elements[(i*2)*3+1] = i*2+3
            elements[(i*2)*3+2] = i*2+1
            elements[(i*2)*3+3] = i*2+3
            elements[(i*2)*3+4] = i*2
            elements[(i*2)*3+5] = i*2+2

        // complete edge loop
        elements[(2*slices-2)*3+1] = 1
        elements[(2*slices-2)*3+3] = 1
        elements[(2*slices-2)*3+5] = 0

        // sphere
        var angle = (float)PI-asinf(rs/rb)
        for var j=0 to (stacks-1)
            // ring of vertices for stacks
            if j is not 0 // don't generate vertices for first ring
                for var i=0 to (slices-1)
                    vertices[((j+1)*slices+i)*11] = (
                            rb*sinf(angle*(1-(float)j/stacks))*
                            sinf(2*(float)PI*i/slices))
                    vertices[((j+1)*slices+i)*11+1] = yl+rb*cosf(angle*(
                                                      1-(float)j/stacks))
                    vertices[((j+1)*slices+i)*11+2] = (
                            rb*sinf(angle*(1-(float)j/stacks))*
                            cosf(2*(float)PI*i/slices))
                    vertices[((j+1)*slices+i)*11+3] = (
                            sinf(angle*(1-(float)j/stacks))*
                            sinf(2*(float)PI*i/slices))
                    vertices[((j+1)*slices+i)*11+4] = (cosf(angle*(1-(
                                                      float)j/stacks)))
                    vertices[((j+1)*slices+i)*11+5] = (
                            sinf(angle*(1-(float)j/stacks))*
                            cosf(2*(float)PI*i/slices))
                    vertices[((j+1)*slices+i)*11+6] = -i/(float)(slices-1)+1
                    vertices[((j+1)*slices+i)*11+7] = 0.25f+0.25f*(i+1)/slices
                    if vertices[((j+1)*slices+i)*11+1] != 0
                        var sign = vertices[((j+1)*slices+i)*11+4]/fabsf(
                                            vertices[((j+1)*slices+i)*11+4])
                        vertices[((j+1)*slices+i)*11+8] = -sign*vertices[((
                                                          j+1)*slices+i)*11+3]
                        vertices[((j+1)*slices+i)*11+9] = sign*((vertices[(
                                           (j+1)*slices+i)*11+3]*vertices[(
                                           (j+1)*slices+i)*11+3]+vertices[(
                                           (j+1)*slices+i)*11+5]*vertices[(
                                           (j+1)*slices+i)*11+5])/vertices[(
                                           (j+1)*slices+i)*11+4])
                        vertices[((j+1)*slices+i)*11+10] = -sign*vertices[((
                                                           j+1)*slices+i)*11+5]
                    else
                        vertices[((j+1)*slices+i)*11+8] = 0
                        vertices[((j+1)*slices+i)*11+9] = 1
                        vertices[((j+1)*slices+i)*11+10] = 0
                    var length = sqrtf((vertices[(
                                 (j+1)*slices+i)*11+8]*vertices[(
                                 (j+1)*slices+i)*11+8])+(vertices[(
                                 (j+1)*slices+i)*11+9]*vertices[(
                                 (j+1)*slices+i)*11+9])+(vertices[(
                                 (j+1)*slices+i)*11+10]*vertices[(
                                 (j+1)*slices+i)*11+10]))
                    vertices[i*11+8] /= length
                    vertices[i*11+9] /= length
                    vertices[i*11+10] /= length

            // triangles of stack
            if j is not (stacks-1) // don't generate triangles for the cap stack
                for var i=0 to (slices-1)
                    elements[(slices*2+j*slices*2+2*i)*3] = i+slices*(1+j)
                    elements[(slices*2+j*slices*2+2*i)*3+1] = i+1+slices*(1+j+1)
                    elements[(slices*2+j*slices*2+2*i)*3+2] = i+slices*(1+j+1)
                    elements[(slices*2+j*slices*2+2*i)*3+3] = i+1+slices*(1+j+1)
                    elements[(slices*2+j*slices*2+2*i)*3+4] = (
                            i+slices*(1+j))
                    elements[(slices*2+j*slices*2+2*i)*3+5] = (
                            i+1+slices*(1+j))

                // fix loop
                elements[(slices*2+j*slices*2+2*(slices-1))*3+1] = (GLushort) (
                        slices*(j+1)+slices)
                elements[(slices*2+j*slices*2+2*(slices-1))*3+3] = (GLushort) (
                        slices*(j+1)+slices)
                elements[(slices*2+j*slices*2+2*(slices-1))*3+5] = (GLushort) (
                        slices*j+slices)

        // cap vertex
        vertices[slices*(1+stacks)*11] = 0.0f
        vertices[slices*(1+stacks)*11+1] = yl+rb
        vertices[slices*(1+stacks)*11+2] = 0.0f
        vertices[slices*(1+stacks)*11+3] = 0.0f
        vertices[slices*(1+stacks)*11+4] = 1.0f
        vertices[slices*(1+stacks)*11+5] = 0.0f
        vertices[slices*(1+stacks)*11+6] = 0.5f
        vertices[slices*(1+stacks)*11+7] = 0.5f

        // cap faces
        for var i=0 to (slices-1)
            elements[(slices*(stacks*2)+i)*3] = i+1+slices*stacks
            elements[(slices*(stacks*2)+i)*3+1] = 0+slices*(stacks+1)
            elements[(slices*(stacks*2)+i)*3+2] = i+slices*stacks

        // fix loop
        elements[(slices*(stacks*2+1)-1)*3] = 0+slices*stacks

        // connect to cylinder
        for var i=0 to (slices-1)
            elements[(slices*2+2*i)*3] = 1+i*2
            elements[(slices*2+2*i)*3+4] = 1+i*2
            elements[(slices*2+2*i)*3+5] = 3+i*2

        // fix loop
        elements[(slices*4-2)*3+5] = 1

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _eboA)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                     (GLsizei) (slices * (1 + 2 * stacks) * 3 *
                     sizeof(GLushort)), elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vboA)
        glBufferData(GL_ARRAY_BUFFER,
                     (GLsizei) ((slices * (1 + stacks) + 1) * 11 *
                     sizeof(GLfloat)), vertices, GL_STATIC_DRAW)


    def _update_joint_B ( )
        // on the first pass
        if _eboB == 0
            glGenBuffers(1, out _eboB)
            glGenBuffers(1, out _vboB)

        posB : soy.atoms.Position = bodyB.position

        // constants to help drawing
        ro : GLfloat = 0.5f   // radius of outer shell
        ri : GLfloat = 0.44f   // radius of inner shell
        rs : GLfloat = 0.25f   // radius of stick
        slices : GLint = 25 // number of slices
        stacks : GLint = 16 // number of stacks

        // distance in y-axis is yl
        yl : GLfloat = sqrtf((posB.x - anchor.x) * (posB.x - anchor.x) +
                              (posB.y - anchor.y) * (posB.y - anchor.y) +
                              (posB.z - anchor.z) * (posB.z - anchor.z))

        elements : array of GLushort = new array of GLushort[(
                                                      slices*(3+stacks*4))*3]
        vertices : array of GLfloat = new array of GLfloat[(
                                                      slices*(2+2*stacks)+1)*11]

        // cylinder faces
        for var i=0 to (slices-1)
            vertices[(i*2)*11] = rs * sinf(2*i*(float)PI/slices)
            vertices[(i*2)*11+1] = 0.0f
            vertices[(i*2)*11+2] = rs * cosf(2*i*(float)PI/slices)
            vertices[(i*2)*11+3] = sinf(2*i*(float)PI/slices)
            vertices[(i*2)*11+4] = 0.0f
            vertices[(i*2)*11+5] = cosf(2*i*(float)PI/slices)
            vertices[(i*2)*11+6] = -i/(float)(slices-1)+1
            vertices[(i*2)*11+7] = 0.75f
            vertices[(i*2)*11+8] = 0.0f
            vertices[(i*2)*11+9] = 1.0f
            vertices[(i*2)*11+10] = 0.0f
            vertices[(i*2+1)*11] = rs * sinf(2*i*(float)PI/slices)
            vertices[(i*2+1)*11+1] = yl-(ro*sqrtf(3)/2)
            vertices[(i*2+1)*11+2] = rs * cosf(2*i*(float)PI/slices)
            vertices[(i*2+1)*11+3] = sinf(2*i*(float)PI/slices)
            vertices[(i*2+1)*11+4] = 0.0f
            vertices[(i*2+1)*11+5] = cosf(2*i*(float)PI/slices)
            vertices[(i*2+1)*11+6] = -i/(float)(slices-1)+1
            vertices[(i*2+1)*11+7] = 1.0f
            vertices[(i*2+1)*11+8] = 0.0f
            vertices[(i*2+1)*11+9] = 1.0f
            vertices[(i*2+1)*11+10] = 0.0f
            elements[(i*2)*3] = i*2
            elements[(i*2)*3+1] = i*2+3
            elements[(i*2)*3+2] = i*2+1
            elements[(i*2)*3+3] = i*2+3
            elements[(i*2)*3+4] = i*2
            elements[(i*2)*3+5] = i*2+2

        // complete edge loop
        elements[(2*slices-2)*3+1] = 1
        elements[(2*slices-2)*3+3] = 1
        elements[(2*slices-2)*3+5] = 0

        // outer shell
        for var j=0 to (stacks-1)

            // ring of vertices for stacks
            for var i=1 to slices
                vertices[(slices*2+j*slices+i-1)*11] = (
                        ro*cosf((j/(stacks*3.0f))*(float)PI)*
                        sinf(2*(float)PI*i/slices))
                vertices[(slices*2+j*slices+i-1)*11+1] = yl-ro*sinf((j/(
                         stacks*3.0f))*(float)PI)
                vertices[(slices*2+j*slices+i-1)*11+2] = (
                        ro*cosf((j/(stacks*3.0f))*(float)PI)*
                        cosf(2*(float)PI*i/slices))
                vertices[(slices*2+j*slices+i-1)*11+3] = (
                        cosf((j/(stacks*3.0f))*(float)PI)*
                        sinf(2*(float)PI*i/slices))
                vertices[(slices*2+j*slices+i-1)*11+4] = (-sinf((
                         j/(stacks*3.0f))*(float)PI))
                vertices[(slices*2+j*slices+i-1)*11+5] = (
                        cosf((j/(stacks*3.0f))*(float)PI)*
                        cosf(2*(float)PI*i/slices))
                vertices[(slices*2+j*slices+i-1)*11+6] = -i/(float)(slices-1)+1
                vertices[(slices*2+j*slices+i-1)*11+7] = 0.5f+0.125f*i/slices
                if vertices[(slices*2+j*slices+i-1)*11+1] != 0
                    var sign = -vertices[(slices*2+j*slices+i-1)*11+4]/fabsf(
                                         vertices[(slices*2+j*slices+i-1)*11+4])
                    vertices[(slices*2+j*slices+i-1)*11+8] = -sign*vertices[(
                                                    slices*2+j*slices+i-1)*11+3]
                    vertices[(slices*2+j*slices+i-1)*11+9] = sign*((
                                         vertices[(slices*2+j*slices+i-1)*11+3]*
                                         vertices[(slices*2+j*slices+i-1)*11+3]+
                                         vertices[(slices*2+j*slices+i-1)*11+5]*
                                         vertices[(slices*2+j*slices+i-1)*11+5])
                                        /vertices[(slices*2+j*slices+i-1)*11+4])
                    vertices[(slices*2+j*slices+i-1)*11+10] = -sign*vertices[(
                                                    slices*2+j*slices+i-1)*11+5]
                else
                    vertices[(slices*2+j*slices+i-1)*11+8] = 0
                    vertices[(slices*2+j*slices+i-1)*11+9] = -1
                    vertices[(slices*2+j*slices+i-1)*11+10] = 0
                var length = sqrtf((vertices[(
                             (j+1)*slices+i)*11+8]*vertices[(
                             (j+1)*slices+i)*11+8])+(vertices[(
                             (j+1)*slices+i)*11+9]*vertices[(
                             (j+1)*slices+i)*11+9])+(vertices[(
                             (j+1)*slices+i)*11+10]*vertices[(
                             (j+1)*slices+i)*11+10]))
                vertices[i*11+8] /= length
                vertices[i*11+9] /= length
                vertices[i*11+10] /= length
            // triangles of stack
            for var i=0 to (slices-1)
                elements[(slices*2+j*slices*2+2*i)*3] = i+slices*(2+j)
                elements[(slices*2+j*slices*2+2*i)*3+1] = i+slices*(2+j+1)
                elements[(slices*2+j*slices*2+2*i)*3+2] = i+1+slices*(2+j+1)
                elements[(slices*2+j*slices*2+2*i)*3+3] = i+1+slices*(2+j+1)
                elements[(slices*2+j*slices*2+2*i)*3+4] = (
                        i+1+slices*(2+j))
                elements[(slices*2+j*slices*2+2*i)*3+5] = (
                        i+slices*(2+j))

            // fix loop
            elements[(slices*2+j*slices*2+2*(slices-1))*3+2] = (GLushort) (
                    slices*(j+2)+slices)
            elements[(slices*2+j*slices*2+2*(slices-1))*3+3] = (GLushort) (
                    slices*(j+2)+slices)
            elements[(slices*2+j*slices*2+2*(slices-1))*3+4] = (GLushort) (
                    slices*(j+1)+slices)

        // connect to cylinder
        for var i=0 to (slices-1)
            elements[(slices*(2*stacks)+2*i)*3+1] = 1+i*2
            elements[(slices*(2*stacks)+2*i)*3+2] = 3+i*2
            elements[(slices*(2*stacks)+2*i)*3+3] = 3+i*2

        // fix loop
        elements[(slices*(2*stacks)+2*(slices-1))*3+2] = 1
        elements[(slices*(2*stacks)+2*(slices-1))*3+3] = 1

        // inner shell
        // NOTE: This is just a scaling of the outer shell, so it's missing a
        // little bit of its bottom (it's closed, though). It's okay, because
        // it'll be obscured by part A's sphere.
        for var j=0 to (stacks-1)
            // ring of vertices for stacks
            for var i=1 to slices
                vertices[(slices*(2+stacks)+j*slices+i-1)*11] = (
                        ri*cosf((j/(stacks*3.0f))*(float)PI)*
                        sinf(2*(float)PI*i/slices))
                vertices[(slices*(2+stacks)+j*slices+i-1)*11+1] = yl-ri*sinf((j/
                         (stacks*3.0f))*(float)PI)
                vertices[(slices*(2+stacks)+j*slices+i-1)*11+2] = (
                        ri*cosf((j/(stacks*3.0f))*(float)PI)*
                        cosf(2*(float)PI*i/slices))
                vertices[(slices*(2+stacks)+j*slices+i-1)*11+3] = (
                        -cosf((j/(stacks*3.0f))*(float)PI)*
                        sinf(2*(float)PI*i/slices))
                vertices[(slices*(2+stacks)+j*slices+i-1)*11+4] = (sinf((
                         j/(stacks*3.0f))*(float)PI))
                vertices[(slices*(2+stacks)+j*slices+i-1)*11+5] = (
                        -cosf((j/(stacks*3.0f))*(float)PI)*
                        cosf(2*(float)PI*i/slices))
                vertices[(slices*(2+stacks)+j*slices+i-1)*11+6] = -i/(float)(
                                                                     slices-1)+1
                vertices[(slices*(2+stacks)+j*slices+i-1)*11+7] = (0.625f+0.125f
                                                                      *i/slices)
                if vertices[(slices*(2+stacks)+j*slices+i-1)*11+1] != 0
                    var sign = vertices[(slices*(2+stacks)+j*slices+i-1
                               )*11+4]/fabsf(vertices[(slices*(2+stacks)+j*
                               slices+i-1)*11+4])
                    vertices[(slices*(2+stacks)+j*slices+i-1)*11+8] = (-sign*
                                vertices[(slices*(2+stacks)+j*slices+i-1)*11+3])
                    vertices[(slices*(2+stacks)+j*slices+i-1)*11+9] = sign*((
                                vertices[(slices*(2+stacks)+j*slices+i-1)*11+3]*
                                vertices[(slices*(2+stacks)+j*slices+i-1)*11+3]+
                                vertices[(slices*(2+stacks)+j*slices+i-1)*11+5]*
                                vertices[(slices*(2+stacks)+j*slices+i-1)*11+5])
                               /vertices[(slices*(2+stacks)+j*slices+i-1)*11+4])
                    vertices[(slices*(2+stacks)+j*slices+i-1)*11+10] = (-sign*
                                vertices[(slices*(2+stacks)+j*slices+i-1)*11+5])
                else
                    vertices[(slices*(2+stacks)+j*slices+i-1)*11+8] = 0
                    vertices[(slices*(2+stacks)+j*slices+i-1)*11+9] = 1
                    vertices[(slices*(2+stacks)+j*slices+i-1)*11+10] = 0
                var length = sqrtf((vertices[(
                             (j+1)*slices+i)*11+8]*vertices[(
                             (j+1)*slices+i)*11+8])+(vertices[(
                             (j+1)*slices+i)*11+9]*vertices[(
                             (j+1)*slices+i)*11+9])+(vertices[(
                             (j+1)*slices+i)*11+10]*vertices[(
                             (j+1)*slices+i)*11+10]))
                vertices[i*11+8] /= length
                vertices[i*11+9] /= length
                vertices[i*11+10] /= length
            // don't create the triangles for the last stack, that's for the cap
            if j is not (stacks-1)
                // triangles of stack
                for var i=0 to (slices-1)
                    elements[(slices*(2+stacks*2)+j*slices*2+2*i)*3] = (
                                                          i+slices*(2+stacks+j))
                    elements[(slices*(2+stacks*2)+j*slices*2+2*i)*3+1] = (
                                                      i+1+slices*(2+stacks+j+1))
                    elements[(slices*(2+stacks*2)+j*slices*2+2*i)*3+2] = (
                                                        i+slices*(2+stacks+j+1))
                    elements[(slices*(2+stacks*2)+j*slices*2+2*i)*3+3] = (
                                                      i+1+slices*(2+stacks+j+1))
                    elements[(slices*(2+stacks*2)+j*slices*2+2*i)*3+4] = (
                                                          i+slices*(2+stacks+j))
                    elements[(slices*(2+stacks*2)+j*slices*2+2*i)*3+5] = (
                                                        i+1+slices*(2+stacks+j))

                // fix loop
                elements[(slices*(2+stacks*2)+j*slices*2+2*(slices-1))*3+1] = (
                        GLushort) (slices*(j+2+stacks)+slices)
                elements[(slices*(2+stacks*2)+j*slices*2+2*(slices-1))*3+3] = (
                        GLushort) (slices*(j+2+stacks)+slices)
                elements[(slices*(2+stacks*2)+j*slices*2+2*(slices-1))*3+5] = (
                        GLushort) (slices*(j+1+stacks)+slices)

        // cap vertex
        vertices[slices*(2*stacks+2)*11] = 0.0f
        vertices[slices*(2*stacks+2)*11+1] = yl-ri
        vertices[slices*(2*stacks+2)*11+2] = 0.0f
        vertices[slices*(2*stacks+2)*11+3] = 0.0f
        vertices[slices*(2*stacks+2)*11+4] = 1.0f
        vertices[slices*(2*stacks+2)*11+5] = 0.0f
        vertices[slices*(2*stacks+2)*11+6] = 1.0f
        vertices[slices*(2*stacks+2)*11+7] = 0.7f
        // cap faces
        for var i=0 to (slices-1)
            elements[(slices*(stacks*4)+i)*3] = i+slices*(2*stacks)
            elements[(slices*(stacks*4)+i)*3+1] = 0+slices*(2*stacks+2)
            elements[(slices*(stacks*4)+i)*3+2] = i-1+slices*(2*stacks)

        // fix loop
        elements[(slices*(stacks*4+1)-1)*3] = -1+slices*(2*stacks)

        // connect to outer shell
        for var i=0 to (slices-1)
            elements[(slices*(1+stacks*4)+2*i)*3] = i+slices*2
            elements[(slices*(1+stacks*4)+2*i)*3+1] = i+1+slices*(2+stacks)
            elements[(slices*(1+stacks*4)+2*i)*3+2] = i+slices*(2+stacks)
            elements[(slices*(1+stacks*4)+2*i)*3+3] = i+1+slices*(2+stacks)
            elements[(slices*(1+stacks*4)+2*i)*3+4] = i+slices*2
            elements[(slices*(1+stacks*4)+2*i)*3+5] = i+1+slices*2

        // fix loop
        elements[(slices*(3+stacks*4)-2)*3+1] = (2+stacks)*slices
        elements[(slices*(3+stacks*4)-2)*3+3] = (2+stacks)*slices
        elements[(slices*(3+stacks*4)-2)*3+5] = 2*slices

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _eboB)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER,
                     (GLsizei) (slices * (3 + 4 * stacks) * 3 *
                     sizeof(GLushort)), elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vboB)
        glBufferData(GL_ARRAY_BUFFER,
                     (GLsizei) ((slices * (2 + 2 * stacks) + 1) * 11 *
                     sizeof(GLfloat)), vertices, GL_STATIC_DRAW)

        _updated = false

    //
    // anchor Property
    _anchor_obj : weak soy.atoms.Position?

    def _anchor_set(anchor : soy.atoms.Position)
        soy.scenes._stepLock.writer_lock()
        ((ode.joints.Ball) joint).SetAnchor((ode.Real) anchor.x,
                                            (ode.Real) anchor.y,
                                            (ode.Real) anchor.z)
        soy.scenes._stepLock.writer_unlock()

    def _anchor_weak(anchor : Object)
        self._anchor_obj = null

    prop anchor : soy.atoms.Position
        owned get
            v : ode.Vector3 = new ode.Vector3()
            ((ode.joints.Ball) self.joint).GetAnchor(v)
            value : soy.atoms.Position? = self._anchor_obj
            if (value is null or (float) v.x != value.x or
                (float) v.y != value.y or (float)v.z != value.z)
                if value is not null
                    _anchor_obj.on_set.disconnect(self._anchor_set)
                    _anchor_obj.weak_unref(self._anchor_weak)
                value = new soy.atoms.Position((float) v.x,
                                               (float) v.y,
                                               (float) v.z)
                value.on_set.connect(self._anchor_set)
                value.weak_ref(self._anchor_weak)
                self._anchor_obj = value
            return value

        set
            self._anchor_set(value)
            _updated = true
            self.gen_matrices()
            if _anchor_obj != null
                _anchor_obj.on_set.disconnect(self._anchor_set)
                _anchor_obj.weak_unref(self._anchor_weak)
            _anchor_obj = value
            value.on_set.connect(self._anchor_set)
            value.weak_ref(self._anchor_weak)
        // TODO we need to somehow update the _anchor_obj whenever the joint
        // its attached to moves.  This would make the most sense in Scene.

