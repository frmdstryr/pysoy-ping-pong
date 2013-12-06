/*
    PySoy - soy.Client._ControllerMap Type
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
#define SELF PySoy_Client__ControllerMap_Object*


static char
tp_doc[] = "soy.Client._ControllerMap Type\n"
"\n";


///////////////////////////////////////////////////////////////////////////////
// Type Functions

static int
tp_init (SELF self, PyObject* args, PyObject* kwds) {
    PyErr_SetString(PyExc_TypeError, "This type is for internal use only.");
    return -1;
}


static void
tp_dealloc (SELF self) {
    // Delete the hashtable
    g_hash_table_destroy(self->map);

    // Delete self
    PyObject_Del(self);
}


static PyObject*
tp_repr (SELF self) {
    PyObject* old = PyUnicode_FromString("");
    PyObject* entry;
    PyObject* new;
    GHashTableIter iter;
    int* key;
    soycontrollersController* g;
    char* pre = "{";
    PyObject* end = PyUnicode_FromString("}");

    // Start table iterator
    g_hash_table_iter_init(&iter, self->map);

    // While we have a controller
    while (g_hash_table_iter_next(&iter, (gpointer*) &key, (gpointer) &g)) {
        char* value = soy_controllers_controller_tp_repr(g);
        entry = PyUnicode_FromFormat("%s%d: %s", pre, *key, value);

        // Don't forget to free the returned string
        g_free(value);

        // Add old return value and new entry for a new return value
        new = PyUnicode_Concat(old, entry);

        // Drop old ret and entry, what's new becomes old
        Py_DECREF(old);
        Py_DECREF(entry);
        old = new;

        // We technically only need to change the prefix once, but its cheaper
        // to do it every time vs testing whether its the first iteration.
        pre = ",\n ";
    }

    // Add old return value and new entry for a new return value
    new = PyUnicode_Concat(old, end);

    // Drop old ret and end, return new value
    Py_DECREF(old);
    Py_DECREF(end);
    return new;
}


///////////////////////////////////////////////////////////////////////////////
// Mapping methods

static Py_ssize_t
mp_length (SELF self) {
    return (Py_ssize_t) g_hash_table_size(self->map);
}


static PySoy_controllers_Controller_Object*
mp_subscript (SELF self, PyObject* key) {
    int keyval;
    soycontrollersController* g;
    PySoy_controllers_Controller_Object* ret;

    // Ensure key is a number
    if (!PyLong_Check(key)) {
        PyErr_SetString(PyExc_TypeError, "controller id must be an int");
        return NULL;
    }

    // Get keyval
    keyval = PyLong_AsLong(key);

    // Get gobject value
    g = (soycontrollersController*)
        g_hash_table_lookup(self->map, &keyval);

    // If not found, return error
    if (g == NULL) {
        PyErr_SetString(PyExc_KeyError, "controller id not found");
        return NULL;
    }

    // Create new Python object for GObject
    ret = (PySoy_controllers_Controller_Object*)
          PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(g), GPyObject),
                            NULL, NULL);
    if (!ret)
        return NULL;

    // Set GObject ref
    ret->g = g;
    g_object_ref(g);

    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyMappingMethods tp_as_mapping = {
    (lenfunc) mp_length,                                   // mp_length
    (binaryfunc) mp_subscript,                             // mp_subscript
    NULL                                                   // mp_ass_subscript
};


static PyMethodDef tp_methods[] = {
    {NULL},                                                // sentinel
};


static PyGetSetDef tp_getset[] = {
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_Client__ControllerMap_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.Client._ControllerMap",                           // tp_name
    sizeof(PySoy_Client__ControllerMap_Object),            // tp_basicsize
    0,                                                     // tp_itemsize
    (destructor) tp_dealloc,                               // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    0,                                                     // tp_as_number
    0,                                                     // tp_as_sequence
    &tp_as_mapping,                                        // tp_as_mapping
    0,                                                     // tp_hash
    0,                                                     // tp_call
    0,                                                     // tp_str
    (getattrofunc) 0,                                      // tp_getattro
    (setattrofunc) 0,                                      // tp_setattro
    0,                                                     // tp_as_buffer
    Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE,              // tp_flags
    tp_doc,                                                // tp_doc
    0,                                                     // tp_traverse
    0,                                                     // tp_clear
    0,                                                     // tp_richcompare
    0,                                                     // tp_weaklistoffset
    0,                                                     // tp_iter
    0,                                                     // tp_iternext
    tp_methods,                                            // tp_methods
    0,                                                     // tp_members
    tp_getset,                                             // tp_getset
    0,                                                     // tp_base
    0,                                                     // tp_dict
    0,                                                     // tp_descr_get
    0,                                                     // tp_descr_set
    0,                                                     // tp_dictoffset
    (initproc) tp_init,                                    // tp_init
    PyType_GenericAlloc,                                   // tp_alloc
    PyType_GenericNew,                                     // tp_new
    PyObject_GC_Del,                                       // tp_free
    0,                                                     // tp_is_gc
};

