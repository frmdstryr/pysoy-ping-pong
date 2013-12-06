/*
 *  libsoy - soy.controllers.VirtualController
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


class soy.controllers.VirtualController : soy.controllers.Controller
    /*
     * Soy VirtualController
     *
     * This is the base virtual Controller class which all virtual controllers must inherit.
     */

     scene : soy.scenes.Scene

     construct (scene : soy.scenes.Scene)
        self.scene = scene
        soy.scenes._stepLock.writer_lock()
        scene.Controllers.add(self)
        soy.scenes._stepLock.writer_unlock()

    /* 
     * This function will be run just prior to each Collide call. stepLock.writer_lock will have already
     * been called by the time and so you should only interact with objects by means of functions in the ode
     * namespace.
     *
     * This function must return quickly
     */
    def virtual run_controller() : void
        return

    /*
     * Remove this controller from the scenes list of VirtualControllers, meaning that run_controller will no longer
     * be called.
     */
    def virtual unregister_controller() : void
        soy.scenes._stepLock.writer_lock()
        self.scene.Controllers.remove(self)
        soy.scenes._stepLock.writer_unlock()


    /*
     * Add this controller to the scene's list of VirtualControllers, meaning that run_controller will be called.
     */
    def virtual register_controller() : void
        soy.scenes._stepLock.writer_lock()
        self.scene.Controllers.add(self)
        soy.scenes._stepLock.writer_unlock()

    /*
     * True if the controller is registered with the scene and will be called prior to physics cycles, false otherwise
     */
    //
    // registered Property
    prop virtual registered : bool
        get
            return self.scene.Controllers.contains(self)
        set
            if value
                self.register_controller()
            else
                self.unregister_controller()

    /*
     * This property tells scene when this controller can be deleted. When the finished property returns
     * true it will stop being called from scene and left to be garbage collected.
     */
    prop virtual readonly finished : bool
        get
            return false

    def new tp_repr ( ) : string
        return "Generic Virtual Controller"
