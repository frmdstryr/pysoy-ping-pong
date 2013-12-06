/*
 *  libsoy - soy.joints.Joint
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
    GL
    ode
    GLib.Math

class soy.joints.Joint : Object
    joint : ode.joints.Joint
    bodyA : weak soy.bodies.Body
    bodyB : weak soy.bodies.Body?
    mutex : Mutex

    init
        // ensures that vbos and materials do not change while joint is rendered
        mutex = Mutex()

    construct(bodyA : soy.bodies.Body, bodyB : soy.bodies.Body?,
              anchor : soy.atoms.Position?, axis1 : soy.atoms.Axis?,
              axis2 : soy.atoms.Axis?, material : soy.materials.Material?)
        self.bodyA = bodyA
        self.bodyB = bodyB
        self._material = material

        // Lock scene until were done
        soy.scenes._stepLock.writer_lock()

        // Create joint
        self.create()

        // Store a ref to self it ODE joint
        joint.SetData((void*) self)

        // Attach joint to body/ies
        if bodyB == null
            joint.Attach(bodyA.body, null)
        else
            joint.Attach(bodyA.body, bodyB.body)

        // Setup joint
        self.setup(anchor, axis1, axis2)

        // add self to scenes for rendering
        // FIXME this breaks when moving bodies between scenes
        bodyA.scene.joints.add(self)

        // generate rotation matrices
        self.gen_matrices()

        // Unlock scene
        soy.scenes._stepLock.writer_unlock()


    def virtual create ( )
        self.joint = new ode.joints.Joint(soy.scenes._world, null)


    def virtual setup (anchor : soy.atoms.Position?, axis1 : soy.atoms.Axis?,
                       axis2 : soy.atoms.Axis?)
        return


    def virtual gen_matrices ( )
        return


    def virtual render ( )
        return


    def virtual mult_model_matrix( )
        return


    def virtual mult_model_matrix_A( )
        return


    def virtual mult_model_matrix_B( )
        return


    ////////////////////////////////////////////////////////////////////////
    //
    // Material property
    _material : soy.materials.Material?
    prop material : soy.materials.Material?
        get
            return _material
        set
            mutex.lock()
            _material = value
            mutex.unlock()

