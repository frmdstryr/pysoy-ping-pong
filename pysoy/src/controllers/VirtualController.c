/*
    PySoy - soy.controllers.VirtualController
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
#define SELF PySoy_controllers_VirtualController_Object*

static char
tp_doc[] = "soy.controllers.VirtualController Type\n"
"\n"
"   This is the base class for Virtual Controllers.\n"
"\n";
//TODO Add documentation


static PyObject*
tp_new (PyTypeObject *type, PyObject *args, PyObject *kwds) {
    SELF self;
    static char* kw[] = {"scene", NULL};
    PySoy_scenes_Scene_Object* scene;

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "O!", kw,
                                     &PySoy_scenes_Scene_Type, &scene))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
      return NULL;

    // new gobject
    self->g = soy_controllers_virtual_controller_new(scene->g);

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (PyObject* self) {
    PyObject *result;

    result = PyUnicode_FromFormat("<VirtualController>");

    return result;
}


///////////////////////////////////////////////////////////////////////////////
// Type structs

static char 
finished_doc[] = "Whether or not the controller is finished";
PYSOY_PROP_BOOL_RO(controllers, virtual_controller, finished);
#define finished_setter NULL

static char
registered_doc[] = "Whether or not this controller is registered with scene";
PYSOY_PROP_BOOL(controllers, virtual_controller, registered);

static PyMethodDef tp_methods[] = {
    {NULL, NULL}
};

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(finished),
    PYSOY_PROPSTRUCT(registered),
    {NULL}
};


PyTypeObject PySoy_controllers_VirtualController_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.controllers.VirtualController",                   // tp_name
    sizeof(PySoy_controllers_VirtualController_Object),    // tp_basicsize
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
    tp_methods,                                            // tp_methods
    0,                                                     // tp_members
    tp_getset,                                             // tp_getset
    &PySoy_controllers_Controller_Type,                    // tp_base
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
