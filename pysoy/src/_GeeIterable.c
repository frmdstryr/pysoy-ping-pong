/*
    PySoy - soy._GeeIterable Type
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

#include "pysoy.h"
#include "pysoy-utils.h"
#define SELF PySoy__GeeIterable_Object*


static char
tp_doc[] = "soy._GeeIterable Type\n"
"\n"
"    This is a type used to wrap Gee.Iterable's in Python.\n"
"\n"
"    It has no methods and is there simply for use in special cases where\n"
"    it is impossible to turn the object into a normal List or Tuple, or for\n"
"    debuging purposes.\n"
"\n"
"    The only defined operations on this type are repr, ==, and !=.\n"
"\n"
"    Its named starting with an underscore as a hint that its not useful to\n"
"    the end user, please take this hint - unless you're implementing a new\n"
"    type in a Python extension class this type serves no purpose to you.\n";


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    // Raise error
    PyErr_SetString(PyExc_TypeError, "This class cannot be used directly.");
    return NULL;
}


PyObject*
PySoy__GeeIterable_new (GeeIterable* iterable) {
    SELF self = (SELF) PyType_GenericNew(&PySoy__GeeIterable_Type, NULL, NULL);
    self->g = g_object_ref(iterable);
    return (PyObject*)self;
}


static PyObject*
tp_repr(SELF self) {
    return PyUnicode_FromFormat("<%s at %p>",
                                g_type_name(G_OBJECT_TYPE(self->g)), self->g);
}


/////////////////////////////////////////////////////////////////////////////
// Type structs

PyTypeObject PySoy__GeeIterable_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy._GeeIterable",                                    // tp_name
    sizeof(PySoy__GeeIterable_Object),                     // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    0,                                                     // tp_as_number
    0,                                                     // tp_as_sequence
    0,                                                     // tp_as_mapping
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
    0,                                                     // tp_methods
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

