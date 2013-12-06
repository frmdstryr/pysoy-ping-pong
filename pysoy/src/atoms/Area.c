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
#define SELF PySoy_atoms_Area_Object*


static char
tp_doc[] = ".. py:class:: Area(x1, x2, y1, y2)\n"
"\n"
"    This type stores the area of an object as four floats (x1, y1, x2, y2)\n"
"    which represent two points that define an area.\n"
"\n"
"    Example::\n"
"\n"
"        >>> a = soy.atoms.Area((10, 10, 20, 20))\n"
"        >>> a\n"
"        <Area ((10.000000, 10.000000), (20.000000, 20.000000))>\n"
"        >>> a.x2 += 10\n"
"        >>> a\n"
"        <Area ((10.000000, 10.000000), (30.000000, 20.000000))>\n"
"\n"
"    :param float x1: the x coordinate of the first corner of the area\n"
"    :param float y1: the y coordinate of the first corner of the area\n"
"    :param float x2: the x coordinate of the second corner of the area\n"
"    :param float x2: the x coordinate of the second corner of the area\n"
"\n";


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    float x1, y1, x2, y2;

    // Parse arguments
    if (!PyArg_ParseTuple(args, "(ffff)",
                          &x1,
                          &y1,
                          &x2,
                          &y2))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, NULL);
    if (!self)
        return NULL;

    // new gobject
    self->g = soy_atoms_area_new(x1, y1, x2, y2);

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    char* str;
    PyObject* ret;

    str = g_strdup_printf("<Area ((%f, %f), (%f, %f))>",
                          soy_atoms_area_get_x1(self->g),
                          soy_atoms_area_get_y1(self->g),
                          soy_atoms_area_get_x2(self->g),
                          soy_atoms_area_get_y2(self->g));
    ret = PyUnicode_FromString(str);

    g_free(str);
    return ret;
}


static PyObject*
tp_str (SELF self) {
    char* str;
    PyObject* ret;

    str = g_strdup_printf("<Area ((%f, %f), (%f, %f))>",
                          soy_atoms_area_get_x1(self->g),
                          soy_atoms_area_get_y1(self->g),
                          soy_atoms_area_get_x2(self->g),
                          soy_atoms_area_get_y2(self->g));
    ret = PyUnicode_FromString(str);

    g_free(str);
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
x1_doc[] = ".. py:attribute:: Area.x1\n"
"\n"
"   A float representing the first x coordinate of the area\n";
PYSOY_PROP_FLOAT(atoms, area, x1);


static char
y1_doc[] = ".. py:attribute:: Area.y1\n"
"\n"
"   A float representing the first y coordinate of the area\n";
PYSOY_PROP_FLOAT(atoms, area, y1);


static char
x2_doc[] = ".. py:attribute:: Area.x2\n"
"\n"
"   A float representing the second x coordinate of the area\n";
PYSOY_PROP_FLOAT(atoms, area, x2);


static char
y2_doc[] = ".. py:attribute:: Area.y2\n"
"\n"
"   A float representing the second y coordinate of the area\n";
PYSOY_PROP_FLOAT(atoms, area, y2);


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(x1),
    PYSOY_PROPSTRUCT(y1),
    PYSOY_PROPSTRUCT(x2),
    PYSOY_PROPSTRUCT(y2),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_atoms_Area_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.atoms.Area",                                      // tp_name
    sizeof(PySoy_atoms_Area_Object),                       // tp_basicsize
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
    (reprfunc) tp_str,                                     // tp_str
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

