/*
 *  libsoy - soy.joints.Piston
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

class soy.joints.Piston: soy.joints.Joint
    construct(bodyA : soy.bodies.Body, bodyB : soy.bodies.Body?,
              anchor : soy.atoms.Position, axis1: soy.atoms.Axis,
              axis2 : soy.atoms.Axis, material : soy.materials.Material?)
        super(bodyA, bodyB, anchor, axis1, axis2, material)


    def override create ( )
        joint = new ode.joints.PrismaticRotoide(soy.scenes._world, null)


    def override setup (anchor : soy.atoms.Position?, axis1 : soy.atoms.Axis?,
                        axis2 : soy.atoms.Axis?)
        ((ode.joints.PrismaticRotoide) joint).SetAnchor((ode.Real) anchor.x,
                                                        (ode.Real) anchor.y,
                                                        (ode.Real) anchor.z)
        ((ode.joints.PrismaticRotoide) joint).SetAxis1((ode.Real) axis1.x,
                                                       (ode.Real) axis1.y,
                                                       (ode.Real) axis1.z)
        ((ode.joints.PrismaticRotoide) joint).SetAxis2((ode.Real) axis2.x,
                                                       (ode.Real) axis2.y,
                                                       (ode.Real) axis2.z)


    def addTorque(torque : ode.Real)
        ((ode.joints.PrismaticRotoide) self.joint).AddTorque(torque)

    //
    // anchor Property
    _anchor_obj : weak soy.atoms.Position?

    def _anchor_set(anchor : soy.atoms.Position)
        soy.scenes._stepLock.writer_lock()
        ((ode.joints.PrismaticRotoide) joint).SetAnchor((ode.Real) anchor.x,
                                                        (ode.Real) anchor.y,
                                                        (ode.Real) anchor.z)
        soy.scenes._stepLock.writer_unlock()

    def _anchor_weak(anchor : Object)
        self._anchor_obj = null

    prop anchor : soy.atoms.Position
        owned get
            v : ode.Vector3 = new ode.Vector3()
            ((ode.joints.PrismaticRotoide) self.joint).GetAnchor(v)
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
            if _anchor_obj != null
                _anchor_obj.on_set.disconnect(self._anchor_set)
                _anchor_obj.weak_unref(self._anchor_weak)
            _anchor_obj = value
            value.on_set.connect(self._anchor_set)
            value.weak_ref(self._anchor_weak)
        // TODO we need to somehow update the _anchor_obj whenever the joint
        // its attached to moves.  This would make the most sense in Scene.

    //
    // axis1 Property

    _axis1_obj : weak soy.atoms.Axis?

    def _axis1_set(value : soy.atoms.Axis)
        axis1 : soy.atoms.Axis = new soy.atoms.Axis.normalize(value)
        soy.scenes._stepLock.writer_lock()
        ((ode.joints.PrismaticRotoide) joint).SetAxis1((ode.Real) axis1.x,
                                                       (ode.Real) axis1.y,
                                                       (ode.Real) axis1.z)
        soy.scenes._stepLock.writer_unlock()

    def _axis1_weak(axis1 : Object)
        self._axis1_obj = null

    prop axis1 : soy.atoms.Axis
        owned get
            v : ode.Vector3 = new ode.Vector3()
            ((ode.joints.PrismaticRotoide) self.joint).GetAxis1(v)
            value : soy.atoms.Axis? = self._axis1_obj
            if (value is null or (float) v.x != value.x or
                (float) v.y != value.y or (float)v.z != value.z)
                if value is not null
                    _axis1_obj.on_set.disconnect(self._axis1_set)
                    _axis1_obj.weak_unref(self._axis1_weak)
                value = new soy.atoms.Axis((float) v.x,
                                               (float) v.y,
                                               (float) v.z)
                value.on_set.connect(self._axis1_set)
                value.weak_ref(self._axis1_weak)
                self._axis1_obj = value
            return value

        set
            self._axis1_set(value)
            if _axis1_obj != null
                _axis1_obj.on_set.disconnect(self._axis1_set)
                _axis1_obj.weak_unref(self._axis1_weak)
            _axis1_obj = value
            value.on_set.connect(self._axis1_set)
            value.weak_ref(self._axis1_weak)

    // axis2 Property

    _axis2_obj : weak soy.atoms.Axis?

    def _axis2_set(value : soy.atoms.Axis)
        axis2 : soy.atoms.Axis = new soy.atoms.Axis.normalize(value)
        soy.scenes._stepLock.writer_lock()
        ((ode.joints.PrismaticRotoide) joint).SetAxis2((ode.Real) axis2.x,
                                                       (ode.Real) axis2.y,
                                                       (ode.Real) axis2.z)
        soy.scenes._stepLock.writer_unlock()

    def _axis2_weak(axis2 : Object)
        self._axis2_obj = null

    prop axis2 : soy.atoms.Axis
        owned get
            v : ode.Vector3 = new ode.Vector3()
            ((ode.joints.PrismaticRotoide) self.joint).GetAxis2(v)
            value : soy.atoms.Axis? = self._axis2_obj
            if (value is null or (float) v.x != value.x or
                (float) v.y != value.y or (float)v.z != value.z)
                if value is not null
                    _axis2_obj.on_set.disconnect(self._axis2_set)
                    _axis2_obj.weak_unref(self._axis2_weak)
                value = new soy.atoms.Axis((float) v.x,
                                               (float) v.y,
                                               (float) v.z)
                value.on_set.connect(self._axis2_set)
                value.weak_ref(self._axis2_weak)
                self._axis2_obj = value
            return value

        set
            self._axis2_set(value)
            if _axis2_obj != null
                _axis2_obj.on_set.disconnect(self._axis2_set)
                _axis2_obj.weak_unref(self._axis2_weak)
            _axis2_obj = value
            value.on_set.connect(self._axis2_set)
            value.weak_ref(self._axis2_weak)

    //
    // angle Property
    prop readonly angle : float
        get
            return (float)((ode.joints.PrismaticRotoide) self.joint).GetAngle()

    //
    // length Property
    prop readonly length : float
        get
            return (float) ((ode.joints.PrismaticRotoide) self.joint).GetPosition()


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

