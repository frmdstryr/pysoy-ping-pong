/*
    PySoy - soy.utils
    Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program; if not, see http://www.gnu.org/licenses
*/

#include "pysoy2.h"
#include "pysoy-utils.h"

static void soy_gee_iterator_interface_init (GeeIteratorIface* iface);
static void soy_generator_class_init        (soyGeneratorClass* klass);
static void soy_generator_finalize          (GObject* obj);

static gboolean soy_generator_next     (soyGenerator* self);
static gboolean soy_generator_has_next (soyGenerator* self);
static gpointer soy_generator_get      (soyGenerator* self);
static void     soy_generator_remove   (soyGenerator* self);
static gboolean soy_generator_first    (soyGenerator* self);

static void     advance_iteration      (soyGenerator* self);
static void     iteration_finished     (soyGenerator* self);

static gpointer do_dup              (soyGenerator* self, gpointer val);
static void     do_destroy          (soyGenerator* self, gpointer val);
static gpointer default_converter   (PyObject* obj);

G_DEFINE_TYPE_WITH_CODE (soyGenerator, soy_generator, G_TYPE_OBJECT,
                         G_IMPLEMENT_INTERFACE(GEE_TYPE_ITERATOR,
                                               soy_gee_iterator_interface_init));

static void soy_generator_init(soyGenerator* self) {
    self->current = NULL;
    self->next = NULL;
    self->iter = NULL;
    self->py_type = NULL;
    self->soy_type = G_TYPE_INVALID;
    self->dup_func = NULL;
    self->destroy_func = NULL;
    self->convert_func = NULL;
    self->has_next = FALSE;
    self->has_current = FALSE;
}

static void soy_generator_class_init(soyGeneratorClass* klass) {
    G_OBJECT_CLASS(klass)->finalize = soy_generator_finalize;
}

static void soy_gee_iterator_interface_init(GeeIteratorIface* iface) {
    iface->next     = (gboolean (*)(GeeIterator*)) soy_generator_next;
    iface->has_next = (gboolean (*)(GeeIterator*)) soy_generator_has_next;
    iface->first    = (gboolean (*)(GeeIterator*)) soy_generator_first;
    iface->get      = (gpointer (*)(GeeIterator*)) soy_generator_get;
    iface->remove   = (void     (*)(GeeIterator*)) soy_generator_remove; 
}

soyGenerator* soy_generator_construct(GType type, PyTypeObject* py_type, GType soy_type, GBoxedCopyFunc g_dup, GDestroyNotify g_destroy, PySoyConvertFunc conv, PyObject* iter) {
    g_return_val_if_fail(PyIter_Check(iter), NULL);
    g_return_val_if_fail(PyType_Check((PyObject*)py_type), NULL);

    soyGenerator* self = (soyGenerator*) g_object_new (type, NULL);
    
    Py_INCREF(iter);
    Py_INCREF(py_type);

    self->iter     = iter;
    self->py_type  = py_type;
    self->soy_type = soy_type;
    self->convert_func = conv;
    self->dup_func = g_dup;
    self->destroy_func = g_destroy;
    self->current  = NULL;
    self->has_next = FALSE;
    self->has_current = FALSE;
    advance_iteration(self);
    return self;
}

soyGenerator* soy_generator_new_soy(PyTypeObject* py_type, GType soy_type, PyObject* iter) {
    return soy_generator_construct(SOY_TYPE_GENERATOR, py_type, soy_type, g_object_ref, g_object_unref, default_converter, iter);
}
soyGenerator* soy_generator_new(PyTypeObject* py_type, GType soy_type, GBoxedCopyFunc g_dup, GDestroyNotify g_destroy, PySoyConvertFunc conv, PyObject* iter) {
    return soy_generator_construct(SOY_TYPE_GENERATOR, py_type, soy_type, g_dup, g_destroy, conv, iter);
}

