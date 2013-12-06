/*
    PySoy - soy.textures.Heightmap Type
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
#define SELF PySoy_textures_Heightmap_Object*


static char
tp_doc[] = ".. py:class:: Heightmap()\n";

static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    GError* error = NULL;
    const gchar* filename = NULL;
    gboolean png=0;

    // Ensure no keywords were provided
    if (!_PyArg_NoKeywords("soy.textures.Heightmap", kwds))
        return NULL;

    // Parse arguments
    if (!PyArg_ParseTuple(args, "s", &filename)) {
        PyErr_Clear();
        if (!PyArg_ParseTuple(args, "")) {
            return NULL;
        }
    }

    if (filename) {
        png = g_str_has_suffix(filename, ".png");

        if (!png) {
            PyErr_SetString(PyExc_ValueError, "Unrecognized mime-type");
            return NULL;
        }
    }

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // new gobject for PNG file
    if (png)
        self->g = soy_textures_heightmap_new_from_png(filename, &error);
    // new gobject
    else
        self->g = soy_textures_heightmap_new();

     // Check if error is raised (FILE_NOT_FOUND)
    if (error != NULL) {
        if(error->domain == IO_ERROR) {
            PyErr_SetString(PyExc_IOError, error->message);
        }
        else if (error->domain == MEMORY_ERROR) {
            PyErr_SetString(PyExc_MemoryError, error->message);
        }
        else {
            PyErr_SetString(PyExc_Exception, error->message);
        }
        g_clear_error (&error);
        return NULL;
    }

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    gchar* str;
    PyObject* ret;

    // generate "<Heightmap>" string
    str = g_strdup_printf("<Heightmap>");

    // return string as unicode object
    ret = PyUnicode_FromString(str);
    g_free(str);
    return ret;
}

///////////////////////////////////////////////////////////////////////////////
// Sequence Methods

static Py_ssize_t
sq_length(SELF self) {
    soyatomsSize* size;
    float width, height;

    size = soy_textures_texture_get_size(((PySoy_textures_Texture_Object*) self)->g);
    width = soy_atoms_size_get_width(size);
    height = soy_atoms_size_get_height(size);
    g_object_unref(size);

    return (Py_ssize_t) (width * height);
}


static PyObject*
sq_item(SELF self, Py_ssize_t index) {
    int g = soy_textures_heightmap_get(self->g, index);
    PyObject* ret;

    // Raise exception if -1 was returned
    if (g == -1) {
        PyErr_SetString(PyExc_IndexError, "Heightmap index out of range");
        return NULL;
    }

    ret = PyLong_FromLong((long) g);

    // Raise exception if new int object couldn't be created
    if (!ret) {
        PyErr_SetString(PyExc_RuntimeError, "Could not create return object");
        return NULL;
    }

    return ret;
}


//Set a specific give soyatomsColor at a given index in the texture
static int
sq_ass_item(SELF self, Py_ssize_t index, PyObject* value) {
    soyatomsSize* size;
    int val = 0;

    // Ensure value is a Color
    if (!PyLong_Check(value)) {
        PyErr_SetString(PyExc_TypeError, "value must be int");
        return -1;
    }

    // Ensure index is in range
    size = soy_textures_texture_get_size(((PySoy_textures_Texture_Object*) self)->g);
    if (index < 0 || index >=
        soy_atoms_size_get_width(size)*soy_atoms_size_get_height(size)) {
        g_object_unref(size);
        PyErr_SetString(PyExc_IndexError, "Heightmap index out of range");
        return -1;
    }
    g_object_unref(size);

    // get int value from PyObject*
    val = (int) PyLong_AsLong(value);

    // check if val is in range [0-255]
    if (val < 0 || val > 255) {
        PyErr_SetString(PyExc_ValueError, "value must be in range [0-255]");
        return -1;
    }

    // Set texel using backend set function
    soy_textures_heightmap_set(self->g, index, val);
    return 0;
}

///////////////////////////////////////////////////////////////////////////////
// Properties

static char
channels_doc[] = ".. py:attribute:: channels\n"
"\n"
"    Number of Channels - always 1\n";
PYSOY_PROP_FLOAT_RO(textures, texture, channels)
#define channels_setter NULL

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PySequenceMethods tp_as_sequence = {
    (lenfunc) sq_length,                                   // sq_length
    0,                                                     // sq_concat
    0,                                                     // sq_repeat
    (ssizeargfunc) sq_item,                                // sq_item
    0,                                                     // was_sq_slice
    (ssizeobjargproc) sq_ass_item,                         // sq_ass_item
    0,                                                     // was_sq_ass_slice
    0,                                                     // sq_contains
    0,                                                     // sq_inplace_concat
    0,                                                     // sq_inplace_repeat
};

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(channels),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_textures_Heightmap_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.textures.Heightmap",                              // tp_name
    sizeof(PySoy_textures_Heightmap_Object),               // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    0,                                                     // tp_as_number
    &tp_as_sequence,                                       // tp_as_sequence
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

