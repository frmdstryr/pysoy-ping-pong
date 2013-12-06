/*
    PySoy - soy.scenes.Space Type
    Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program; if not, see http://www.gnu.org/licenses
*/

#include "pysoy2.h"
#define SELF PySoy_scenes_Space_Object*


static char
tp_doc[] = "soy.scenes.Scene Type\n"
"\n"
"    ''Space is big. Really, really big. You just won't believe how vastly,\n"
"    mind-boggling big it is. I mean you think it's a long way down the\n"
"    street to the chemist's, but that's just peanuts to Space.''\n"
"                                                     ~ Douglas Adams\n"
"\n"
"    Space is a specialized scene class for astronomical environments.\n"
"    Planetary/stellar bodies and a starfield background are implemented\n"
"    through multi-stage rendering and an optimized octtree for collision\n"
"    are a few of this classes enhancements.\n"
"\n"
"    If a game includes multiple star systems each system should be\n"
"    implemented as an instance of this class.\n"
"\n"
"    It is currently incomplete.  In fact, right now, its just docs!\n"
"\n";

