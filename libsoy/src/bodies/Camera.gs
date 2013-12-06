/*
 *  libsoy - soy.bodies.Camera
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
    ode
    soy
    soy.atoms

class soy.bodies.Camera : soy.bodies.Body
    _znear : GLfloat
    _zfar  : GLfloat

    init
        _lens = 45.0f
        _znear = 1.0f
        _zfar  = 256.0f


    construct (position : soy.atoms.Position?, radius : float = 1.0f)
        super(position, null, 0.0f)
        _radius = radius


    //prop wireframe

    //prop lens
    _lens  : GLfloat
    prop lens : float
        get
            return self._lens
        set
            // TODO test value to ensure it won't crash something
            self._lens = value


    //prop direction

    //prop right

    //prop up

    // prop radius
    _radius : GLfloat
    prop radius : float
        get
            return self._radius
        set
            if scene is not null
                soy.scenes._stepLock.writer_lock()
            self._radius = value
            if scene is not null
                soy.scenes._stepLock.writer_unlock()

            self.set_mass (self.density)

    def project (aspect : GLfloat)
        if(scene is null)
            return

        mtx : array of GLfloat[16] = new array of GLfloat[16]
        rot : weak ode.Matrix3 = self.body.GetRotation()
        glMatrixMode (GL_MODELVIEW)
        glLoadIdentity ()

        mtx[0]  = (GLfloat) rot.m0
        mtx[1]  = (GLfloat) rot.m1
        mtx[2]  = (GLfloat) rot.m2
        mtx[3]  = 0.0f
        mtx[4]  = (GLfloat) rot.m4
        mtx[5]  = (GLfloat) rot.m5
        mtx[6]  = (GLfloat) rot.m6
        mtx[7]  = 0.0f
        mtx[8]  = (GLfloat) rot.m8
        mtx[9]  = (GLfloat) rot.m9
        mtx[10] = (GLfloat) rot.ma
        mtx[11] = 0.0f
        mtx[12] = 0.0f
        mtx[13] = 0.0f
        mtx[14] = 0.0f
        mtx[15] = 1.0f

        // Rotate matrix by camera's rotation
        glLoadMatrixf (mtx)

        self.scene.render(self._lens, aspect, self._znear, self._zfar, self, 0)

    def override set_mass (density : float)
        if density is not 0 and self.volume() != 0.0f
            mass : ode.Mass = new ode.Mass()
            mass.SetSphere(density, _radius)
            body.SetMass(mass)
            body.SetGravityMode(1)
        else
            body.SetGravityMode(0)

