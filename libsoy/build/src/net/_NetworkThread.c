/* _NetworkThread.c generated by valac 0.20.1, the Vala compiler
 * generated from _NetworkThread.gs, do not modify */

/*
 *  libsoy - soy.net._NetworkThread
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


#define SOY_NET_TYPE__NETWORKTHREAD (soy_net__networkthread_get_type ())
#define SOY_NET__NETWORKTHREAD(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_NET_TYPE__NETWORKTHREAD, soynet_NetworkThread))
#define SOY_NET__NETWORKTHREAD_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_NET_TYPE__NETWORKTHREAD, soynet_NetworkThreadClass))
#define SOY_NET_IS__NETWORKTHREAD(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_NET_TYPE__NETWORKTHREAD))
#define SOY_NET_IS__NETWORKTHREAD_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_NET_TYPE__NETWORKTHREAD))
#define SOY_NET__NETWORKTHREAD_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_NET_TYPE__NETWORKTHREAD, soynet_NetworkThreadClass))

typedef struct _soynet_NetworkThread soynet_NetworkThread;
typedef struct _soynet_NetworkThreadClass soynet_NetworkThreadClass;
typedef struct _soynet_NetworkThreadPrivate soynet_NetworkThreadPrivate;
#define _g_main_loop_unref0(var) ((var == NULL) ? NULL : (var = (g_main_loop_unref (var), NULL)))
#define _g_thread_unref0(var) ((var == NULL) ? NULL : (var = (g_thread_unref (var), NULL)))
#define _g_main_context_unref0(var) ((var == NULL) ? NULL : (var = (g_main_context_unref (var), NULL)))

struct _soynet_NetworkThread {
	GObject parent_instance;
	soynet_NetworkThreadPrivate * priv;
	GMainContext* context;
};

struct _soynet_NetworkThreadClass {
	GObjectClass parent_class;
};

struct _soynet_NetworkThreadPrivate {
	GMainLoop* _loop;
	GThread* _thread;
};


extern soynet_NetworkThread* soy_net__thread;
soynet_NetworkThread* soy_net__thread = NULL;
static gpointer soy_net__networkthread_parent_class = NULL;

GType soy_net__networkthread_get_type (void) G_GNUC_CONST;
#define SOY_NET__NETWORKTHREAD_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_NET_TYPE__NETWORKTHREAD, soynet_NetworkThreadPrivate))
enum  {
	SOY_NET__NETWORKTHREAD_DUMMY_PROPERTY
};
void* soy_net__networkthread_run (soynet_NetworkThread* self);
soynet_NetworkThread* soy_net__networkthread_new (void);
soynet_NetworkThread* soy_net__networkthread_construct (GType object_type);
static GObject * soy_net__networkthread_constructor (GType type, guint n_construct_properties, GObjectConstructParam * construct_properties);
static gpointer _soy_net__networkthread_run_gthread_func (gpointer self);
static void soy_net__networkthread_finalize (GObject* obj);


void* soy_net__networkthread_run (soynet_NetworkThread* self) {
	void* result = NULL;
	GMainLoop* _tmp0_;
	g_return_val_if_fail (self != NULL, NULL);
	_tmp0_ = self->priv->_loop;
	g_main_loop_run (_tmp0_);
	result = NULL;
	return result;
}


soynet_NetworkThread* soy_net__networkthread_construct (GType object_type) {
	soynet_NetworkThread * self = NULL;
	self = (soynet_NetworkThread*) g_object_new (object_type, NULL);
	return self;
}


soynet_NetworkThread* soy_net__networkthread_new (void) {
	return soy_net__networkthread_construct (SOY_NET_TYPE__NETWORKTHREAD);
}


static gpointer _soy_net__networkthread_run_gthread_func (gpointer self) {
	gpointer result;
	result = soy_net__networkthread_run (self);
	g_object_unref (self);
	return result;
}


static GObject * soy_net__networkthread_constructor (GType type, guint n_construct_properties, GObjectConstructParam * construct_properties) {
	GObject * obj;
	GObjectClass * parent_class;
	soynet_NetworkThread * self;
	gboolean _tmp0_ = FALSE;
	GMainContext* _tmp1_;
	GMainContext* _tmp2_;
	GMainLoop* _tmp3_;
	GThread* _tmp4_;
	parent_class = G_OBJECT_CLASS (soy_net__networkthread_parent_class);
	obj = parent_class->constructor (type, n_construct_properties, construct_properties);
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_NET_TYPE__NETWORKTHREAD, soynet_NetworkThread);
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
	_tmp4_ = g_thread_new ("Controllers", _soy_net__networkthread_run_gthread_func, g_object_ref (self));
	_g_thread_unref0 (self->priv->_thread);
	self->priv->_thread = _tmp4_;
	return obj;
}


static void soy_net__networkthread_class_init (soynet_NetworkThreadClass * klass) {
	soy_net__networkthread_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soynet_NetworkThreadPrivate));
	G_OBJECT_CLASS (klass)->constructor = soy_net__networkthread_constructor;
	G_OBJECT_CLASS (klass)->finalize = soy_net__networkthread_finalize;
}


static void soy_net__networkthread_instance_init (soynet_NetworkThread * self) {
	self->priv = SOY_NET__NETWORKTHREAD_GET_PRIVATE (self);
}


static void soy_net__networkthread_finalize (GObject* obj) {
	soynet_NetworkThread * self;
	GMainLoop* _tmp0_;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_NET_TYPE__NETWORKTHREAD, soynet_NetworkThread);
	_tmp0_ = self->priv->_loop;
	g_main_loop_quit (_tmp0_);
	_g_main_loop_unref0 (self->priv->_loop);
	_g_thread_unref0 (self->priv->_thread);
	_g_main_context_unref0 (self->context);
	G_OBJECT_CLASS (soy_net__networkthread_parent_class)->finalize (obj);
}


GType soy_net__networkthread_get_type (void) {
	static volatile gsize soy_net__networkthread_type_id__volatile = 0;
	if (g_once_init_enter (&soy_net__networkthread_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soynet_NetworkThreadClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_net__networkthread_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soynet_NetworkThread), 0, (GInstanceInitFunc) soy_net__networkthread_instance_init, NULL };
		GType soy_net__networkthread_type_id;
		soy_net__networkthread_type_id = g_type_register_static (G_TYPE_OBJECT, "soynet_NetworkThread", &g_define_type_info, 0);
		g_once_init_leave (&soy_net__networkthread_type_id__volatile, soy_net__networkthread_type_id);
	}
	return soy_net__networkthread_type_id__volatile;
}


