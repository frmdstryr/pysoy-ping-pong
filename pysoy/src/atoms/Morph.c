/*
    PySoy - soy.atoms.Morph Type
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
#define SELF PySoy_atoms_Morph_Object*


static char
tp_doc[] = ".. py:class:: Morph(seed, variant [, delta])\n"
"\n"
"    This atom represents the difference between one mesh (seed) and a\n"
"    different mesh with the same number of faces (variant).\n"
"\n"
"    The resultant matrix is multiplied by delta\n"
"    (a value between 0.0 and 1.0) and can be added to a\n"
"    :class:`soy.models.Target`\n"
"\n"
"    During rendering, a Target will apply all its morphs recursively."
"\n"
"    :param soy.bodies.Mesh seed: The base mesh to be applied\n"
"    :param soy.bodies.Mesh variant: The differing mesh to get a delta from\n"
"    :param float delta: delta ratio for morph\n"
"\n";


static SELF
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds){
    SELF self;
    PySoy_bodies_Mesh_Object* seed;
    PySoy_bodies_Mesh_Object* variant;
    float delta;
    static char* kw[] = {"seed","variant","delta",NULL};

    if(!PyArg_ParseTupleAndKeywords(args, kwds, "O!O!|f", kw,
                                    &PySoy_bodies_Mesh_Type, &seed,
                                    &PySoy_bodies_Mesh_Type, &variant,
                                    &delta))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if(!self)
        return NULL;

    // new gobject
    if(delta)
        self->g = soy_atoms_morph_new_with_delta(seed->g, variant->g, delta);
    else
        self->g = soy_atoms_morph_new(seed->g, variant->g);

    return self;
}


static PyObject*
tp_repr (SELF self){
    char* str;
    PyObject* ret;

    // PyUnicode_FromFormat doesn't have float support
    str = g_strdup_printf("<Morph at %f>", soy_atoms_morph_get_delta(self->g));
    ret = PyUnicode_FromString(str);

    // return the PyObject
    g_free(str);
    Py_INCREF(ret);
    return ret;

}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
delta_doc[] = ".. py:attribute:: delta\n"
"\n"
"   A Morph atom is a matrix of vertex transformations that will be\n"
"   added to a Mesh. Each element of the matrix is multiplied by\n"
"   the delta ratio before being added.\n"
"\n";
PYSOY_PROP_FLOAT(atoms, morph, delta);


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(delta),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_atoms_Morph_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.atoms.Morph",                                     // tp_name
    sizeof(PySoy_atoms_Morph_Object),                      // tp_basicsize
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
    tp_getset,                                             // tp_getset
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

