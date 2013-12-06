/*
    PySoy - soy.scenes.Planar Type
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
#define SELF PySoy_scenes_Planar_Object*


static char
tp_doc[] = ".. py:class:: Planar([offset[, step[, material]]])\n"
"\n"
"    This is a simple scene with an infinite flat floor which objects can\n"
"    fall to and rest on.\n"
"\n";


static SELF
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    float offset = 0.0f;
    int step = 10;
    PySoy_materials_Material_Object* py_material = NULL;
    soymaterialsMaterial* material;

    static char* kw[] = {"offset", "step", "material", NULL};

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "|fiO!", kw,
            &offset,
            &step,
            &PySoy_materials_Material_Type, &py_material))
        return NULL;

    // Grab optional material gobject
    material = (py_material) ? py_material->g : NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // new gobject
    self->g = soy_scenes_planar_new(offset, step, material);

    return self;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
material_doc[] = ".. py:attribute:: material\n"
"\n"
"    This :py:class:`~soy.materials.Material` is used to render the floor.\n";
PYSOY_PROP_OBJECT(scenes, planar, material, materials_Material)

static char
scale_doc[] = "Texcoord Scale";
PYSOY_PROP_FLOAT(scenes, planar, scale);

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(material),
    PYSOY_PROPSTRUCT(scale),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_scenes_Planar_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.scenes.Planar",                                   // tp_name
    sizeof(PySoy_scenes_Planar_Object),                    // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    0,                                                     // tp_repr
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
    tp_getset,                                             // tp_getset
    &PySoy_scenes_Scene_Type,                              // tp_base
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

