/*
 *  libsoy tests - bluetoothagent (bluetoothagent.gs)
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
    bluez
    Posix

init
    
    dev_id : int = hci_get_route(null)
    sock : int = hci_open_dev( dev_id )

    var addr = new array of char[19]
    var name = new array of char[248]
    if (dev_id < 0 or sock < 0)
        print "Error opening socket"
        exit(1)
    print "dev id %d", dev_id
    print "socket %d", sock
    len : int = 8
    max_rsp: int = 255
    flags : uint8 = 0x0001
    ii : inquiry_info* = (inquiry_info*)malloc(sizeof(inquiry_info)*max_rsp)
    num_rsp : int = hci_inquiry(dev_id, len, max_rsp, null, &ii, flags);
    print "%d",num_rsp
    for var i = 0 to (num_rsp-1)
        ba2str(&(ii+i)->bdaddr, addr)
        hci_read_remote_name(sock, &(ii+i)->bdaddr, 248, name, 0)
        
        print "%s %s", (string)addr, (string)name
        
        
    exit(1)
