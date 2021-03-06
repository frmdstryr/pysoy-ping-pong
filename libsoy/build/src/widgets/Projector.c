/* Projector.c generated by valac 0.20.1, the Vala compiler
 * generated from Projector.gs, do not modify */

/*
 *  libsoy - soy.widgets.Projector
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
#include <GLES/gl.h>
#include <GLES/glext.h>


#define SOY_WIDGETS_TYPE_WIDGET (soy_widgets_widget_get_type ())
#define SOY_WIDGETS_WIDGET(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_WIDGETS_TYPE_WIDGET, soywidgetsWidget))
#define SOY_WIDGETS_WIDGET_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_WIDGETS_TYPE_WIDGET, soywidgetsWidgetClass))
#define SOY_WIDGETS_IS_WIDGET(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_WIDGETS_TYPE_WIDGET))
#define SOY_WIDGETS_IS_WIDGET_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_WIDGETS_TYPE_WIDGET))
#define SOY_WIDGETS_WIDGET_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_WIDGETS_TYPE_WIDGET, soywidgetsWidgetClass))

typedef struct _soywidgetsWidget soywidgetsWidget;
typedef struct _soywidgetsWidgetClass soywidgetsWidgetClass;
typedef struct _soywidgetsWidgetPrivate soywidgetsWidgetPrivate;

#define SOY_WIDGETS_TYPE_CONTAINER (soy_widgets_container_get_type ())
#define SOY_WIDGETS_CONTAINER(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_WIDGETS_TYPE_CONTAINER, soywidgetsContainer))
#define SOY_WIDGETS_CONTAINER_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_WIDGETS_TYPE_CONTAINER, soywidgetsContainerClass))
#define SOY_WIDGETS_IS_CONTAINER(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_WIDGETS_TYPE_CONTAINER))
#define SOY_WIDGETS_IS_CONTAINER_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_WIDGETS_TYPE_CONTAINER))
#define SOY_WIDGETS_CONTAINER_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_WIDGETS_TYPE_CONTAINER, soywidgetsContainerClass))

typedef struct _soywidgetsContainer soywidgetsContainer;
typedef struct _soywidgetsContainerClass soywidgetsContainerClass;

#define SOY_WIDGETS_TYPE_PROJECTOR (soy_widgets_projector_get_type ())
#define SOY_WIDGETS_PROJECTOR(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_WIDGETS_TYPE_PROJECTOR, soywidgetsProjector))
#define SOY_WIDGETS_PROJECTOR_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_WIDGETS_TYPE_PROJECTOR, soywidgetsProjectorClass))
#define SOY_WIDGETS_IS_PROJECTOR(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_WIDGETS_TYPE_PROJECTOR))
#define SOY_WIDGETS_IS_PROJECTOR_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_WIDGETS_TYPE_PROJECTOR))
#define SOY_WIDGETS_PROJECTOR_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_WIDGETS_TYPE_PROJECTOR, soywidgetsProjectorClass))

typedef struct _soywidgetsProjector soywidgetsProjector;
typedef struct _soywidgetsProjectorClass soywidgetsProjectorClass;
typedef struct _soywidgetsProjectorPrivate soywidgetsProjectorPrivate;

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
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))

#define SOY_ATOMS_TYPE_SIZE (soy_atoms_size_get_type ())
#define SOY_ATOMS_SIZE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_SIZE, soyatomsSize))
#define SOY_ATOMS_SIZE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_SIZE, soyatomsSizeClass))
#define SOY_ATOMS_IS_SIZE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_SIZE))
#define SOY_ATOMS_IS_SIZE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_SIZE))
#define SOY_ATOMS_SIZE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_SIZE, soyatomsSizeClass))

typedef struct _soyatomsSize soyatomsSize;
typedef struct _soyatomsSizeClass soyatomsSizeClass;

struct _soywidgetsWidget {
	GObject parent_instance;
	soywidgetsWidgetPrivate * priv;
	gint width;
	gint height;
	gboolean resized;
};

struct _soywidgetsWidgetClass {
	GObjectClass parent_class;
	void (*add) (soywidgetsWidget* self, soywidgetsContainer* parent);
	void (*remove) (soywidgetsWidget* self);
	void (*render) (soywidgetsWidget* self, gint x, gint y, gint width, gint height);
	void (*resize) (soywidgetsWidget* self, gint x, gint y, gint width, gint height);
};

struct _soywidgetsProjector {
	soywidgetsWidget parent_instance;
	soywidgetsProjectorPrivate * priv;
};

struct _soywidgetsProjectorClass {
	soywidgetsWidgetClass parent_class;
};

struct _soywidgetsProjectorPrivate {
	gfloat _aspect;
	soybodiesCamera* _camera;
};


static gpointer soy_widgets_projector_parent_class = NULL;

GType soy_widgets_widget_get_type (void) G_GNUC_CONST;
GType soy_widgets_container_get_type (void) G_GNUC_CONST;
GType soy_widgets_projector_get_type (void) G_GNUC_CONST;
GType soy_bodies_body_get_type (void) G_GNUC_CONST;
GType soy_bodies_camera_get_type (void) G_GNUC_CONST;
#define SOY_WIDGETS_PROJECTOR_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_WIDGETS_TYPE_PROJECTOR, soywidgetsProjectorPrivate))
enum  {
	SOY_WIDGETS_PROJECTOR_DUMMY_PROPERTY,
	SOY_WIDGETS_PROJECTOR_CAMERA
};
soywidgetsProjector* soy_widgets_projector_new (soybodiesCamera* camera);
soywidgetsProjector* soy_widgets_projector_construct (GType object_type, soybodiesCamera* camera);
soywidgetsWidget* soy_widgets_widget_new (void);
soywidgetsWidget* soy_widgets_widget_construct (GType object_type);
static void soy_widgets_projector_real_add (soywidgetsWidget* base, soywidgetsContainer* parent);
GType soy_atoms_size_get_type (void) G_GNUC_CONST;
soyatomsSize* soy_widgets_widget_get_size (soywidgetsWidget* self);
void soy_widgets_widget_set_size (soywidgetsWidget* self, soyatomsSize* value);
static void soy_widgets_projector_real_remove (soywidgetsWidget* base);
soyatomsSize* soy_atoms_size_new (gfloat width, gfloat height, gfloat depth);
soyatomsSize* soy_atoms_size_construct (GType object_type, gfloat width, gfloat height, gfloat depth);
static void soy_widgets_projector_real_render (soywidgetsWidget* base, gint x, gint y, gint width, gint height);
void soy_bodies_camera_project (soybodiesCamera* self, GLfloat aspect);
soybodiesCamera* soy_widgets_projector_get_camera (soywidgetsProjector* self);
void soy_widgets_projector_set_camera (soywidgetsProjector* self, soybodiesCamera* value);
static void soy_widgets_projector_finalize (GObject* obj);
static void _vala_soy_widgets_projector_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec);
static void _vala_soy_widgets_projector_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec);


static gpointer _g_object_ref0 (gpointer self) {
	return self ? g_object_ref (self) : NULL;
}


soywidgetsProjector* soy_widgets_projector_construct (GType object_type, soybodiesCamera* camera) {
	soywidgetsProjector * self = NULL;
	soybodiesCamera* _tmp0_;
	soybodiesCamera* _tmp1_;
	self = (soywidgetsProjector*) soy_widgets_widget_construct (object_type);
	_tmp0_ = camera;
	_tmp1_ = _g_object_ref0 (_tmp0_);
	_g_object_unref0 (self->priv->_camera);
	self->priv->_camera = _tmp1_;
	return self;
}


soywidgetsProjector* soy_widgets_projector_new (soybodiesCamera* camera) {
	return soy_widgets_projector_construct (SOY_WIDGETS_TYPE_PROJECTOR, camera);
}


static void soy_widgets_projector_real_add (soywidgetsWidget* base, soywidgetsContainer* parent) {
	soywidgetsProjector * self;
	soywidgetsContainer* _tmp0_;
	soyatomsSize* _tmp1_;
	soyatomsSize* _tmp2_;
	soyatomsSize* _tmp3_;
	self = (soywidgetsProjector*) base;
	g_return_if_fail (parent != NULL);
	_tmp0_ = parent;
	_tmp1_ = soy_widgets_widget_get_size ((soywidgetsWidget*) _tmp0_);
	_tmp2_ = _tmp1_;
	_tmp3_ = _tmp2_;
	soy_widgets_widget_set_size ((soywidgetsWidget*) self, _tmp3_);
	_g_object_unref0 (_tmp3_);
}


static void soy_widgets_projector_real_remove (soywidgetsWidget* base) {
	soywidgetsProjector * self;
	soyatomsSize* _tmp0_;
	soyatomsSize* _tmp1_;
	self = (soywidgetsProjector*) base;
	_tmp0_ = soy_atoms_size_new ((gfloat) 0, (gfloat) 0, (gfloat) 0);
	_tmp1_ = _tmp0_;
	soy_widgets_widget_set_size ((soywidgetsWidget*) self, _tmp1_);
	_g_object_unref0 (_tmp1_);
}


static void soy_widgets_projector_real_render (soywidgetsWidget* base, gint x, gint y, gint width, gint height) {
	soywidgetsProjector * self;
	gfloat aspect;
	soybodiesCamera* _tmp0_;
	gfloat _tmp1_;
	gint _tmp5_;
	gint _tmp6_;
	gint _tmp7_;
	gint _tmp8_;
	soybodiesCamera* _tmp9_;
	gfloat _tmp10_;
	self = (soywidgetsProjector*) base;
	aspect = 0.0f;
	_tmp0_ = self->priv->_camera;
	if (_tmp0_ == NULL) {
		return;
	}
	_tmp1_ = self->priv->_aspect;
	if (_tmp1_ != 0.0f) {
		gfloat _tmp2_;
		_tmp2_ = self->priv->_aspect;
		aspect = _tmp2_;
	} else {
		gint _tmp3_;
		gint _tmp4_;
		_tmp3_ = width;
		_tmp4_ = height;
		aspect = ((gfloat) _tmp3_) / ((gfloat) _tmp4_);
	}
	_tmp5_ = x;
	_tmp6_ = y;
	_tmp7_ = width;
	_tmp8_ = height;
	glViewport ((GLint) _tmp5_, (GLint) _tmp6_, (GLsizei) ((GLint) _tmp7_), (GLsizei) ((GLint) _tmp8_));
	_tmp9_ = self->priv->_camera;
	_tmp10_ = aspect;
	soy_bodies_camera_project (_tmp9_, (GLfloat) _tmp10_);
}


soybodiesCamera* soy_widgets_projector_get_camera (soywidgetsProjector* self) {
	soybodiesCamera* result;
	soybodiesCamera* _tmp0_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_camera;
	result = _tmp0_;
	return result;
}


void soy_widgets_projector_set_camera (soywidgetsProjector* self, soybodiesCamera* value) {
	soybodiesCamera* _tmp0_;
	soybodiesCamera* _tmp1_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	_tmp1_ = _g_object_ref0 (_tmp0_);
	_g_object_unref0 (self->priv->_camera);
	self->priv->_camera = _tmp1_;
	g_object_notify ((GObject *) self, "camera");
}


static void soy_widgets_projector_class_init (soywidgetsProjectorClass * klass) {
	soy_widgets_projector_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soywidgetsProjectorPrivate));
	SOY_WIDGETS_WIDGET_CLASS (klass)->add = soy_widgets_projector_real_add;
	SOY_WIDGETS_WIDGET_CLASS (klass)->remove = soy_widgets_projector_real_remove;
	SOY_WIDGETS_WIDGET_CLASS (klass)->render = soy_widgets_projector_real_render;
	G_OBJECT_CLASS (klass)->get_property = _vala_soy_widgets_projector_get_property;
	G_OBJECT_CLASS (klass)->set_property = _vala_soy_widgets_projector_set_property;
	G_OBJECT_CLASS (klass)->finalize = soy_widgets_projector_finalize;
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_WIDGETS_PROJECTOR_CAMERA, g_param_spec_object ("camera", "camera", "camera", SOY_BODIES_TYPE_CAMERA, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
}


static void soy_widgets_projector_instance_init (soywidgetsProjector * self) {
	self->priv = SOY_WIDGETS_PROJECTOR_GET_PRIVATE (self);
}


static void soy_widgets_projector_finalize (GObject* obj) {
	soywidgetsProjector * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_WIDGETS_TYPE_PROJECTOR, soywidgetsProjector);
	_g_object_unref0 (self->priv->_camera);
	G_OBJECT_CLASS (soy_widgets_projector_parent_class)->finalize (obj);
}


GType soy_widgets_projector_get_type (void) {
	static volatile gsize soy_widgets_projector_type_id__volatile = 0;
	if (g_once_init_enter (&soy_widgets_projector_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soywidgetsProjectorClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_widgets_projector_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soywidgetsProjector), 0, (GInstanceInitFunc) soy_widgets_projector_instance_init, NULL };
		GType soy_widgets_projector_type_id;
		soy_widgets_projector_type_id = g_type_register_static (SOY_WIDGETS_TYPE_WIDGET, "soywidgetsProjector", &g_define_type_info, 0);
		g_once_init_leave (&soy_widgets_projector_type_id__volatile, soy_widgets_projector_type_id);
	}
	return soy_widgets_projector_type_id__volatile;
}


static void _vala_soy_widgets_projector_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec) {
	soywidgetsProjector * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_WIDGETS_TYPE_PROJECTOR, soywidgetsProjector);
	switch (property_id) {
		case SOY_WIDGETS_PROJECTOR_CAMERA:
		g_value_set_object (value, soy_widgets_projector_get_camera (self));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}


static void _vala_soy_widgets_projector_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec) {
	soywidgetsProjector * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_WIDGETS_TYPE_PROJECTOR, soywidgetsProjector);
	switch (property_id) {
		case SOY_WIDGETS_PROJECTOR_CAMERA:
		soy_widgets_projector_set_camera (self, g_value_get_object (value));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}



