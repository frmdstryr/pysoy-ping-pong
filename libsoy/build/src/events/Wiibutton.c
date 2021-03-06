/* Wiibutton.c generated by valac 0.20.1, the Vala compiler
 * generated from Wiibutton.gs, do not modify */

/*
 *  libsoy - soy.events.Button
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


#define SOY_EVENTS_TYPE_WIIBUTTON (soy_events_wiibutton_get_type ())

#define SOY_TYPE_EVENT_TYPE (soy_event_type_get_type ())
typedef struct _soyeventsWiibutton soyeventsWiibutton;

typedef enum  {
	SOY_EVENT_TYPE_KeyPress,
	SOY_EVENT_TYPE_KeyDown,
	SOY_EVENT_TYPE_KeyRelease,
	SOY_EVENT_TYPE_Motion,
	SOY_EVENT_TYPE_ButtonPress,
	SOY_EVENT_TYPE_ButtonRelease,
	SOY_EVENT_TYPE_Scroll,
	SOY_EVENT_TYPE_WiimoteButtonPress
} soyEventType;

struct _soyeventsWiibutton {
	soyEventType type;
	guint16 wiibutton;
};



GType soy_events_wiibutton_get_type (void) G_GNUC_CONST;
GType soy_event_type_get_type (void) G_GNUC_CONST;
soyeventsWiibutton* soy_events_wiibutton_dup (const soyeventsWiibutton* self);
void soy_events_wiibutton_free (soyeventsWiibutton* self);


soyeventsWiibutton* soy_events_wiibutton_dup (const soyeventsWiibutton* self) {
	soyeventsWiibutton* dup;
	dup = g_new0 (soyeventsWiibutton, 1);
	memcpy (dup, self, sizeof (soyeventsWiibutton));
	return dup;
}


void soy_events_wiibutton_free (soyeventsWiibutton* self) {
	g_free (self);
}


GType soy_events_wiibutton_get_type (void) {
	static volatile gsize soy_events_wiibutton_type_id__volatile = 0;
	if (g_once_init_enter (&soy_events_wiibutton_type_id__volatile)) {
		GType soy_events_wiibutton_type_id;
		soy_events_wiibutton_type_id = g_boxed_type_register_static ("soyeventsWiibutton", (GBoxedCopyFunc) soy_events_wiibutton_dup, (GBoxedFreeFunc) soy_events_wiibutton_free);
		g_once_init_leave (&soy_events_wiibutton_type_id__volatile, soy_events_wiibutton_type_id);
	}
	return soy_events_wiibutton_type_id__volatile;
}



