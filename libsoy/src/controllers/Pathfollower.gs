/*
 *  libsoy - soy.controllers.Pathfollower
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
    Gee
    soy

class soy.controllers.Pathfollower : soy.controllers.VirtualController

    //FIXME these should both be protected when we can do it.
    _path : Gee.Iterable of soy.atoms.Position
    _iter_path : Gee.Iterator of soy.atoms.Position
    _iter_valid : bool = false

    controlled : soy.bodies.Body
    /* this should be locked if one is updating the path. If it is locked then the controller will be paused and return immediatly
     * when runcontroller is called
     */
    path_lock : RecMutex
    pause_lock : Mutex
    //Speed is maximum speed in units per physics-cycle
    _speed : float
    
    _finished : bool = false
    _paused : bool = true
    _fuzziness : float

    construct (scene : soy.scenes.Scene, controlled : soy.bodies.Body, speed : float, fuzziness : float, paused : bool, path : Gee.Iterable of soy.atoms.Position)
        super(scene)
        path_lock = RecMutex()
        pause_lock = Mutex()
        self._paused = true
        self.path_lock.lock()
        self._finished = false
        self._speed = speed
        self.controlled = controlled
        self._fuzziness = fuzziness
        self._iter_path = path.iterator()
        self._path = path
        if self._iter_path.has_next()
            self._iter_path.next()
            self._iter_valid = true
        if !paused
            self._paused = false
            self.path_lock.unlock()

    def override tp_repr() : string
        return "Generic pathfollower virtual controller"

    /*
     * This function is called when the body that is being controlled has arrived at it's final destination.
     */
    def virtual path_finished(body : ode.Body) : void
        body.SetLinearVel(0.0f, 0.0f, 0.0f)
        return

    /*
     * This function is called when the body that is being controlled has arrived at the next waypoint on its path.
     * It is called with the ode.Body that is being controled, a unit-length vector pointing to the next waypoint
     * and the distance to the next waypoint.
     */
    def virtual waypoint_reached(body : ode.Body, next_vec : soy.atoms.Vector, dist : float) : void
        self.between_waypoints(body, next_vec, dist)
        return
    /*
     * This function is called when the body that is being controlled is between waypoints.
     * It is called with the ode.Body that is being controled, a unit-length vector pointing to the next waypoint
     * and the distance to the next waypoint.
     */
    def virtual between_waypoints(body : ode.Body, next_vec : soy.atoms.Vector, dist : float) : void
        // The *100 is so the first is the speed needed to travel that distance in one tick. 
        spd : float = Math.fminf(dist*100.0f, self.speed)
        body.SetLinearVel(next_vec.x * spd, next_vec.y*spd, next_vec.z*spd)
        return

    /*
     * This function is called if run_controller is unable to get a lock on the path, or the
     * controller is paused. 
     */
    def virtual skipped(body : ode.Body) : void
        if self.paused
            body.SetLinearVel(0.0f, 0.0f, 0.0f)
        return

    /*
     * This function will be called before every physics step and will determine what to do next.
     * When called the thread is gaurenteed to hold the scene's stepLock.
     */
    def override run_controller() : void
        // Due to issues with deadlocks all access to and manipulation of bodies is to be through the ode.Body, not the soy.bodies.Body
        if _finished 
            return
        if self._paused or not(path_lock.trylock())
            self.skipped(self.controlled.body)
            return
        if !_iter_valid
            path_lock.unlock()
            self._finished = true
            self.path_finished(self.controlled.body)
            return
        cur  : unowned ode.Vector3 = self.controlled.body.GetPosition()
        next : soy.atoms.Position = self._iter_path.get() 
        dist : float = Math.hypotf(Math.hypotf(((float)cur.x) - next.x, ((float)cur.y) - next.y), ((float)cur.z) - next.z)
        vec : soy.atoms.Vector
        if dist < self._fuzziness
            self._iter_path.remove()
            if not(self._iter_path.has_next())
                path_lock.unlock()
                self._finished = true
                self.path_finished(self.controlled.body)
                return
            self._iter_path.next()
            next = self._iter_path.get()
            path_lock.unlock()
            dist = Math.hypotf(Math.hypotf(((float)cur.x) - next.x, ((float)cur.y) - next.y), ((float)cur.z) - next.z)
            if dist == 0.0f
                vec = new soy.atoms.Vector(0.0f, 0.0f, 0.0f)
            else
                vec = new soy.atoms.Vector((next.x - ((float)cur.x))/dist, (next.y - ((float)cur.y))/dist, (next.z - ((float)cur.z))/dist)
            self.waypoint_reached(self.controlled.body, vec, dist)
        else
            path_lock.unlock()
            vec = new soy.atoms.Vector((next.x - ((float)cur.x))/dist, (next.y - ((float)cur.y))/dist, (next.z - ((float)cur.z))/dist)
            self.between_waypoints(self.controlled.body, vec, dist)

    def override unregister_controller() : void
        super.unregister_controller()
        soy.scenes._stepLock.writer_lock()
        self.path_finished(self.controlled.body)
        soy.scenes._stepLock.writer_unlock()

    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // path Property
    prop path : Gee.Iterable of soy.atoms.Position
        get
            return self._path
        set
            self._path = value
            self._iter_path = value.iterator()
            if not(self._iter_path.has_next())
                self._iter_valid = false
                self._finished = true
                self.registered = false
            else
                self._iter_path.next()
                self._iter_valid = true
                self._finished = false
                self.registered = true

    //
    // speed Property
    //
    // speed in distance per physics-step
    prop virtual speed : float
        get
            return self._speed
        set
            assert value > 0.0f
            self._speed = value

    //
    // finished Property
    prop override readonly finished : bool
        get
            return _finished

    //
    // paused Property
    //
    // Allows one to pause and restart the controller.
    // will not perform any operation if set multiple times
    prop paused : bool
        get
            return _paused
        set
            self.pause_lock.lock()
            if _paused and not(value)
                self.path_lock.unlock()
                self._paused = false
            else if not(_paused) and value
                self.path_lock.lock()
                self._paused = true
            self.pause_lock.unlock()

    //
    // fuzziness Property
    //
    // The distance from a waypoint at which the controller considers it reached
    prop fuzziness : float
        get 
            return self._fuzziness
        set
            assert value > 0.0f
            self._fuzziness = value
