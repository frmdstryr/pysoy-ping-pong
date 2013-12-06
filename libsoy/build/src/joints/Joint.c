/* Joint.c generated by valac 0.20.1, the Vala compiler
 * generated from Joint.gs, do not modify */

/*
 *  libsoy - soy.joints.Joint
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
#include <soy-1/ode.h>
#include <float.h>
#include <math.h>
#include <GLES/gl.h>
#include <GLES/glext.h>
#include <stdlib.h>
#include <string.h>
#include <gee.h>


#define SOY_JOINTS_TYPE_JOINT (soy_joints_joint_get_type ())
#define SOY_JOINTS_JOINT(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_JOINTS_TYPE_JOINT, soyjointsJoint))
#define SOY_JOINTS_JOINT_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_JOINTS_TYPE_JOINT, soyjointsJointClass))
#define SOY_JOINTS_IS_JOINT(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_JOINTS_TYPE_JOINT))
#define SOY_JOINTS_IS_JOINT_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_JOINTS_TYPE_JOINT))
#define SOY_JOINTS_JOINT_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_JOINTS_TYPE_JOINT, soyjointsJointClass))

typedef struct _soyjointsJoint soyjointsJoint;
typedef struct _soyjointsJointClass soyjointsJointClass;
typedef struct _soyjointsJointPrivate soyjointsJointPrivate;

#define SOY_ATOMS_TYPE_POSITION (soy_atoms_position_get_type ())
#define SOY_ATOMS_POSITION(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_POSITION, soyatomsPosition))
#define SOY_ATOMS_POSITION_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_POSITION, soyatomsPositionClass))
#define SOY_ATOMS_IS_POSITION(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_POSITION))
#define SOY_ATOMS_IS_POSITION_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_POSITION))
#define SOY_ATOMS_POSITION_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_POSITION, soyatomsPositionClass))

typedef struct _soyatomsPosition soyatomsPosition;
typedef struct _soyatomsPositionClass soyatomsPositionClass;

#define SOY_ATOMS_TYPE_AXIS (soy_atoms_axis_get_type ())
#define SOY_ATOMS_AXIS(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_AXIS, soyatomsAxis))
#define SOY_ATOMS_AXIS_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_AXIS, soyatomsAxisClass))
#define SOY_ATOMS_IS_AXIS(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_AXIS))
#define SOY_ATOMS_IS_AXIS_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_AXIS))
#define SOY_ATOMS_AXIS_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_AXIS, soyatomsAxisClass))

typedef struct _soyatomsAxis soyatomsAxis;
typedef struct _soyatomsAxisClass soyatomsAxisClass;

#define SOY_BODIES_TYPE_BODY (soy_bodies_body_get_type ())
#define SOY_BODIES_BODY(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_BODIES_TYPE_BODY, soybodiesBody))
#define SOY_BODIES_BODY_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_BODIES_TYPE_BODY, soybodiesBodyClass))
#define SOY_BODIES_IS_BODY(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_BODIES_TYPE_BODY))
#define SOY_BODIES_IS_BODY_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_BODIES_TYPE_BODY))
#define SOY_BODIES_BODY_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_BODIES_TYPE_BODY, soybodiesBodyClass))

typedef struct _soybodiesBody soybodiesBody;
typedef struct _soybodiesBodyClass soybodiesBodyClass;

#define SOY_MATERIALS_TYPE_MATERIAL (soy_materials_material_get_type ())
#define SOY_MATERIALS_MATERIAL(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_MATERIALS_TYPE_MATERIAL, soymaterialsMaterial))
#define SOY_MATERIALS_MATERIAL_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_MATERIALS_TYPE_MATERIAL, soymaterialsMaterialClass))
#define SOY_MATERIALS_IS_MATERIAL(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_MATERIALS_TYPE_MATERIAL))
#define SOY_MATERIALS_IS_MATERIAL_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_MATERIALS_TYPE_MATERIAL))
#define SOY_MATERIALS_MATERIAL_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_MATERIALS_TYPE_MATERIAL, soymaterialsMaterialClass))

typedef struct _soymaterialsMaterial soymaterialsMaterial;
typedef struct _soymaterialsMaterialClass soymaterialsMaterialClass;
#define _dJointDestroy0(var) ((var == NULL) ? NULL : (var = (dJointDestroy (var), NULL)))
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))
typedef struct _soybodiesBodyPrivate soybodiesBodyPrivate;

#define SOY_BODIES_TYPE_CAMERA (soy_bodies_camera_get_type ())
#define SOY_BODIES_CAMERA(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_BODIES_TYPE_CAMERA, soybodiesCamera))
#define SOY_BODIES_CAMERA_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_BODIES_TYPE_CAMERA, soybodiesCameraClass))
#define SOY_BODIES_IS_CAMERA(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_BODIES_TYPE_CAMERA))
#define SOY_BODIES_IS_CAMERA_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_BODIES_TYPE_CAMERA))
#define SOY_BODIES_CAMERA_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_BODIES_TYPE_CAMERA, soybodiesCameraClass))

typedef struct _soybodiesCamera soybodiesCamera;
typedef struct _soybodiesCameraClass soybodiesCameraClass;

#define SOY_SCENES_TYPE_SCENE (soy_scenes_scene_get_type ())
#define SOY_SCENES_SCENE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_SCENES_TYPE_SCENE, soyscenesScene))
#define SOY_SCENES_SCENE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_SCENES_TYPE_SCENE, soyscenesSceneClass))
#define SOY_SCENES_IS_SCENE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_SCENES_TYPE_SCENE))
#define SOY_SCENES_IS_SCENE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_SCENES_TYPE_SCENE))
#define SOY_SCENES_SCENE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_SCENES_TYPE_SCENE, soyscenesSceneClass))

typedef struct _soyscenesScene soyscenesScene;
typedef struct _soyscenesSceneClass soyscenesSceneClass;
typedef struct _soyscenesScenePrivate soyscenesScenePrivate;

#define SOY_BODIES_TYPE_LIGHT (soy_bodies_light_get_type ())
#define SOY_BODIES_LIGHT(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_BODIES_TYPE_LIGHT, soybodiesLight))
#define SOY_BODIES_LIGHT_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_BODIES_TYPE_LIGHT, soybodiesLightClass))
#define SOY_BODIES_IS_LIGHT(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_BODIES_TYPE_LIGHT))
#define SOY_BODIES_IS_LIGHT_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_BODIES_TYPE_LIGHT))
#define SOY_BODIES_LIGHT_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_BODIES_TYPE_LIGHT, soybodiesLightClass))

typedef struct _soybodiesLight soybodiesLight;
typedef struct _soybodiesLightClass soybodiesLightClass;

#define SOY_CONTROLLERS_TYPE_CONTROLLER (soy_controllers_controller_get_type ())
#define SOY_CONTROLLERS_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersController))
#define SOY_CONTROLLERS_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersControllerClass))
#define SOY_CONTROLLERS_IS_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER))
#define SOY_CONTROLLERS_IS_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_TYPE_CONTROLLER))
#define SOY_CONTROLLERS_CONTROLLER_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_TYPE_CONTROLLER, soycontrollersControllerClass))

typedef struct _soycontrollersController soycontrollersController;
typedef struct _soycontrollersControllerClass soycontrollersControllerClass;

#define SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER (soy_controllers_virtual_controller_get_type ())
#define SOY_CONTROLLERS_VIRTUAL_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, soycontrollersVirtualController))
#define SOY_CONTROLLERS_VIRTUAL_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, soycontrollersVirtualControllerClass))
#define SOY_CONTROLLERS_IS_VIRTUAL_CONTROLLER(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER))
#define SOY_CONTROLLERS_IS_VIRTUAL_CONTROLLER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER))
#define SOY_CONTROLLERS_VIRTUAL_CONTROLLER_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_TYPE_VIRTUAL_CONTROLLER, soycontrollersVirtualControllerClass))

typedef struct _soycontrollersVirtualController soycontrollersVirtualController;
typedef struct _soycontrollersVirtualControllerClass soycontrollersVirtualControllerClass;

#define SOY_FIELDS_TYPE_FIELD (soy_fields_field_get_type ())
#define SOY_FIELDS_FIELD(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_FIELDS_TYPE_FIELD, soyfieldsField))
#define SOY_FIELDS_FIELD_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_FIELDS_TYPE_FIELD, soyfieldsFieldClass))
#define SOY_FIELDS_IS_FIELD(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_FIELDS_TYPE_FIELD))
#define SOY_FIELDS_IS_FIELD_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_FIELDS_TYPE_FIELD))
#define SOY_FIELDS_FIELD_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_FIELDS_TYPE_FIELD, soyfieldsFieldClass))

typedef struct _soyfieldsField soyfieldsField;
typedef struct _soyfieldsFieldClass soyfieldsFieldClass;

struct _soyjointsJoint {
	GObject parent_instance;
	soyjointsJointPrivate * priv;
	struct dxJoint* joint;
	soybodiesBody* bodyA;
	soybodiesBody* bodyB;
	GMutex mutex;
};

struct _soyjointsJointClass {
	GObjectClass parent_class;
	void (*create) (soyjointsJoint* self);
	void (*setup) (soyjointsJoint* self, soyatomsPosition* anchor, soyatomsAxis* axis1, soyatomsAxis* axis2);
	void (*gen_matrices) (soyjointsJoint* self);
	void (*render) (soyjointsJoint* self);
	void (*mult_model_matrix) (soyjointsJoint* self);
	void (*mult_model_matrix_A) (soyjointsJoint* self);
	void (*mult_model_matrix_B) (soyjointsJoint* self);
};

struct _soyjointsJointPrivate {
	soymaterialsMaterial* _material;
};

struct _soybodiesBody {
	GObject parent_instance;
	soybodiesBodyPrivate * priv;
	struct dxBody* body;
	GLfloat* fogcoords;
	gint fogcoords_length1;
	struct dxGeom* geom;
	gchar* key;
	GMutex mutex;
	GLfloat* tslvs;
	gint tslvs_length1;
	soyscenesScene* scene;
	GeeHashMap* tags_;
};

struct _soybodiesBodyClass {
	GObjectClass parent_class;
	void (*create_geom) (soybodiesBody* self, GObject* geom_param, gfloat geom_scalar);
	void (*set_mass) (soybodiesBody* self, gfloat density);
	void (*add_extra) (soybodiesBody* self);
	void (*remove_extra) (soybodiesBody* self);
	gfloat (*pointDepth) (soybodiesBody* self, gfloat x, gfloat y, gfloat z);
	gfloat (*volume) (soybodiesBody* self);
	gint (*finite) (soybodiesBody* self);
	void (*mult_model_matrix) (soybodiesBody* self);
	void (*render) (soybodiesBody* self, gboolean alpha_stage, soybodiesCamera* camera, gint level);
	gfloat (*get_col_radius) (soybodiesBody* self);
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


static gpointer soy_joints_joint_parent_class = NULL;
extern GRWLock soy_scenes__stepLock;
extern struct dxWorld* soy_scenes__world;

GType soy_joints_joint_get_type (void) G_GNUC_CONST;
GType soy_atoms_position_get_type (void) G_GNUC_CONST;
GType soy_atoms_axis_get_type (void) G_GNUC_CONST;
GType soy_bodies_body_get_type (void) G_GNUC_CONST;
GType soy_materials_material_get_type (void) G_GNUC_CONST;
#define SOY_JOINTS_JOINT_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_JOINTS_TYPE_JOINT, soyjointsJointPrivate))
enum  {
	SOY_JOINTS_JOINT_DUMMY_PROPERTY,
	SOY_JOINTS_JOINT_MATERIAL
};
soyjointsJoint* soy_joints_joint_new (soybodiesBody* bodyA, soybodiesBody* bodyB, soyatomsPosition* anchor, soyatomsAxis* axis1, soyatomsAxis* axis2, soymaterialsMaterial* material);
soyjointsJoint* soy_joints_joint_construct (GType object_type, soybodiesBody* bodyA, soybodiesBody* bodyB, soyatomsPosition* anchor, soyatomsAxis* axis1, soyatomsAxis* axis2, soymaterialsMaterial* material);
void soy_joints_joint_create (soyjointsJoint* self);
GType soy_bodies_camera_get_type (void) G_GNUC_CONST;
GType soy_scenes_scene_get_type (void) G_GNUC_CONST;
void soy_joints_joint_setup (soyjointsJoint* self, soyatomsPosition* anchor, soyatomsAxis* axis1, soyatomsAxis* axis2);
GType soy_bodies_light_get_type (void) G_GNUC_CONST;
GType soy_controllers_controller_get_type (void) G_GNUC_CONST;
GType soy_controllers_virtual_controller_get_type (void) G_GNUC_CONST;
GType soy_fields_field_get_type (void) G_GNUC_CONST;
void soy_joints_joint_gen_matrices (soyjointsJoint* self);
static void soy_joints_joint_real_create (soyjointsJoint* self);
static void soy_joints_joint_real_setup (soyjointsJoint* self, soyatomsPosition* anchor, soyatomsAxis* axis1, soyatomsAxis* axis2);
static void soy_joints_joint_real_gen_matrices (soyjointsJoint* self);
void soy_joints_joint_render (soyjointsJoint* self);
static void soy_joints_joint_real_render (soyjointsJoint* self);
void soy_joints_joint_mult_model_matrix (soyjointsJoint* self);
static void soy_joints_joint_real_mult_model_matrix (soyjointsJoint* self);
void soy_joints_joint_mult_model_matrix_A (soyjointsJoint* self);
static void soy_joints_joint_real_mult_model_matrix_A (soyjointsJoint* self);
void soy_joints_joint_mult_model_matrix_B (soyjointsJoint* self);
static void soy_joints_joint_real_mult_model_matrix_B (soyjointsJoint* self);
soymaterialsMaterial* soy_joints_joint_get_material (soyjointsJoint* self);
void soy_joints_joint_set_material (soyjointsJoint* self, soymaterialsMaterial* value);
static GObject * soy_joints_joint_constructor (GType type, guint n_construct_properties, GObjectConstructParam * construct_properties);
static void soy_joints_joint_finalize (GObject* obj);
static void _vala_soy_joints_joint_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec);
static void _vala_soy_joints_joint_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec);
static void _vala_clear_GMutex (GMutex * mutex);
static void _vala_clear_GRecMutex (GRecMutex * mutex);
static void _vala_clear_GRWLock (GRWLock * mutex);
static void _vala_clear_GCond (GCond * mutex);


static gpointer _g_object_ref0 (gpointer self) {
	return self ? g_object_ref (self) : NULL;
}


soyjointsJoint* soy_joints_joint_construct (GType object_type, soybodiesBody* bodyA, soybodiesBody* bodyB, soyatomsPosition* anchor, soyatomsAxis* axis1, soyatomsAxis* axis2, soymaterialsMaterial* material) {
	soyjointsJoint * self = NULL;
	soybodiesBody* _tmp0_;
	soybodiesBody* _tmp1_;
	soymaterialsMaterial* _tmp2_;
	soymaterialsMaterial* _tmp3_;
	struct dxJoint* _tmp4_;
	soybodiesBody* _tmp5_;
	soyatomsPosition* _tmp14_;
	soyatomsAxis* _tmp15_;
	soyatomsAxis* _tmp16_;
	soybodiesBody* _tmp17_;
	soyscenesScene* _tmp18_;
	GeeArrayList* _tmp19_;
	g_return_val_if_fail (bodyA != NULL, NULL);
	self = (soyjointsJoint*) g_object_new (object_type, NULL);
	_tmp0_ = bodyA;
	self->bodyA = _tmp0_;
	_tmp1_ = bodyB;
	self->bodyB = _tmp1_;
	_tmp2_ = material;
	_tmp3_ = _g_object_ref0 (_tmp2_);
	_g_object_unref0 (self->priv->_material);
	self->priv->_material = _tmp3_;
	g_rw_lock_writer_lock (&soy_scenes__stepLock);
	soy_joints_joint_create (self);
	_tmp4_ = self->joint;
	dJointSetData (_tmp4_, (void*) self);
	_tmp5_ = bodyB;
	if (_tmp5_ == NULL) {
		struct dxJoint* _tmp6_;
		soybodiesBody* _tmp7_;
		struct dxBody* _tmp8_;
		_tmp6_ = self->joint;
		_tmp7_ = bodyA;
		_tmp8_ = _tmp7_->body;
		dJointAttach (_tmp6_, _tmp8_, NULL);
	} else {
		struct dxJoint* _tmp9_;
		soybodiesBody* _tmp10_;
		struct dxBody* _tmp11_;
		soybodiesBody* _tmp12_;
		struct dxBody* _tmp13_;
		_tmp9_ = self->joint;
		_tmp10_ = bodyA;
		_tmp11_ = _tmp10_->body;
		_tmp12_ = bodyB;
		_tmp13_ = _tmp12_->body;
		dJointAttach (_tmp9_, _tmp11_, _tmp13_);
	}
	_tmp14_ = anchor;
	_tmp15_ = axis1;
	_tmp16_ = axis2;
	soy_joints_joint_setup (self, _tmp14_, _tmp15_, _tmp16_);
	_tmp17_ = bodyA;
	_tmp18_ = _tmp17_->scene;
	_tmp19_ = _tmp18_->joints;
	gee_abstract_collection_add ((GeeAbstractCollection*) _tmp19_, self);
	soy_joints_joint_gen_matrices (self);
	g_rw_lock_writer_unlock (&soy_scenes__stepLock);
	return self;
}


soyjointsJoint* soy_joints_joint_new (soybodiesBody* bodyA, soybodiesBody* bodyB, soyatomsPosition* anchor, soyatomsAxis* axis1, soyatomsAxis* axis2, soymaterialsMaterial* material) {
	return soy_joints_joint_construct (SOY_JOINTS_TYPE_JOINT, bodyA, bodyB, anchor, axis1, axis2, material);
}


static void soy_joints_joint_real_create (soyjointsJoint* self) {
	struct dxWorld* _tmp0_;
	struct dxJoint* _tmp1_;
	_tmp0_ = soy_scenes__world;
	_tmp1_ = dJointCreateNull (_tmp0_, NULL);
	_dJointDestroy0 (self->joint);
	self->joint = _tmp1_;
}


void soy_joints_joint_create (soyjointsJoint* self) {
	g_return_if_fail (self != NULL);
	SOY_JOINTS_JOINT_GET_CLASS (self)->create (self);
}


static void soy_joints_joint_real_setup (soyjointsJoint* self, soyatomsPosition* anchor, soyatomsAxis* axis1, soyatomsAxis* axis2) {
	return;
}


void soy_joints_joint_setup (soyjointsJoint* self, soyatomsPosition* anchor, soyatomsAxis* axis1, soyatomsAxis* axis2) {
	g_return_if_fail (self != NULL);
	SOY_JOINTS_JOINT_GET_CLASS (self)->setup (self, anchor, axis1, axis2);
}


static void soy_joints_joint_real_gen_matrices (soyjointsJoint* self) {
	return;
}


void soy_joints_joint_gen_matrices (soyjointsJoint* self) {
	g_return_if_fail (self != NULL);
	SOY_JOINTS_JOINT_GET_CLASS (self)->gen_matrices (self);
}


static void soy_joints_joint_real_render (soyjointsJoint* self) {
	return;
}


void soy_joints_joint_render (soyjointsJoint* self) {
	g_return_if_fail (self != NULL);
	SOY_JOINTS_JOINT_GET_CLASS (self)->render (self);
}


static void soy_joints_joint_real_mult_model_matrix (soyjointsJoint* self) {
	return;
}


void soy_joints_joint_mult_model_matrix (soyjointsJoint* self) {
	g_return_if_fail (self != NULL);
	SOY_JOINTS_JOINT_GET_CLASS (self)->mult_model_matrix (self);
}


static void soy_joints_joint_real_mult_model_matrix_A (soyjointsJoint* self) {
	return;
}


void soy_joints_joint_mult_model_matrix_A (soyjointsJoint* self) {
	g_return_if_fail (self != NULL);
	SOY_JOINTS_JOINT_GET_CLASS (self)->mult_model_matrix_A (self);
}


static void soy_joints_joint_real_mult_model_matrix_B (soyjointsJoint* self) {
	return;
}


void soy_joints_joint_mult_model_matrix_B (soyjointsJoint* self) {
	g_return_if_fail (self != NULL);
	SOY_JOINTS_JOINT_GET_CLASS (self)->mult_model_matrix_B (self);
}


soymaterialsMaterial* soy_joints_joint_get_material (soyjointsJoint* self) {
	soymaterialsMaterial* result;
	soymaterialsMaterial* _tmp0_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_material;
	result = _tmp0_;
	return result;
}


void soy_joints_joint_set_material (soyjointsJoint* self, soymaterialsMaterial* value) {
	soymaterialsMaterial* _tmp0_;
	soymaterialsMaterial* _tmp1_;
	g_return_if_fail (self != NULL);
	g_mutex_lock (&self->mutex);
	_tmp0_ = value;
	_tmp1_ = _g_object_ref0 (_tmp0_);
	_g_object_unref0 (self->priv->_material);
	self->priv->_material = _tmp1_;
	g_mutex_unlock (&self->mutex);
	g_object_notify ((GObject *) self, "material");
}


static GObject * soy_joints_joint_constructor (GType type, guint n_construct_properties, GObjectConstructParam * construct_properties) {
	GObject * obj;
	GObjectClass * parent_class;
	soyjointsJoint * self;
	parent_class = G_OBJECT_CLASS (soy_joints_joint_parent_class);
	obj = parent_class->constructor (type, n_construct_properties, construct_properties);
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_JOINTS_TYPE_JOINT, soyjointsJoint);
	_vala_clear_GMutex (&self->mutex);
	g_mutex_init (&self->mutex);
	return obj;
}


static void soy_joints_joint_class_init (soyjointsJointClass * klass) {
	soy_joints_joint_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soyjointsJointPrivate));
	SOY_JOINTS_JOINT_CLASS (klass)->create = soy_joints_joint_real_create;
	SOY_JOINTS_JOINT_CLASS (klass)->setup = soy_joints_joint_real_setup;
	SOY_JOINTS_JOINT_CLASS (klass)->gen_matrices = soy_joints_joint_real_gen_matrices;
	SOY_JOINTS_JOINT_CLASS (klass)->render = soy_joints_joint_real_render;
	SOY_JOINTS_JOINT_CLASS (klass)->mult_model_matrix = soy_joints_joint_real_mult_model_matrix;
	SOY_JOINTS_JOINT_CLASS (klass)->mult_model_matrix_A = soy_joints_joint_real_mult_model_matrix_A;
	SOY_JOINTS_JOINT_CLASS (klass)->mult_model_matrix_B = soy_joints_joint_real_mult_model_matrix_B;
	G_OBJECT_CLASS (klass)->get_property = _vala_soy_joints_joint_get_property;
	G_OBJECT_CLASS (klass)->set_property = _vala_soy_joints_joint_set_property;
	G_OBJECT_CLASS (klass)->constructor = soy_joints_joint_constructor;
	G_OBJECT_CLASS (klass)->finalize = soy_joints_joint_finalize;
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_JOINTS_JOINT_MATERIAL, g_param_spec_object ("material", "material", "material", SOY_MATERIALS_TYPE_MATERIAL, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
}


static void soy_joints_joint_instance_init (soyjointsJoint * self) {
	self->priv = SOY_JOINTS_JOINT_GET_PRIVATE (self);
}


static void soy_joints_joint_finalize (GObject* obj) {
	soyjointsJoint * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_JOINTS_TYPE_JOINT, soyjointsJoint);
	_dJointDestroy0 (self->joint);
	_vala_clear_GMutex (&self->mutex);
	_g_object_unref0 (self->priv->_material);
	G_OBJECT_CLASS (soy_joints_joint_parent_class)->finalize (obj);
}


GType soy_joints_joint_get_type (void) {
	static volatile gsize soy_joints_joint_type_id__volatile = 0;
	if (g_once_init_enter (&soy_joints_joint_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soyjointsJointClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_joints_joint_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soyjointsJoint), 0, (GInstanceInitFunc) soy_joints_joint_instance_init, NULL };
		GType soy_joints_joint_type_id;
		soy_joints_joint_type_id = g_type_register_static (G_TYPE_OBJECT, "soyjointsJoint", &g_define_type_info, 0);
		g_once_init_leave (&soy_joints_joint_type_id__volatile, soy_joints_joint_type_id);
	}
	return soy_joints_joint_type_id__volatile;
}


static void _vala_soy_joints_joint_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec) {
	soyjointsJoint * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_JOINTS_TYPE_JOINT, soyjointsJoint);
	switch (property_id) {
		case SOY_JOINTS_JOINT_MATERIAL:
		g_value_set_object (value, soy_joints_joint_get_material (self));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}


static void _vala_soy_joints_joint_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec) {
	soyjointsJoint * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_JOINTS_TYPE_JOINT, soyjointsJoint);
	switch (property_id) {
		case SOY_JOINTS_JOINT_MATERIAL:
		soy_joints_joint_set_material (self, g_value_get_object (value));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}


static void _vala_clear_GMutex (GMutex * mutex) {
	GMutex zero_mutex = { 0 };
	if (memcmp (mutex, &zero_mutex, sizeof (GMutex))) {
		g_mutex_clear (mutex);
		memset (mutex, 0, sizeof (GMutex));
	}
}


static void _vala_clear_GRecMutex (GRecMutex * mutex) {
	GRecMutex zero_mutex = { 0 };
	if (memcmp (mutex, &zero_mutex, sizeof (GRecMutex))) {
		g_rec_mutex_clear (mutex);
		memset (mutex, 0, sizeof (GRecMutex));
	}
}


static void _vala_clear_GRWLock (GRWLock * mutex) {
	GRWLock zero_mutex = { 0 };
	if (memcmp (mutex, &zero_mutex, sizeof (GRWLock))) {
		g_rw_lock_clear (mutex);
		memset (mutex, 0, sizeof (GRWLock));
	}
}


static void _vala_clear_GCond (GCond * mutex) {
	GCond zero_mutex = { 0 };
	if (memcmp (mutex, &zero_mutex, sizeof (GCond))) {
		g_cond_clear (mutex);
		memset (mutex, 0, sizeof (GCond));
	}
}


