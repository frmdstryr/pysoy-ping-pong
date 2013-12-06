/* TDSide.c generated by valac 0.20.1, the Vala compiler
 * generated from TDSide.gs, do not modify */

/*
 *  libsoy - soy.scenes.td.Side
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
#include <GLES/gl.h>
#include <GLES/glext.h>
#include <soy-1/ode.h>
#include <gee.h>
#include <stdlib.h>
#include <string.h>
#include <float.h>
#include <math.h>


#define SOY_SCENES_TYPE_SCENE (soy_scenes_scene_get_type ())
#define SOY_SCENES_SCENE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_SCENES_TYPE_SCENE, soyscenesScene))
#define SOY_SCENES_SCENE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_SCENES_TYPE_SCENE, soyscenesSceneClass))
#define SOY_SCENES_IS_SCENE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_SCENES_TYPE_SCENE))
#define SOY_SCENES_IS_SCENE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_SCENES_TYPE_SCENE))
#define SOY_SCENES_SCENE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_SCENES_TYPE_SCENE, soyscenesSceneClass))

typedef struct _soyscenesScene soyscenesScene;
typedef struct _soyscenesSceneClass soyscenesSceneClass;
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

#define SOY_SCENES_TYPE_TD_SIDE (soy_scenes_td_side_get_type ())
#define SOY_SCENES_TD_SIDE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_SCENES_TYPE_TD_SIDE, soyscenesTDSide))
#define SOY_SCENES_TD_SIDE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_SCENES_TYPE_TD_SIDE, soyscenesTDSideClass))
#define SOY_SCENES_IS_TD_SIDE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_SCENES_TYPE_TD_SIDE))
#define SOY_SCENES_IS_TD_SIDE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_SCENES_TYPE_TD_SIDE))
#define SOY_SCENES_TD_SIDE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_SCENES_TYPE_TD_SIDE, soyscenesTDSideClass))

typedef struct _soyscenesTDSide soyscenesTDSide;
typedef struct _soyscenesTDSideClass soyscenesTDSideClass;
typedef struct _soyscenesTDSidePrivate soyscenesTDSidePrivate;

#define SOY_JOINTS_TYPE_PLANE2_D (soy_joints_plane2_d_get_type ())
#define SOY_JOINTS_PLANE2_D(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_JOINTS_TYPE_PLANE2_D, soyjointsPlane2D))
#define SOY_JOINTS_PLANE2_D_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_JOINTS_TYPE_PLANE2_D, soyjointsPlane2DClass))
#define SOY_JOINTS_IS_PLANE2_D(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_JOINTS_TYPE_PLANE2_D))
#define SOY_JOINTS_IS_PLANE2_D_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_JOINTS_TYPE_PLANE2_D))
#define SOY_JOINTS_PLANE2_D_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_JOINTS_TYPE_PLANE2_D, soyjointsPlane2DClass))

typedef struct _soyjointsPlane2D soyjointsPlane2D;
typedef struct _soyjointsPlane2DClass soyjointsPlane2DClass;

#define SOY_FIELDS_TYPE_ACCELERATE (soy_fields_accelerate_get_type ())
#define SOY_FIELDS_ACCELERATE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_FIELDS_TYPE_ACCELERATE, soyfieldsAccelerate))
#define SOY_FIELDS_ACCELERATE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_FIELDS_TYPE_ACCELERATE, soyfieldsAccelerateClass))
#define SOY_FIELDS_IS_ACCELERATE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_FIELDS_TYPE_ACCELERATE))
#define SOY_FIELDS_IS_ACCELERATE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_FIELDS_TYPE_ACCELERATE))
#define SOY_FIELDS_ACCELERATE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_FIELDS_TYPE_ACCELERATE, soyfieldsAccelerateClass))

typedef struct _soyfieldsAccelerate soyfieldsAccelerate;
typedef struct _soyfieldsAccelerateClass soyfieldsAccelerateClass;
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))

#define SOY_MATERIALS_TYPE_MATERIAL (soy_materials_material_get_type ())
#define SOY_MATERIALS_MATERIAL(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_MATERIALS_TYPE_MATERIAL, soymaterialsMaterial))
#define SOY_MATERIALS_MATERIAL_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_MATERIALS_TYPE_MATERIAL, soymaterialsMaterialClass))
#define SOY_MATERIALS_IS_MATERIAL(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_MATERIALS_TYPE_MATERIAL))
#define SOY_MATERIALS_IS_MATERIAL_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_MATERIALS_TYPE_MATERIAL))
#define SOY_MATERIALS_MATERIAL_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_MATERIALS_TYPE_MATERIAL, soymaterialsMaterialClass))

typedef struct _soymaterialsMaterial soymaterialsMaterial;
typedef struct _soymaterialsMaterialClass soymaterialsMaterialClass;
typedef struct _soybodiesBodyPrivate soybodiesBodyPrivate;

#define SOY_ATOMS_TYPE_VECTOR (soy_atoms_vector_get_type ())
#define SOY_ATOMS_VECTOR(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_VECTOR, soyatomsVector))
#define SOY_ATOMS_VECTOR_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_VECTOR, soyatomsVectorClass))
#define SOY_ATOMS_IS_VECTOR(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_VECTOR))
#define SOY_ATOMS_IS_VECTOR_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_VECTOR))
#define SOY_ATOMS_VECTOR_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_VECTOR, soyatomsVectorClass))

typedef struct _soyatomsVector soyatomsVector;
typedef struct _soyatomsVectorClass soyatomsVectorClass;

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

struct _soyscenesTDSide {
	soyscenesScene parent_instance;
	soyscenesTDSidePrivate * priv;
	GeeLinkedList* tdbodies;
	GeeHashMap* plane2ds;
};

struct _soyscenesTDSideClass {
	soyscenesSceneClass parent_class;
};

struct _soyscenesTDSidePrivate {
	soyfieldsAccelerate* _tdgravity;
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


static gpointer soy_scenes_td_side_parent_class = NULL;

GType soy_scenes_scene_get_type (void) G_GNUC_CONST;
GType soy_bodies_body_get_type (void) G_GNUC_CONST;
GType soy_bodies_camera_get_type (void) G_GNUC_CONST;
GType soy_bodies_light_get_type (void) G_GNUC_CONST;
GType soy_joints_joint_get_type (void) G_GNUC_CONST;
GType soy_controllers_controller_get_type (void) G_GNUC_CONST;
GType soy_controllers_virtual_controller_get_type (void) G_GNUC_CONST;
GType soy_fields_field_get_type (void) G_GNUC_CONST;
GType soy_scenes_td_side_get_type (void) G_GNUC_CONST;
GType soy_joints_plane2_d_get_type (void) G_GNUC_CONST;
GType soy_fields_accelerate_get_type (void) G_GNUC_CONST;
#define SOY_SCENES_TD_SIDE_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_SCENES_TYPE_TD_SIDE, soyscenesTDSidePrivate))
enum  {
	SOY_SCENES_TD_SIDE_DUMMY_PROPERTY,
	SOY_SCENES_TD_SIDE_TDGRAVITY
};
soyscenesTDSide* soy_scenes_td_side_new (void);
soyscenesTDSide* soy_scenes_td_side_construct (GType object_type);
soyscenesScene* soy_scenes_scene_new (void);
soyscenesScene* soy_scenes_scene_construct (GType object_type);
soyfieldsAccelerate* soy_fields_accelerate_new (gfloat x, gfloat y, gfloat z);
soyfieldsAccelerate* soy_fields_accelerate_construct (GType object_type, gfloat x, gfloat y, gfloat z);
static void soy_scenes_td_side_real_do_in_step (soyscenesScene* base);
static void _soy_scenes_td_side_align_to_z_axis (soyscenesTDSide* self);
void soy_scenes_td_side_set2d (soyscenesTDSide* self, soybodiesBody* body);
GType soy_materials_material_get_type (void) G_GNUC_CONST;
soyjointsPlane2D* soy_joints_plane2_d_new (soybodiesBody* bodyA, soybodiesBody* bodyB, soymaterialsMaterial* material);
soyjointsPlane2D* soy_joints_plane2_d_construct (GType object_type, soybodiesBody* bodyA, soybodiesBody* bodyB, soymaterialsMaterial* material);
void soy_scenes_td_side_unset2d (soyscenesTDSide* self, soybodiesBody* body);
void soy_scenes_td_side_set_vel_x (soyscenesTDSide* self, soybodiesBody* body, gfloat vel);
void soy_joints_plane2_d_setXParam (soyjointsPlane2D* self, gint param, dReal val);
void soy_scenes_td_side_set_vel_y (soyscenesTDSide* self, soybodiesBody* body, gfloat vel);
void soy_joints_plane2_d_setYParam (soyjointsPlane2D* self, gint param, dReal val);
GType soy_atoms_vector_get_type (void) G_GNUC_CONST;
soyatomsVector* soy_scenes_td_side_get_tdgravity (soyscenesTDSide* self);
soyatomsVector* soy_fields_accelerate_get_acceleration (soyfieldsAccelerate* self);
void soy_scenes_td_side_set_tdgravity (soyscenesTDSide* self, soyatomsVector* value);
void soy_fields_accelerate_set_acceleration (soyfieldsAccelerate* self, soyatomsVector* value);
static void soy_scenes_td_side_finalize (GObject* obj);
static void _vala_soy_scenes_td_side_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec);
static void _vala_soy_scenes_td_side_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec);


soyscenesTDSide* soy_scenes_td_side_construct (GType object_type) {
	soyscenesTDSide * self = NULL;
	GeeLinkedList* _tmp0_;
	GeeHashMap* _tmp1_;
	soyfieldsAccelerate* _tmp2_;
	self = (soyscenesTDSide*) soy_scenes_scene_construct (object_type);
	_tmp0_ = gee_linked_list_new (SOY_BODIES_TYPE_BODY, (GBoxedCopyFunc) g_object_ref, g_object_unref, NULL);
	_g_object_unref0 (self->tdbodies);
	self->tdbodies = _tmp0_;
	_tmp1_ = gee_hash_map_new (SOY_BODIES_TYPE_BODY, (GBoxedCopyFunc) g_object_ref, g_object_unref, SOY_JOINTS_TYPE_PLANE2_D, (GBoxedCopyFunc) g_object_ref, g_object_unref, NULL, NULL, NULL);
	_g_object_unref0 (self->plane2ds);
	self->plane2ds = _tmp1_;
	_tmp2_ = soy_fields_accelerate_new (0.0f, 0.0f, 0.0f);
	_g_object_unref0 (self->priv->_tdgravity);
	self->priv->_tdgravity = _tmp2_;
	return self;
}


soyscenesTDSide* soy_scenes_td_side_new (void) {
	return soy_scenes_td_side_construct (SOY_SCENES_TYPE_TD_SIDE);
}


static void soy_scenes_td_side_real_do_in_step (soyscenesScene* base) {
	soyscenesTDSide * self;
	self = (soyscenesTDSide*) base;
	_soy_scenes_td_side_align_to_z_axis (self);
}


void soy_scenes_td_side_set2d (soyscenesTDSide* self, soybodiesBody* body) {
	GeeLinkedList* _tmp0_;
	soybodiesBody* _tmp1_;
	GeeHashMap* _tmp2_;
	soybodiesBody* _tmp3_;
	soybodiesBody* _tmp4_;
	soyjointsPlane2D* _tmp5_;
	soyjointsPlane2D* _tmp6_;
	g_return_if_fail (self != NULL);
	g_return_if_fail (body != NULL);
	_tmp0_ = self->tdbodies;
	_tmp1_ = body;
	gee_abstract_collection_add ((GeeAbstractCollection*) _tmp0_, _tmp1_);
	_tmp2_ = self->plane2ds;
	_tmp3_ = body;
	_tmp4_ = body;
	_tmp5_ = soy_joints_plane2_d_new (_tmp4_, NULL, NULL);
	_tmp6_ = _tmp5_;
	gee_abstract_map_set ((GeeAbstractMap*) _tmp2_, _tmp3_, _tmp6_);
	_g_object_unref0 (_tmp6_);
}


void soy_scenes_td_side_unset2d (soyscenesTDSide* self, soybodiesBody* body) {
	GeeLinkedList* _tmp0_;
	soybodiesBody* _tmp1_;
	GeeHashMap* _tmp2_;
	soybodiesBody* _tmp3_;
	g_return_if_fail (self != NULL);
	g_return_if_fail (body != NULL);
	_tmp0_ = self->tdbodies;
	_tmp1_ = body;
	gee_abstract_collection_remove ((GeeAbstractCollection*) _tmp0_, _tmp1_);
	_tmp2_ = self->plane2ds;
	_tmp3_ = body;
	gee_abstract_map_unset ((GeeAbstractMap*) _tmp2_, _tmp3_, NULL);
}


static gpointer _g_object_ref0 (gpointer self) {
	return self ? g_object_ref (self) : NULL;
}


static void _soy_scenes_td_side_align_to_z_axis (soyscenesTDSide* self) {
	g_return_if_fail (self != NULL);
	{
		GeeLinkedList* _tmp0_;
		GeeLinkedList* _tmp1_;
		GeeLinkedList* _body_list;
		GeeLinkedList* _tmp2_;
		gint _tmp3_;
		gint _tmp4_;
		gint _body_size;
		gint _body_index;
		_tmp0_ = self->tdbodies;
		_tmp1_ = _g_object_ref0 (_tmp0_);
		_body_list = _tmp1_;
		_tmp2_ = _body_list;
		_tmp3_ = gee_abstract_collection_get_size ((GeeCollection*) _tmp2_);
		_tmp4_ = _tmp3_;
		_body_size = _tmp4_;
		_body_index = -1;
		while (TRUE) {
			gint _tmp5_;
			gint _tmp6_;
			gint _tmp7_;
			GeeLinkedList* _tmp8_;
			gint _tmp9_;
			gpointer _tmp10_ = NULL;
			soybodiesBody* body;
			soybodiesBody* _tmp11_;
			struct dxBody* _tmp12_;
			dxVector3* _tmp13_ = NULL;
			dxVector3* rot;
			soybodiesBody* _tmp14_;
			struct dxBody* _tmp15_;
			dxQuaternion* _tmp16_ = NULL;
			dxQuaternion* quat;
			dReal quat_len = 0.0;
			dxQuaternion* _tmp17_;
			dxQuaternion* _tmp18_;
			dxQuaternion* _tmp19_;
			dReal _tmp20_;
			dxQuaternion* _tmp21_;
			dReal _tmp22_;
			dxQuaternion* _tmp23_;
			dReal _tmp24_;
			dxQuaternion* _tmp25_;
			dReal _tmp26_;
			gfloat _tmp27_ = 0.0F;
			dxQuaternion* _tmp28_;
			dxQuaternion* _tmp29_;
			dReal _tmp30_;
			dReal _tmp31_;
			dxQuaternion* _tmp32_;
			dxQuaternion* _tmp33_;
			dReal _tmp34_;
			dReal _tmp35_;
			soybodiesBody* _tmp36_;
			struct dxBody* _tmp37_;
			dxQuaternion* _tmp38_;
			soybodiesBody* _tmp39_;
			struct dxBody* _tmp40_;
			dxVector3* _tmp41_;
			dReal _tmp42_;
			_tmp5_ = _body_index;
			_body_index = _tmp5_ + 1;
			_tmp6_ = _body_index;
			_tmp7_ = _body_size;
			if (!(_tmp6_ < _tmp7_)) {
				break;
			}
			_tmp8_ = _body_list;
			_tmp9_ = _body_index;
			_tmp10_ = gee_abstract_list_get ((GeeAbstractList*) _tmp8_, _tmp9_);
			body = (soybodiesBody*) _tmp10_;
			_tmp11_ = body;
			_tmp12_ = _tmp11_->body;
			_tmp13_ = dBodyGetAngularVel (_tmp12_);
			rot = _tmp13_;
			_tmp14_ = body;
			_tmp15_ = _tmp14_->body;
			_tmp16_ = dBodyGetQuaternion (_tmp15_);
			quat = _tmp16_;
			_tmp17_ = quat;
			_tmp17_->x = (dReal) 0;
			_tmp18_ = quat;
			_tmp18_->y = (dReal) 0;
			_tmp19_ = quat;
			_tmp20_ = _tmp19_->w;
			_tmp21_ = quat;
			_tmp22_ = _tmp21_->w;
			_tmp23_ = quat;
			_tmp24_ = _tmp23_->z;
			_tmp25_ = quat;
			_tmp26_ = _tmp25_->z;
			_tmp27_ = sqrtf ((((gfloat) _tmp20_) * ((gfloat) _tmp22_)) + (((gfloat) _tmp24_) * ((gfloat) _tmp26_)));
			quat_len = (dReal) _tmp27_;
			_tmp28_ = quat;
			_tmp29_ = quat;
			_tmp30_ = _tmp29_->w;
			_tmp31_ = quat_len;
			_tmp29_->w = _tmp30_ / _tmp31_;
			_tmp32_ = quat;
			_tmp33_ = quat;
			_tmp34_ = _tmp33_->z;
			_tmp35_ = quat_len;
			_tmp33_->z = _tmp34_ / _tmp35_;
			_tmp36_ = body;
			_tmp37_ = _tmp36_->body;
			_tmp38_ = quat;
			dBodySetQuaternion (_tmp37_, _tmp38_);
			_tmp39_ = body;
			_tmp40_ = _tmp39_->body;
			_tmp41_ = rot;
			_tmp42_ = _tmp41_->z;
			dBodySetAngularVel (_tmp40_, (dReal) 0, (dReal) 0, _tmp42_);
			_g_object_unref0 (body);
		}
		_g_object_unref0 (_body_list);
	}
}


void soy_scenes_td_side_set_vel_x (soyscenesTDSide* self, soybodiesBody* body, gfloat vel) {
	GeeHashMap* _tmp0_;
	soybodiesBody* _tmp1_;
	gpointer _tmp2_ = NULL;
	soyjointsPlane2D* _tmp3_;
	gfloat _tmp4_;
	g_return_if_fail (self != NULL);
	g_return_if_fail (body != NULL);
	_tmp0_ = self->plane2ds;
	_tmp1_ = body;
	_tmp2_ = gee_abstract_map_get ((GeeAbstractMap*) _tmp0_, _tmp1_);
	_tmp3_ = (soyjointsPlane2D*) _tmp2_;
	_tmp4_ = vel;
	soy_joints_plane2_d_setXParam (_tmp3_, (gint) dParamVel, (dReal) _tmp4_);
	_g_object_unref0 (_tmp3_);
}


void soy_scenes_td_side_set_vel_y (soyscenesTDSide* self, soybodiesBody* body, gfloat vel) {
	GeeHashMap* _tmp0_;
	soybodiesBody* _tmp1_;
	gpointer _tmp2_ = NULL;
	soyjointsPlane2D* _tmp3_;
	gfloat _tmp4_;
	g_return_if_fail (self != NULL);
	g_return_if_fail (body != NULL);
	_tmp0_ = self->plane2ds;
	_tmp1_ = body;
	_tmp2_ = gee_abstract_map_get ((GeeAbstractMap*) _tmp0_, _tmp1_);
	_tmp3_ = (soyjointsPlane2D*) _tmp2_;
	_tmp4_ = vel;
	soy_joints_plane2_d_setYParam (_tmp3_, (gint) dParamVel, (dReal) _tmp4_);
	_g_object_unref0 (_tmp3_);
}


soyatomsVector* soy_scenes_td_side_get_tdgravity (soyscenesTDSide* self) {
	soyatomsVector* result;
	soyfieldsAccelerate* _tmp0_;
	soyatomsVector* _tmp1_;
	soyatomsVector* _tmp2_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_tdgravity;
	_tmp1_ = soy_fields_accelerate_get_acceleration (_tmp0_);
	_tmp2_ = _tmp1_;
	result = _tmp2_;
	return result;
}


void soy_scenes_td_side_set_tdgravity (soyscenesTDSide* self, soyatomsVector* value) {
	soyfieldsAccelerate* _tmp0_;
	soyatomsVector* _tmp1_;
	g_return_if_fail (self != NULL);
	_tmp0_ = self->priv->_tdgravity;
	_tmp1_ = value;
	soy_fields_accelerate_set_acceleration (_tmp0_, _tmp1_);
	g_object_notify ((GObject *) self, "tdgravity");
}


static void soy_scenes_td_side_class_init (soyscenesTDSideClass * klass) {
	soy_scenes_td_side_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soyscenesTDSidePrivate));
	SOY_SCENES_SCENE_CLASS (klass)->do_in_step = soy_scenes_td_side_real_do_in_step;
	G_OBJECT_CLASS (klass)->get_property = _vala_soy_scenes_td_side_get_property;
	G_OBJECT_CLASS (klass)->set_property = _vala_soy_scenes_td_side_set_property;
	G_OBJECT_CLASS (klass)->finalize = soy_scenes_td_side_finalize;
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_SCENES_TD_SIDE_TDGRAVITY, g_param_spec_object ("tdgravity", "tdgravity", "tdgravity", SOY_ATOMS_TYPE_VECTOR, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
}


static void soy_scenes_td_side_instance_init (soyscenesTDSide * self) {
	self->priv = SOY_SCENES_TD_SIDE_GET_PRIVATE (self);
}


static void soy_scenes_td_side_finalize (GObject* obj) {
	soyscenesTDSide * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_SCENES_TYPE_TD_SIDE, soyscenesTDSide);
	_g_object_unref0 (self->tdbodies);
	_g_object_unref0 (self->plane2ds);
	_g_object_unref0 (self->priv->_tdgravity);
	G_OBJECT_CLASS (soy_scenes_td_side_parent_class)->finalize (obj);
}


GType soy_scenes_td_side_get_type (void) {
	static volatile gsize soy_scenes_td_side_type_id__volatile = 0;
	if (g_once_init_enter (&soy_scenes_td_side_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soyscenesTDSideClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_scenes_td_side_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soyscenesTDSide), 0, (GInstanceInitFunc) soy_scenes_td_side_instance_init, NULL };
		GType soy_scenes_td_side_type_id;
		soy_scenes_td_side_type_id = g_type_register_static (SOY_SCENES_TYPE_SCENE, "soyscenesTDSide", &g_define_type_info, 0);
		g_once_init_leave (&soy_scenes_td_side_type_id__volatile, soy_scenes_td_side_type_id);
	}
	return soy_scenes_td_side_type_id__volatile;
}


static void _vala_soy_scenes_td_side_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec) {
	soyscenesTDSide * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_SCENES_TYPE_TD_SIDE, soyscenesTDSide);
	switch (property_id) {
		case SOY_SCENES_TD_SIDE_TDGRAVITY:
		g_value_set_object (value, soy_scenes_td_side_get_tdgravity (self));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}


static void _vala_soy_scenes_td_side_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec) {
	soyscenesTDSide * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_SCENES_TYPE_TD_SIDE, soyscenesTDSide);
	switch (property_id) {
		case SOY_SCENES_TD_SIDE_TDGRAVITY:
		soy_scenes_td_side_set_tdgravity (self, g_value_get_object (value));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}


