/*
 *  libsoy - soy utils
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

namespace soy
    enum EventType
        // Keyboard events
        KeyPress
        KeyDown
        KeyRelease

        // Pointer events
        Motion
        ButtonPress
        ButtonRelease
        Scroll

        // Wiimote events
        WiimoteButtonPress

    enum ScrollDirection
        Up
        Down
        Left
        Right
        
    enum Comparison
        LT
        LE
        NE
        EQ
        GT
        GE

    enum MathOperator
        ADD
        SUB
        MUL
        DIV
        MOD
        OR
        AND

    // Returns a symbolic name of the key value specified by keyval.
    def keyval_name(keyval : uint) : string
        return "" //Gdk.keyval_name(keyval)

    class IteratorWrapper of G : Object implements Iterable of G
        _iter : Iterator of G

        construct (iter : Iterator of G)
            self._iter = iter

        prop readonly element_type : Type
            get
                return typeof(G)

        def iterator() : Iterator of G?
            return _iter
