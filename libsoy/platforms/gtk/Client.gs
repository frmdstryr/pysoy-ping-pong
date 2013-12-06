/*
 *  libsoy - soy.Client for gdk
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
    Gdk

class soy.Client : Object

    prop readonly address : string
    prop readonly gdk_window : Window?
    prop readonly window : soy.widgets.Window

    _window_size : soy.atoms.Size


    construct (args : array of string)
        Gdk.init(ref args)
        
        // Set empty address
        _address = ""

        // Create new window
        _window = new soy.widgets.Window()

        // Get a hook for the new window's size
        _window_size = _window.size
        _window_size.on_set.connect(self.window_resize)

        // TODO hook into position, title, icon, etc

        // Set empty controllermap
        //self->controllers = (PySoy_Client__ControllerMap_Object*)
        //    PyType_GenericNew(&PySoy_Client__ControllerMap_Type,
        //                      NULL, NULL);
        //self->controllers->map = g_hash_table_new_full(g_int_hash, g_int_equal,
        //                                               g_free, g_object_unref);
        //self->pointer = NULL;
        //self->keyboard = NULL;

         
        // Launch background thread if it hasn't already
        if soy._client_thread is null
            soy._client_thread = new soy._ClientThread()

        // Add event source to be called every 25ms (40fps)
        var source = new TimeoutSource(25)
        source.set_callback(thread_step)
        source.attach(soy._client_thread.context)


    def thread_step () : bool
        if _gdk_window is not null
            return true
                
        // Open a new window
        var attrs = Gdk.WindowAttr () {
            title  = _window.title,
            width  = (int) _window_size.width,
            height = (int) _window_size.height,
            window_type = Gdk.WindowType.TOPLEVEL,
            event_mask  = Gdk.EventMask.ALL_EVENTS_MASK
        }
        var amask = (Gdk.WindowAttributesType.TITLE |
                     Gdk.WindowAttributesType.X |
                     Gdk.WindowAttributesType.Y |
                     Gdk.WindowAttributesType.WMCLASS)
        _gdk_window = new Gdk.Window(null, attrs, amask)
        var gg = Gdk.Geometry()
        gg.win_gravity = Gdk.Gravity.STATIC;
        _gdk_window.set_geometry_hints(gg, Gdk.WindowHints.WIN_GRAVITY);
        _gdk_window.show()
        return true


    def window_resize (size : soy.atoms.Size)
        return

