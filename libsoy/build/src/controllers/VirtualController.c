/* VirtualController.c generated by valac 0.20.1, the Vala compiler
 * generated from VirtualController.gs, do not modify */

/*
 *  libsoy - soy.controllers.VirtualController
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
#include <GLES/gl.h>
#include <GLES/glext.h>
#include <soy-1/ode.h>
#include <gee.h>


#define SOY_CONTROLLERS_TYPE_CONTROLLER (soy_controllers_controller_get_type ())
#define SOY_CONTROLLERS_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersController))
#define SOY_CONTROLLERS_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersControllerClass))
#define SOY_CONTROLLERS_IS_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER))
#define SOY_CONTROLLERS_IS_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_TYPE_CONTROLLER))
#define SOY_CONTROLLERS_CONTROLLER_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersControllerClass))

typedef struct _soycontrollersController soycontrollersController;
typedef struct _soycontrollersControllerClass soycontrollersControllerClass;
typedef struct _soycontrollersControllerPrivate soycontrollersControllerPrivate;

#define SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER (soy_controllers_virtual_controller_get_type ())
#define SOY_CONTROLLERS_VIRTUAL_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, soycontrollersVirtualController))
#define SOY_CONTROLLERS_VIRTUAL_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, soycontrollersVirtualControllerClass))
#define SOY_CONTROLLERS_IS_VIRTUAL_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER))
#define SOY_CONTROLLERS_IS_VIRTUAL_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER))
#define SOY_CONTROLLERS_VIRTUAL_CONTROLLER_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, soycontrollersVirtualControllerClass))

typedef struct _soycontrollersVirtualController soycontrollersVirtualController;
typedef struct _soycontrollersVirtualControllerClass soycontrollersVirtualControllerClass;
typedef struct _soycontrollersVirtualControllerPrivate soycontrollersVirtualControllerPrivate;

#define SOY_SCENES_TYPE_SCENE (soy_scenes_scene_get_type ())
#define SOY_SCENES_SCENE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_SCENES_TYPE_SCENE, soyscenesScene))
#define SOY_SCENES_SCENE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_SCENES_TYPE_SCENE, soyscenesSceneClass))
#define SOY_SCENES_IS_SCENE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_SCENES_TYPE_SCENE))
#define SOY_SCENES_IS_SCENE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_SCENES_TYPE_SCENE))
#define SOY_SCENES_SCENE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_SCENES_TYPE_SCENE, soyscenesSceneClass))

typedef struct _soyscenesScene soyscenesScene;
typedef struct _soyscenesSceneClass soyscenesSceneClass;
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))
typedef struct _soyscenesScenePrivate soyscenesScenePrivate;

#define SOY_BODIES_TYPE_BODY (soy_bodies_body_get_type ())
#define SOY_BODIES_BODY(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_BODIES_TYPE_BODY, soybodiesBody))
#define SOY_BODIES_BODY_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_BODIES_TYPE_BODY, soybodiesBodyClass))
#define SOY_BODIES_IS_BODY(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_BODIES_TYPE_BODY))
#define SOY_BODIES_IS_BODY_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_BODIES_TYPE_BODY))
#define SOY_BODIES_BODY_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_BODIES_TYPE_BODY, soybodiesBodyClass))

typedef struct _soybodiesBody soybodiesBody;
typedef struct _soybodiesBodyClass soybodiesBodyClass;

#define SOY_BODIES_TYPE_CAMERA (soy_bodies_camera_get_type ())
#define SOY_BODIES_CAMERA(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_BODIES_TYPE_CAMERA, soybodiesCamera))
#define SOY_BODIES_CAMERA_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_BODIES_TYPE_CAMERA, soybodiesCameraClass))
#define SOY_BODIES_IS_CAMERA(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_BODIES_TYPE_CAMERA))
#define SOY_BODIES_IS_CAMERA_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_BODIES_TYPE_CAMERA))
#define SOY_BODIES_CAMERA_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_BODIES_TYPE_CAMERA, soybodiesCameraClass))

typedef struct _soybodiesCamera soybodiesCamera;
typedef struct _soybodiesCameraClass soybodiesCameraClass;

#define SOY_BODIES_TYPE_LIGHT (soy_bodies_light_get_type ())
#define SOY_BODIES_LIGHT(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_BODIES_TYPE_LIGHT, soybodiesLight))
#define SOY_BODIES_LIGHT_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_BODIES_TYPE_LIGHT, soybodiesLightClass))
#define SOY_BODIES_IS_LIGHT(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_BODIES_TYPE_LIGHT))
#define SOY_BODIES_IS_LIGHT_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_BODIES_TYPE_LIGHT))
#define SOY_BODIES_LIGHT_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_BODIES_TYPE_LIGHT, soybodiesLightClass))

typedef struct _soybodiesLight soybodiesLight;
typedef struct _soybodiesLightClass soybodiesLightClass;

#define SOY_JOINTS_TYPE_JOINT (soy_joints_joint_get_type ())
#define SOY_JOINTS_JOINT(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_JOINTS_TYPE_JOINT, soyjointsJoint))
#define SOY_JOINTS_JOINT_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_JOINTS_TYPE_JOINT, soyjointsJointClass))
#define SOY_JOINTS_IS_JOINT(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_JOINTS_TYPE_JOINT))
#define SOY_JOINTS_IS_JOINT_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_JOINTS_TYPE_JOINT))
#define SOY_JOINTS_JOINT_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_JOINTS_TYPE_JOINT, soyjointsJointClass))

typedef struct _soyjointsJoint soyjointsJoint;
typedef struct _soyjointsJointClass soyjointsJointClass;

#define SOY_FIELDS_TYPE_FIELD (soy_fields_field_get_type ())
#define SOY_FIELDS_FIELD(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_FIELDS_TYPE_FIELD, soyfieldsField))
#define SOY_FIELDS_FIELD_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_FIELDS_TYPE_FIELD, soyfieldsFieldClass))
#define SOY_FIELDS_IS_FIELD(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_FIELDS_TYPE_FIELD))
#define SOY_FIELDS_IS_FIELD_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_FIELDS_TYPE_FIELD))
#define SOY_FIELDS_FIELD_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_FIELDS_TYPE_FIELD, soyfieldsFieldClass))

typedef struct _soyfieldsField soyfieldsField;
typedef struct _soyfieldsFieldClass soyfieldsFieldClass;

struct _soycontrollersController {
	GObject parent_instance;
	soycontrollersControllerPrivate * priv;
};

struct _soycontrollersControllerClass {
	GObjectClass parent_class;
	gchar* (*tp_repr) (soycontrollersController* self);
};

struct _soycontrollersVirtualController {
	soycontrollersController parent_instance;
	soycontrollersVirtualControllerPrivate * priv;
	soyscenesScene* scene;
};

struct _soycontrollersVirtualControllerClass {
	soycontrollersControllerClass parent_class;
	void (*run_controller) (soycontrollersVirtualController* self);
	void (*unregister_controller) (soycontrollersVirtualController* self);
	void (*register_controller) (soycontrollersVirtualController* self);
	gboolean (*get_registered) (soycontrollersVirtualController* self);
	void (*set_registered) (soycontrollersVirtualController* self, gboolean value);
	gboolean (*get_finished) (soycontrollersVirtualController* self);
};

struct _soyscenesScene {
	GObject parent_instance;
	soyscenesScenePrivate * priv;
	struct dxSpace* space;
	GeeHashSet* lights;
	GeeHashMap* bodies;
	GeeArrayList* joints;
	GeeHashSet* Controllers;
	GeeHashMap* fields;
	GLfloat* tslvs;
	gint tslvs_length1;
	GLfloat* colTexels;
};

struct _soyscenesSceneClass {
	GObjectClass parent_class;
	void (*do_in_step) (soyscenesScene* self);
	void (*render) (soyscenesScene* self, GLfloat fov, GLfloat aspect, GLfloat znear, GLfloat zfar, soybodiesCamera* camera, gint level);
	void (*render_extra) (soyscenesScene* self);
};


static gpointer soy_controllers_virtual_controller_parent_class = NULL;
extern GRWLock soy_scenes__stepLock;

GType soy_controllers_controller_get_type (void) G_GNUC_CONST;
GType soy_controllers_virtual_controller_get_type (void) G_GNUC_CONST;
GType soy_scenes_scene_get_type (void) G_GNUC_CONST;
enum  {
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_DUMMY_PROPERTY,
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_REGISTERED,
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_FINISHED
};
soycontrollersVirtualController* soy_controllers_virtual_controller_new (soyscenesScene* scene);
soycontrollersVirtualController* soy_controllers_virtual_controller_construct (GType object_type, soyscenesScene* scene);
soycontrollersController* soy_controllers_controller_new (void);
soycontrollersController* soy_controllers_controller_construct (GType object_type);
GType soy_bodies_body_get_type (void) G_GNUC_CONST;
GType soy_bodies_camera_get_type (void) G_GNUC_CONST;
GType soy_bodies_light_get_type (void) G_GNUC_CONST;
GType soy_joints_joint_get_type (void) G_GNUC_CONST;
GType soy_fields_field_get_type (void) G_GNUC_CONST;
void soy_controllers_virtual_controller_run_controller (soycontrollersVirtualController* self);
static void soy_controllers_virtual_controller_real_run_controller (soycontrollersVirtualController* self);
void soy_controllers_virtual_controller_unregister_controller (soycontrollersVirtualController* self);
static void soy_controllers_virtual_controller_real_unregister_controller (soycontrollersVirtualController* self);
void soy_controllers_virtual_controller_register_controller (soycontrollersVirtualController* self);
static void soy_controllers_virtual_controller_real_register_controller (soycontrollersVirtualController* self);
gchar* soy_controllers_virtual_controller_tp_repr (soycontrollersVirtualController* self);
gboolean soy_controllers_virtual_controller_get_registered (soycontrollersVirtualController* self);
void soy_controllers_virtual_controller_set_registered (soycontrollersVirtualController* self, gboolean value);
gboolean soy_controllers_virtual_controller_get_finished (soycontrollersVirtualController* self);
static void soy_controllers_virtual_controller_finalize (GObject* obj);
static void _vala_soy_controllers_virtual_controller_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec);
static void _vala_soy_controllers_virtual_controller_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec);


static gpointer _g_object_ref0 (gpointer self) {
	return self ? g_object_ref (self) : NULL;
}


soycontrollersVirtualController* soy_controllers_virtual_controller_construct (GType object_type, soyscenesScene* scene) {
	soycontrollersVirtualController * self = NULL;
	soyscenesScene* _tmp0_;
	soyscenesScene* _tmp1_;
	soyscenesScene* _tmp2_;
	GeeHashSet* _tmp3_;
	g_return_val_if_fail (scene != NULL, NULL);
	self = (soycontrollersVirtualController*) soy_controllers_controller_construct (object_type);
	_tmp0_ = scene;
	_tmp1_ = _g_object_ref0 (_tmp0_);
	_g_object_unref0 (self->scene);
	self->scene = _tmp1_;
	g_rw_lock_writer_lock (&soy_scenes__stepLock);
	_tmp2_ = scene;
	_tmp3_ = _tmp2_->Controllers;
	gee_abstract_collection_add ((GeeAbstractCollection*) _tmp3_, self);
	g_rw_lock_writer_unlock (&soy_scenes__stepLock);
	return self;
}


soycontrollersVirtualController* soy_controllers_virtual_controller_new (soyscenesScene* scene) {
	return soy_controllers_virtual_controller_construct (SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, scene);
}


static void soy_controllers_virtual_controller_real_run_controller (soycontrollersVirtualController* self) {
	return;
}


void soy_controllers_virtual_controller_run_controller (soycontrollersVirtualController* self) {
	g_return_if_fail (self != NULL);
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_GET_CLASS (self)->run_controller (self);
}


static void soy_controllers_virtual_controller_real_unregister_controller (soycontrollersVirtualController* self) {
	soyscenesScene* _tmp0_;
	GeeHashSet* _tmp1_;
	g_rw_lock_writer_lock (&soy_scenes__stepLock);
	_tmp0_ = self->scene;
	_tmp1_ = _tmp0_->Controllers;
	gee_abstract_collection_remove ((GeeAbstractCollection*) _tmp1_, self);
	g_rw_lock_writer_unlock (&soy_scenes__stepLock);
}


void soy_controllers_virtual_controller_unregister_controller (soycontrollersVirtualController* self) {
	g_return_if_fail (self != NULL);
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_GET_CLASS (self)->unregister_controller (self);
}


static void soy_controllers_virtual_controller_real_register_controller (soycontrollersVirtualController* self) {
	soyscenesScene* _tmp0_;
	GeeHashSet* _tmp1_;
	g_rw_lock_writer_lock (&soy_scenes__stepLock);
	_tmp0_ = self->scene;
	_tmp1_ = _tmp0_->Controllers;
	gee_abstract_collection_add ((GeeAbstractCollection*) _tmp1_, self);
	g_rw_lock_writer_unlock (&soy_scenes__stepLock);
}


void soy_controllers_virtual_controller_register_controller (soycontrollersVirtualController* self) {
	g_return_if_fail (self != NULL);
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_GET_CLASS (self)->register_controller (self);
}


gchar* soy_controllers_virtual_controller_tp_repr (soycontrollersVirtualController* self) {
	gchar* result = NULL;
	gchar* _tmp0_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = g_strdup ("Generic Virtual Controller");
	result = _tmp0_;
	return result;
}


gboolean soy_controllers_virtual_controller_get_registered (soycontrollersVirtualController* self) {
	g_return_val_if_fail (self != NULL, FALSE);
	return SOY_CONTROLLERS_VIRTUAL_CONTROLLER_GET_CLASS (self)->get_registered (self);
}


static gboolean soy_controllers_virtual_controller_real_get_registered (soycontrollersVirtualController* base) {
	gboolean result;
	soycontrollersVirtualController* self;
	soyscenesScene* _tmp0_;
	GeeHashSet* _tmp1_;
	gboolean _tmp2_ = FALSE;
	self = base;
	_tmp0_ = self->scene;
	_tmp1_ = _tmp0_->Controllers;
	_tmp2_ = gee_abstract_collection_contains ((GeeAbstractCollection*) _tmp1_, self);
	result = _tmp2_;
	return result;
}


void soy_controllers_virtual_controller_set_registered (soycontrollersVirtualController* self, gboolean value) {
	g_return_if_fail (self != NULL);
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_GET_CLASS (self)->set_registered (self, value);
}


static void soy_controllers_virtual_controller_real_set_registered (soycontrollersVirtualController* base, gboolean value) {
	soycontrollersVirtualController* self;
	gboolean _tmp0_;
	self = base;
	_tmp0_ = value;
	if (_tmp0_) {
		soy_controllers_virtual_controller_register_controller (self);
	} else {
		soy_controllers_virtual_controller_unregister_controller (self);
	}
	g_object_notify ((GObject *) self, "registered");
}


gboolean soy_controllers_virtual_controller_get_finished (soycontrollersVirtualController* self) {
	g_return_val_if_fail (self != NULL, FALSE);
	return SOY_CONTROLLERS_VIRTUAL_CONTROLLER_GET_CLASS (self)->get_finished (self);
}


static gboolean soy_controllers_virtual_controller_real_get_finished (soycontrollersVirtualController* base) {
	gboolean result;
	soycontrollersVirtualController* self;
	self = base;
	result = FALSE;
	return result;
}


static void soy_controllers_virtual_controller_class_init (soycontrollersVirtualControllerClass * klass) {
	soy_controllers_virtual_controller_parent_class = g_type_class_peek_parent (klass);
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_CLASS (klass)->run_controller = soy_controllers_virtual_controller_real_run_controller;
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_CLASS (klass)->unregister_controller = soy_controllers_virtual_controller_real_unregister_controller;
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_CLASS (klass)->register_controller = soy_controllers_virtual_controller_real_register_controller;
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_CLASS (klass)->get_registered = soy_controllers_virtual_controller_real_get_registered;
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_CLASS (klass)->set_registered = soy_controllers_virtual_controller_real_set_registered;
	SOY_CONTROLLERS_VIRTUAL_CONTROLLER_CLASS (klass)->get_finished = soy_controllers_virtual_controller_real_get_finished;
	G_OBJECT_CLASS (klass)->get_property = _vala_soy_controllers_virtual_controller_get_property;
	G_OBJECT_CLASS (klass)->set_property = _vala_soy_controllers_virtual_controller_set_property;
	G_OBJECT_CLASS (klass)->finalize = soy_controllers_virtual_controller_finalize;
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_CONTROLLERS_VIRTUAL_CONTROLLER_REGISTERED, g_param_spec_boolean ("registered", "registered", "registered", FALSE, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_CONTROLLERS_VIRTUAL_CONTROLLER_FINISHED, g_param_spec_boolean ("finished", "finished", "finished", FALSE, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE));
}


static void soy_controllers_virtual_controller_instance_init (soycontrollersVirtualController * self) {
}


static void soy_controllers_virtual_controller_finalize (GObject* obj) {
	soycontrollersVirtualController * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, soycontrollersVirtualController);
	_g_object_unref0 (self->scene);
	G_OBJECT_CLASS (soy_controllers_virtual_controller_parent_class)->finalize (obj);
}


GType soy_controllers_virtual_controller_get_type (void) {
	static volatile gsize soy_controllers_virtual_controller_type_id__volatile = 0;
	if (g_once_init_enter (&soy_controllers_virtual_controller_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soycontrollersVirtualControllerClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_controllers_virtual_controller_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soycontrollersVirtualController), 0, (GInstanceInitFunc) soy_controllers_virtual_controller_instance_init, NULL };
		GType soy_controllers_virtual_controller_type_id;
		soy_controllers_virtual_controller_type_id = g_type_register_static (SOY_CONTROLLERS_TYPE_CONTROLLER, "soycontrollersVirtualController", &g_define_type_info, 0);
		g_once_init_leave (&soy_controllers_virtual_controller_type_id__volatile, soy_controllers_virtual_controller_type_id);
	}
	return soy_controllers_virtual_controller_type_id__volatile;
}


static void _vala_soy_controllers_virtual_controller_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec) {
	soycontrollersVirtualController * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, soycontrollersVirtualController);
	switch (property_id) {
		case SOY_CONTROLLERS_VIRTUAL_CONTROLLER_REGISTERED:
		g_value_set_boolean (value, soy_controllers_virtual_controller_get_registered (self));
		break;
		case SOY_CONTROLLERS_VIRTUAL_CONTROLLER_FINISHED:
		g_value_set_boolean (value, soy_controllers_virtual_controller_get_finished (self));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}


static void _vala_soy_controllers_virtual_controller_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec) {
	soycontrollersVirtualController * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, soycontrollersVirtualController);
	switch (property_id) {
		case SOY_CONTROLLERS_VIRTUAL_CONTROLLER_REGISTERED:
		soy_controllers_virtual_controller_set_registered (self, g_value_get_boolean (value));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}



