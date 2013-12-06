/*
 *  libsoy - soy.controllers.BaseNavigator
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
    soy
    ode

class soy.controllers.BaseNavigator : soy.controllers.Pathfollower

    graph : soy.controllers.graph.IGraph
    _updates : bool
    _dest : soy.atoms.Position
    source : TimeoutSource? /* should be protected, in subclasses be sure to remove when unneeded */
    _prev_cat_bits : ulong
    _finding_path : bool

    construct (scene       : soy.scenes.Scene,
               controlled  : soy.bodies.Body,
               speed       : float,
               fuzziness   : float,
               graph       : soy.controllers.graph.IGraph,
               end         : soy.atoms.Position,
               updates     : bool,
               paused      : bool)
        super(scene, controlled, speed, fuzziness, true, new Gee.LinkedList of soy.atoms.Position)
        self._updates = updates
        self._dest = end
        self._dest.on_set.connect(self._dest_set)
        self.graph = graph
        self._finding_path = true

        _set_cat_bits(_prev_cat_bits|GeomIgnored)
        self.path = soy.controllers.graph.Pathfinder.find_optimized_path(scene, controlled.position, _dest, graph)
        _set_cat_bits(_prev_cat_bits)
        self.paused = paused
        self._finding_path = false

        if self._updates
            self.source = new TimeoutSource(150) //FIXME What should this be, currently 1 every 15 physics steps
            self.source.set_callback((GLib.SourceFunc)self._SF_run_update)
            self.source.attach(soy.controllers._thread.context)
            self.source.set_priority(Priority.DEFAULT + 10)

    def override waypoint_reached(body : ode.Body, next_vec : soy.atoms.Vector, dist : float) : void
        super.waypoint_reached(body, next_vec, dist)
        if _updates
            _run_updater()

    def override path_finished(body : ode.Body) : void
        super.path_finished(body)
        if not(self.source is null)
            self.source.destroy()
            self.source = null

    def override skipped(body : ode.Body) : void
        if self._finding_path or self.paused
            body.SetLinearVel(0.0f, 0.0f, 0.0f)
        return

    def _SF_run_update() : bool
        if self.finished
            return true // This is so if the destination is changed we do not need
                        // to do all this stuff with re-adding the source callback...

        self._do_update()
        return true

    /*
     * Start a new thread to check if there are any obstructions between current location and next waypoint.
     */
    def _run_updater() : void
        if self.finished
            return
        /*try
            GLib.Thread.create of void*(_do_update, false)
        except ex : ThreadError
            print "ThreadError: %s", ex.message
        return */

    /*
     * Check if there are any obstructions between current location and next waypoint.
     */
    def _do_update() : void*
        if not(self.path isa Gee.List of soy.atoms.Position)
            return null
        var pth = (Gee.List of soy.atoms.Position)self.path
        cur_pos : soy.atoms.Position = self.controlled.position
        // Hopefully this does not cause any problems with run_controller.
        self.path_lock.lock()
        if pth.size == 0
            self.path_lock.unlock()
            return null
        next_pos : soy.atoms.Position = pth.first()
        self.path_lock.unlock()
        _set_cat_bits(_prev_cat_bits|GeomIgnored)
        if self.graph.check_collisions(cur_pos, {next_pos})[0]
            self.update_path()

        _set_cat_bits(_prev_cat_bits)

        return null

    //FIXME maybe this should be in soy.bodies.Body
    /*
     * Set the category bits for an object.
     */
    def _set_cat_bits(bts : ulong) : void
        soy.scenes._stepLock.writer_lock()
        if self.controlled.geom != null
            self.controlled.geom.SetCategoryBits(bts)
/*        geo : ode.geoms.Geom = self.controlled.body.GetFirstGeom()
        while not(geo is null)
            geo.SetCategoryBits(bts)
            geo = geo.GetNextGeom() */
        soy.scenes._stepLock.writer_unlock()

    /*
     * Recalculate the path to the destination.
     */
    def update_path() : void
        self.path_lock.lock()
        self._finding_path = true
        _set_cat_bits(_prev_cat_bits|GeomIgnored)
        self.path = soy.controllers.graph.Pathfinder.find_optimized_path(scene, controlled.position, _dest, graph)
        self.path_lock.unlock()
        self._finding_path = false
        _set_cat_bits(_prev_cat_bits)

    ////////////////////////////////////////////////////////////////////////
    // Properties

    def _dest_set(pos : soy.atoms.Position)
        self.update_path()

    //
    // destination Property
    prop destination : soy.atoms.Position
        get
            return self._dest
        set
            self._dest.on_set.disconnect(self._dest_set)
            self._dest = value
            self.update_path()

