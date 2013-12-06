/*
 *  libsoy - soy.scenes.Scene
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
    GLib.Math
    GL
    Gee
    ode

GeomScene   : ulong = 1
GeomBody    : ulong = 2
GeomField   : ulong = 4
GeomLight   : ulong = 8
GeomGhost   : ulong = 16
GeomTestRay : ulong = 32
GeomIgnored : ulong = 64

MAX_RENDER_LEVEL : int = 1

class soy.scenes.Scene : Object

    space : ode.spaces.Space
    _contactGroup : ode.joints.JointGroup
    _lastStep : uint64
    _tv : TimeVal
    lights : Gee.HashSet of soy.bodies.Light
    bodies : dict of string, soy.bodies.Body
    joints : list of soy.joints.Joint
    Controllers : Gee.HashSet of soy.controllers.VirtualController
    fields : dict of ode.Body,soy.fields.Field
    _callFields : LinkedList of soy.fields.Field
    _giveFields : LinkedList of soy.fields.Field
    _skybox : soy.textures.Cubemap
    _skybox_updated : bool // do the skybox buffers need to be updated?
    _ebo    : GLuint
    _vbo    : GLuint
    tslvs : array of GLfloat
    _colTextureID : GLuint
    colTexels : GLfloat*

    //
    // Class constructor
    init static
        if soy.scenes._thread is null
            soy.scenes._thread = new soy.scenes._PhysicsThread()


    //
    // Instance constructor
    construct ()
        bodies = new dict of string, soy.bodies.Body
        lights = new Gee.HashSet of soy.bodies.Light
        joints = new list of soy.joints.Joint
        Controllers = new Gee.HashSet of soy.controllers.VirtualController
        fields = new dict of unowned ode.Body,soy.fields.Field
        _callFields = new LinkedList of soy.fields.Field
        _giveFields = new LinkedList of soy.fields.Field
        _ambient = new array of GLfloat[4] = {0.5f, 0.5f, 0.5f, 1.0f}
        _fog = new array of GLfloat[4] = {0.0f, 0.0f, 0.0f, 0.0f}
        space = new ode.spaces.Space( null )
        _contactGroup = new ode.joints.JointGroup(0)
        _ebo = 0 // for first pass checking
        _skybox = skybox
        _skybox_updated = true
        colTexels = malloc(sizeof(GLfloat) * 4 * 16)
        self.rotation = new array of GLfloat[9] = {1.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 1.0f}
        self.position = new soy.atoms.Position()

        // Get current time
        // Note: Any information more precise than milliseconds is lost
        _tv = GLib.TimeVal()
        _time = ((uint64) _tv.tv_sec) * 1000 + ((uint64) _tv.tv_usec) / 1000
        _lastStep = ((uint64) _tv.tv_sec) * 1000 + ((uint64) _tv.tv_usec) / 1000

        // Add timeout callback
        var source = new TimeoutSource(10)
        source.set_callback ((GLib.SourceFunc) self.step )
        source.attach(soy.scenes._thread.context)

        // Set gravity
        _gravity = new soy.atoms.Vector(0.0f, 0.0f, 0.0f)

    //
    // Mapping
    def new get (key : string) : soy.bodies.Body?
        if key in bodies.keys
            return bodies[key]
        return null


    def has_key (key : string) : bool
        return bodies.has_key(key)


    def new set (key : string, value : soy.bodies.Body?)
        _stepLock.writer_lock()
        bodies[key] = value
        value.add(key, self)
        _stepLock.writer_unlock()

    //
    // Scene Callbacks
    def _collided (geomA : geoms.Geom, geomB : geoms.Geom) : void
        numberOfContacts : int
        contactGeoms : ode.ContactGeomArray* = new ode.ContactGeomArray(4)
        bodyA : unowned ode.Body? = null
        bodyB : unowned ode.Body? = null
        contact : ode.Contact = ode.Contact()

        // Get Contact Geoms
        //
        // We ask ODE for up to 4 contact points between the two geoms.
        numberOfContacts = geomA.Collide(geomB, 4,
                                         contactGeoms,
                                         (int) sizeof(ode.ContactGeom))

        // This callback may be called when two objects are near each other
        // but not actually touching.  In this case we test for actual contacts
        // above and then return if none are found.
        if numberOfContacts == 0
            return

        // Scene Check
        //
        // Geoms are either associated with a scene (ie, the ground) or a body.
        // When a body collides with a scene (ie, tire on ground), only the
        // body moves in reaction (the tire can't move the ground) so the
        // resulting Contact joint is between the body and NULL.
        //
        // Geoms associated with a scene are flagged with GeomScene to mark
        // this condition, otherwise they're assumed to have an attached body.
        if geomA.GetCategoryBits() != GeomScene
            bodyA = geomA.GetBody()
        if geomB.GetCategoryBits() != GeomScene
            bodyB = geomB.GetBody()

        // Ghost Check
        //
        // A "ghost" is a body who's movement is constrained by the the scene
        // and other bodies in the scene, but who cannot effect other bodies
        // in the scene.
        //
        // An example would be an invisible camera in the scene.  You wouldn't
        // want the camera ending up inside an object or terrain, but it also
        // shouldn't be able to move objects it bumps into.
        //
        // To accomplish this, we change the Body its colliding with to NULL
        // so that the "ghost" object is colliding against an immovable point
        // in the scene rather than the other body.
        if geomA.GetCategoryBits() == GeomGhost
            bodyB = null
        if geomB.GetCategoryBits() == GeomGhost
            bodyA = null

        // If both bodies are NULL (ie, Ghost-Ghost collision) just return now.
        if bodyA == bodyB
            return

        // Add bodies to callFields.
        if self.fields.has_key(bodyA)
            self._callFields.add(self.fields[bodyA])
        if self.fields.has_key(bodyB)
            self._callFields.add(self.fields[bodyB])

        // Create Contact Joints
        //
        // So we're working with a few things here.  To start, we have the
        // array of ContactGeoms.  Each ContactGeom represents a different
        // point of contact between these two bodies and will result in its
        // own Contact joint.
        //
        // In order to create these Contact joints we need to setup a struct
        // we call "contact" which holds a copy of the ContactGeom and surface
        // parameters such as how much friction it applies and how much bounce
        // it has to it.
        //
        // Once the "contact" struct is finished we create a new Contact joint
        // and add it to our _contactGroup which is reset after each step, then
        // attach it to bodyA and bodyB as determined above.
        //
        // TODO surface parameters should come from the Shape, not hard-coded!
        numberOfContacts -= 1
        for var i = 0 to numberOfContacts
            contact.geom = contactGeoms->get(i)
            contact.surface.mode = ode.contacts.Bounce
            contact.surface.mu = (Real) 0.0
            contact.surface.bounce = (Real) 0.8
            contact.surface.bounce_vel = (Real) 0.0
            joint : ode.joints.Contact* = new ode.joints.Contact(_world,
                                                                 _contactGroup,
                                                                 contact)
            joint->Attach(bodyA, bodyB)
        return

    // Scene Methods
    def step () : bool
        self._callFields.clear()
        self._giveFields.clear()

        for field in self.fields.values
            // Make sure every field is in givefields & give each one
            if not self._giveFields.contains(field)
                field.give(0)
                self._giveFields.add(field)

        for field in self.fields.values
            // Apply fields; add incompletely applied fields to the list
            if not field.apply()
                self._callFields.add(field)

        // Apply any outstanding fields
        for field in self._callFields
            field.commit()

        var finished_controllers = new Gee.LinkedList of soy.controllers.VirtualController()

        // Apply gravity
        for body in self.bodies.values
            m : float = body.density * body.volume()
            body.addForce(m*self._gravity.x, m*self._gravity.y,m*self._gravity.z)

        // Get current time
        _tv.get_current_time()
        self._time = ((uint64) _tv.tv_sec) * 1000 + ((uint64) _tv.tv_usec) / 1000
        var steps = GLib.Math.lround((self.time - _lastStep)/10)
        _lastStep = self._time
        _stepLock.writer_lock()
        for var i = 0 to steps
            _tv.get_current_time()
            self._time = ((uint64) _tv.tv_sec) * 1000 + ((uint64) _tv.tv_usec) / 1000
            self.do_in_step()
            // apply gravity
            //for body in self.bodies.values
            //    m : float = body.density * body.volume()
            //    body.addForce(m*self._gravity.x, m*self._gravity.y,m*self._gravity.z)
            for field in self._giveFields
                field.give(1)
            self._callFields.clear()
            for cont in self.Controllers
                cont.run_controller()
                if cont.finished
                    finished_controllers.add(cont)
            self.Controllers.remove_all(finished_controllers)
            finished_controllers.clear()

            if self.bodies.values is not null
                bodies_arr : array of soy.bodies.Body = bodies.values.to_array()
                glEnable(GL_TEXTURE_2D)
                if _colTextureID is 0
                    glGenTextures(1, out _colTextureID)
                glActiveTexture(GL_TEXTURE0)
                glBindTexture(GL_TEXTURE_2D, _colTextureID)
                var index = 0
                for body in bodies_arr
                    if index >= 64
                        break
                    colTexels[index] = body.position.x
                    colTexels[index+1] = body.position.y
                    colTexels[index+2] = body.position.z
                    colTexels[index+3] = body.col_radius
                    index += 4
                glTexImage2D(GL_TEXTURE_2D, 0, (GLint) GL_RGBA,
                             4, 4, 0,
                             GL_RGBA, GL_FLOAT,
                             (GL.GLvoid*) self.colTexels)
                glDisable(GL_TEXTURE_2D)

            space.Collide(self._collided)
            // FIXME QuickStep needs to be run once for all scenes
            // FIXME changing that will require refactoring this method
            _world.QuickStep(0.01f)
            _contactGroup.Empty()
            if i != 0
                for field in self._callFields
                    field.give(0)
        _stepLock.writer_unlock()
        return true


    // Overridable method for subclasses to do something inside step-method.
    def virtual do_in_step ()
        pass


    /* Render Scene

        This is called by a Camera to render the scene.  The argumets come from
        the various camera/destination properties, these are used here instead
        of by the Camera class because some Scene subclasses may need to do
        more interesting things, like render in multiple passes with different
        znear/zfar parameters or bend the fov.
    */
    def virtual render (fov : GLfloat, aspect : GLfloat,
                        znear : GLfloat, zfar : GLfloat,
                        camera : soy.bodies.Camera, level : int)
        if level > MAX_RENDER_LEVEL
            return
        i : GLenum // for looping through lights by OpenGL ID

        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()

        //
        // gluPerspective(fov, aspect, znear, zfar)
        perspective(fov, aspect, znear, zfar)

        //
        // Switch to MODELVIEW
        glMatrixMode(GL_MODELVIEW)

        //
        // Setup scene-level rendering
        glClear(GL_DEPTH_BUFFER_BIT)
        
        if _skybox is not null
            z : GLfloat = zfar/2.0f
            glPushMatrix()
            glScalef(z, z, z)
            self._enable_skybox()
            glPopMatrix()

        // Translate to scene center
        pos : soy.atoms.Position = camera.position
        glTranslatef (-(GLfloat) pos.x, -(GLfloat) pos.y, -(GLfloat) pos.z)

        glEnable (GL_DEPTH_TEST)

        glEnable (GL_LIGHTING)
        glLightModelfv(GL_LIGHT_MODEL_AMBIENT, _ambient)

        self.render_extra()

        //
        // Turn on fog if enabled
        if _fog[3] != 0.0f
            // We'll Clear To The Color Of The Fog ( Modified )
            glClearColor(0.5f, 0.5f, 0.5f ,1.0f)    // FIXME
            glEnable(GL_FOG)                        // Enables GL_FOG
            // Note GL_FOG_MODE uses glFogi on desktop OpenGL, possible FIXME
            glFogf(GL_FOG_MODE, GL_EXP2)            // Fog Mode
            glFogfv(GL_FOG_COLOR, _fog)             // Set Fog Color
            glFogf(GL_FOG_DENSITY, self._fog[3]/20.0f) // FIXME wtf?
            glHint(GL_FOG_HINT, GL_NICEST)          // Fog Hint Value
            glFogf(GL_FOG_START, 1.0f)              // Fog Start Depth
            glFogf(GL_FOG_END, 50.0f)               // Fog End Depth

        //
        // Turn on lights
        i = GL_LIGHT0
        for light in lights
            light.on(i)
            i++

        _stepLock.reader_lock()
        size : int = self.bodies.size
        if bodies.values is not null
            bodies_arr : array of soy.bodies.Body = bodies.values.to_array()
            distances : array of float = new array of float[size]
            x_positions : array of float = new array of float[size]
            y_positions : array of float = new array of float[size]
            z_positions : array of float = new array of float[size]
            j, k, l : int
            max : float
            j = 0
            l = 0

            for body in bodies_arr
                x_positions[j] = body.position.x
                y_positions[j] = body.position.y
                z_positions[j] = body.position.z

                j += 1

            body_distance_squared(distances, x_positions, y_positions, z_positions,
                                  (float) pos.x, (float) pos.y, (float) pos.z, size)

            j = size - 1
            while j > 0
                max = -1.0f
                for k = 0 to (size - 1)
                    if distances[k] > max
                        max = distances[k]
                        l = k

                distances[l] = -1.0f
                bodies_arr[l].render(false, camera, level)
                bodies_arr[l].render(true, camera, level)
                j -= 1
        

        for joint in joints
            joint.render()

        _stepLock.reader_unlock()

        //
        // Turn lights off
        i = GL_LIGHT0
        for light in lights
            light.off(i)
            i++

        // Disable fog if needed
        if self._fog[3] != 0.0f
            glDisable(GL_FOG)

        glDisable(GL_LIGHTING)
        glDisable(GL_DEPTH_TEST)

    def virtual render_extra ()
        return


    /* Set projection matrix for perspective view

        This is a variant of  gluPerspective(fov, aspect, znear, zfar) which
        works with OpenGL ES 1, where GLU is designed for desktop OpenGL only.

        This is defined separately because subclasses may want to call it with
        a different render() method.
    */
    def static perspective (fovy : GLfloat, aspect : GLfloat,
                            zNear : GLfloat, zFar : GLfloat)
        // This function replaces gluPerspective for GLES1.1
        m : array of GLfloat
        deltaZ : float = zFar - zNear
        radians : float = fovy / 2.0f * 3.141592653589793f / 180.0f
        sine : float = Posix.sinf(radians)

        // Bail now if parameters would divide by zero
        if ((deltaZ == 0.0f) || (sine == 0.0f) || (aspect == 0.0f))
            return

        cotangent : float = Posix.cosf(radians) / sine

        // Set matrix
        m = {
            1.0f,   0.0f,   0.0f,   0.0f,
            0.0f,   1.0f,   0.0f,   0.0f,
            0.0f,   0.0f,   1.0f,  -1.0f,
            0.0f,   0.0f,   0.0f,   0.0f}
        m[0] = cotangent / aspect
        m[5] = cotangent
        m[10] = -(zFar + zNear) / deltaZ
        m[14] = -2.0f * zNear * zFar / deltaZ
        glMultMatrixf(m);

    ////////////////////////////////////////////////////////////////////////
    // Pathfinding Methods

    def _check_collisions_NearCallback(o1 : ode.geoms.Geom, o2 : ode.geoms.Geom)
        result : bool*
        flags  : int = 1 //int.MIN + 1 //0x80000001 // 1000000000000000 0000000000000001

        cat1 : ulong = o1.GetCategoryBits()
        cat2 : ulong = o2.GetCategoryBits()
        if (cat1 & GeomIgnored) != 0 or (cat2 & GeomIgnored) != 0
            return
        else if o1.GetCategoryBits() == GeomTestRay
            result = ((bool*)o1.GetData())
        else if o2.GetCategoryBits() == GeomTestRay
            result = ((bool*)o2.GetData())
        else
            // Niether of the Geoms are the Rays we made, we can skip them.
            return
        if *result
            // we have already found that this ray has a collision
            return

        if (o2.IsSpace() | o1.IsSpace()) != 0
            o1.Collide2(o2, self._check_collisions_NearCallback)

        contactGeoms : ode.ContactGeomArray* = new ode.ContactGeomArray(1)
        num : int = o1.Collide(o2, flags, contactGeoms, (int)sizeof(ode.ContactGeom))
        if num != 0
            *result = true
        return


    def check_path_collision(start : soy.atoms.Position, end : soy.atoms.Position) : bool
        ends : array of soy.atoms.Position = {end}
        return check_collisions(start, ends)[0]

    /*
     * This should not be exposed in Python, this is just for use in the pathfinding code
     *
     * This takes in a start position and an array of other positions. It returns an array
     * of booleans where the ith entry is true if and only if there is not a path between the
     * start position and the ith entry of the given array.
     *
     */
    def check_collisions(start : soy.atoms.Position,
                         ends  : array of soy.atoms.Position) : array of bool
        ret : array of bool = new array of bool[ends.length]

        /* We do this whole thing with the pointers and the geoms array because we need
         * to make sure that there is a lock on the scene when all the new geoms get removed.
         * we also need to make sure that all geoms are removed before the next physics step.
         */
        geoms : array of ode.geoms.Ray* = new array of ode.geoms.Ray*[ends.length]

        category_bits : ulong = GeomTestRay
        collide_bits  : ulong = ~(category_bits|GeomIgnored) // GeomIgnored will be given to object
                                                             // wants to guide so will not trip up pathfinding

        // We don't want this running at the same time as a step.
        _stepLock.writer_lock()
        for i : int = 0 to (ends.length - 1)
            ret[i] = false
            dx : float = ends[i].x - start.x
            dy : float = ends[i].y - start.y
            dz : float = ends[i].z - start.z
            dist : ode.Real = (ode.Real) Math.hypotf(Math.hypotf(dx,dy),dz)
            ray  : ode.geoms.Ray* = new ode.geoms.Ray(self.space, dist)
            ray->Set((ode.Real) start.x, (ode.Real) start.y, (ode.Real) start.z,
                        (ode.Real) dx, (ode.Real) dy, (ode.Real) dz)
            ray->SetCollideBits(collide_bits)
            ray->SetCategoryBits(category_bits)
            ray->SetData((void *) (&(ret[i]))) /*set data to the pointer to the bool in ret*/
            geoms[i] = ray

        //call collide
        space.Collide(self._check_collisions_NearCallback)

        //clean up
        for i : ode.geoms.Ray* in geoms
            //make sure all the geoms are removed
            delete i
        _stepLock.writer_unlock()
        return ret

    def check_collisions_with_radius(start  : soy.atoms.Position,
                                     ends   : array of soy.atoms.Position,
                                     radius : float) : array of bool
        ret : array of bool = new array of bool[ends.length]
        geoms : array of ode.geoms.Capsule* = new array of ode.geoms.Capsule*[ends.length]

        category_bits : ulong = GeomTestRay
        collide_bits  : ulong = ~(category_bits|GeomIgnored) // GeomIgnored will be given to object
                                                             // wants to guide so will not trip up pathfinding

        _stepLock.writer_lock()
        for i : int = 0 to (ends.length - 1)
            ret[i] = false
            end : soy.atoms.Position = ends[i]
            dist : float = Math.hypotf(Math.hypotf(end.x - start.x, end.y - start.y),
                                                   end.z - start.z)
            angle : float = Math.acosf((end.z - start.z)/(dist))

            // (0,0,dist) X ((end-start))
            //
            // | i j   k  |
            // | 0 0 dist |
            // | x y   z  |
            axis_x : float = -(dist*(end.y - start.y))
            axis_y : float = dist*(end.x - start.x)
            axis_z : float = 0

            cap : ode.geoms.Capsule* = new ode.geoms.Capsule(self.space, radius, dist)
            cap->SetPosition(start.x + (end.x - start.x)/2.0f, start.y + (end.y - start.y)/2.0f, start.z + (end.z - start.z)/2.0f)
            rot : ode.Matrix3 = new ode.Matrix3()
            rot.FromAxisAndAngle(axis_x, axis_y, axis_z, angle)
            cap->SetRotation(rot)
            cap->SetCollideBits(collide_bits)
            cap->SetCategoryBits(category_bits)
            cap->SetData((void *)(&(ret[i])))
            geoms[i] = cap

        //call collide
        space.Collide(self._check_collisions_NearCallback)

        //clean up
        for i : ode.geoms.Capsule* in geoms
            //make sure all the rays are removed
            delete i
        _stepLock.writer_unlock()
        return ret



    /*
     * Version of check_collisions with the added atoms.Size argument, which is the size of the bounding box of
     * whatever you want to check collisions for. This function assumes that the object bounded will always be bounded by this box
     * no matter its (or the box's) orientation.
     *
     * NB This means that for a cube with side length of 1 which might spin around any of its axes the correct bounding box would be
     * (sqrt(3), sqrt(3), sqrt(3)), If it can only spin about its z-axis then the bounding box should be (sqrt(2), sqrt(2), 1), etc.
     */
    def check_collisions_with_size(start : soy.atoms.Position,
                                   ends  : array of soy.atoms.Position,
                                   aabb  : soy.atoms.Size) : array of bool
        ret : array of bool = new array of bool[ends.length]
        start_bool : bool = false
        geoms : array of ode.geoms.Box* = new array of ode.geoms.Box*[2*ends.length]

        category_bits : ulong = GeomTestRay
        collide_bits  : ulong = ~(category_bits|GeomIgnored) // GeomIgnored will be given to object
                                                             // wants to guide so will not trip up pathfinding

        x : float = (float) aabb.width
        y : float = (float) aabb.height
        z : float = (float) aabb.depth

        size_y : float = Math.hypotf(x,y)
        size_z : float = Math.hypotf(x,z)

        _stepLock.writer_lock()
        box_start : ode.geoms.Box* = new ode.geoms.Box(self.space, x, y, z)
        box_start->SetPosition(start.x, start.y, start.z)
        box_start->SetCollideBits(collide_bits)
        box_start->SetCategoryBits(category_bits)
        box_start->SetData((void *) (&start_bool))
        for i : int = 0 to (ends.length - 1)
            ret[i] = false
            end : soy.atoms.Position = ends[i]
            dist : float = Math.hypotf(Math.hypotf(end.x - start.x, end.y - start.y),
                                       end.z - start.z)

            // arccos(\frac{(dist,0,0) \cdot (end - start)}{dist^{2}})
            angle : float = Math.acosf((end.x - start.x)/(dist))

            // (dist,0,0) X (end-start)
            //
            // |   i  j k |
            // | dist 0 0 |
            // |   x  y z |
            axis_x : float = 0
            axis_y : float = -(dist*(end.z - start.z))
            axis_z : float = dist*(end.y - start.y)

            box_end   : ode.geoms.Box* = new ode.geoms.Box(self.space, x, y, z)
            middle    : ode.geoms.Box* = new ode.geoms.Box(self.space, dist, size_y, size_z)

            box_end->SetPosition(end.x, end.y, end.z)
            middle->SetPosition(start.x + (end.x - start.x)/2.0f, start.y + (end.y - start.y)/2.0f, start.z + (end.z - start.z)/2.0f)

            rot : ode.Matrix3 = new ode.Matrix3()
            rot.FromAxisAndAngle(axis_x, axis_y, axis_z, angle)
            middle->SetRotation(rot)

            box_end->SetCollideBits(collide_bits)
            middle->SetCollideBits(collide_bits)

            box_end->SetCategoryBits(category_bits)
            middle->SetCategoryBits(category_bits)

            // set data to the pointer to the same bool in ret, so if any of them goes they all do
            box_end->SetData((void *) (&(ret[i])))
            middle->SetData((void *) (&(ret[i])))

            geoms[2*i] = middle
            geoms[2*i+1] = box_end

        //call collide
        space.Collide(self._check_collisions_NearCallback)

        //clean up
        delete box_start
        for i : ode.geoms.Box* in geoms
            //make sure all the rays are removed
            delete i
        _stepLock.writer_unlock()
        if start_bool
            //Means there was a collision at the very begining, so set all paths to true
            for i : int = 0 to (ends.length - 1)
                ret[i] = true
        return ret

    
    def _enable_skybox()
        // update (if necessary) the skybox or rebind buffers
        if _skybox_updated
            _update_skybox()

        // rebind buffers when they arent getting updated
        else
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
            glBindBuffer(GL_ARRAY_BUFFER, _vbo)

        // activate the texture
        glActiveTexture(GL_TEXTURE0)
        glClientActiveTexture(GL_TEXTURE0)
        glEnableClientState(GL_TEXTURE_COORD_ARRAY)
        glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, (GLint) GL_MODULATE)
        _skybox.enable()

        // draw the elements
        glVertexPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 3), null)
        glTexCoordPointer(3, GL_FLOAT, (GLsizei) (sizeof(GLfloat) * 3), null)
        glDrawElements(GL_TRIANGLES, (GLsizei) 36, GL_UNSIGNED_BYTE, null)

        // disable the texture after use
        glClientActiveTexture(GL_TEXTURE0)
        glDisableClientState(GL_TEXTURE_COORD_ARRAY)
        _skybox.disable()


    def _update_skybox()
        ///////////////////////////////////////////////
        // The skybox is rendered before anything else is and before the depth
        // buffer is turned on. Therefore, the width, height, and depth of it
        // are 1 to simplify code. It is a cube that the scene is rendered on
        // top of to provide a background. 
        //
        //    2.......3
        //   /|      /|
        //  6.......7 |
        //  | |     | |
        //  | 0.....|.1
        //  |/      |/
        //  4.......5

        // on first pass
        if _ebo == 0
            glGenBuffers(1, out _ebo)
            glGenBuffers(1, out _vbo)

        // each side is composed of 4 vertices and 2 triangles
        // there are 8 total vertices in the skybox
        // each dot in the diagram below is a vertex
        // .---.
        // | / |
        // .___.

        // the faces are generated in this order:
        // right, left, top, bottom, front, back

        // index array of vertex array
        elements : array of GLubyte = {
            5, 7, 1,    1, 7, 3, // right
            0, 2, 4,    4, 2, 6, // left
            6, 2, 7,    7, 2, 3, // top
            0, 4, 1,    1, 4, 5, // bottom
            4, 6, 5,    5, 6, 7, // front
            1, 3, 0,    0, 3, 2  // back
        }
        
        // because it is only a texture being rendered, openGl only needs
        // positions (px py pz)
        vertices : array of GLfloat = {
            -1,-1,-1,
             1,-1,-1,
            -1, 1,-1,
             1, 1,-1,
            -1,-1, 1,
             1,-1, 1,
            -1, 1, 1,
             1, 1, 1
        }

        // bind elements
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _ebo)
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, 36, elements, GL_STATIC_DRAW)

        // bind vertices
        glBindBuffer(GL_ARRAY_BUFFER, _vbo)
        glBufferData(GL_ARRAY_BUFFER, (GLsizei) (8 * 3 * sizeof(GLfloat)),
                     vertices, GL_STATIC_DRAW)
        _skybox_updated = false

    def calculateTSLV (vertices : array of GLfloat)
        if self.lights.size is not 0 and vertices.length is not 0
            var _inv_mm = new array of GLfloat[16]
            var _model_light_pos = new array of ode.Real[3]
            var _vert_light_pos = new array of ode.Real[3]
            var _binormal = new array of ode.Real[3]
            self.tslvs = new array of GLfloat[(int)(vertices.length*3/14)]

            rotation : array of GLfloat = self.rotation
            position : soy.atoms.Position = self.position

            // There must be a better way to get a single light from a HashMap...
            dummy : ode.Vector3 = new ode.Vector3()
            light_position : unowned ode.Vector3 = dummy // placeholder
            for light in self.lights
                light_position = light.body.GetPosition()
                break

            _inv_mm[0]  = (GLfloat) rotation[0]
            _inv_mm[1]  = (GLfloat) rotation[1]
            _inv_mm[2]  = (GLfloat) rotation[2]
            _inv_mm[3]  = (GLfloat) 0.0
            _inv_mm[4]  = (GLfloat) rotation[3]
            _inv_mm[5]  = (GLfloat) rotation[4]
            _inv_mm[6]  = (GLfloat) rotation[5]
            _inv_mm[7]  = (GLfloat) 0.0
            _inv_mm[8]  = (GLfloat) rotation[6]
            _inv_mm[9]  = (GLfloat) rotation[7]
            _inv_mm[10] = (GLfloat) rotation[8]
            _inv_mm[11] = (GLfloat) 0.0
            _inv_mm[12] = (GLfloat) (-position.x)
            _inv_mm[13] = (GLfloat) (-position.y)
            _inv_mm[14] = (GLfloat) (-position.z)
            _inv_mm[15] = (GLfloat) 1.0
            //
            // Vector by matrix multiplication by hand
            // This code needs to average the light color and vector
            //
            _model_light_pos[0] = (_inv_mm[0] * (light_position.x + _inv_mm[12])
                                 + _inv_mm[4] * (light_position.y + _inv_mm[13])
                                 + _inv_mm[8] * (light_position.z + _inv_mm[14]))
            _model_light_pos[1] = (_inv_mm[1] * (light_position.x + _inv_mm[12])
                                 + _inv_mm[5] * (light_position.y + _inv_mm[13])
                                 + _inv_mm[9] * (light_position.z + _inv_mm[14]))
            _model_light_pos[2] = (_inv_mm[2] * (light_position.x + _inv_mm[12])
                                 + _inv_mm[6] * (light_position.y + _inv_mm[13])
                                 + _inv_mm[10]* (light_position.z + _inv_mm[14]))

            // Assign values to each vertex in array
            for var i=0 to ((vertices.length/14)-1)
                _vert_light_pos[0] = _model_light_pos[0] - vertices[i*11]
                _vert_light_pos[1] = _model_light_pos[1] - vertices[i*11+1]
                _vert_light_pos[2] = _model_light_pos[2] - vertices[i*11+2]

                _lgt : float = sqrtf((float)(_vert_light_pos[0] * _vert_light_pos[0]
                                            +_vert_light_pos[1] * _vert_light_pos[1]
                                            +_vert_light_pos[2] * _vert_light_pos[2]))

                _vert_light_pos[0] = _vert_light_pos[0] / _lgt
                _vert_light_pos[1] = _vert_light_pos[1] / _lgt
                _vert_light_pos[2] = _vert_light_pos[2] / _lgt

                _binormal[0] = (vertices[i*11+9] * vertices[i*11+5] -
                                vertices[i*11+10] * vertices[i*11+4])
                _binormal[1] = (vertices[i*11+10] * vertices[i*11+3] -
                               vertices[i*11+8] * vertices[i*11+5])
                _binormal[2] = (vertices[i*11+8] * vertices[i*11+4] -
                                vertices[i*11+9] * vertices[i*11+3])

                self.tslvs[i*3] = (GLfloat) (_vert_light_pos[0] * vertices[i*11+8]
                                      +_vert_light_pos[1] * vertices[i*11+9]
                                      +_vert_light_pos[2] * vertices[i*11+10])
                self.tslvs[i*3+1] = (GLfloat) (_vert_light_pos[0] * _binormal[0]
                                        +_vert_light_pos[1] * _binormal[1]
                                        +_vert_light_pos[2] * _binormal[2])
                self.tslvs[i*3+2] = (GLfloat) (_vert_light_pos[0] * vertices[i*11+3]
                                        +_vert_light_pos[1] * vertices[i*11+4]
                                        +_vert_light_pos[2] * vertices[i*11+5])

    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // time Property
    _time : uint64
    prop time : uint64
        get
            return self._time

    //
    // ambient Property
    _ambient : array of GLfloat
    _ambient_obj : weak soy.atoms.Color?

    def _ambient_set(color : soy.atoms.Color)
        _ambient = color.get4f()

    def _ambient_weak(ambient : Object)
        self._ambient_obj = null

    prop ambient : soy.atoms.Color
        owned get
            value : soy.atoms.Color? = self._ambient_obj
            if value is null
                value = new soy.atoms.Color.new4f(self._ambient)
                value.on_set.connect(self._ambient_set)
                value.weak_ref(self._ambient_weak)
                self._ambient_obj = value
            return value
        set
            self._ambient_set(value)
            if _ambient_obj != null
                _ambient_obj.on_set.disconnect(self._ambient_set)
                _ambient_obj.weak_unref(self._ambient_weak)
            _ambient_obj = value
            value.on_set.connect(self._ambient_set)
            value.weak_ref(self._ambient_weak)


    //
    // fog Property
    _fog : array of GLfloat
    _fog_obj : weak soy.atoms.Color?

    def _fog_set(color : soy.atoms.Color)
        _fog = color.get4f()

    def _fog_weak(ambient : Object)
        self._fog_obj = null

    prop fog : soy.atoms.Color
        owned get
            value : soy.atoms.Color? = self._fog_obj
            if value is null
                value = new soy.atoms.Color.new4f(self._fog)
                value.on_set.connect(self._fog_set)
                value.weak_ref(self._fog_weak)
                self._fog_obj = value
            return value
        set
            self._fog_set(value)
            if _fog_obj != null
                _fog_obj.on_set.disconnect(self._fog_set)
                _fog_obj.weak_unref(self._fog_weak)
            _fog_obj = value
            value.on_set.connect(self._fog_set)
            value.weak_ref(self._fog_weak)


    //
    // gravity Property
    _gravity : soy.atoms.Vector
    prop gravity : soy.atoms.Vector
        get
            return _gravity
        set
            _stepLock.writer_lock()
            _gravity = value
            _stepLock.writer_unlock()


    prop length : ulong
        get
            return bodies.size

    prop skybox : soy.textures.Cubemap
        get
            return _skybox
        set
            _skybox = value
            _skybox_updated = true
            

    //
    // stepsize Property
    prop stepsize : float

    //
    // rotation Property
    _rotation : array of GLfloat
    prop rotation : array of GLfloat
        get
            return _rotation
        set
            _stepLock.writer_lock()
            _rotation = value
            _stepLock.writer_unlock()

    //
    // position Property
    _position : soy.atoms.Position
    prop position : soy.atoms.Position
        get
            return _position
        set
            _stepLock.writer_lock()
            _position = value
            _stepLock.writer_unlock()

    //////////////////////////////////////////////////
    // orc functions

    // returns the distance squared between the origin body at
    // (x_origin, y_origin, z_origin) and each body described in
    // x_positions, y_positions, z_positions 
    def static extern body_distance_squared(distances:   float*,
                                            x_positions: float*,
                                            y_positions: float*,
                                            z_positions: float*,
                                            x_origin:    float,
                                            y_origin:    float,
                                            z_origin:    float,
                                            size:        int)

    // returns the distance between the origin body at 
    // (x_origin, y_origin, z_origin) and each body described in
    // x_positions, y_positions, z_positions
    def static extern body_distance(distances   : float*,
                                    x_positions : float*,
                                    y_positions : float*,
                                    z_positions : float*,
                                    x_origin    : float,
                                    y_origin    : float,
                                    z_origin    : float,
                                    size        : int)
