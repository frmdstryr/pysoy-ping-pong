/* AbstractGraph.c generated by valac 0.20.1, the Vala compiler
 * generated from AbstractGraph.gs, do not modify */

/*
 *  libsoy - soy.controllers.graph.AbstractGraph
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
#include <float.h>
#include <math.h>


#define SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH (soy_controllers_graph_abstract_graph_get_type ())
#define SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH, soycontrollersgraphAbstractGraph))
#define SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH, soycontrollersgraphAbstractGraphClass))
#define SOY_CONTROLLERS_GRAPH_IS_ABSTRACT_GRAPH(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH))
#define SOY_CONTROLLERS_GRAPH_IS_ABSTRACT_GRAPH_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH))
#define SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH, soycontrollersgraphAbstractGraphClass))

typedef struct _soycontrollersgraphAbstractGraph soycontrollersgraphAbstractGraph;
typedef struct _soycontrollersgraphAbstractGraphClass soycontrollersgraphAbstractGraphClass;
typedef struct _soycontrollersgraphAbstractGraphPrivate soycontrollersgraphAbstractGraphPrivate;

#define SOY_ATOMS_TYPE_POSITION (soy_atoms_position_get_type ())
#define SOY_ATOMS_POSITION(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_POSITION, soyatomsPosition))
#define SOY_ATOMS_POSITION_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_POSITION, soyatomsPositionClass))
#define SOY_ATOMS_IS_POSITION(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_POSITION))
#define SOY_ATOMS_IS_POSITION_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_POSITION))
#define SOY_ATOMS_POSITION_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_POSITION, soyatomsPositionClass))

typedef struct _soyatomsPosition soyatomsPosition;
typedef struct _soyatomsPositionClass soyatomsPositionClass;

#define SOY_SCENES_TYPE_SCENE (soy_scenes_scene_get_type ())
#define SOY_SCENES_SCENE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_SCENES_TYPE_SCENE, soyscenesScene))
#define SOY_SCENES_SCENE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_SCENES_TYPE_SCENE, soyscenesSceneClass))
#define SOY_SCENES_IS_SCENE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_SCENES_TYPE_SCENE))
#define SOY_SCENES_IS_SCENE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_SCENES_TYPE_SCENE))
#define SOY_SCENES_SCENE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_SCENES_TYPE_SCENE, soyscenesSceneClass))

typedef struct _soyscenesScene soyscenesScene;
typedef struct _soyscenesSceneClass soyscenesSceneClass;

#define SOY_ATOMS_TYPE_SIZE (soy_atoms_size_get_type ())
#define SOY_ATOMS_SIZE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_SIZE, soyatomsSize))
#define SOY_ATOMS_SIZE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_SIZE, soyatomsSizeClass))
#define SOY_ATOMS_IS_SIZE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_SIZE))
#define SOY_ATOMS_IS_SIZE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_SIZE))
#define SOY_ATOMS_SIZE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_SIZE, soyatomsSizeClass))

typedef struct _soyatomsSize soyatomsSize;
typedef struct _soyatomsSizeClass soyatomsSizeClass;
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))

struct _soycontrollersgraphAbstractGraph {
	GObject parent_instance;
	soycontrollersgraphAbstractGraphPrivate * priv;
};

struct _soycontrollersgraphAbstractGraphClass {
	GObjectClass parent_class;
	gboolean* (*check_collisions) (soycontrollersgraphAbstractGraph* self, soyatomsPosition* start, soyatomsPosition** ends, int ends_length1, int* result_length1);
};

struct _soycontrollersgraphAbstractGraphPrivate {
	soyscenesScene* _scene;
	gfloat _radius;
	gboolean _has_radius;
	soyatomsSize* _size;
};


static gpointer soy_controllers_graph_abstract_graph_parent_class = NULL;

GType soy_controllers_graph_abstract_graph_get_type (void) G_GNUC_CONST;
GType soy_atoms_position_get_type (void) G_GNUC_CONST;
GType soy_scenes_scene_get_type (void) G_GNUC_CONST;
GType soy_atoms_size_get_type (void) G_GNUC_CONST;
#define SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH, soycontrollersgraphAbstractGraphPrivate))
enum  {
	SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_DUMMY_PROPERTY,
	SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_SIZE,
	SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_SCENE,
	SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_RADIUS
};
soycontrollersgraphAbstractGraph* soy_controllers_graph_abstract_graph_new (soyscenesScene* scene, gfloat radius, soyatomsSize* size);
soycontrollersgraphAbstractGraph* soy_controllers_graph_abstract_graph_construct (GType object_type, soyscenesScene* scene, gfloat radius, soyatomsSize* size);
gboolean* soy_controllers_graph_abstract_graph_check_collisions (soycontrollersgraphAbstractGraph* self, soyatomsPosition* start, soyatomsPosition** ends, int ends_length1, int* result_length1);
static gboolean* soy_controllers_graph_abstract_graph_real_check_collisions (soycontrollersgraphAbstractGraph* self, soyatomsPosition* start, soyatomsPosition** ends, int ends_length1, int* result_length1);
soyatomsSize* soy_controllers_graph_abstract_graph_get_size (soycontrollersgraphAbstractGraph* self);
soyscenesScene* soy_controllers_graph_abstract_graph_get_scene (soycontrollersgraphAbstractGraph* self);
gboolean* soy_scenes_scene_check_collisions_with_size (soyscenesScene* self, soyatomsPosition* start, soyatomsPosition** ends, int ends_length1, soyatomsSize* aabb, int* result_length1);
gboolean* soy_scenes_scene_check_collisions_with_radius (soyscenesScene* self, soyatomsPosition* start, soyatomsPosition** ends, int ends_length1, gfloat radius, int* result_length1);
gfloat soy_controllers_graph_abstract_graph_get_radius (soycontrollersgraphAbstractGraph* self);
gboolean* soy_scenes_scene_check_collisions (soyscenesScene* self, soyatomsPosition* start, soyatomsPosition** ends, int ends_length1, int* result_length1);
static void soy_controllers_graph_abstract_graph_finalize (GObject* obj);
static void _vala_soy_controllers_graph_abstract_graph_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec);


static gpointer _g_object_ref0 (gpointer self) {
	return self ? g_object_ref (self) : NULL;
}


soycontrollersgraphAbstractGraph* soy_controllers_graph_abstract_graph_construct (GType object_type, soyscenesScene* scene, gfloat radius, soyatomsSize* size) {
	soycontrollersgraphAbstractGraph * self = NULL;
	soyscenesScene* _tmp0_;
	soyscenesScene* _tmp1_;
	gfloat _tmp2_;
	gboolean _tmp3_;
	soyatomsSize* _tmp5_;
	soyatomsSize* _tmp6_;
	g_return_val_if_fail (scene != NULL, NULL);
	self = (soycontrollersgraphAbstractGraph*) g_object_new (object_type, NULL);
	_tmp0_ = scene;
	_tmp1_ = _g_object_ref0 (_tmp0_);
	_g_object_unref0 (self->priv->_scene);
	self->priv->_scene = _tmp1_;
	_tmp2_ = radius;
	self->priv->_has_radius = _tmp2_ > 0.0f;
	_tmp3_ = self->priv->_has_radius;
	if (!_tmp3_) {
		self->priv->_radius = -1.0f;
	} else {
		gfloat _tmp4_;
		_tmp4_ = radius;
		self->priv->_radius = _tmp4_;
	}
	_tmp5_ = size;
	_tmp6_ = _g_object_ref0 (_tmp5_);
	_g_object_unref0 (self->priv->_size);
	self->priv->_size = _tmp6_;
	return self;
}


soycontrollersgraphAbstractGraph* soy_controllers_graph_abstract_graph_new (soyscenesScene* scene, gfloat radius, soyatomsSize* size) {
	return soy_controllers_graph_abstract_graph_construct (SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH, scene, radius, size);
}


static gboolean* soy_controllers_graph_abstract_graph_real_check_collisions (soycontrollersgraphAbstractGraph* self, soyatomsPosition* start, soyatomsPosition** ends, int ends_length1, int* result_length1) {
	gboolean* result = NULL;
	soyatomsSize* _tmp0_;
	soyatomsSize* _tmp1_;
	g_return_val_if_fail (start != NULL, NULL);
	_tmp0_ = soy_controllers_graph_abstract_graph_get_size (self);
	_tmp1_ = _tmp0_;
	if (!(_tmp1_ == NULL)) {
		soyscenesScene* _tmp2_;
		soyscenesScene* _tmp3_;
		soyatomsPosition* _tmp4_;
		soyatomsPosition** _tmp5_;
		gint _tmp5__length1;
		soyatomsSize* _tmp6_;
		soyatomsSize* _tmp7_;
		gint _tmp8_ = 0;
		gboolean* _tmp9_ = NULL;
		gboolean* _tmp10_;
		gint _tmp10__length1;
		_tmp2_ = soy_controllers_graph_abstract_graph_get_scene (self);
		_tmp3_ = _tmp2_;
		_tmp4_ = start;
		_tmp5_ = ends;
		_tmp5__length1 = ends_length1;
		_tmp6_ = soy_controllers_graph_abstract_graph_get_size (self);
		_tmp7_ = _tmp6_;
		_tmp9_ = soy_scenes_scene_check_collisions_with_size (_tmp3_, _tmp4_, _tmp5_, _tmp5__length1, _tmp7_, &_tmp8_);
		_tmp10_ = _tmp9_;
		_tmp10__length1 = _tmp8_;
		if (result_length1) {
			*result_length1 = _tmp10__length1;
		}
		result = _tmp10_;
		return result;
	} else {
		gboolean _tmp11_;
		_tmp11_ = self->priv->_has_radius;
		if (_tmp11_) {
			soyscenesScene* _tmp12_;
			soyscenesScene* _tmp13_;
			soyatomsPosition* _tmp14_;
			soyatomsPosition** _tmp15_;
			gint _tmp15__length1;
			gfloat _tmp16_;
			gfloat _tmp17_;
			gint _tmp18_ = 0;
			gboolean* _tmp19_ = NULL;
			gboolean* _tmp20_;
			gint _tmp20__length1;
			_tmp12_ = soy_controllers_graph_abstract_graph_get_scene (self);
			_tmp13_ = _tmp12_;
			_tmp14_ = start;
			_tmp15_ = ends;
			_tmp15__length1 = ends_length1;
			_tmp16_ = soy_controllers_graph_abstract_graph_get_radius (self);
			_tmp17_ = _tmp16_;
			_tmp19_ = soy_scenes_scene_check_collisions_with_radius (_tmp13_, _tmp14_, _tmp15_, _tmp15__length1, _tmp17_, &_tmp18_);
			_tmp20_ = _tmp19_;
			_tmp20__length1 = _tmp18_;
			if (result_length1) {
				*result_length1 = _tmp20__length1;
			}
			result = _tmp20_;
			return result;
		} else {
			soyscenesScene* _tmp21_;
			soyscenesScene* _tmp22_;
			soyatomsPosition* _tmp23_;
			soyatomsPosition** _tmp24_;
			gint _tmp24__length1;
			gint _tmp25_ = 0;
			gboolean* _tmp26_ = NULL;
			gboolean* _tmp27_;
			gint _tmp27__length1;
			_tmp21_ = soy_controllers_graph_abstract_graph_get_scene (self);
			_tmp22_ = _tmp21_;
			_tmp23_ = start;
			_tmp24_ = ends;
			_tmp24__length1 = ends_length1;
			_tmp26_ = soy_scenes_scene_check_collisions (_tmp22_, _tmp23_, _tmp24_, _tmp24__length1, &_tmp25_);
			_tmp27_ = _tmp26_;
			_tmp27__length1 = _tmp25_;
			if (result_length1) {
				*result_length1 = _tmp27__length1;
			}
			result = _tmp27_;
			return result;
		}
	}
}


gboolean* soy_controllers_graph_abstract_graph_check_collisions (soycontrollersgraphAbstractGraph* self, soyatomsPosition* start, soyatomsPosition** ends, int ends_length1, int* result_length1) {
	g_return_val_if_fail (self != NULL, NULL);
	return SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_GET_CLASS (self)->check_collisions (self, start, ends, ends_length1, result_length1);
}


soyatomsSize* soy_controllers_graph_abstract_graph_get_size (soycontrollersgraphAbstractGraph* self) {
	soyatomsSize* result;
	soyatomsSize* _tmp0_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_size;
	result = _tmp0_;
	return result;
}


soyscenesScene* soy_controllers_graph_abstract_graph_get_scene (soycontrollersgraphAbstractGraph* self) {
	soyscenesScene* result;
	soyscenesScene* _tmp0_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_scene;
	result = _tmp0_;
	return result;
}


gfloat soy_controllers_graph_abstract_graph_get_radius (soycontrollersgraphAbstractGraph* self) {
	gfloat result;
	gfloat _tmp0_;
	g_return_val_if_fail (self != NULL, 0.0F);
	_tmp0_ = self->priv->_radius;
	result = _tmp0_;
	return result;
}


static void soy_controllers_graph_abstract_graph_class_init (soycontrollersgraphAbstractGraphClass * klass) {
	soy_controllers_graph_abstract_graph_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soycontrollersgraphAbstractGraphPrivate));
	SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_CLASS (klass)->check_collisions = soy_controllers_graph_abstract_graph_real_check_collisions;
	G_OBJECT_CLASS (klass)->get_property = _vala_soy_controllers_graph_abstract_graph_get_property;
	G_OBJECT_CLASS (klass)->finalize = soy_controllers_graph_abstract_graph_finalize;
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_SIZE, g_param_spec_object ("size", "size", "size", SOY_ATOMS_TYPE_SIZE, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_SCENE, g_param_spec_object ("scene", "scene", "scene", SOY_SCENES_TYPE_SCENE, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_RADIUS, g_param_spec_float ("radius", "radius", "radius", -G_MAXFLOAT, G_MAXFLOAT, 0.0F, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE));
}


static void soy_controllers_graph_abstract_graph_instance_init (soycontrollersgraphAbstractGraph * self) {
	self->priv = SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_GET_PRIVATE (self);
}


static void soy_controllers_graph_abstract_graph_finalize (GObject* obj) {
	soycontrollersgraphAbstractGraph * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH, soycontrollersgraphAbstractGraph);
	_g_object_unref0 (self->priv->_scene);
	_g_object_unref0 (self->priv->_size);
	G_OBJECT_CLASS (soy_controllers_graph_abstract_graph_parent_class)->finalize (obj);
}


GType soy_controllers_graph_abstract_graph_get_type (void) {
	static volatile gsize soy_controllers_graph_abstract_graph_type_id__volatile = 0;
	if (g_once_init_enter (&soy_controllers_graph_abstract_graph_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soycontrollersgraphAbstractGraphClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_controllers_graph_abstract_graph_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soycontrollersgraphAbstractGraph), 0, (GInstanceInitFunc) soy_controllers_graph_abstract_graph_instance_init, NULL };
		GType soy_controllers_graph_abstract_graph_type_id;
		soy_controllers_graph_abstract_graph_type_id = g_type_register_static (G_TYPE_OBJECT, "soycontrollersgraphAbstractGraph", &g_define_type_info, 0);
		g_once_init_leave (&soy_controllers_graph_abstract_graph_type_id__volatile, soy_controllers_graph_abstract_graph_type_id);
	}
	return soy_controllers_graph_abstract_graph_type_id__volatile;
}


static void _vala_soy_controllers_graph_abstract_graph_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec) {
	soycontrollersgraphAbstractGraph * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_CONTROLLERS_GRAPH_TYPE_ABSTRACT_GRAPH, soycontrollersgraphAbstractGraph);
	switch (property_id) {
		case SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_SIZE:
		g_value_set_object (value, soy_controllers_graph_abstract_graph_get_size (self));
		break;
		case SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_SCENE:
		g_value_set_object (value, soy_controllers_graph_abstract_graph_get_scene (self));
		break;
		case SOY_CONTROLLERS_GRAPH_ABSTRACT_GRAPH_RADIUS:
		g_value_set_float (value, soy_controllers_graph_abstract_graph_get_radius (self));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}



