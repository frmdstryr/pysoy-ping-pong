/* Area.c generated by valac 0.20.1, the Vala compiler
 * generated from Area.gs, do not modify */

/*
 *  libsoy - soy.atoms.Area
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


#define SOY_ATOMS_TYPE_AREA (soy_atoms_area_get_type ())
#define SOY_ATOMS_AREA(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_AREA, soyatomsArea))
#define SOY_ATOMS_AREA_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_AREA, soyatomsAreaClass))
#define SOY_ATOMS_IS_AREA(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_AREA))
#define SOY_ATOMS_IS_AREA_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_AREA))
#define SOY_ATOMS_AREA_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_AREA, soyatomsAreaClass))

typedef struct _soyatomsArea soyatomsArea;
typedef struct _soyatomsAreaClass soyatomsAreaClass;
typedef struct _soyatomsAreaPrivate soyatomsAreaPrivate;

struct _soyatomsArea {
	GObject parent_instance;
	soyatomsAreaPrivate * priv;
};

struct _soyatomsAreaClass {
	GObjectClass parent_class;
};

struct _soyatomsAreaPrivate {
	gfloat _x1;
	gfloat _y1;
	gfloat _x2;
	gfloat _y2;
};


static gpointer soy_atoms_area_parent_class = NULL;

GType soy_atoms_area_get_type (void) G_GNUC_CONST;
#define SOY_ATOMS_AREA_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_ATOMS_TYPE_AREA, soyatomsAreaPrivate))
enum  {
	SOY_ATOMS_AREA_DUMMY_PROPERTY,
	SOY_ATOMS_AREA_X1,
	SOY_ATOMS_AREA_Y1,
	SOY_ATOMS_AREA_X2,
	SOY_ATOMS_AREA_Y2
};
soyatomsArea* soy_atoms_area_new (gfloat x1, gfloat y1, gfloat x2, gfloat y2);
soyatomsArea* soy_atoms_area_construct (GType object_type, gfloat x1, gfloat y1, gfloat x2, gfloat y2);
void soy_atoms_area_set (soyatomsArea* self, gfloat x1, gfloat y1, gfloat x2, gfloat y2);
gfloat soy_atoms_area_get_x1 (soyatomsArea* self);
void soy_atoms_area_set_x1 (soyatomsArea* self, gfloat value);
gfloat soy_atoms_area_get_y1 (soyatomsArea* self);
void soy_atoms_area_set_y1 (soyatomsArea* self, gfloat value);
gfloat soy_atoms_area_get_x2 (soyatomsArea* self);
void soy_atoms_area_set_x2 (soyatomsArea* self, gfloat value);
gfloat soy_atoms_area_get_y2 (soyatomsArea* self);
void soy_atoms_area_set_y2 (soyatomsArea* self, gfloat value);
static void soy_atoms_area_finalize (GObject* obj);
static void _vala_soy_atoms_area_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec);
static void _vala_soy_atoms_area_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec);


soyatomsArea* soy_atoms_area_construct (GType object_type, gfloat x1, gfloat y1, gfloat x2, gfloat y2) {
	soyatomsArea * self = NULL;
	gfloat _tmp0_;
	gfloat _tmp1_;
	gfloat _tmp2_;
	gfloat _tmp3_;
	self = (soyatomsArea*) g_object_new (object_type, NULL);
	_tmp0_ = x1;
	self->priv->_x1 = _tmp0_;
	_tmp1_ = y1;
	self->priv->_y1 = _tmp1_;
	_tmp2_ = x2;
	self->priv->_x2 = _tmp2_;
	_tmp3_ = y2;
	self->priv->_y2 = _tmp3_;
	return self;
}


soyatomsArea* soy_atoms_area_new (gfloat x1, gfloat y1, gfloat x2, gfloat y2) {
	return soy_atoms_area_construct (SOY_ATOMS_TYPE_AREA, x1, y1, x2, y2);
}


void soy_atoms_area_set (soyatomsArea* self, gfloat x1, gfloat y1, gfloat x2, gfloat y2) {
	gfloat _tmp0_;
	gfloat _tmp1_;
	gfloat _tmp2_;
	gfloat _tmp3_;
	g_return_if_fail (self != NULL);
	_tmp0_ = x1;
	self->priv->_x1 = _tmp0_;
	_tmp1_ = y1;
	self->priv->_y1 = _tmp1_;
	_tmp2_ = x2;
	self->priv->_x2 = _tmp2_;
	_tmp3_ = y2;
	self->priv->_y2 = _tmp3_;
	g_signal_emit_by_name (self, "on-set", self);
}


gfloat soy_atoms_area_get_x1 (soyatomsArea* self) {
	gfloat result;
	gfloat _tmp0_;
	g_return_val_if_fail (self != NULL, 0.0F);
	_tmp0_ = self->priv->_x1;
	result = _tmp0_;
	return result;
}


void soy_atoms_area_set_x1 (soyatomsArea* self, gfloat value) {
	gfloat _tmp0_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	self->priv->_x1 = _tmp0_;
	g_signal_emit_by_name (self, "on-set", self);
	g_object_notify ((GObject *) self, "x1");
}


gfloat soy_atoms_area_get_y1 (soyatomsArea* self) {
	gfloat result;
	gfloat _tmp0_;
	g_return_val_if_fail (self != NULL, 0.0F);
	_tmp0_ = self->priv->_y1;
	result = _tmp0_;
	return result;
}


void soy_atoms_area_set_y1 (soyatomsArea* self, gfloat value) {
	gfloat _tmp0_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	self->priv->_y1 = _tmp0_;
	g_signal_emit_by_name (self, "on-set", self);
	g_object_notify ((GObject *) self, "y1");
}


gfloat soy_atoms_area_get_x2 (soyatomsArea* self) {
	gfloat result;
	gfloat _tmp0_;
	g_return_val_if_fail (self != NULL, 0.0F);
	_tmp0_ = self->priv->_x2;
	result = _tmp0_;
	return result;
}


void soy_atoms_area_set_x2 (soyatomsArea* self, gfloat value) {
	gfloat _tmp0_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	self->priv->_x2 = _tmp0_;
	g_signal_emit_by_name (self, "on-set", self);
	g_object_notify ((GObject *) self, "x2");
}


gfloat soy_atoms_area_get_y2 (soyatomsArea* self) {
	gfloat result;
	gfloat _tmp0_;
	g_return_val_if_fail (self != NULL, 0.0F);
	_tmp0_ = self->priv->_y2;
	result = _tmp0_;
	return result;
}


void soy_atoms_area_set_y2 (soyatomsArea* self, gfloat value) {
	gfloat _tmp0_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	self->priv->_y2 = _tmp0_;
	g_signal_emit_by_name (self, "on-set", self);
	g_object_notify ((GObject *) self, "y2");
}


static void soy_atoms_area_class_init (soyatomsAreaClass * klass) {
	soy_atoms_area_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soyatomsAreaPrivate));
	G_OBJECT_CLASS (klass)->get_property = _vala_soy_atoms_area_get_property;
	G_OBJECT_CLASS (klass)->set_property = _vala_soy_atoms_area_set_property;
	G_OBJECT_CLASS (klass)->finalize = soy_atoms_area_finalize;
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_ATOMS_AREA_X1, g_param_spec_float ("x1", "x1", "x1", -G_MAXFLOAT, G_MAXFLOAT, 0.0F, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_ATOMS_AREA_Y1, g_param_spec_float ("y1", "y1", "y1", -G_MAXFLOAT, G_MAXFLOAT, 0.0F, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_ATOMS_AREA_X2, g_param_spec_float ("x2", "x2", "x2", -G_MAXFLOAT, G_MAXFLOAT, 0.0F, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_ATOMS_AREA_Y2, g_param_spec_float ("y2", "y2", "y2", -G_MAXFLOAT, G_MAXFLOAT, 0.0F, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_signal_new ("on_set", SOY_ATOMS_TYPE_AREA, G_SIGNAL_RUN_LAST, 0, NULL, NULL, g_cclosure_marshal_VOID__OBJECT, G_TYPE_NONE, 1, SOY_ATOMS_TYPE_AREA);
}


static void soy_atoms_area_instance_init (soyatomsArea * self) {
	self->priv = SOY_ATOMS_AREA_GET_PRIVATE (self);
}


static void soy_atoms_area_finalize (GObject* obj) {
	soyatomsArea * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_ATOMS_TYPE_AREA, soyatomsArea);
	G_OBJECT_CLASS (soy_atoms_area_parent_class)->finalize (obj);
}


GType soy_atoms_area_get_type (void) {
	static volatile gsize soy_atoms_area_type_id__volatile = 0;
	if (g_once_init_enter (&soy_atoms_area_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soyatomsAreaClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_atoms_area_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soyatomsArea), 0, (GInstanceInitFunc) soy_atoms_area_instance_init, NULL };
		GType soy_atoms_area_type_id;
		soy_atoms_area_type_id = g_type_register_static (G_TYPE_OBJECT, "soyatomsArea", &g_define_type_info, 0);
		g_once_init_leave (&soy_atoms_area_type_id__volatile, soy_atoms_area_type_id);
	}
	return soy_atoms_area_type_id__volatile;
}


static void _vala_soy_atoms_area_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec) {
	soyatomsArea * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_ATOMS_TYPE_AREA, soyatomsArea);
	switch (property_id) {
		case SOY_ATOMS_AREA_X1:
		g_value_set_float (value, soy_atoms_area_get_x1 (self));
		break;
		case SOY_ATOMS_AREA_Y1:
		g_value_set_float (value, soy_atoms_area_get_y1 (self));
		break;
		case SOY_ATOMS_AREA_X2:
		g_value_set_float (value, soy_atoms_area_get_x2 (self));
		break;
		case SOY_ATOMS_AREA_Y2:
		g_value_set_float (value, soy_atoms_area_get_y2 (self));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}


static void _vala_soy_atoms_area_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec) {
	soyatomsArea * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_ATOMS_TYPE_AREA, soyatomsArea);
	switch (property_id) {
		case SOY_ATOMS_AREA_X1:
		soy_atoms_area_set_x1 (self, g_value_get_float (value));
		break;
		case SOY_ATOMS_AREA_Y1:
		soy_atoms_area_set_y1 (self, g_value_get_float (value));
		break;
		case SOY_ATOMS_AREA_X2:
		soy_atoms_area_set_x2 (self, g_value_get_float (value));
		break;
		case SOY_ATOMS_AREA_Y2:
		soy_atoms_area_set_y2 (self, g_value_get_float (value));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}



