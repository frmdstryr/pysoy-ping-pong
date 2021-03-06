/* Controller.c generated by valac 0.20.1, the Vala compiler
 * generated from Controller.gs, do not modify */

/*
 *  libsoy - soy.controllers.Controller
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


#define SOY_CONTROLLERS_TYPE_CONTROLLER (soy_controllers_controller_get_type ())
#define SOY_CONTROLLERS_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersController))
#define SOY_CONTROLLERS_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersControllerClass))
#define SOY_CONTROLLERS_IS_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER))
#define SOY_CONTROLLERS_IS_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_TYPE_CONTROLLER))
#define SOY_CONTROLLERS_CONTROLLER_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersControllerClass))

typedef struct _soycontrollersController soycontrollersController;
typedef struct _soycontrollersControllerClass soycontrollersControllerClass;
typedef struct _soycontrollersControllerPrivate soycontrollersControllerPrivate;

#define SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD (soy_controllers__controllerthread_get_type ())
#define SOY_CONTROLLERS__CONTROLLERTHREAD(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD, soycontrollers_ControllerThread))
#define SOY_CONTROLLERS__CONTROLLERTHREAD_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD, soycontrollers_ControllerThreadClass))
#define SOY_CONTROLLERS_IS__CONTROLLERTHREAD(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD))
#define SOY_CONTROLLERS_IS__CONTROLLERTHREAD_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD))
#define SOY_CONTROLLERS__CONTROLLERTHREAD_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD, soycontrollers_ControllerThreadClass))

typedef struct _soycontrollers_ControllerThread soycontrollers_ControllerThread;
typedef struct _soycontrollers_ControllerThreadClass soycontrollers_ControllerThreadClass;
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))

struct _soycontrollersController {
	GObject parent_instance;
	soycontrollersControllerPrivate * priv;
};

struct _soycontrollersControllerClass {
	GObjectClass parent_class;
	gchar* (*tp_repr) (soycontrollersController* self);
};


static gpointer soy_controllers_controller_parent_class = NULL;
extern soycontrollers_ControllerThread* soy_controllers__thread;

GType soy_controllers_controller_get_type (void) G_GNUC_CONST;
enum  {
	SOY_CONTROLLERS_CONTROLLER_DUMMY_PROPERTY
};
gchar* soy_controllers_controller_tp_repr (soycontrollersController* self);
static gchar* soy_controllers_controller_real_tp_repr (soycontrollersController* self);
soycontrollersController* soy_controllers_controller_new (void);
soycontrollersController* soy_controllers_controller_construct (GType object_type);
soycontrollers_ControllerThread* soy_controllers__controllerthread_new (void);
soycontrollers_ControllerThread* soy_controllers__controllerthread_construct (GType object_type);
GType soy_controllers__controllerthread_get_type (void) G_GNUC_CONST;


static gchar* soy_controllers_controller_real_tp_repr (soycontrollersController* self) {
	gchar* result = NULL;
	gchar* _tmp0_;
	_tmp0_ = g_strdup ("Generic Controller");
	result = _tmp0_;
	return result;
}


gchar* soy_controllers_controller_tp_repr (soycontrollersController* self) {
	g_return_val_if_fail (self != NULL, NULL);
	return SOY_CONTROLLERS_CONTROLLER_GET_CLASS (self)->tp_repr (self);
}


soycontrollersController* soy_controllers_controller_construct (GType object_type) {
	soycontrollersController * self = NULL;
	self = (soycontrollersController*) g_object_new (object_type, NULL);
	return self;
}


soycontrollersController* soy_controllers_controller_new (void) {
	return soy_controllers_controller_construct (SOY_CONTROLLERS_TYPE_CONTROLLER);
}


static void soy_controllers_controller_class_init (soycontrollersControllerClass * klass) {
	soycontrollers_ControllerThread* _tmp0_;
	soy_controllers_controller_parent_class = g_type_class_peek_parent (klass);
	SOY_CONTROLLERS_CONTROLLER_CLASS (klass)->tp_repr = soy_controllers_controller_real_tp_repr;
	_tmp0_ = soy_controllers__controllerthread_new ();
	_g_object_unref0 (soy_controllers__thread);
	soy_controllers__thread = _tmp0_;
}


static void soy_controllers_controller_instance_init (soycontrollersController * self) {
}


GType soy_controllers_controller_get_type (void) {
	static volatile gsize soy_controllers_controller_type_id__volatile = 0;
	if (g_once_init_enter (&soy_controllers_controller_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soycontrollersControllerClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_controllers_controller_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soycontrollersController), 0, (GInstanceInitFunc) soy_controllers_controller_instance_init, NULL };
		GType soy_controllers_controller_type_id;
		soy_controllers_controller_type_id = g_type_register_static (G_TYPE_OBJECT, "soycontrollersController", &g_define_type_info, 0);
		g_once_init_leave (&soy_controllers_controller_type_id__volatile, soy_controllers_controller_type_id);
	}
	return soy_controllers_controller_type_id__volatile;
}