static void soy_generator_finalize(GObject* obj) { 
    soyGenerator* self = SOY_GENERATOR(obj);
    Py_XDECREF(self->iter);
    Py_XDECREF(self->py_type);
    self->iter = NULL;
    self->py_type = NULL;

    do_destroy(self, self->current);
    self->current = NULL;

    do_destroy(self, self->next);
    self->next = NULL;

    G_OBJECT_CLASS(soy_generator_parent_class)->finalize(obj);
}

static void advance_iteration(soyGenerator* self) {
    g_return_if_fail((self->iter) != NULL);
    g_return_if_fail(PyIter_Check(self->iter));

    self->current = self->next;
    self->has_current = self->has_next;

    PyGILState_STATE st = PyGILState_Ensure();
    PyObject* obj = PyIter_Next(self->iter);
    PyGILState_Release(st);

    if (PyErr_Occurred()) {
        g_warning("Error occured during Iterator.next call in Generator %p. Stopping iteration.",self);
        PyErr_Clear();
        Py_XDECREF(obj);
        iteration_finished(self);
        return;
    } else if (obj == NULL) {
        iteration_finished(self);
        return;
    }
    if ( !PyObject_TypeCheck(obj, self->py_type) ) {
        // We will just stop when we hit the first bad value;
        g_warning("An object given by the iterator to Generator %p was of type %s, not the expected %s, stopping iteration.", 
                self, obj->ob_type->tp_name, self->py_type->tp_name);
        Py_DECREF(obj);
        iteration_finished(self);
        return;
    }
    gpointer nxt = self->convert_func(obj);
    if (!g_type_is_a(G_OBJECT_TYPE(nxt), self->soy_type)) {
        g_critical("An object given by the iterator to Generator %p was converted to the GObject type of %s, not the expected %s, stopping iteration.", 
                self, g_type_name(G_OBJECT_TYPE(nxt)), g_type_name(self->soy_type));
        Py_DECREF(obj);
        iteration_finished(self);
        return;
    }
    self->next = do_dup(self, nxt);
    self->has_next = TRUE;
    Py_DECREF(obj);
}

static void iteration_finished(soyGenerator* self) {
    self->next = NULL;
    self->has_next = FALSE;
}

static gboolean soy_generator_has_next(soyGenerator* self) {
    g_return_val_if_fail(SOY_IS_GENERATOR(self), FALSE);
    return self->has_next;
}

static gboolean soy_generator_next(soyGenerator* self) {
    g_return_val_if_fail(SOY_IS_GENERATOR(self), FALSE);
    if (!soy_generator_has_next(self)) {
        g_warning("Iterator.next was callen on exhausted Generator %p.",self);
        return FALSE;
    }
    advance_iteration(self);
    return TRUE;
}

static gpointer soy_generator_get(soyGenerator* self) {
    g_return_val_if_fail(SOY_IS_GENERATOR(self), NULL);
    g_return_val_if_fail(self->has_current, NULL);
    return do_dup(self, self->current);
}

static void soy_generator_remove (soyGenerator* self) {
    g_return_if_fail(SOY_IS_GENERATOR(self));
    if (self->has_current) {
        do_destroy(self, self->current);
        self->current = NULL;
        self->has_current = FALSE;
    } else {
        g_warning("Iterator.remove was called on Generator %p when there was no currently pointed to item.", self);
    }
    return;
}

static gboolean soy_generator_first(soyGenerator* self) {
    g_return_val_if_fail(SOY_IS_GENERATOR(self), FALSE);
    return FALSE;
}

static gpointer do_dup(soyGenerator* self, gpointer ptr) {
    if ((self->dup_func != NULL) && (ptr != NULL))
        return self->dup_func(ptr);
    else
        return ptr;
}

static void do_destroy(soyGenerator* self, gpointer ptr) {
    if ((self->destroy_func != NULL) && (ptr != NULL)) 
        self->destroy_func(ptr);
    return;
}

static gpointer default_converter(PyObject* obj) {
    return (gpointer)(((PySoy__G_Object*)obj)->g);
}

