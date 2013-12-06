/*
 *  libsoy - soy.joints.Slider
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

class soy.joints.Slider: soy.joints.Joint
    _ebo : GLuint // element buffer object
    _vbo : GLuint // vertex buffer object
    _updated : bool // do the buffers need updated?
    _jointRotTheta : array of GLfloat
    _jointRotPhi   : array of GLfloat
    _inverseRotation : array of GLfloat

    construct(bodyA : soy.bodies.Body, bodyB : soy.bodies.Body?,
              axis: soy.atoms.Axis, material : soy.materials.Material?)
        super(bodyA, bodyB, null, axis, null, material)
        _updated = true


    def override create ( )
        joint = new ode.joints.Slider(soy.scenes._world, null)


    def override setup (anchor : soy.atoms.Position?, axis1 : soy.atoms.Axis?,
                        axis2 : soy.atoms.Axis?)
        ((ode.joints.Slider) joint).SetAxis((ode.Real) axis1.x,
                                            (ode.Real) axis1.y,
                                            (ode.Real) axis1.z)


    def override gen_matrices ( )
        posBRel : soy.atoms.Vector = bodyA.getRelPointPos(bodyB)

        radius : ode.Real = (ode.Real) sqrt(posBRel.x*posBRel.x +
                                            posBRel.y*posBRel.y +
                                            posBRel.z*posBRel.z)

        phi   : ode.Real = (ode.Real) acos(posBRel.y / radius)
        theta : ode.Real = (ode.Real) (atan2(posBRel.z, posBRel.x))

        _jointRotTheta = new array of GLfloat[16]
        _jointRotPhi = new array of GLfloat[16]
        _inverseRotation = new array of GLfloat[16]

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


    def override render ( )
        // Do not render when material is not set
        if self.material is null
            return

        i : int = 0

        // save current matrix
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()

        // lock so cant be changed during a render
        mutex.lock()

        // set modelview matrix
        self.mult_model_matrix()

        // update ebo/vbo if its needed
        if _updated
            _update_slider()

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


    def _update_slider()
        return


    def addForce(force : ode.Real)
        ((ode.joints.Slider) self.joint).AddForce(force)

    //
    // axis Property
    _axis_obj : weak soy.atoms.Axis?

    def _axis_set(value : soy.atoms.Axis)
        axis : soy.atoms.Axis = new soy.atoms.Axis.normalize(value)
        soy.scenes._stepLock.writer_lock()
        ((ode.joints.Slider) joint).SetAxis((ode.Real) axis.x,
                                            (ode.Real) axis.y,
                                            (ode.Real) axis.z)
        soy.scenes._stepLock.writer_unlock()

    def _axis_weak(axis : Object)
        self._axis_obj = null

    prop axis : soy.atoms.Axis
        owned get
            v : ode.Vector3 = new ode.Vector3()
            ((ode.joints.Slider) self.joint).GetAxis(v)
            value : soy.atoms.Axis? = self._axis_obj
            if (value is null or (float) v.x != value.x or
                (float) v.y != value.y or (float) v.z != value.z)
                if value is not null
                    _axis_obj.on_set.disconnect(self._axis_set)
                    _axis_obj.weak_unref(self._axis_weak)
                value = new soy.atoms.Axis((float) v.x,
                                           (float) v.y,
                                           (float) v.z)
                value.on_set.connect(self._axis_set)
                value.weak_ref(self._axis_weak)
                self._axis_obj = value
            return value

        set
            self._axis_set(value)
            if _axis_obj != null
                _axis_obj.on_set.disconnect(self._axis_set)
                _axis_obj.weak_unref(self._axis_weak)
            _axis_obj = value
            value.on_set.connect(self._axis_set)
            value.weak_ref(self._axis_weak)

    //
    // length Property
    prop readonly length : float
        get
            return (float) ((ode.joints.Slider) self.joint).GetPosition()


/* TODO: These won't work until the parameters are in the vapi file
    prop stops : array of float
        owned get
            loangle : ode.Real = self.joint.GetParam(ode.dParamLoStop)
            hiangle : ode.Real = self.joint.GetParam(ode.dParamHiStop)

    prop bounces : float
        owned get
            return (float) self.joint.GetParam(ode.dParamBounce)
        set
            if (value < 0.0) or (value > 1.0)
                print "0.0 to 1.0 only"
                return
            self.joint.SetParam(ode.dParamBounce,(float)value)
*/

