/* Window.c generated by valac 0.20.1, the Vala compiler
 * generated from Window.gs, do not modify */

/*
 *  libsoy - soy.widgets.Window
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
#include <gee.h>
#include <stdlib.h>
#include <string.h>
#include <GLES/gl.h>
#include <GLES/glext.h>
#include <float.h>
#include <math.h>


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
typedef struct _soywidgetsContainerPrivate soywidgetsContainerPrivate;

#define SOY_WIDGETS_TYPE_WINDOW (soy_widgets_window_get_type ())
#define SOY_WIDGETS_WINDOW(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindow))
#define SOY_WIDGETS_WINDOW_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindowClass))
#define SOY_WIDGETS_IS_WINDOW(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_WIDGETS_TYPE_WINDOW))
#define SOY_WIDGETS_IS_WINDOW_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_WIDGETS_TYPE_WINDOW))
#define SOY_WIDGETS_WINDOW_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindowClass))

typedef struct _soywidgetsWindow soywidgetsWindow;
typedef struct _soywidgetsWindowClass soywidgetsWindowClass;
typedef struct _soywidgetsWindowPrivate soywidgetsWindowPrivate;

#define SOY_ATOMS_TYPE_COLOR (soy_atoms_color_get_type ())
#define SOY_ATOMS_COLOR(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_COLOR, soyatomsColor))
#define SOY_ATOMS_COLOR_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_COLOR, soyatomsColorClass))
#define SOY_ATOMS_IS_COLOR(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_COLOR))
#define SOY_ATOMS_IS_COLOR_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_COLOR))
#define SOY_ATOMS_COLOR_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_COLOR, soyatomsColorClass))

typedef struct _soyatomsColor soyatomsColor;
typedef struct _soyatomsColorClass soyatomsColorClass;

#define SOY_ATOMS_TYPE_POSITION (soy_atoms_position_get_type ())
#define SOY_ATOMS_POSITION(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_POSITION, soyatomsPosition))
#define SOY_ATOMS_POSITION_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_POSITION, soyatomsPositionClass))
#define SOY_ATOMS_IS_POSITION(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_POSITION))
#define SOY_ATOMS_IS_POSITION_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_POSITION))
#define SOY_ATOMS_POSITION_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_POSITION, soyatomsPositionClass))

typedef struct _soyatomsPosition soyatomsPosition;
typedef struct _soyatomsPositionClass soyatomsPositionClass;
#define _g_free0(var) (var = (g_free (var), NULL))

#define SOY_ATOMS_TYPE_SIZE (soy_atoms_size_get_type ())
#define SOY_ATOMS_SIZE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_SIZE, soyatomsSize))
#define SOY_ATOMS_SIZE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_SIZE, soyatomsSizeClass))
#define SOY_ATOMS_IS_SIZE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_SIZE))
#define SOY_ATOMS_IS_SIZE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_SIZE))
#define SOY_ATOMS_SIZE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_SIZE, soyatomsSizeClass))

typedef struct _soyatomsSize soyatomsSize;
typedef struct _soyatomsSizeClass soyatomsSizeClass;
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))

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

struct _soywidgetsContainer {
	soywidgetsWidget parent_instance;
	soywidgetsContainerPrivate * priv;
	GeeLinkedList* children;
	GMutex mutex;
};

struct _soywidgetsContainerClass {
	soywidgetsWidgetClass parent_class;
	void (*resize_children) (soywidgetsContainer* self, gint x, gint y, gint width, gint height);
};

struct _soywidgetsWindow {
	soywidgetsContainer parent_instance;
	soywidgetsWindowPrivate * priv;
};

struct _soywidgetsWindowClass {
	soywidgetsContainerClass parent_class;
};

struct _soywidgetsWindowPrivate {
	gboolean _resizable;
	gint _rpt;
	guint64* _rtimes;
	gint _rtimes_length1;
	gint __rtimes_size_;
	gchar* _title;
	gboolean _retitle;
	GLfloat* _background;
	gint _background_length1;
	gint __background_size_;
	soyatomsColor* _background_obj;
	gint _x;
	gint _y;
	soyatomsPosition* _position_obj;
};


static gpointer soy_widgets_window_parent_class = NULL;

GType soy_widgets_widget_get_type (void) G_GNUC_CONST;
GType soy_widgets_container_get_type (void) G_GNUC_CONST;
GType soy_widgets_window_get_type (void) G_GNUC_CONST;
GType soy_atoms_color_get_type (void) G_GNUC_CONST;
GType soy_atoms_position_get_type (void) G_GNUC_CONST;
#define SOY_WIDGETS_WINDOW_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindowPrivate))
enum  {
	SOY_WIDGETS_WINDOW_DUMMY_PROPERTY,
	SOY_WIDGETS_WINDOW_RESIZABLE,
	SOY_WIDGETS_WINDOW_FPS,
	SOY_WIDGETS_WINDOW_TITLE,
	SOY_WIDGETS_WINDOW_RETITLE,
	SOY_WIDGETS_WINDOW_BACKGROUND,
	SOY_WIDGETS_WINDOW_POSITION
};
soywidgetsWindow* soy_widgets_window_new (void);
soywidgetsWindow* soy_widgets_window_construct (GType object_type);
soywidgetsContainer* soy_widgets_container_new (void);
soywidgetsContainer* soy_widgets_container_construct (GType object_type);
void soy_widgets_window_draw (soywidgetsWindow* self);
void soy_widgets_widget_render (soywidgetsWidget* self, gint x, gint y, gint width, gint height);
static void soy_widgets_window_real_resize_children (soywidgetsContainer* base, gint x, gint y, gint width, gint height);
soyatomsSize* soy_atoms_size_new (gfloat width, gfloat height, gfloat depth);
soyatomsSize* soy_atoms_size_construct (GType object_type, gfloat width, gfloat height, gfloat depth);
GType soy_atoms_size_get_type (void) G_GNUC_CONST;
void soy_widgets_widget_set_size (soywidgetsWidget* self, soyatomsSize* value);
static void _soy_widgets_window_background_set (soywidgetsWindow* self, soyatomsColor* color);
gfloat* soy_atoms_color_get4f (soyatomsColor* self, int* result_length1);
static void _soy_widgets_window_background_weak (soywidgetsWindow* self, GObject* color);
static void _soy_widgets_window_position_set (soywidgetsWindow* self, soyatomsPosition* position);
gfloat soy_atoms_position_get_x (soyatomsPosition* self);
gfloat soy_atoms_position_get_y (soyatomsPosition* self);
static void _soy_widgets_window_position_weak (soywidgetsWindow* self, GObject* position);
gboolean soy_widgets_window_get_resizable (soywidgetsWindow* self);
void soy_widgets_window_set_resizable (soywidgetsWindow* self, gboolean value);
gint soy_widgets_window_get_fps (soywidgetsWindow* self);
const gchar* soy_widgets_window_get_title (soywidgetsWindow* self);
void soy_widgets_window_set_title (soywidgetsWindow* self, const gchar* value);
gboolean soy_widgets_window_get_retitle (soywidgetsWindow* self);
void soy_widgets_window_set_retitle (soywidgetsWindow* self, gboolean value);
soyatomsColor* soy_widgets_window_get_background (soywidgetsWindow* self);
soyatomsColor* soy_atoms_color_new_new4f (gfloat* rgba, int rgba_length1);
soyatomsColor* soy_atoms_color_construct_new4f (GType object_type, gfloat* rgba, int rgba_length1);
static void __soy_widgets_window_background_set_soy_atoms_color_on_set (soyatomsColor* _sender, soyatomsColor* color, gpointer self);
static void __soy_widgets_window_background_weak_gweak_notify (gpointer self, GObject* object);
void soy_widgets_window_set_background (soywidgetsWindow* self, soyatomsColor* value);
soyatomsPosition* soy_widgets_window_get_position (soywidgetsWindow* self);
soyatomsPosition* soy_atoms_position_new (gfloat x, gfloat y, gfloat z);
soyatomsPosition* soy_atoms_position_construct (GType object_type, gfloat x, gfloat y, gfloat z);
static void __soy_widgets_window_position_set_soy_atoms_position_on_set (soyatomsPosition* _sender, soyatomsPosition* position, gpointer self);
static void __soy_widgets_window_position_weak_gweak_notify (gpointer self, GObject* object);
void soy_widgets_window_set_position (soywidgetsWindow* self, soyatomsPosition* value);
static void soy_widgets_window_finalize (GObject* obj);
static void _vala_soy_widgets_window_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec);
static void _vala_soy_widgets_window_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec);


soywidgetsWindow* soy_widgets_window_construct (GType object_type) {
	soywidgetsWindow * self = NULL;
	gchar* _tmp0_;
	GLfloat* _tmp1_ = NULL;
	self = (soywidgetsWindow*) soy_widgets_container_construct (object_type);
	_tmp0_ = g_strdup ("");
	_g_free0 (self->priv->_title);
	self->priv->_title = _tmp0_;
	_tmp1_ = g_new0 (GLfloat, 4);
	_tmp1_[0] = (GLfloat) 0.0f;
	_tmp1_[1] = (GLfloat) 0.0f;
	_tmp1_[2] = (GLfloat) 0.0f;
	_tmp1_[3] = (GLfloat) 0.0f;
	self->priv->_background = (g_free (self->priv->_background), NULL);
	self->priv->_background = _tmp1_;
	self->priv->_background_length1 = 4;
	self->priv->__background_size_ = self->priv->_background_length1;
	((soywidgetsWidget*) self)->width = 320;
	((soywidgetsWidget*) self)->height = 240;
	self->priv->_resizable = TRUE;
	self->priv->_rpt = 0;
	return self;
}


soywidgetsWindow* soy_widgets_window_new (void) {
	return soy_widgets_window_construct (SOY_WIDGETS_TYPE_WINDOW);
}


void soy_widgets_window_draw (soywidgetsWindow* self) {
	GLfloat* _tmp0_;
	gint _tmp0__length1;
	GLfloat _tmp1_;
	GLfloat* _tmp2_;
	gint _tmp2__length1;
	GLfloat _tmp3_;
	GLfloat* _tmp4_;
	gint _tmp4__length1;
	GLfloat _tmp5_;
	GLfloat* _tmp6_;
	gint _tmp6__length1;
	GLfloat _tmp7_;
	gint _tmp8_;
	gint _tmp9_;
	gint _tmp10_;
	GTimeVal tv = {0};
	guint64* _tmp11_;
	gint _tmp11__length1;
	gint _tmp12_;
	GTimeVal _tmp13_;
	glong _tmp14_;
	GTimeVal _tmp15_;
	glong _tmp16_;
	guint64 _tmp17_;
	g_return_if_fail (self != NULL);
	_tmp0_ = self->priv->_background;
	_tmp0__length1 = self->priv->_background_length1;
	_tmp1_ = _tmp0_[0];
	_tmp2_ = self->priv->_background;
	_tmp2__length1 = self->priv->_background_length1;
	_tmp3_ = _tmp2_[1];
	_tmp4_ = self->priv->_background;
	_tmp4__length1 = self->priv->_background_length1;
	_tmp5_ = _tmp4_[2];
	_tmp6_ = self->priv->_background;
	_tmp6__length1 = self->priv->_background_length1;
	_tmp7_ = _tmp6_[3];
	glClearColor ((GLclampf) _tmp1_, (GLclampf) _tmp3_, (GLclampf) _tmp5_, (GLclampf) _tmp7_);
	glClear ((GLbitfield) GL_COLOR_BUFFER_BIT);
	glEnableClientState (GL_VERTEX_ARRAY);
	glEnableClientState (GL_NORMAL_ARRAY);
	glEnableClientState (GL_TEXTURE_COORD_ARRAY);
	glEnable (GL_CULL_FACE);
	_tmp8_ = ((soywidgetsWidget*) self)->width;
	_tmp9_ = ((soywidgetsWidget*) self)->height;
	soy_widgets_widget_render ((soywidgetsWidget*) self, 0, 0, _tmp8_, _tmp9_);
	_tmp10_ = self->priv->_rpt;
	self->priv->_rpt = (_tmp10_ + 1) % 16;
	g_get_current_time (&tv);
	_tmp11_ = self->priv->_rtimes;
	_tmp11__length1 = self->priv->_rtimes_length1;
	_tmp12_ = self->priv->_rpt;
	_tmp13_ = tv;
	_tmp14_ = _tmp13_.tv_sec;
	_tmp15_ = tv;
	_tmp16_ = _tmp15_.tv_usec;
	_tmp11_[_tmp12_] = (((guint64) _tmp14_) * 1000) + (((guint64) _tmp16_) / 1000);
	_tmp17_ = _tmp11_[_tmp12_];
	glDisableClientState (GL_VERTEX_ARRAY);
	glDisableClientState (GL_NORMAL_ARRAY);
	glDisableClientState (GL_TEXTURE_COORD_ARRAY);
	glDisable (GL_CULL_FACE);
}


static gpointer _g_object_ref0 (gpointer self) {
	return self ? g_object_ref (self) : NULL;
}


static void soy_widgets_window_real_resize_children (soywidgetsContainer* base, gint x, gint y, gint width, gint height) {
	soywidgetsWindow * self;
	self = (soywidgetsWindow*) base;
	{
		GeeLinkedList* _tmp0_;
		GeeLinkedList* _tmp1_;
		GeeLinkedList* _widget_list;
		GeeLinkedList* _tmp2_;
		gint _tmp3_;
		gint _tmp4_;
		gint _widget_size;
		gint _widget_index;
		_tmp0_ = ((soywidgetsContainer*) self)->children;
		_tmp1_ = _g_object_ref0 (_tmp0_);
		_widget_list = _tmp1_;
		_tmp2_ = _widget_list;
		_tmp3_ = gee_abstract_collection_get_size ((GeeCollection*) _tmp2_);
		_tmp4_ = _tmp3_;
		_widget_size = _tmp4_;
		_widget_index = -1;
		while (TRUE) {
			gint _tmp5_;
			gint _tmp6_;
			gint _tmp7_;
			GeeLinkedList* _tmp8_;
			gint _tmp9_;
			gpointer _tmp10_ = NULL;
			soywidgetsWidget* widget;
			soywidgetsWidget* _tmp11_;
			gint _tmp12_;
			gint _tmp13_;
			soyatomsSize* _tmp14_;
			soyatomsSize* _tmp15_;
			_tmp5_ = _widget_index;
			_widget_index = _tmp5_ + 1;
			_tmp6_ = _widget_index;
			_tmp7_ = _widget_size;
			if (!(_tmp6_ < _tmp7_)) {
				break;
			}
			_tmp8_ = _widget_list;
			_tmp9_ = _widget_index;
			_tmp10_ = gee_abstract_list_get ((GeeAbstractList*) _tmp8_, _tmp9_);
			widget = (soywidgetsWidget*) _tmp10_;
			_tmp11_ = widget;
			_tmp12_ = ((soywidgetsWidget*) self)->width;
			_tmp13_ = ((soywidgetsWidget*) self)->height;
			_tmp14_ = soy_atoms_size_new ((gfloat) _tmp12_, (gfloat) _tmp13_, 0.0f);
			_tmp15_ = _tmp14_;
			soy_widgets_widget_set_size (_tmp11_, _tmp15_);
			_g_object_unref0 (_tmp15_);
			_g_object_unref0 (widget);
		}
		_g_object_unref0 (_widget_list);
	}
}


static void _soy_widgets_window_background_set (soywidgetsWindow* self, soyatomsColor* color) {
	soyatomsColor* _tmp0_;
	gint _tmp1_ = 0;
	gfloat* _tmp2_ = NULL;
	g_return_if_fail (self != NULL);
	g_return_if_fail (color != NULL);
	_tmp0_ = color;
	_tmp2_ = soy_atoms_color_get4f (_tmp0_, &_tmp1_);
	self->priv->_background = (g_free (self->priv->_background), NULL);
	self->priv->_background = _tmp2_;
	self->priv->_background_length1 = _tmp1_;
	self->priv->__background_size_ = self->priv->_background_length1;
}


static void _soy_widgets_window_background_weak (soywidgetsWindow* self, GObject* color) {
	g_return_if_fail (self != NULL);
	g_return_if_fail (color != NULL);
	self->priv->_background_obj = NULL;
}


static void _soy_widgets_window_position_set (soywidgetsWindow* self, soyatomsPosition* position) {
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


static void _soy_widgets_window_position_weak (soywidgetsWindow* self, GObject* position) {
	g_return_if_fail (self != NULL);
	g_return_if_fail (position != NULL);
	self->priv->_position_obj = NULL;
}


gboolean soy_widgets_window_get_resizable (soywidgetsWindow* self) {
	gboolean result;
	gboolean _tmp0_;
	g_return_val_if_fail (self != NULL, FALSE);
	_tmp0_ = self->priv->_resizable;
	result = _tmp0_;
	return result;
}


void soy_widgets_window_set_resizable (soywidgetsWindow* self, gboolean value) {
	gboolean _tmp0_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	self->priv->_resizable = _tmp0_;
	g_object_notify ((GObject *) self, "resizable");
}


gint soy_widgets_window_get_fps (soywidgetsWindow* self) {
	gint result;
	guint64* _tmp0_;
	gint _tmp0__length1;
	gint _tmp1_;
	guint64 _tmp2_;
	guint64 f2;
	guint64* _tmp3_;
	gint _tmp3__length1;
	gint _tmp4_;
	guint64 _tmp5_;
	guint64 f1;
	gboolean _tmp6_ = FALSE;
	gboolean _tmp7_ = FALSE;
	guint64 _tmp8_;
	gboolean _tmp10_;
	gboolean _tmp13_;
	g_return_val_if_fail (self != NULL, 0);
	_tmp0_ = self->priv->_rtimes;
	_tmp0__length1 = self->priv->_rtimes_length1;
	_tmp1_ = self->priv->_rpt;
	_tmp2_ = _tmp0_[_tmp1_];
	f2 = _tmp2_;
	_tmp3_ = self->priv->_rtimes;
	_tmp3__length1 = self->priv->_rtimes_length1;
	_tmp4_ = self->priv->_rpt;
	_tmp5_ = _tmp3_[(_tmp4_ + 1) % 16];
	f1 = _tmp5_;
	_tmp8_ = f1;
	if (((gdouble) _tmp8_) == 0.0) {
		_tmp7_ = TRUE;
	} else {
		guint64 _tmp9_;
		_tmp9_ = f2;
		_tmp7_ = ((gdouble) _tmp9_) == 0.0;
	}
	_tmp10_ = _tmp7_;
	if (_tmp10_) {
		_tmp6_ = TRUE;
	} else {
		guint64 _tmp11_;
		guint64 _tmp12_;
		_tmp11_ = f1;
		_tmp12_ = f2;
		_tmp6_ = _tmp11_ == _tmp12_;
	}
	_tmp13_ = _tmp6_;
	if (_tmp13_) {
		result = 0;
		return result;
	} else {
		guint64 _tmp14_;
		guint64 _tmp15_;
		_tmp14_ = f2;
		_tmp15_ = f1;
		result = (gint) (15000 / (_tmp14_ - _tmp15_));
		return result;
	}
}


const gchar* soy_widgets_window_get_title (soywidgetsWindow* self) {
	const gchar* result;
	const gchar* _tmp0_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_title;
	result = _tmp0_;
	return result;
}


void soy_widgets_window_set_title (soywidgetsWindow* self, const gchar* value) {
	const gchar* _tmp0_;
	gchar* _tmp1_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	_tmp1_ = g_strdup (_tmp0_);
	_g_free0 (self->priv->_title);
	self->priv->_title = _tmp1_;
	self->priv->_retitle = TRUE;
	g_object_notify ((GObject *) self, "title");
}


gboolean soy_widgets_window_get_retitle (soywidgetsWindow* self) {
	gboolean result;
	gboolean _tmp0_;
	g_return_val_if_fail (self != NULL, FALSE);
	_tmp0_ = self->priv->_retitle;
	result = _tmp0_;
	return result;
}


void soy_widgets_window_set_retitle (soywidgetsWindow* self, gboolean value) {
	gboolean _tmp0_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	self->priv->_retitle = _tmp0_;
	g_object_notify ((GObject *) self, "retitle");
}


static void __soy_widgets_window_background_set_soy_atoms_color_on_set (soyatomsColor* _sender, soyatomsColor* color, gpointer self) {
	_soy_widgets_window_background_set (self, color);
}


static void __soy_widgets_window_background_weak_gweak_notify (gpointer self, GObject* object) {
	_soy_widgets_window_background_weak (self, object);
}


soyatomsColor* soy_widgets_window_get_background (soywidgetsWindow* self) {
	soyatomsColor* result;
	soyatomsColor* _tmp0_;
	soyatomsColor* _tmp1_;
	soyatomsColor* ret;
	soyatomsColor* _tmp2_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_background_obj;
	_tmp1_ = _g_object_ref0 (_tmp0_);
	ret = _tmp1_;
	_tmp2_ = ret;
	if (_tmp2_ == NULL) {
		GLfloat* _tmp3_;
		gint _tmp3__length1;
		soyatomsColor* _tmp4_;
		soyatomsColor* _tmp5_;
		soyatomsColor* _tmp6_;
		soyatomsColor* _tmp7_;
		_tmp3_ = self->priv->_background;
		_tmp3__length1 = self->priv->_background_length1;
		_tmp4_ = soy_atoms_color_new_new4f (_tmp3_, _tmp3__length1);
		_g_object_unref0 (ret);
		ret = _tmp4_;
		_tmp5_ = ret;
		g_signal_connect_object (_tmp5_, "on-set", (GCallback) __soy_widgets_window_background_set_soy_atoms_color_on_set, self, 0);
		_tmp6_ = ret;
		g_object_weak_ref ((GObject*) _tmp6_, __soy_widgets_window_background_weak_gweak_notify, self);
		_tmp7_ = ret;
		self->priv->_background_obj = _tmp7_;
	}
	result = ret;
	return result;
}


void soy_widgets_window_set_background (soywidgetsWindow* self, soyatomsColor* value) {
	soyatomsColor* _tmp0_;
	gint _tmp1_ = 0;
	gfloat* _tmp2_ = NULL;
	soyatomsColor* _tmp3_;
	soyatomsColor* _tmp7_;
	soyatomsColor* _tmp8_;
	soyatomsColor* _tmp9_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	_tmp2_ = soy_atoms_color_get4f (_tmp0_, &_tmp1_);
	self->priv->_background = (g_free (self->priv->_background), NULL);
	self->priv->_background = _tmp2_;
	self->priv->_background_length1 = _tmp1_;
	self->priv->__background_size_ = self->priv->_background_length1;
	_tmp3_ = self->priv->_background_obj;
	if (_tmp3_ != NULL) {
		soyatomsColor* _tmp4_;
		guint _tmp5_ = 0U;
		soyatomsColor* _tmp6_;
		_tmp4_ = self->priv->_background_obj;
		g_signal_parse_name ("on-set", SOY_ATOMS_TYPE_COLOR, &_tmp5_, NULL, FALSE);
		g_signal_handlers_disconnect_matched (_tmp4_, G_SIGNAL_MATCH_ID | G_SIGNAL_MATCH_FUNC | G_SIGNAL_MATCH_DATA, _tmp5_, 0, NULL, (GCallback) __soy_widgets_window_background_set_soy_atoms_color_on_set, self);
		_tmp6_ = self->priv->_background_obj;
		g_object_weak_unref ((GObject*) _tmp6_, __soy_widgets_window_background_weak_gweak_notify, self);
	}
	_tmp7_ = value;
	self->priv->_background_obj = _tmp7_;
	_tmp8_ = value;
	g_signal_connect_object (_tmp8_, "on-set", (GCallback) __soy_widgets_window_background_set_soy_atoms_color_on_set, self, 0);
	_tmp9_ = value;
	g_object_weak_ref ((GObject*) _tmp9_, __soy_widgets_window_background_weak_gweak_notify, self);
	g_object_notify ((GObject *) self, "background");
}


static void __soy_widgets_window_position_set_soy_atoms_position_on_set (soyatomsPosition* _sender, soyatomsPosition* position, gpointer self) {
	_soy_widgets_window_position_set (self, position);
}


static void __soy_widgets_window_position_weak_gweak_notify (gpointer self, GObject* object) {
	_soy_widgets_window_position_weak (self, object);
}


soyatomsPosition* soy_widgets_window_get_position (soywidgetsWindow* self) {
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
		g_signal_connect_object (_tmp6_, "on-set", (GCallback) __soy_widgets_window_position_set_soy_atoms_position_on_set, self, 0);
		_tmp7_ = value;
		g_object_weak_ref ((GObject*) _tmp7_, __soy_widgets_window_position_weak_gweak_notify, self);
		_tmp8_ = value;
		self->priv->_position_obj = _tmp8_;
	}
	result = value;
	return result;
}


void soy_widgets_window_set_position (soywidgetsWindow* self, soyatomsPosition* value) {
	soyatomsPosition* _tmp0_;
	soyatomsPosition* _tmp1_;
	soyatomsPosition* _tmp5_;
	soyatomsPosition* _tmp6_;
	soyatomsPosition* _tmp7_;
	g_return_if_fail (self != NULL);
	_tmp0_ = value;
	_soy_widgets_window_position_set (self, _tmp0_);
	_tmp1_ = self->priv->_position_obj;
	if (_tmp1_ != NULL) {
		soyatomsPosition* _tmp2_;
		guint _tmp3_ = 0U;
		soyatomsPosition* _tmp4_;
		_tmp2_ = self->priv->_position_obj;
		g_signal_parse_name ("on-set", SOY_ATOMS_TYPE_POSITION, &_tmp3_, NULL, FALSE);
		g_signal_handlers_disconnect_matched (_tmp2_, G_SIGNAL_MATCH_ID | G_SIGNAL_MATCH_FUNC | G_SIGNAL_MATCH_DATA, _tmp3_, 0, NULL, (GCallback) __soy_widgets_window_position_set_soy_atoms_position_on_set, self);
		_tmp4_ = self->priv->_position_obj;
		g_object_weak_unref ((GObject*) _tmp4_, __soy_widgets_window_position_weak_gweak_notify, self);
	}
	_tmp5_ = value;
	self->priv->_position_obj = _tmp5_;
	_tmp6_ = value;
	g_signal_connect_object (_tmp6_, "on-set", (GCallback) __soy_widgets_window_position_set_soy_atoms_position_on_set, self, 0);
	_tmp7_ = value;
	g_object_weak_ref ((GObject*) _tmp7_, __soy_widgets_window_position_weak_gweak_notify, self);
	g_object_notify ((GObject *) self, "position");
}


static void soy_widgets_window_class_init (soywidgetsWindowClass * klass) {
	soy_widgets_window_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soywidgetsWindowPrivate));
	SOY_WIDGETS_CONTAINER_CLASS (klass)->resize_children = soy_widgets_window_real_resize_children;
	G_OBJECT_CLASS (klass)->get_property = _vala_soy_widgets_window_get_property;
	G_OBJECT_CLASS (klass)->set_property = _vala_soy_widgets_window_set_property;
	G_OBJECT_CLASS (klass)->finalize = soy_widgets_window_finalize;
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_WIDGETS_WINDOW_RESIZABLE, g_param_spec_boolean ("resizable", "resizable", "resizable", FALSE, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_WIDGETS_WINDOW_FPS, g_param_spec_int ("fps", "fps", "fps", G_MININT, G_MAXINT, 0, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_WIDGETS_WINDOW_TITLE, g_param_spec_string ("title", "title", "title", NULL, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_WIDGETS_WINDOW_RETITLE, g_param_spec_boolean ("retitle", "retitle", "retitle", FALSE, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_WIDGETS_WINDOW_BACKGROUND, g_param_spec_object ("background", "background", "background", SOY_ATOMS_TYPE_COLOR, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
	g_object_class_install_property (G_OBJECT_CLASS (klass), SOY_WIDGETS_WINDOW_POSITION, g_param_spec_object ("position", "position", "position", SOY_ATOMS_TYPE_POSITION, G_PARAM_STATIC_NAME | G_PARAM_STATIC_NICK | G_PARAM_STATIC_BLURB | G_PARAM_READABLE | G_PARAM_WRITABLE));
}


static void soy_widgets_window_instance_init (soywidgetsWindow * self) {
	guint64* _tmp0_ = NULL;
	self->priv = SOY_WIDGETS_WINDOW_GET_PRIVATE (self);
	_tmp0_ = g_new0 (guint64, 16);
	self->priv->_rtimes = _tmp0_;
	self->priv->_rtimes_length1 = 16;
	self->priv->__rtimes_size_ = self->priv->_rtimes_length1;
}


static void soy_widgets_window_finalize (GObject* obj) {
	soywidgetsWindow * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindow);
	self->priv->_rtimes = (g_free (self->priv->_rtimes), NULL);
	_g_free0 (self->priv->_title);
	self->priv->_background = (g_free (self->priv->_background), NULL);
	G_OBJECT_CLASS (soy_widgets_window_parent_class)->finalize (obj);
}


GType soy_widgets_window_get_type (void) {
	static volatile gsize soy_widgets_window_type_id__volatile = 0;
	if (g_once_init_enter (&soy_widgets_window_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soywidgetsWindowClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_widgets_window_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soywidgetsWindow), 0, (GInstanceInitFunc) soy_widgets_window_instance_init, NULL };
		GType soy_widgets_window_type_id;
		soy_widgets_window_type_id = g_type_register_static (SOY_WIDGETS_TYPE_CONTAINER, "soywidgetsWindow", &g_define_type_info, 0);
		g_once_init_leave (&soy_widgets_window_type_id__volatile, soy_widgets_window_type_id);
	}
	return soy_widgets_window_type_id__volatile;
}


static void _vala_soy_widgets_window_get_property (GObject * object, guint property_id, GValue * value, GParamSpec * pspec) {
	soywidgetsWindow * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindow);
	switch (property_id) {
		case SOY_WIDGETS_WINDOW_RESIZABLE:
		g_value_set_boolean (value, soy_widgets_window_get_resizable (self));
		break;
		case SOY_WIDGETS_WINDOW_FPS:
		g_value_set_int (value, soy_widgets_window_get_fps (self));
		break;
		case SOY_WIDGETS_WINDOW_TITLE:
		g_value_set_string (value, soy_widgets_window_get_title (self));
		break;
		case SOY_WIDGETS_WINDOW_RETITLE:
		g_value_set_boolean (value, soy_widgets_window_get_retitle (self));
		break;
		case SOY_WIDGETS_WINDOW_BACKGROUND:
		g_value_take_object (value, soy_widgets_window_get_background (self));
		break;
		case SOY_WIDGETS_WINDOW_POSITION:
		g_value_take_object (value, soy_widgets_window_get_position (self));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}


static void _vala_soy_widgets_window_set_property (GObject * object, guint property_id, const GValue * value, GParamSpec * pspec) {
	soywidgetsWindow * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (object, SOY_WIDGETS_TYPE_WINDOW, soywidgetsWindow);
	switch (property_id) {
		case SOY_WIDGETS_WINDOW_RESIZABLE:
		soy_widgets_window_set_resizable (self, g_value_get_boolean (value));
		break;
		case SOY_WIDGETS_WINDOW_TITLE:
		soy_widgets_window_set_title (self, g_value_get_string (value));
		break;
		case SOY_WIDGETS_WINDOW_RETITLE:
		soy_widgets_window_set_retitle (self, g_value_get_boolean (value));
		break;
		case SOY_WIDGETS_WINDOW_BACKGROUND:
		soy_widgets_window_set_background (self, g_value_get_object (value));
		break;
		case SOY_WIDGETS_WINDOW_POSITION:
		soy_widgets_window_set_position (self, g_value_get_object (value));
		break;
		default:
		G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
		break;
	}
}



