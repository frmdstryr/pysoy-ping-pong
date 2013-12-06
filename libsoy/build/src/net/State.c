/* State.c generated by valac 0.20.1, the Vala compiler
 * generated from State.gs, do not modify */

/*
 *  libsoy - soy.net.State
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
#include <string.h>


#define SOY_NET_TYPE_STATE (soy_net_state_get_type ())
typedef struct _soynetState soynetState;

struct _soynetState {
	gint numObjects;
	void* objects;
};



GType soy_net_state_get_type (void) G_GNUC_CONST;
soynetState* soy_net_state_dup (const soynetState* self);
void soy_net_state_free (soynetState* self);


soynetState* soy_net_state_dup (const soynetState* self) {
	soynetState* dup;
	dup = g_new0 (soynetState, 1);
	memcpy (dup, self, sizeof (soynetState));
	return dup;
}


void soy_net_state_free (soynetState* self) {
	g_free (self);
}


GType soy_net_state_get_type (void) {
	static volatile gsize soy_net_state_type_id__volatile = 0;
	if (g_once_init_enter (&soy_net_state_type_id__volatile)) {
		GType soy_net_state_type_id;
		soy_net_state_type_id = g_boxed_type_register_static ("soynetState", (GBoxedCopyFunc) soy_net_state_dup, (GBoxedFreeFunc) soy_net_state_free);
		g_once_init_leave (&soy_net_state_type_id__volatile, soy_net_state_type_id);
	}
	return soy_net_state_type_id__volatile;
}



