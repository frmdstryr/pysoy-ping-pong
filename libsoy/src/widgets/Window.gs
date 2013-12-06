/*
 *  libsoy - soy.widgets.Window
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
    soy.atoms


class soy.widgets.Window : soy.widgets.Container
    
    construct ()
        // set title
        _title = ""

        // set background
        _background = {0.0f, 0.0f, 0.0f, 0.0f}

        // set size
        self.width = 320
        self.height = 240

        // set resizable
        _resizable = true

        // init _rpt
        _rpt = 0


    //final
        //if self._window != null
        //    self._window.destroy()


    def draw ( )
        // Clear window
        glClearColor(_background[0], _background[1],
                     _background[2], _background[3])
        glClear(GL_COLOR_BUFFER_BIT)

        // Enable client states
        glEnableClientState(GL_VERTEX_ARRAY)
        glEnableClientState(GL_NORMAL_ARRAY)
        glEnableClientState(GL_TEXTURE_COORD_ARRAY)
        glEnable(GL_CULL_FACE)

        // Render contained widgets (see widgets/Container.gs)
        self.render(0, 0, self.width, self.height)

        // Record current time   
        _rpt = (_rpt+1)%16
        var tv = GLib.TimeVal()        
        _rtimes[_rpt] = ((uint64)tv.tv_sec)*1000 + ((uint64) tv.tv_usec) / 1000
        
        // Disable client states
        glDisableClientState(GL_VERTEX_ARRAY)
        glDisableClientState(GL_NORMAL_ARRAY)
        glDisableClientState(GL_TEXTURE_COORD_ARRAY)
        glDisable(GL_CULL_FACE)


    def override resize_children (x : int, y : int, width : int, height : int)
        // Resize each child widget in order
        for widget in self.children
            widget.size = new soy.atoms.Size(self.width, self.height)


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // resizable Property
    _resizable : bool
    prop resizable : bool
        get
            return _resizable
        set
            _resizable = value

    //
    // fps Property
    _rpt : int
    _rtimes : array of uint64 = new array of uint64[16];
    prop readonly fps : int // actual FPS
        get
            var f2 = _rtimes[_rpt]
            var f1 = _rtimes[(_rpt+1) % 16]
            //print("Time: %d",_rtime[_rtp
            if f1 is 0.0 or f2 is 0.0 or f1 is f2
                return 0
            else
                return (int)(15000 / (f2-f1))

    //
    // title Property
    _title : string?
    _retitle : bool
    prop title : string
        get
            return _title
        set
            _title = value
            _retitle = true
    prop retitle : bool
        get
            return _retitle
        set
            _retitle = value

    /*
    // icon Property
    _icon : Gdk.Pixmap?
    prop icon : Gdk.Pixmap
        get
            return _icon
        set
            _icon = value
            // TODO src/widgets/Window.gs:119.50-119.53: warning: Argument 3: Cannot pass null to non-null parameter type
            //self._window.set_icon(self._window, value, null)
    */

    //
    // background Property
    _background : array of GLfloat
    _background_obj : weak soy.atoms.Color?

    def _background_set(color : soy.atoms.Color)
        self._background = color.get4f()

    def _background_weak(color : Object)
        self._background_obj = null

    prop background : soy.atoms.Color
        owned get
            ret : soy.atoms.Color? = _background_obj
            if ret == null
                ret = new soy.atoms.Color.new4f(_background)
                ret.on_set.connect(self._background_set)
                ret.weak_ref(self._background_weak)
                _background_obj = ret
            return ret
        set
            _background = value.get4f()
            if _background_obj != null
                _background_obj.on_set.disconnect(self._background_set)
                _background_obj.weak_unref(self._background_weak)
            _background_obj = value
            value.on_set.connect(self._background_set)
            value.weak_ref(self._background_weak)


    //
    // position Property
    _x : int
    _y : int
    _position_obj : weak soy.atoms.Position?

    def _position_set(position : soy.atoms.Position)
        _x = (int) position.x
        _y = (int) position.y
        //self._window.move(_x, _y)

    def _position_weak(position : Object)
        self._position_obj = null

    prop position : soy.atoms.Position
        owned get
            value : soy.atoms.Position? = self._position_obj
            if value is null
                value = new soy.atoms.Position((float) self._x,
                                               (float) self._y, 0.0f)
                value.on_set.connect(self._position_set)
                value.weak_ref(self._position_weak)
                self._position_obj = value
            return value
        set
            self._position_set(value)
            if _position_obj != null
                _position_obj.on_set.disconnect(self._position_set)
                _position_obj.weak_unref(self._position_weak)
            _position_obj = value
            value.on_set.connect(self._position_set)
            value.weak_ref(self._position_weak)

    //
    // Size property inherited from Widget

