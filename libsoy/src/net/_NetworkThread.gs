/*
 *  libsoy - soy.net._NetworkThread
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


namespace soy.net
    _thread : soy.net._NetworkThread?


class soy.net._NetworkThread : Object
    _loop   : MainLoop
    _thread : Thread of void*
    context : MainContext

    init
        if !Thread.supported()
            print "ThreadError: Threading is unsupported"
            Posix.raise(15)

        context = new MainContext()

        // Create mainloop, the thread will run this continually
        _loop  = new MainLoop(context, true)
        _thread = new Thread of void* ("Controllers", self.run)

    final
        _loop.quit()
        // _thread should close itself, we should wait for it !!!

    def run() : void*
        // Run as long as this class continues to exist, then exit
        _loop.run()
        return null

