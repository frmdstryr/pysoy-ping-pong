/*
    PySoy - soy.textures.Texture Type
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
#define SELF PySoy_textures_Cubemap_Object*


static char
tp_doc[] = ".. py:class:: Cubemap([pattern[, colors]])\n"
"\n"
"    Cubemap textures are made of 6 2d :py:class:`~soy.textures.Texture`\n"
"    sides arranged in a cube as follows::\n"
"\n"
"                          C--------A                 +y\n"
"                          | +z     |                 |\n"
"                          | |      |                 |____+x\n"
"                          | |___+x |                 /\n"
"                          |  top   |              +z/     E-------G\n"
"        A--------C--------E--------G--------A            /|      /|\n"
"        | +y     | +y     | +y     | +y     |           C-------A |\n"
"        | |      | |      | |      | |      |           | |     | |\n"
"        | |___-x | |___-z | |___+x | |___+z |           | F-----|-H\n"
"        |  front |  left  |  back  |  right |           |/      |/\n"
"        B--------D--------F--------H--------B           D-------B\n"
"                          | -z     |\n"
"                          | |      |\n"
"                          | |___+x |\n"
"                          | bottom |\n"
"                          D--------B\n"
"\n"
"    Unlike other :py:mod:`~soy.textures` classes which use vertex texture\n"
"    coordinates, cubemaps use vertex positions for texture mapping. This\n"
"    results in \"shrink wrapping\" the cubemap faces to body surfaces.\n"
"\n";
// TODO document patterns


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;

    char* pattern = NULL;
    PyObject* py_colorList = NULL;
    soyatomsColor** colorList = NULL;
    int i;
    int size = 0;
    int x = 1;
    int y = 1;
    int z = 1;

    if (!PyArg_ParseTuple(args, "|sOiii",
                          &pattern,
                          &py_colorList,
                          &x, &y, &z))
        return NULL;

    // When a sequence of colors is provided
    if (py_colorList && !PySoy_atoms_Color_Check(py_colorList)) {
        // Ensure its a sequence
        if (!PySequence_Check(py_colorList)) {
            PyErr_SetString(PyExc_TypeError,
                    "second argument must be a sequence of soy.atoms.Color");
            return NULL;
        }

        // Get parameters size
        size = PySequence_Size(py_colorList);
        if (size < 0)
            return NULL;
    }

    if (size > 0) {
        colorList = PyMem_Malloc(sizeof(void*) * size);

        for (i = 0; i < size; i++) {
            PyObject* tempColor = PySequence_GetItem(py_colorList, i);
            if(!PySoy_atoms_Color_Check(tempColor)) {
                PyMem_Free(colorList);
                Py_DECREF(tempColor);
                PyErr_SetString(PyExc_TypeError,
                    "second argument must be a sequence of soy.atoms.Color");
                return NULL;
            }
            colorList[i] = ((PySoy_atoms_Color_Object*) tempColor)->g;
            Py_DECREF(tempColor);
        }
    }

    // When a single color is provided instead
    if (py_colorList != NULL && PySoy_atoms_Color_Check(py_colorList)) {
        printf("b");
        colorList = PyMem_Malloc(sizeof(void*));
        colorList[0] = ((PySoy_atoms_Color_Object*) py_colorList)->g;
        size = 1;
    }

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    if (!pattern)
        self->g = soy_textures_cubemap_new();
    else
        self->g = soy_textures_cubemap_new_pattern(pattern, colorList, size, x, y, z);

    // Cleanup colorList
    if (size > 0)
        PyMem_Free(colorList);

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    gchar* str;
    PyObject* ret;

    // generate "<Cubemap>" string
    str = g_strdup_printf("<Cubemap>");

    // return string as unicode object
    ret = PyUnicode_FromString(str);
    g_free(str);
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
up_doc[] = "Up texture";
PYSOY_PROP_OBJECT(textures, cubemap, up, textures_Texture)


static char
down_doc[] = "Down texture";
PYSOY_PROP_OBJECT(textures, cubemap, down, textures_Texture)

static char
left_doc[] = "Left texture";
PYSOY_PROP_OBJECT(textures, cubemap, left, textures_Texture)

static char
right_doc[] = "Right texture";
PYSOY_PROP_OBJECT(textures, cubemap, right, textures_Texture)

static char
front_doc[] = "Front texture";
PYSOY_PROP_OBJECT(textures, cubemap, front, textures_Texture)

static char
back_doc[] = "Back texture";
PYSOY_PROP_OBJECT(textures, cubemap, back, textures_Texture)


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(up),
    PYSOY_PROPSTRUCT(down),
    PYSOY_PROPSTRUCT(left),
    PYSOY_PROPSTRUCT(right),
    PYSOY_PROPSTRUCT(front),
    PYSOY_PROPSTRUCT(back),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_textures_Cubemap_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.textures.Cubemap",                                // tp_name
    sizeof(PySoy_textures_Cubemap_Object),                 // tp_basicsize
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
    &PySoy_textures_Texture_Type,                          // tp_base
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

