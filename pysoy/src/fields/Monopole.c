/*
  PySoy - soy.atoms.Area Type
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

#define SELF PySoy_fields_Monopole_Object*

static char
tp_doc[] = "soy.fields.Monopole Type\n"
"\n"
"   Monopoles are invisible fields that either attract or repulse other \n"
"   bodies in the entire scene based on an inverse square law";

static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;

    PySoy_scenes_Scene_Object* scene;

    if(!PyArg_ParseTuple(args, "",
                         &PySoy_scenes_Scene_Type))
        return NULL;

    self = (SELF) PyType_GenericNew(type, args, NULL);

    if(!self)
        return NULL;

    self->g = soy_fields_monopole_new();

    return (PyObject*) self;
}

static PyObject*
tp_repr(SELF self) {
    char* str;
    PyObject* ret;

    str = g_strdup_printf("<Monopole with multiplier %f>",
                          soy_fields_monopole_get_multiplier(self->g));
    ret = PyUnicode_FromString(str);

    g_free(str);

    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
multiplier_doc[] = "Multipliers of the monopoles force";
PYSOY_PROP_FLOAT(fields, monopole, multiplier);

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(multiplier),
    {NULL},                     // sentinel
};

PyTypeObject PySoy_fields_Monopole_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.fields.Monopole",                                 // tp_name
    sizeof(PySoy_fields_Monopole_Object),                  // tp_basicsize
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
    (reprfunc) tp_repr,                                    // tp_str
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
    tp_getset,                                             // tp_getset
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

