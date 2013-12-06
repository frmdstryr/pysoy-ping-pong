/*
 *  libsoy - soy._init
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

#include <glib.h>
#include <glib-object.h>
#include <stdlib.h>
#include <string.h>
#include <gee.h>
#include "src/soy-1/soy.h"


void soy_init (void) {
    g_type_init();

    // Initialize soy_loadable hashmap
    soy_loadable = gee_hash_map_new (G_TYPE_STRING, (GBoxedCopyFunc) g_strdup,
                                     g_free, G_TYPE_POINTER, NULL, NULL, NULL,
                                     NULL, NULL);

    // soy.atoms.Color
    gee_abstract_map_set ((GeeAbstractMap*) soy_loadable,
                          "soy.atoms.Color",
                          soy_atoms_color_new_load);
}

