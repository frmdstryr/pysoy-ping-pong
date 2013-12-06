/*
 *  libsoy - soy.scenes.td.Side
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
    Gee
    ode

class soy.scenes.TDSide : soy.scenes.Scene
    tdbodies : LinkedList of soy.bodies.Body
    plane2ds : dict of soy.bodies.Body, soy.joints.Plane2D

    construct ()
        self.tdbodies = new LinkedList of soy.bodies.Body
        self.plane2ds = new dict of soy.bodies.Body, soy.joints.Plane2D
        //self._tdgravity = new soy.fields.Accelerate(self)
        self._tdgravity = new soy.fields.Accelerate()

    def override do_in_step ()
        self._align_to_z_axis()

    // Set the body as 2D body.
    //
    // 2D bodies are bodies whose movement is restricted to a 2D plane.
    def set2d(body : soy.bodies.Body)
        self.tdbodies.add(body)
        self.plane2ds[body] = new soy.joints.Plane2D(body, null, null)
        // do not collide with non-2d bodies
        //body.shape.geom.SetCategoryBits(3)
        //body.shape.geom.SetCollideBits(0x0001)

    // Unset the body as 2D body.
    def unset2d(body : soy.bodies.Body)
        self.tdbodies.remove(body)
        self.plane2ds.unset(body)
        // start colliding with non-2d bodies
        //body.shape.geom.SetCategoryBits(3)
        //body.shape.geom.SetCollideBits(0xFFFF)

    // Align 2D bodies to Z-axis.
    //
    // Plane2D stops objects rotating along non-2d axes, but it does not
    // compensate for drift. To prevent angular drift, every time ODE does
    // a time step, we limit the object rotation and angular velocity for
    //  each object which needs to be confined to the plane.
    def _align_to_z_axis()
        for body in self.tdbodies
            rot : weak ode.Vector3 = body.body.GetAngularVel()
            quat : weak ode.Quaternion = body.body.GetQuaternion()
            quat_len : ode.Real
            quat.x = 0
            quat.y = 0
            quat_len = Math.sqrtf( (float)quat.w * (float)quat.w + (float)quat.z * (float)quat.z )
            quat.w /= quat_len
            quat.z /= quat_len

            body.body.SetQuaternion(quat)
            body.body.SetAngularVel(0, 0, rot.z)

    // Set a velocity on the X-axis to a body.
    def set_vel_x(body : soy.bodies.Body, vel : float)
        self.plane2ds[body].setXParam(ode.Param.Vel, vel)

    // Set a velocity on the Y-axis to a body.
    def set_vel_y(body : soy.bodies.Body, vel : float)
        self.plane2ds[body].setYParam(ode.Param.Vel, vel)

    //* Properties

    // Gravity vector for 2D bodies.
    _tdgravity : soy.fields.Accelerate

    prop tdgravity : soy.atoms.Vector
        get
            return self._tdgravity.acceleration
        set
            self._tdgravity.acceleration = value

