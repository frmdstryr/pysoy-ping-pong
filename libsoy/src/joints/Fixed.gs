/*
 *  libsoy - soy.joints.Fixed
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


class soy.joints.Fixed: soy.joints.Joint
    _ebo : GLuint // element buffer object
    _vbo : GLuint // vertex buffer object
    _updated : bool // do the buffers need updated?
    _jointRotTheta : array of GLfloat
    _jointRotPhi   : array of GLfloat
    _inverseRotation : array of GLfloat

    construct(bodyA : soy.bodies.Body, bodyB : soy.bodies.Body?,
              material : soy.materials.Material?)
        super(bodyA, bodyB, null, null, null, material)
        _updated = true


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override create ( )
        joint = new ode.joints.Fixed(soy.scenes._world, null)


    def override setup (anchor : soy.atoms.Position?, axis1 : soy.atoms.Axis?,
                        axis2 : soy.atoms.Axis?)
        ((ode.joints.Fixed) joint).Set()

    def override gen_matrices ( )
         _jointRotTheta = new array of GLfloat[16]
        _jointRotPhi   = new array of GLfloat[16]
        _inverseRotation  = new array of GLfloat[16]

        posBRel : soy.atoms.Vector = bodyA.getRelPointPos(bodyB)
        radius : ode.Real = (ode.Real) sqrt(posBRel.x*posBRel.x +
                                            posBRel.y*posBRel.y +
                                            posBRel.z*posBRel.z)

        phi   : ode.Real = (ode.Real) acos(posBRel.y / radius)
        theta : ode.Real = (ode.Real) (atan2(posBRel.z, posBRel.x))

        _jointRotPhi[0]  = (GLfloat) cos(phi)
        _jointRotPhi[1]  = (GLfloat) (-sin(phi))
        _jointRotPhi[2]  = (GLfloat) 0.0
        _jointRotPhi[3]  = (GLfloat) 0.0
        _jointRotPhi[4]  = (GLfloat) sin(phi)
        _jointRotPhi[5]  = (GLfloat) cos(phi)
        _jointRotPhi[6]  = (GLfloat) 0.0
        _jointRotPhi[7]  = (GLfloat) 0.0
        _jointRotPhi[8]  = (GLfloat) 0.0
        _jointRotPhi[9]  = (GLfloat) 0.0
        _jointRotPhi[10] = (GLfloat) 1.0
        _jointRotPhi[11] = (GLfloat) 0.0
        _jointRotPhi[12] = (GLfloat) 0.0
        _jointRotPhi[13] = (GLfloat) 0.0
        _jointRotPhi[14] = (GLfloat) 0.0
        _jointRotPhi[15] = (GLfloat) 1.0

        _jointRotTheta[0]  = (GLfloat) cos(theta)
        _jointRotTheta[1]  = (GLfloat) 0.0
        _jointRotTheta[2]  = (GLfloat) sin(theta)
        _jointRotTheta[3]  = (GLfloat) 0.0
        _jointRotTheta[4]  = (GLfloat) 0.0
        _jointRotTheta[5]  = (GLfloat) 1.0
        _jointRotTheta[6]  = (GLfloat) 0.0
        _jointRotTheta[7]  = (GLfloat) 0.0
        _jointRotTheta[8]  = (GLfloat) (-sin(theta))
        _jointRotTheta[9]  = (GLfloat) 0.0
        _jointRotTheta[10] = (GLfloat) cos(theta)
        _jointRotTheta[11] = (GLfloat) 0.0
        _jointRotTheta[12] = (GLfloat) 0.0
        _jointRotTheta[13] = (GLfloat) 0.0
        _jointRotTheta[14] = (GLfloat) 0.0
        _jointRotTheta[15] = (GLfloat) 1.0

        rotation : unowned ode.Matrix3 = bodyA.body.GetRotation()
        _inverseRotation[0] = (GLfloat) rotation.m0
        _inverseRotation[1] = (GLfloat) rotation.m1
        _inverseRotation[2] = (GLfloat) rotation.m2
        _inverseRotation[3] = (GLfloat) 0.0
        _inverseRotation[4] = (GLfloat) rotation.m4
        _inverseRotation[5] = (GLfloat) rotation.m5
        _inverseRotation[6] = (GLfloat) rotation.m6
        _inverseRotation[7] = (GLfloat) 0.0
        _inverseRotation[8] = (GLfloat) rotation.m8
        _inverseRotation[9] = (GLfloat) rotation.m9
        _inverseRotation[10] = (GLfloat) rotation.ma
        _inverseRotation[11] = (GLfloat) 0.0
        _inverseRotation[12] = (GLfloat) 0.0
        _inverseRotation[13] = (GLfloat) 0.0
        _inverseRotation[14] = (GLfloat) 0.0
        _inverseRotation[15] = (GLfloat) 1.0

    def override mult_model_matrix( )
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
        glMultMatrixf(_inverseRotation)
        glMultMatrixf(_jointRotTheta)
        glMultMatrixf(_jointRotPhi)

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

        // set modelview matrix
        self.mult_model_matrix()

        // update ebo/vbo if its needed
        if _updated
            _update_joint()

        // rebind buffers when not updating
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11), null)
        glNormalPointer(   GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 11),
                        (GLvoid*) (sizeof(GLfloat) * 3))

        while self.material.render(i, null)
            glDrawElements(GL_TRIANGLES, (GLsizei) 240, GL_UNSIGNED_BYTE, null)
            i += 1

        // unlock mutex for writing, rendering done
        mutex.unlock()

        // restore matrix
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()


    def _update_joint()
        ///////////////////////////////////////////////////////////////////////
        //    .........
        //   /|      /|
        //  ......... |
        //  | |     | |
        //  | ......|..
        //  |/      |/
        //  .........
        //
        //
        // on the first pass
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        posA : soy.atoms.Position = bodyA.position
        posB : soy.atoms.Position = bodyB.position

        // constants to help drawing
        r : GLfloat = 0.0625f   // radius

        // x-values at edge/side boundaries
        tx1 : GLfloat = (float) (PI*r/(4.0f+8*PI*r))
        tx2 : GLfloat = 0.25f - tx1

        // distance in z-axis is width
        width : GLfloat = 0.250f - r

        // distance in x-axis is depth
        depth : GLfloat = 0.250f - r

        // distance in y-axis is yl
        yl : GLfloat = sqrtf((posB.x - posA.x) * (posB.x - posA.x) +
                             (posB.y - posA.y) * (posB.y - posA.y) +
                             (posB.z - posA.z) * (posB.z - posA.z))

        // index array of vertex array
        elements : array of GLubyte = {
            0, 2, 1,    1, 2, 3,    3, 2, 4,    4, 2, 0,      // front
            5, 7, 6,    6, 7, 8,    8, 7, 9,    9, 7, 5,      // right
            10,12,11,   11,12,13,   13,12,14,   14,12,10,     // left
            15,17,16,   16,17,18,   18,17,19,   19,17,15,     // back

            1, 20,0,    0, 20,22,   22,20,21,   21,20,1,      // edges
            21,23,22,   22,23,25,   25,23,24,   24,23,21,
            24,26,25,   25,26,28,   28,26,27,   27,26,24,
            27,29,28,   28,29,5,    5, 29,9,    9, 29,27,

            8, 30,6,    6, 30,32,   32,30,31,   31,30,8,
            31,33,32,   32,33,35,   35,33,34,   34,33,31,
            34,36,35,   35,36,38,   38,36,37,   37,36,34,
            37,39,38,   38,39,19,   19,39,18,   18,39,37,

            16,40,15,   15,40,42,   42,40,41,   41,40,16,
            41,43,42,   42,43,45,   45,43,44,   44,43,41,
            44,46,45,   45,46,48,   48,46,47,   47,46,44,
            47,49,48,   48,49,11,   11,49,10,   10,49,47,

            14,50,13,   13,50,52,   52,50,51,   51,50,14,
            51,53,52,   52,53,55,   55,53,54,   54,53,51,
            54,56,55,   55,56,58,   58,56,57,   57,56,54,
            57,59,58,   58,59,4,    4, 59,3,    3, 59,57

        }

        // interleaved (vertex, normals, texcoords, tangents) array
        // (px py pz nx ny nz tx ty ux uy uz) for each vertex
        vertices : array of GLfloat = {
            // front
           width,      yl, 0.250f,
               0,       0,      1,
             tx2,       1,
               0,       0,      0,

           width,       0, 0.250f,
               0,       0,      1,
             tx2,       0,
               0,       1,      0,

               0,    yl/2, 0.250f,
               0,       0,      1,
          0.125f,    0.5f,
               0,       1,      0,

          -width,       0, 0.250f,
               0,       0,      1,
             tx1,       0,
               0,       1,      0,

          -width,      yl, 0.250f,
               0,       0,      1,
             tx1,       1,
               0,       1,      0,

            // right
          0.250f,      yl,  depth,
               1,       0,      0,
       0.25f+tx1,       1,
               0,       1,      0,

          0.250f,      yl, -depth,
               1,       0,      0,
       0.25f+tx2,       1,
               0,       1,      0,

          0.250f,    yl/2,      0,
               1,       0,      0,
          0.375f,    0.5f,
               0,       1,      0,

          0.250f,     0,   -depth,
               1,       0,      0,
       0.25f+tx2,       0,
               0,       1,      0,

          0.250f,     0,    depth,
               1,       0,      0,
       0.25f+tx1,       0,
               0,       1,      0,

            // left
            -0.250f,   0,  -depth,
              -1,       0,      0,
       0.75f+tx1,       0,
               0,       1,      0,

          -0.250f,    yl,  -depth,
              -1,       0,      0,
       0.75f+tx1,       1,
               0,       1,      0,

          -0.250f,  yl/2,       0,
              -1,       0,      0,
          0.875f,    0.5f,
               0,       1,      0,

        -0.250f,      yl,   depth,
              -1,       0,      0,
       0.75f+tx2,       1,
               0,       1,      0,

           -0.250f,    0,   depth,
              -1,       0,      0,
       0.75f+tx2,       0,
               0,       1,      0,

            // back
          -width,      yl,-0.250f,
               0,       0,     -1,
        0.5f+tx2,       1,
               0,       1,      0,

           -width,    0,  -0.250f,
               0,       0,     -1,
        0.5f+tx2,       0,
               0,       1,      0,

               0,    yl/2,-0.250f,
               0,       0,     -1,
          0.625f,    0.5f,
               0,       1,      0,

           width,       0,-0.250f,
               0,       0,     -1,
        0.5f+tx1,       0,
               0,       1,      0,

           width,    yl,  -0.250f,
               0,       0,     -1,
        0.5f+tx1,       1,
               0,       1,      0,

        // edges

           width + r * sinf((float)PI/16), yl/2, depth + r * cosf((float)PI/16),
               sinf((float)PI/16),        0,                 cosf((float)PI/16),
            0.25f-tx1*3/4,                           0.5f,
               0,       1,      0,

           width + r * sinf((float)PI/8),    0,    depth + r * cosf((float)PI/8),
              sinf((float)PI/8),      0,                        cosf((float)PI/8),
              0.25f-tx1/2,                           0,
               0,       1,      0,

           width + r * sinf((float)PI/8),    yl,    depth + r * cosf((float)PI/8),
           sinf((float)PI/8),       0,                          cosf((float)PI/8),
               0.25f-tx1/2,                           1,
               0,       1,      0,

           width + r * sinf((float)PI*3/16),    yl/2,    depth + r * cosf((float)PI*3/16),
                sinf((float)PI*3/16),    0,                        cosf((float)PI*3/16),
               0.25f-tx1/4,                           0.5f,
               0,       1,      0,

             width + r * sinf((float)PI/4),  0,    depth + r * cosf((float)PI/4),
            sinf((float)PI/4),     0,                           cosf((float)PI/4),
               0.25f,                           0,
               0,       1,      0,

             width + r * sinf((float)PI/4),  yl,    depth + r * cosf((float)PI/4),
          sinf((float)PI/4),        0,                         cosf((float)PI/4),
               0.25f,                           1,
               0,       1,      0,

           width + r * sinf((float)PI*5/16),    yl/2,    depth + r * cosf((float)PI*5/16),
                sinf((float)PI*5/16),     0,                       cosf((float)PI*5/16),
               0.25f+tx1/4,                           0.5f,
               0,       1,      0,

            width + r * sinf((float)PI*3/8),   0,    depth + r * cosf((float)PI*3/8),
                sinf((float)PI*3/8),     0,                       cosf((float)PI*3/8),
               0.25f+tx1/2,                           0,
               0,       1,      0,

            width + r * sinf((float)PI*3/8),   yl,    depth + r * cosf((float)PI*3/8),
           sinf((float)PI*3/8),       0,                          cosf((float)PI*3/8),
               0.25f+tx1/2,                           1,
               0,       1,      0,

           width + r * sinf((float)PI*7/16),    yl/2,    depth + r * cosf((float)PI*7/16),
               sinf((float)PI*7/16),      0,                       cosf((float)PI*7/16),
               0.25f+tx1*3/4,                           0.5f,
               0,       1,      0,

            //

           width + r * sinf((float)PI*7/16),    yl/2,   -depth - r * cosf((float)PI*7/16),
               sinf((float)PI*7/16),      0,                       -cosf((float)PI*7/16),
               0.5f-tx1*3/4,                           0.5f,
               0,       1,      0,

            width + r * sinf((float)PI*3/8),   0,   -depth - r * cosf((float)PI*3/8),
                sinf((float)PI*3/8),     0,                       -cosf((float)PI*3/8),
               0.5f-tx1/2,                           0,
               0,       1,      0,

            width + r * sinf((float)PI*3/8),   yl,   -depth - r * cosf((float)PI*3/8),
           sinf((float)PI*3/8),       0,                          -cosf((float)PI*3/8),
               0.5f-tx1/2,                           1,
               0,       1,      0,

           width + r * sinf((float)PI*5/16),    yl/2,   -depth - r * cosf((float)PI*5/16),
                sinf((float)PI*5/16),     0,                      -cosf((float)PI*5/16),
               0.5f-tx1/4,                           0.5f,
               0,       1,      0,

             width + r * sinf((float)PI/4),  0,   -depth - r * cosf((float)PI/4),
            sinf((float)PI/4),     0,                           -cosf((float)PI/4),
               0.5f,                           0,
               0,       1,      0,

             width + r * sinf((float)PI/4),  yl,    -depth - r * cosf((float)PI/4),
          sinf((float)PI/4),        0,                          -cosf((float)PI/4),
               0.5f,                           1,
               0,       1,      0,

           width + r * sinf((float)PI*3/16),    yl/2,    -depth - r * cosf((float)PI*3/16),
                sinf((float)PI*3/16),    0,                        -cosf((float)PI*3/16),
               0.5f+tx1/4,                           0.5f,
               0,       1,      0,

           width + r * sinf((float)PI/8),    0,    -depth - r * cosf((float)PI/8),
              sinf((float)PI/8),      0,                        -cosf((float)PI/8),
               0.5f+tx1/2,                           0,
               0,       1,      0,

           width + r * sinf((float)PI/8),    yl,    -depth - r * cosf((float)PI/8),
           sinf((float)PI/8),       0,                          -cosf((float)PI/8),
               0.5f+tx1/2,                           1,
               0,       1,      0,

           width + r * sinf((float)PI/16),    yl/2,    -depth - r * cosf((float)PI/16),
               sinf((float)PI/16),              0,              -cosf((float)PI/16),
               0.5f+tx1*3/4,                           0.5f,
               0,       1,      0,

            //

           -width - r * sinf((float)PI/16),    yl/2,    -depth - r * cosf((float)PI/16),
            -sinf((float)PI/16),    0,                           -cosf((float)PI/16),
               0.75f-tx1*3/4,                           0.5f,
               0,       1,      0,

          -width - r * sinf((float)PI/8),    0,    -depth - r * cosf((float)PI/8),
              -sinf((float)PI/8),      0,                       -cosf((float)PI/8),
               0.75f-tx1/2,                           0,
               0,       1,      0,

          -width - r * sinf((float)PI/8),    yl,    -depth - r * cosf((float)PI/8),
           -sinf((float)PI/8),       0,                         -cosf((float)PI/8),
               0.75f-tx1/2,                           1,
               0,       1,      0,

          -width - r * sinf((float)PI*3/16),    yl/2,    -depth - r * cosf((float)PI*3/16),
                -sinf((float)PI*3/16),    0,                       -cosf((float)PI*3/16),
               0.75f-tx1/4,                           0.5f,
               0,       1,      0,

            -width - r * sinf((float)PI/4),  0,   -depth - r * cosf((float)PI/4),
            -sinf((float)PI/4),     0,                          -cosf((float)PI/4),
               0.75f,                           0,
               0,       1,      0,

            -width - r * sinf((float)PI/4),  yl,   -depth - r * cosf((float)PI/4),
          -sinf((float)PI/4),        0,                         -cosf((float)PI/4),
               0.75f,                           1,
               0,       1,      0,

          -width - r * sinf((float)PI*5/16),    yl/2,   -depth - r * cosf((float)PI*5/16),
                -sinf((float)PI*5/16),     0,                      -cosf((float)PI*5/16),
               0.75f+tx1/4,                           0.5f,
               0,       1,      0,

           -width - r * sinf((float)PI*3/8),   0,   -depth - r * cosf((float)PI*3/8),
                -sinf((float)PI*3/8),     0,                      -cosf((float)PI*3/8),
               0.75f+tx1/2,                           0,
               0,       1,      0,

           -width - r * sinf((float)PI*3/8),   yl,   -depth - r * cosf((float)PI*3/8),
           -sinf((float)PI*3/8),       0,                         -cosf((float)PI*3/8),
               0.75f+tx1/2,                           1,
               0,       1,      0,

          -width - r * sinf((float)PI*7/16),    yl/2,   -depth - r * cosf((float)PI*7/16),
               -sinf((float)PI*7/16),      0,                      -cosf((float)PI*7/16),
               0.75f+tx1*3/4,                           0.5f,
               0,       1,      0,

            //

          -width - r * sinf((float)PI*7/16),    yl/2,   depth + r * cosf((float)PI*7/16),
               -sinf((float)PI*7/16),      0,                       cosf((float)PI*7/16),
               1.0f-tx1*3/4,                           0.5f,
               0,       1,      0,

           -width - r * sinf((float)PI*3/8),   0,   depth + r * cosf((float)PI*3/8),
                -sinf((float)PI*3/8),     0,                       cosf((float)PI*3/8),
               1.0f-tx1/2,                           0,
               0,       1,      0,

           -width - r * sinf((float)PI*3/8),   yl,   depth + r * cosf((float)PI*3/8),
           -sinf((float)PI*3/8),       0,                          cosf((float)PI*3/8),
               1.0f-tx1/2,                           1,
               0,       1,      0,

          -width - r * sinf((float)PI*5/16),    yl/2,   depth + r * cosf((float)PI*5/16),
                -sinf((float)PI*5/16),     0,                      cosf((float)PI*5/16),
               1.0f-tx1/4,                           0.5f,
               0,       1,      0,

            -width - r * sinf((float)PI/4),  0,   depth + r * cosf((float)PI/4),
            -sinf((float)PI/4),     0,                           cosf((float)PI/4),
               0,                           0,
               0,       1,      0,

            -width - r * sinf((float)PI/4),  yl,    depth + r * cosf((float)PI/4),
          -sinf((float)PI/4),        0,                          cosf((float)PI/4),
               0,                           1,
               0,       1,      0,

          -width - r * sinf((float)PI*3/16),    yl/2,    depth + r * cosf((float)PI*3/16),
                -sinf((float)PI*3/16),    0,                        cosf((float)PI*3/16),
               tx1/4,                           0.5f,
               0,       1,      0,

          -width - r * sinf((float)PI/8),    0,    depth + r * cosf((float)PI/8),
              -sinf((float)PI/8),      0,                        cosf((float)PI/8),
               tx1/2,                           0,
               0,       1,      0,

          -width - r * sinf((float)PI/8),    yl,    depth + r * cosf((float)PI/8),
           -sinf((float)PI/8),       0,                          cosf((float)PI/8),
               tx1/2,                           1,
               0,       1,      0,

          -width - r * sinf((float)PI/16),    yl/2,    depth + r * cosf((float)PI/16),
               -sinf((float)PI/16),              0,              cosf((float)PI/16),
               tx1*3/4,                           0.5f,
               0,       1,      0

        }

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, 240, elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (60 * 11 * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)

        _updated = false

