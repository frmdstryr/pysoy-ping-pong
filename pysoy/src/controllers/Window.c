/*
    PySoy - soy.controllers.Pointer
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
#define SELF PySoy_controllers_Window_Object*


typedef struct {
    PyObject_HEAD

} PySoy_controllers_Window_Object;


static char
tp_doc[] = "soy.controllers.Window Type\n"
"\n";
//TODO


static SELF
tp_new (PyTypeObject* type, PyObject* args,
                              PyObject* kwds) {
    PySoy_controllers_Window_Object* self;
    static char* kw[] = {"window" , NULL};
    PySoy_widgets_Window_Object* window;

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "O!", kw,
                                     &PySoy_widgets_Window_Type, &window))
            return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args,
                                                                kwds);

    if (!self)
        return NULL;

    return self;
}


static PyObject*
tp_repr (PySoy_controllers_Window_Object* self) {
    PyObject* repr;
    repr = PyUnicode_FromFormat("<Window Controller>");
    return repr;
}


///////////////////////////////////////////////////////////////////////////////
// Type structs

PyTypeObject PySoy_controllers_Window_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.controllers.Window",                              // tp_name
    sizeof(PySoy_controllers_Window_Object),               // tp_basicsize
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
    (newfunc) tp_new,                                      // tp_new
    0,                                                     // tp_free
    0,                                                     // tp_is_gc
};
