/* _ControllerThread.c generated by valac 0.20.1, the Vala compiler
 * generated from _ControllerThread.gs, do not modify */

/*
 *  libsoy - soy.controllers._ControllerThread
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
#include <signal.h>


#define SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD (soy_controllers__controllerthread_get_type ())
#define SOY_CONTROLLERS__CONTROLLERTHREAD(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD, soycontrollers_ControllerThread))
#define SOY_CONTROLLERS__CONTROLLERTHREAD_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD, soycontrollers_ControllerThreadClass))
#define SOY_CONTROLLERS_IS__CONTROLLERTHREAD(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD))
#define SOY_CONTROLLERS_IS__CONTROLLERTHREAD_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD))
#define SOY_CONTROLLERS__CONTROLLERTHREAD_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD, soycontrollers_ControllerThreadClass))

typedef struct _soycontrollers_ControllerThread soycontrollers_ControllerThread;
typedef struct _soycontrollers_ControllerThreadClass soycontrollers_ControllerThreadClass;
typedef struct _soycontrollers_ControllerThreadPrivate soycontrollers_ControllerThreadPrivate;
#define _g_main_loop_unref0(var) ((var == NULL) ? NULL : (var = (g_main_loop_unref (var), NULL)))
#define _g_thread_unref0(var) ((var == NULL) ? NULL : (var = (g_thread_unref (var), NULL)))
#define _g_main_context_unref0(var) ((var == NULL) ? NULL : (var = (g_main_context_unref (var), NULL)))

struct _soycontrollers_ControllerThread {
	GObject parent_instance;
	soycontrollers_ControllerThreadPrivate * priv;
	GMainContext* context;
};

struct _soycontrollers_ControllerThreadClass {
	GObjectClass parent_class;
};

struct _soycontrollers_ControllerThreadPrivate {
	GMainLoop* _loop;
	GThread* _thread;
};


extern soycontrollers_ControllerThread* soy_controllers__thread;
soycontrollers_ControllerThread* soy_controllers__thread = NULL;
static gpointer soy_controllers__controllerthread_parent_class = NULL;

GType soy_controllers__controllerthread_get_type (void) G_GNUC_CONST;
#define SOY_CONTROLLERS__CONTROLLERTHREAD_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD, soycontrollers_ControllerThreadPrivate))
enum  {
	SOY_CONTROLLERS__CONTROLLERTHREAD_DUMMY_PROPERTY
};
void* soy_controllers__controllerthread_run (soycontrollers_ControllerThread* self);
soycontrollers_ControllerThread* soy_controllers__controllerthread_new (void);
soycontrollers_ControllerThread* soy_controllers__controllerthread_construct (GType object_type);
static GObject * soy_controllers__controllerthread_constructor (GType type, guint n_construct_properties, GObjectConstructParam * construct_properties);
static gpointer _soy_controllers__controllerthread_run_gthread_func (gpointer self);
static void soy_controllers__controllerthread_finalize (GObject* obj);


void* soy_controllers__controllerthread_run (soycontrollers_ControllerThread* self) {
	void* result = NULL;
	GMainLoop* _tmp0_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_loop;
	g_main_loop_run (_tmp0_);
	result = NULL;
	return result;
}


soycontrollers_ControllerThread* soy_controllers__controllerthread_construct (GType object_type) {
	soycontrollers_ControllerThread * self = NULL;
	self = (soycontrollers_ControllerThread*) g_object_new (object_type, NULL);
	return self;
}


soycontrollers_ControllerThread* soy_controllers__controllerthread_new (void) {
	return soy_controllers__controllerthread_construct (SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD);
}


static gpointer _soy_controllers__controllerthread_run_gthread_func (gpointer self) {
	gpointer result;
	result = soy_controllers__controllerthread_run (self);
	g_object_unref (self);
	return result;
}


static GObject * soy_controllers__controllerthread_constructor (GType type, guint n_construct_properties, GObjectConstructParam * construct_properties) {
	GObject * obj;
	GObjectClass * parent_class;
	soycontrollers_ControllerThread * self;
	gboolean _tmp0_ = FALSE;
	GMainContext* _tmp1_;
	GMainContext* _tmp2_;
	GMainLoop* _tmp3_;
	GThread* _tmp4_;
	parent_class = G_OBJECT_CLASS (soy_controllers__controllerthread_parent_class);
	obj = parent_class->constructor (type, n_construct_properties, construct_properties);
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD, soycontrollers_ControllerThread);
	_tmp0_ = g_thread_supported ();
	if (!_tmp0_) {
		g_print ("ThreadError: Threading is unsupported\n");
		raise (15);
	}
	_tmp1_ = g_main_context_new ();
	_g_main_context_unref0 (self->context);
	self->context = _tmp1_;
	_tmp2_ = self->context;
	_tmp3_ = g_main_loop_new (_tmp2_, TRUE);
	_g_main_loop_unref0 (self->priv->_loop);
	self->priv->_loop = _tmp3_;
	_tmp4_ = g_thread_new ("Controllers", _soy_controllers__controllerthread_run_gthread_func, g_object_ref (self));
	_g_thread_unref0 (self->priv->_thread);
	self->priv->_thread = _tmp4_;
	return obj;
}


static void soy_controllers__controllerthread_class_init (soycontrollers_ControllerThreadClass * klass) {
	soy_controllers__controllerthread_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soycontrollers_ControllerThreadPrivate));
	G_OBJECT_CLASS (klass)->constructor = soy_controllers__controllerthread_constructor;
	G_OBJECT_CLASS (klass)->finalize = soy_controllers__controllerthread_finalize;
}


static void soy_controllers__controllerthread_instance_init (soycontrollers_ControllerThread * self) {
	self->priv = SOY_CONTROLLERS__CONTROLLERTHREAD_GET_PRIVATE (self);
}


static void soy_controllers__controllerthread_finalize (GObject* obj) {
	soycontrollers_ControllerThread * self;
	GMainLoop* _tmp0_;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_CONTROLLERS_TYPE__CONTROLLERTHREAD, soycontrollers_ControllerThread);
	_tmp0_ = self->priv->_loop;
	g_main_loop_quit (_tmp0_);
	_g_main_loop_unref0 (self->priv->_loop);
	_g_thread_unref0 (self->priv->_thread);
	_g_main_context_unref0 (self->context);
	G_OBJECT_CLASS (soy_controllers__controllerthread_parent_class)->finalize (obj);
}


GType soy_controllers__controllerthread_get_type (void) {
	static volatile gsize soy_controllers__controllerthread_type_id__volatile = 0;
	if (g_once_init_enter (&soy_controllers__controllerthread_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soycontrollers_ControllerThreadClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_controllers__controllerthread_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soycontrollers_ControllerThread), 0, (GInstanceInitFunc) soy_controllers__controllerthread_instance_init, NULL };
		GType soy_controllers__controllerthread_type_id;
		soy_controllers__controllerthread_type_id = g_type_register_static (G_TYPE_OBJECT, "soycontrollers_ControllerThread", &g_define_type_info, 0);
		g_once_init_leave (&soy_controllers__controllerthread_type_id__volatile, soy_controllers__controllerthread_type_id);
	}
	return soy_controllers__controllerthread_type_id__volatile;
}



