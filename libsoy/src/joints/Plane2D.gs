/*
 *  libsoy - soy.joints.Plane2D
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

class soy.joints.Plane2D: soy.joints.Joint
    construct(bodyA : soy.bodies.Body, bodyB : soy.bodies.Body?,
              material : soy.materials.Material?)
        super(bodyA, bodyB, null, null, null, material)


    def override create ( )
        joint = new ode.joints.Plane2D(soy.scenes._world, null)


    def setXParam(param : int, val : ode.Real)
        ((ode.joints.Plane2D) joint).SetXParam(param, val)


    def setYParam(param : int, val : ode.Real)
        ((ode.joints.Plane2D) joint).SetYParam(param, val)


    def setAngleParam(param : int, val : ode.Real)
        ((ode.joints.Plane2D) joint).SetAngleParam(param,  val)

