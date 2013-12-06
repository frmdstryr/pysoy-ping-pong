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

#define SELF PySoy_fields_Shockwave_Object*

static char
tp_doc[] = "soy.fields.Shockwave Type\n"
"\n"
"   Shockwave fields model a constant-rate expanding shockwave";

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

    self->g = soy_fields_shockwave_new();

    return (PyObject*) self;
}

static PyObject*
tp_repr(SELF self) {
    char* str;
    PyObject* ret;

    str = g_strdup_printf("<Shockwave with swvel %f, energy %f, radius %f, length %f>",
                          soy_fields_shockwave_get_swvel(self->g),
                          soy_fields_shockwave_get_energy(self->g),
                          soy_fields_shockwave_get_radius(self->g),
                          soy_fields_shockwave_get_length(self->g));
    ret = PyUnicode_FromString(str);

    g_free(str);

    return ret;
}

///////////////////////////////////////////////////////////////////////////////
// Properties

static char swvel_doc[] = "velocity of the shockwave in m/s";
PYSOY_PROP_FLOAT(fields, shockwave, swvel);

static char energy_doc[] = "energy of the shockwave in joules";
PYSOY_PROP_FLOAT(fields, shockwave, energy);

static char radius_doc[] = "effective radius of the shockwave";
PYSOY_PROP_FLOAT(fields, shockwave, radius);

static char length_doc[] = "thickness of the shockwave";
PYSOY_PROP_FLOAT(fields, shockwave, length);

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(swvel),
    PYSOY_PROPSTRUCT(energy),
    PYSOY_PROPSTRUCT(radius),
    PYSOY_PROPSTRUCT(length),
    {NULL},                         // sentinel
};

PyTypeObject PySoy_fields_Shockwave_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.fields.Shockwave",                                // tp_name
    sizeof(PySoy_fields_Shockwave_Object),                 // tp_basicsize
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

