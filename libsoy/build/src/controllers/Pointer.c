/* Pointer.c generated by valac 0.20.1, the Vala compiler
 * generated from Pointer.gs, do not modify */

/*
 *  libsoy - soy.controllers.Pointer
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
#include <float.h>
#include <math.h>


#define SOY_CONTROLLERS_TYPE_CONTROLLER (soy_controllers_controller_get_type ())
#define SOY_CONTROLLERS_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersController))
#define SOY_CONTROLLERS_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersControllerClass))
#define SOY_CONTROLLERS_IS_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER))
#define SOY_CONTROLLERS_IS_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_TYPE_CONTROLLER))
#define SOY_CONTROLLERS_CONTROLLER_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersControllerClass))

typedef struct _soycontrollersController soycontrollersController;
typedef struct _soycontrollersControllerClass soycontrollersControllerClass;
typedef struct _soycontrollersControllerPrivate soycontrollersControllerPrivate;

#define SOY_CONTROLLERS_TYPE_POINTER (soy_controllers_pointer_get_type ())
#define SOY_CONTROLLERS_POINTER(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_TYPE_POINTER, soycontrollersPointer))
#define SOY_CONTROLLERS_POINTER_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_TYPE_POINTER, soycontrollersPointerClass))
#define SOY_CONTROLLERS_IS_POINTER(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_TYPE_POINTER))
#define SOY_CONTROLLERS_IS_POINTER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_TYPE_POINTER))
#define SOY_CONTROLLERS_POINTER_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_TYPE_POINTER, soycontrollersPointerClass))

typedef struct _soycontrollersPointer soycontrollersPointer;
typedef struct _soycontrollersPointerClass soycontrollersPointerClass;
typedef struct _soycontrollersPointerPrivate soycontrollersPointerPrivate;

#define SOY_ATOMS_TYPE_POSITION (soy_atoms_position_get_type ())
#define SOY_ATOMS_POSITION(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_POSITION, soyatomsPosition))
#define SOY_ATOMS_POSITION_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_POSITION, soyatomsPositionClass))
#define SOY_ATOMS_IS_POSITION(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_POSITION))
#define SOY_ATOMS_IS_POSITION_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_POSITION))
#define SOY_ATOMS_POSITION_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_POSITION, soyatomsPositionClass))

typedef struct _soyatomsPosition soyatomsPosition;
typedef struct _soyatomsPositionClass soyatomsPositionClass;
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))

#define SOY_EVENTS_TYPE_EVENT (soy_events_event_get_type ())
#define SOY_EVENTS_EVENT(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_EVENTS_TYPE_EVENT, soyeventsEvent))
#define SOY_EVENTS_EVENT_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_EVENTS_TYPE_EVENT, soyeventsEventClass))
#define SOY_EVENTS_IS_EVENT(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_EVENTS_TYPE_EVENT))
#define SOY_EVENTS_IS_EVENT_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_EVENTS_TYPE_EVENT))
#define SOY_EVENTS_EVENT_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_EVENTS_TYPE_EVENT, soyeventsEventClass))

typedef struct _soyeventsEvent soyeventsEvent;
typedef struct _soyeventsEventClass soyeventsEventClass;

#define SOY_EVENTS_TYPE_DEVICE (soy_events_device_get_type ())
#define SOY_EVENTS_DEVICE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_EVENTS_TYPE_DEVICE, soyeventsDevice))
#define SOY_EVENTS_DEVICE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_EVENTS_TYPE_DEVICE, soyeventsDeviceClass))
#define SOY_EVENTS_IS_DEVICE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_EVENTS_TYPE_DEVICE))
#define SOY_EVENTS_IS_DEVICE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_EVENTS_TYPE_DEVICE))
#define SOY_EVENTS_DEVICE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_EVENTS_TYPE_DEVICE, soyeventsDeviceClass))

typedef struct _soyeventsDevice soyeventsDevice;
typedef struct _soyeventsDeviceClass soyeventsDeviceClass;

#define SOY_EVENTS_TYPE_BUTTON_PRESS (soy_events_button_press_get_type ())
#define SOY_EVENTS_BUTTON_PRESS(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_EVENTS_TYPE_BUTTON_PRESS, soyeventsButtonPress))
#define SOY_EVENTS_BUTTON_PRESS_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_EVENTS_TYPE_BUTTON_PRESS, soyeventsButtonPressClass))
#define SOY_EVENTS_IS_BUTTON_PRESS(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_EVENTS_TYPE_BUTTON_PRESS))
#define SOY_EVENTS_IS_BUTTON_PRESS_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_EVENTS_TYPE_BUTTON_PRESS))
#define SOY_EVENTS_BUTTON_PRESS_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_EVENTS_TYPE_BUTTON_PRESS, soyeventsButtonPressClass))

typedef struct _soyeventsButtonPress soyeventsButtonPress;
typedef struct _soyeventsButtonPressClass soyeventsButtonPressClass;

#define SOY_EVENTS_TYPE_BUTTON_RELEASE (soy_events_button_release_get_type ())
#define SOY_EVENTS_BUTTON_RELEASE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_EVENTS_TYPE_BUTTON_RELEASE, soyeventsButtonRelease))
#define SOY_EVENTS_BUTTON_RELEASE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_EVENTS_TYPE_BUTTON_RELEASE, soyeventsButtonReleaseClass))
#define SOY_EVENTS_IS_BUTTON_RELEASE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_EVENTS_TYPE_BUTTON_RELEASE))
#define SOY_EVENTS_IS_BUTTON_RELEASE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_EVENTS_TYPE_BUTTON_RELEASE))
#define SOY_EVENTS_BUTTON_RELEASE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_EVENTS_TYPE_BUTTON_RELEASE, soyeventsButtonReleaseClass))

typedef struct _soyeventsButtonRelease soyeventsButtonRelease;
typedef struct _soyeventsButtonReleaseClass soyeventsButtonReleaseClass;

struct _soycontrollersController {
	GObject parent_instance;
	soycontrollersControllerPrivate * priv;
};

struct _soycontrollersControllerClass {
	GObjectClass parent_class;
	gchar* (*tp_repr) (soycontrollersController* self);
};

struct _soycontrollersPointer {
	soycontrollersController parent_instance;
	soycontrollersPointerPrivate * priv;
};

struct _soycontrollersPointerClass {
	soycontrollersControllerClass parent_class;
};

struct _soycontrollersPointerPrivate {
	gint _x;
	gint _y;
	soyatomsPosition* _position_obj;
};


static gpointer soy_controllers_pointer_parent_class = NULL;

GType soy_controllers_controller_get_type (void) G_GNUC_CONST;
GType soy_controllers_pointer_get_type (void) G_GNUC_CONST;
GType soy_atoms_position_get_type (void) G_GNUC_CONST;
#define SOY_CONTROLLERS_POINTER_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_CONTROLLERS_TYPE_POINTER, soycontrollersPointerPrivate))
enum  {
	SOY_CONTROLLERS_POINTER_DUMMY_PROPERTY,
	SOY_CONTROLLERS_POINTER_POSITION
};
static gchar* soy_controllers_pointer_real_tp_repr (soycontrollersController* base);
void soy_controllers_pointer_motion (soycontrollersPointer* self, gint x, gint y);
void soy_atoms_position_set (soyatomsPosition* self, gfloat x, gfloat y, gfloat z);
static void _soy_controllers_pointer_position_set (soycontrollersPointer* self, soyatomsPosition* position);
gfloat soy_atoms_position_get_x (soyatomsPosition* self);
gfloat soy_atoms_position_get_y (soyatomsPosition* self);
static void _soy_controllers_pointer_position_weak (soycontrollersPointer* self, GObject* position);
soycontrollersPointer* soy_controllers_pointer_new (void);
soycontrollersPointer* soy_controllers_pointer_construct (GType object_type);
soycontrollersController* soy_controllers_controller_new (void);
soycontrollersController* soy_controllers_controller_construct (GType object_type);
soyatomsPosition* soy_controllers_pointer_get_position (soycontrollersPointer* self);
soyatomsPosition* soy_atoms_position_new (gfloat x, gfloat y, gfloat z);
soyatomsPosition* soy_atoms_position_construct (GType object_type, gfloat x, gfloat y, gfloat z);
static void __soy_controllers_pointer_position_set_soy_atoms_position_on_set (soyatomsPosition* _sender, soyatomsPosition* position, gpointer self);
static void __soy_controllers_pointer_position_weak_gweak_notify (gpointer self, GObject* object);
void soy_controllers_pointer_set_position (soycontrollersPointer* self, soyatomsPosition* value);
GType soy_events_event_get_type (void) G_GNUC_CONST;
GType soy_events_device_get_type (void) G_GNUC_CONST;
GType soy_events_button_press_get_type (void) G_GNUC_CONST;
GType soy_events_button_release_get_type (void) G_GNUC_CONST;
static void soy_controllers_pointer_finalize (GObject* obj);
static void _vala_soy_controllers_pointer_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec);
static void _vala_soy_controllers_pointer_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec);


static gchar* soy_controllers_pointer_real_tp_repr (soycontrollersController* base) {
	soycontrollersPointer * self;
	gchar* result = NULL;
	gchar* _tmp0_;
	self = (soycontrollersPointer*) base;
	_tmp0_ = g_strdup ("Pointer");
	result = _tmp0_;
	return result;
}


void soy_controllers_pointer_motion (soycontrollersPointer* self, gint x, gint y) {
	gint _tmp0_;
	gint _tmp1_;
	soyatomsPosition* _tmp2_;
	g_return_if_fail (self != NULL);
	_tmp0_ = x;
	self->priv->_x = _tmp0_;
	_tmp1_ = y;
	self->priv->_y = _tmp1_;
	_tmp2_ = self->priv->_position_obj;
	if (_tmp2_ != NULL) {
		soyatomsPosition* _tmp3_;
		gint _tmp4_;
		gint _tmp5_;
		_tmp3_ = self->priv->_position_obj;
		_tmp4_ = x;
		_tmp5_ = y;
		soy_atoms_position_set (_tmp3_, (gfloat) _tmp4_, (gfloat) _tmp5_, 0.0f);
	}
}


static void _soy_controllers_pointer_position_set (soycontrollersPointer* self, soyatomsPosition* position) {
	soyatomsPosition* _tmp0_;
	gfloat _tmp1_;
	gfloat _tmp2_;
	soyatomsPosition* _tmp3_;
	gfloat _tmp4_;
	gfloat _tmp5_;
	g_return_if_fail (self != NULL);
	g_return_if_fail (position != NULL);
	_tmp0_ = position;
	_tmp1_ = soy_atoms_position_get_x (_tmp0_);
	_tmp2_ = _tmp1_;
	self->priv->_x = (gint) _tmp2_;
	_tmp3_ = position;
	_tmp4_ = soy_atoms_position_get_y (_tmp3_);
	_tmp5_ = _tmp4_;
	self->priv->_y = (gint) _tmp5_;
}


static void _soy_controllers_pointer_position_weak (soycontrollersPointer* self, GObject* position) {
	g_return_if_fail (self != NULL);
	g_return_if_fail (position != NULL);
	self->priv->_position_obj = NULL;
}


soycontrollersPointer* soy_controllers_pointer_construct (GType object_type) {
	soycontrollersPointer * self = NULL;
	self = (soycontrollersPointer*) soy_controllers_controller_construct (object_type);
	return self;
}


soycontrollersPointer* soy_controllers_pointer_new (void) {
	return soy_controllers_pointer_construct (SOY_CONTROLLERS_TYPE_POINTER);
}


static gpointer _g_object_ref0 (gpointer self) {
	return self ? g_object_ref (self) : NULL;
}


static void __soy_controllers_pointer_position_set_soy_atoms_position_on_set (soyatomsPosition* _sender, soyatomsPosition* position, gpointer self) {
	_soy_controllers_pointer_position_set (self, position);
}


static void __soy_controllers_pointer_position_weak_gweak_notify (gpointer self, GObject* object) {
	_soy_controllers_pointer_position_weak (self, object);
}


soyatomsPosition* soy_controllers_pointer_get_position (soycontrollersPointer* self) {
	soyatomsPosition* result;
	soyatomsPosition* _tmp0_;
	soyatomsPosition* _tmp1_;
	soyatomsPosition* value;
	soyatomsPosition* _tmp2_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_position_obj;
	_tmp1_ = _g_object_ref0 (_tmp0_);
	value = _tmp1_;
	_tmp2_ = value;
	if (_tmp2_ == NULL) {
		gint _tmp3_;
		gint _tmp4_;
		soyatomsPosition* _tmp5_;
		soyatomsPosition* _tmp6_;
		soyatomsPosition* _tmp7_;
		soyatomsPosition* _tmp8_;
		_tmp3_ = self->priv->_x;
		_tmp4_ = self->priv->_y;
		_tmp5_ = soy_atoms_position_new ((gfloat) _tmp3_, (gfloat) _tmp4_, 0.0f);
		_g_object_unref0 (value);
		value = _tmp5_;
		_tmp6_ = value;
		g_signal_connect_object (_tmp6_, "on-set", (GCallback) __soy_controllers_pointer_position_set_soy_atoms_position_on_set, self, 0);
		_tmp7_ = value;
		g_object_weak_ref ((GObject*) _tmp7_, __soy_controllers_pointer_position_weak_gweak_notify, self);
		_tmp8_ = value;
		self->priv->_position_obj = _tmp8_;
	}
	result = value;
	return result;
}


void soy_controllers_pointer_set_position (soycontrollersPointer* self, soyatomsPosition* value) {
	soyatomsPosition* _tmp0_;
	soyatomsPosition* _tmp1_;
	soyatomsPosition* _tmp5_;
	soyatomsPosition* _tmp6_;
	soyatomsPosition* _tmp7_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	_soy_controllers_pointer_position_set (self, _tmp0_);
	_tmp1_ = self->priv->_position_obj;
	if (_tmp1_ != NULL) {
		soyatomsPosition* _tmp2_;
		guint _tmp3_ = 0U;
		soyatomsPosition* _tmp4_;
		_tmp2_ = self->priv->_position_obj;
		g_signal_parse_name ("on-set", SOY_ATOMS_TYPE_POSITION, &_tmp3_, NULL, FALSE);
		g_signal_handlers_disconnect_matched (_tmp2_, G_SIGNAL_MATCH_ID | G_SIGNAL_MATCH_FUNC | G_SIGNAL_MATCH_DATA, _tmp3_, 0, NULL, (GCallback) __soy_controllers_pointer_position_set_soy_atoms_position_on_set, self);
		_tmp4_ = self->priv->_position_obj;
		g_object_weak_unref ((GObject*) _tmp4_, __soy_controllers_pointer_position_weak_gweak_notify, self);
	}
	_tmp5_ = value;
	self->priv->_position_obj = _tmp5_;
	_tmp6_ = value;
	g_signal_connect_object (_tmp6_, "on-set", (GCallback) __soy_controllers_pointer_position_set_soy_atoms_position_on_set, self, 0);
	_tmp7_ = value;
	g_object_weak_ref ((GObject*) _tmp7_, __soy_controllers_pointer_position_weak_gweak_notify, self);
	g_object_notify ((GObject *) self, "position");
}


static void soy_controllers_pointer_class_init (soycontrollersPointerClass * klass) {
	soy_controllers_pointer_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soycontrollersPointerPrivate));
	SOY_CONTROLLERS_CONTROLLER_CLASS (klass)->tp_repr = soy_controllers_pointer_real_tp_repr;
	G_OBJECT_CLASS (klass)->get_property = _vala_soy_controllers_pointer_get_property;
	G_OBJECT_CLASS (klass)->set_property = _vala_soy_controllers_pointer_set_property;
	G_OBJECT_CLASS (klass)->finalize = soy_controllers_pointer_finalize;
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_CONTROLLERS_POINTER_POSITION, g_param_spec_object ("position", "position", "position", SOY_ATOMS_TYPE_POSITION, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_signal_new ("button_press", SOY_CONTROLLERS_TYPE_POINTER, G_SIGNAL_RUN_LAST, 0, NULL, NULL, g_cclosure_marshal_VOID__OBJECT, G_TYPE_NONE, 1, SOY_EVENTS_TYPE_BUTTON_PRESS);
	g_signal_new ("button_release", SOY_CONTROLLERS_TYPE_POINTER, G_SIGNAL_RUN_LAST, 0, NULL, NULL, g_cclosure_marshal_VOID__OBJECT, G_TYPE_NONE, 1, SOY_EVENTS_TYPE_BUTTON_RELEASE);
}


static void soy_controllers_pointer_instance_init (soycontrollersPointer * self) {
	self->priv = SOY_CONTROLLERS_POINTER_GET_PRIVATE (self);
}


static void soy_controllers_pointer_finalize (GObject* obj) {
	soycontrollersPointer * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_CONTROLLERS_TYPE_POINTER, soycontrollersPointer);
	G_OBJECT_CLASS (soy_controllers_pointer_parent_class)->finalize (obj);
}


GType soy_controllers_pointer_get_type (void) {
	static volatile gsize soy_controllers_pointer_type_id__volatile = 0;
	if (g_once_init_enter (&soy_controllers_pointer_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soycontrollersPointerClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_controllers_pointer_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soycontrollersPointer), 0, (GInstanceInitFunc) soy_controllers_pointer_instance_init, NULL };
		GType soy_controllers_pointer_type_id;
		soy_controllers_pointer_type_id = g_type_register_static (SOY_CONTROLLERS_TYPE_CONTROLLER, "soycontrollersPointer", &g_define_type_info, 0);
		g_once_init_leave (&soy_controllers_pointer_type_id__volatile, soy_controllers_pointer_type_id);
	}
	return soy_controllers_pointer_type_id__volatile;
}


static void _vala_soy_controllers_pointer_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec) {
	soycontrollersPointer * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_CONTROLLERS_TYPE_POINTER, soycontrollersPointer);
	switch (property_id) {
		case SOY_CONTROLLERS_POINTER_POSITION:
		g_value_take_object (value, soy_controllers_pointer_get_position (self));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}


static void _vala_soy_controllers_pointer_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec) {
	soycontrollersPointer * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_CONTROLLERS_TYPE_POINTER, soycontrollersPointer);
	switch (property_id) {
		case SOY_CONTROLLERS_POINTER_POSITION:
		soy_controllers_pointer_set_position (self, g_value_get_object (value));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}



