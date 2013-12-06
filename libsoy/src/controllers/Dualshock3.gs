/*
 *  libsoy - soy.controllers.Dualshock3
 *  Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group
 *
 *  This program is free software you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program if not, see http://www.gnu.org/licenses
 *
 */

[indent=4]
uses
    Posix
    USB

class soy.controllers.Dualshock3 : soy.controllers.Controller
    /*
    Soy Dualshock3 Controller

    This class controls Dualshock3 input.
    */

    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override tp_repr ( ) : string
        return "Dualshock3"
    def show_master( )
        print "Current Bluetooth master: "
        /*int res = usb_control_msg(devh, USB_DIR_IN | USB_TYPE_CLASS | USB_RECIP_INTERFACE,0x01, 0x03f5, itfnum, (void*)msg, sizeof(msg), 5000)
        control_msg (int requesttype, int request, int value, int index, char[] bytes, int size, int timeout);
        if ( res < 0 ) { perror("USB_REQ_GET_CONFIGURATION") return }
        print "%02x:%02x:%02x:%02x:%02x:%02x\n", msg[2], msg[3], msg[4], msg[5], msg[6], msg[7]*/
    ////////////////////////////////////////////////////////////////////////
    // Properties

