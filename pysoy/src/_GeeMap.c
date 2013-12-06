/*
    PySoy - soy._GeeMap Type
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
#define SELF PySoy__GeeMap_Object*


static char
tp_doc[] = "soy._GeeMap Type\n";


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    PyErr_SetString(PyExc_TypeError, "This class cannot be used directly.");
    return NULL;
}


static void
tp_dealloc (SELF self) {
    // decref gobject
    if (self->g)
      g_object_unref(self->g);

    // dealloc base type
    PyObject_Del((PyObject*) self);
}


static PyObject*
tp_repr (SELF self) {
    PyObject* old = PyUnicode_FromString("{");
    PyObject* comma = PyUnicode_FromString(", ");
    PyObject* new;
    PyObject* ret;
    GeeSet* keys_set = gee_abstract_map_get_keys(
        (GeeAbstractMap*) self->g);
    GeeIterator* iterator = gee_iterable_iterator((GeeIterable*) keys_set);

    if (gee_iterator_next(iterator)) {
        while (1) {
            gchar* quoted;
            gpointer g;
            PySoy__G_Object* value;
            char* key = (char*) gee_iterator_get(iterator);

            // Get new PySoy.bodies.Body object
            g = self->get((gpointer) self->g, key);
            value = (PySoy__G_Object*)
                    PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(g),
                                                       GPyObject),
                                      NULL, NULL);

            if (!value) return NULL;
            value->g = g;
            g_object_ref(g);

            // Add key to ret
            quoted = g_strdup_printf("'%s': ", key);
            new = PyUnicode_FromString(quoted);
            g_free(quoted);
            ret = PySequence_Concat(old, new);
            Py_DECREF(old);
            Py_DECREF(new);
            old = ret;

            // Add new value to ret (temporarily, cat)
            new = PyObject_Repr((PyObject*) value);
            Py_DECREF(value);
            ret = PySequence_Concat(old, new);
            Py_DECREF(old);
            Py_DECREF(new);

            // Add a ", " if we have another value
            if (gee_iterator_next(iterator)) {
                old = PySequence_Concat(ret, comma);
                Py_DECREF(ret);
            }
            else {
                old = ret;
                break;
            }
        }
    }

    // Add final '}'
    new = PyUnicode_FromString("}");
    ret = PySequence_Concat(old, new);

    // Cleanup pyobjects
    Py_DECREF(old);
    Py_DECREF(new);
    Py_DECREF(comma);

    // Cleanup gobjects
    g_object_unref(keys_set);
    g_object_unref(iterator);

    // return string as unicode object
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Sequence methods

static Py_ssize_t
sq_length (SELF self) {
    return gee_abstract_map_get_size((GeeAbstractMap*) self->g);
}


static int
sq_contains (SELF self, PyObject* key) {
    PyObject* name;

    // Require key to be either a bytes or unicode object
    if (PyBytes_Check(key)) {
        // Use a bytes string verbatim as UTF-8 name
        Py_INCREF(key);
        name = key;
    }
    else if (PyUnicode_Check(key)) {
        // Encode unicode string as UTF-8 bytes object
        name = PyUnicode_AsUTF8String(key);
    }
    else
        return FALSE;

    return gee_abstract_map_has_key((GeeAbstractMap*)
                                    self->g, PyBytes_AsString(name));
}


///////////////////////////////////////////////////////////////////////////////
// Mapping methods

static PyObject*
mp_subscript (SELF self, PyObject* key) {
    PyObject* name;
    gpointer g;
    PySoy__G_Object* value;

    // Require key to be either a bytes or unicode object
    if (PyBytes_Check(key)) {
        // Use a bytes string verbatim as UTF-8 name
        Py_INCREF(key);
        name = key;
    }
    else if (PyUnicode_Check(key)) {
        // Encode unicode string as UTF-8 bytes object
        name = PyUnicode_AsUTF8String(key);
    }
    else {
        // Raise exception
        PyErr_SetString(PyExc_TypeError, "attribute name must be a string");
        return NULL;
    }

    g = self->get((gpointer) self->g, PyBytes_AsString(name));
    Py_DECREF(name);

    // Raise exception if not found
    if (g == NULL) {
        PyErr_SetString(PyExc_KeyError, "attribute not found");
        return NULL;
    }

    // This should never happen
    if (!g) Py_RETURN_NONE;

    // Create PyObject for libsoy body
    value = (PySoy__G_Object*)
            PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(g), GPyObject),
                              NULL, NULL);
    if (!value) return NULL;
    value->g = g;
    g_object_ref(g);

    return (PyObject*) value;
}


static int
mp_ass_subscript (SELF self, PyObject* key, PyObject* value) {
    PyObject* name;

    // Require key to be either a bytes or unicode object
    if (PyBytes_Check(key)) {
        // Use a bytes string verbatim as UTF-8 name
        Py_INCREF(key);
        name = key;
    }
    else if (PyUnicode_Check(key)) {
        // Encode unicode string as UTF-8 bytes object
        name = PyUnicode_AsUTF8String(key);
    }
    else {
        // Raise exception
        PyErr_SetString(PyExc_TypeError, "attribute name must be a string");
        return -1;
    }

    // If v == NULL then delete object
    if (value == NULL) {
        gee_abstract_map_unset((GeeAbstractMap*) self->g,
                               PyBytes_AsString(name), NULL);

        // Successfully deleted body
        Py_DECREF(name);
        return 0;
    }

    // Require value to be either a bytes or unicode object
    if (!PySoy__G_Check(value)) {
        // Raise exception
        Py_DECREF(name);
        PyErr_SetString(PyExc_TypeError,
                        "attribute value must be a PySoy type");
        return -1;
    }

    if(0 == self->check_type(((PySoy__G_Object*) value)->g)) {
        // Raise exception
        Py_DECREF(name);
        PyErr_SetString(PyExc_TypeError, "wrong attribute value type");
        return -1;
    }

    self->set((gpointer) self->g, PyBytes_AsString(name),
                                       ((PySoy__G_Object*) value)->g);

    // Successfully assigned new value
    Py_DECREF(name);
    return 0;
}

///////////////////////////////////////////////////////////////////////////////
// Methods

static char
keys_doc[] = "Return keys of the HashMap";

static PyObject*
keys (SELF self, PyObject* args) {
    PyObject* ret;

    // Parse arguments
    if (!PyArg_ParseTuple(args, ""))
        return NULL;

    if (!(ret = PyList_New(sq_length(self))))
        return NULL;

    GeeSet* keys_set = gee_abstract_map_get_keys(
        (GeeAbstractMap*) self->g);
    GeeIterator* iterator = gee_iterable_iterator ((GeeIterable*) keys_set);
    int i = 0;

    while (gee_iterator_next(iterator))
        PyList_SetItem(ret, i++,
                       (PyObject*)
                       PyUnicode_FromString(gee_iterator_get(iterator)));

    // Cleanup gobjects
    g_object_unref(keys_set);
    g_object_unref(iterator);

    return (PyObject*) ret;
}


static char
values_doc[] = "Return values of the HashMap";

static PyObject*
values (SELF self, PyObject* args) {
    PyObject* ret;

    // Parse arguments
    if (!PyArg_ParseTuple(args, ""))
        return NULL;

    if (!(ret = PyList_New(sq_length(self))))
        return NULL;

    GeeSet* keys_set = gee_abstract_map_get_keys(
        (GeeAbstractMap*) self->g);
    GeeIterator* iterator = gee_iterable_iterator((GeeIterable*) keys_set);
    int i = 0;

    while (gee_iterator_next(iterator)) {
        gpointer g;
        PySoy__G_Object* value;
        char* key = (char*) gee_iterator_get(iterator);

        // Get new PySoy.bodies.Body object
        g = self->get((gpointer) self->g, key);
        value = (PySoy__G_Object*)
                PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(g),
                                                   GPyObject), NULL, NULL);
        if (!value) return NULL;
        value->g = g;

        g_object_ref(g);
        PyList_SetItem(ret, i++, (PyObject*) value);
    }

    // Cleanup gobjects
    g_object_unref(keys_set);
    g_object_unref(iterator);

    return (PyObject*) ret;
}


/////////////////////////////////////////////////////////////////////////////
// Type structs

static PySequenceMethods tp_as_sequence = {
    (lenfunc) sq_length,                                   // sq_length
    0,                                                     // sq_concat
    0,                                                     // sq_repeat
    0,                                                     // sq_item
    0,                                                     // was_sq_slice
    0,                                                     // sq_ass_item
    0,                                                     // was_sq_ass_slice
    (objobjproc) sq_contains,                              // sq_contains
    0,                                                     // sq_inplace_concat
    0,                                                     // sq_inplace_repeat
};


static PyMappingMethods tp_as_mapping = {
    0,                                                     // mp_length
    (binaryfunc) mp_subscript,                             // mp_subscript
    (objobjargproc) mp_ass_subscript,                      // mp_ass_subscript
};


static PyMethodDef tp_methods[] = {
    {"keys",                                               // ml_name
     (PyCFunction) keys,                                   // ml_meth
     METH_VARARGS,                                         // ml_flags
     keys_doc},                                            // ml_doc
    {"values",                                             // ml_name
     (PyCFunction) values,                                 // ml_meth
     METH_VARARGS,                                         // ml_flags
     values_doc},                                          // ml_doc
    {NULL},                                                // sentinel
};


PyTypeObject PySoy__GeeMap_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy._GeeMap",                                         // tp_name
    sizeof(PySoy__GeeMap_Object),                          // tp_basicsize
    0,                                                     // tp_itemsize
    (destructor) tp_dealloc,                               // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    0,                                                     // tp_as_number
    &tp_as_sequence,                                       // tp_as_sequence
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
    0,                                                     // tp_getset
    &PySoy__G_Type,                                        // tp_base
    0,                                                     // tp_dict
    0,                                                     // tp_descr_get
    0,                                                     // tp_descr_set
    0,                                                     // tp_dictoffset
    0,                                                     // tp_init
    0,                                                     // tp_alloc
    tp_new,                                                // tp_new
    0,                                                     // tp_free
    0,                                                     // tp_is_gc
};

