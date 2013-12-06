/*
    PySoy - soy._G Type
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
#define SELF PySoy__G_Object*


static char
tp_doc[] = "soy._G Type\n"
"\n"
"    This is a base type for all PySoy types that use a libsoy backend class.\n"
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


static void
tp_dealloc (SELF self) {
    // decref gobject
    if (self->g)
      g_object_unref(self->g);

    // dealloc base type
    PyObject_Del((PyObject*) self);
}


static Py_hash_t
tp_hash (SELF self) {
    return _Py_HashPointer(self->g);
}


static PyObject*
tp_richcompare (PyObject* a, PyObject* b, int op) {
    // Return False if both objects are not based on soy._G
    if (!(PySoy__G_Check(a) && PySoy__G_Check(b)))
        Py_RETURN_FALSE;

    switch (op) {
        case Py_EQ :
            if (((SELF) a)->g == ((SELF) b)->g)
                Py_RETURN_TRUE;
            Py_RETURN_FALSE;

        case Py_NE :
            if (((SELF) a)->g != ((SELF) b)->g)
                Py_RETURN_TRUE;
            Py_RETURN_FALSE;

        default :
            PyErr_SetString(PyExc_TypeError, "Unorderable types");
            return NULL;
    }
}


/////////////////////////////////////////////////////////////////////////////
// Type structs

PyTypeObject PySoy__G_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy._G",                                              // tp_name
    sizeof(PySoy__G_Object),                               // tp_basicsize
    0,                                                     // tp_itemsize
    (destructor) tp_dealloc,                               // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    0,                                                     // tp_repr
    0,                                                     // tp_as_number
    0,                                                     // tp_as_sequence
    0,                                                     // tp_as_mapping
    (hashfunc) tp_hash,                                    // tp_hash
    0,                                                     // tp_call
    0,                                                     // tp_str
    (getattrofunc) 0,                                      // tp_getattro
    (setattrofunc) 0,                                      // tp_setattro
    0,                                                     // tp_as_buffer
    Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE,              // tp_flags
    tp_doc,                                                // tp_doc
    0,                                                     // tp_traverse
    0,                                                     // tp_clear
    tp_richcompare,                                        // tp_richcompare
    0,                                                     // tp_weaklistoffset
    0,                                                     // tp_iter
    0,                                                     // tp_iternext
    0,                                                     // tp_methods
    0,                                                     // tp_members
    0,                                                     // tp_getset
    0,                                                     // tp_base
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

