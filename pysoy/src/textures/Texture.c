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
#define SELF PySoy_textures_Texture_Object*


static char
tp_doc[] = ".. py:class:: Texture([name])\n"
"\n"
"    A PySoy texture is an OpenGL texture.\n"
"    A texture is a type that contains one or more images that all have\n"
"    the same image format.\n"
"    It can be used as a render target (for exapmle from soy.widgets.Canvas\n"
"    or CameraBody)\n"
"\n"
"    A texture is accessed like a list of soy.atoms.Color type\n"
"    Indexing a texture with Texture[x] will always return a\n"
"    soy.atoms.Color (or raise an exception because x is out of bounds)\n"
"\n";
// TODO


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    const gchar* filename = NULL;
    GError* error = NULL;
    gboolean png=0, svg=0, svgstr=0;

    char* pattern = NULL;
    PyObject* py_colorList = NULL;
    soyatomsColor** colorList = NULL;
    int i;
    int size = 0;
    int x = 1;
    int y = 1;

    // Ensure no keywords were provided
    if (!_PyArg_NoKeywords("soy.textures.Texture", kwds))
        return NULL;

    // Parse arguments
    if (!PyArg_ParseTuple(args, "s", &filename)) {
        PyErr_Clear();
        if (!PyArg_ParseTuple(args, "|sOii", &pattern, &py_colorList, &x, &y)) {
            PyErr_Clear();
            if (!PyArg_ParseTuple(args, ""))
                return NULL;
        }
    }

    if (filename) {
        png = g_str_has_suffix(filename, ".png");
        svg = (g_str_has_suffix(filename, ".svg") ||
               g_str_has_suffix(filename, ".sgk"));
        svgstr = g_str_has_prefix(filename, "<");
        if (!(png || svg || svgstr)) {
            PyErr_SetString(PyExc_ValueError, "Unrecognized mime-type");
            return NULL;
        }
    }
    else if (pattern && py_colorList) {
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
        if (size != 2 && size != 4) {
            PyErr_SetString(PyExc_TypeError,
                    "second argument must be of length 2 or 4");
            return NULL;
        }

        colorList = PyMem_Malloc(sizeof(void*) * size);

        for (i = 0; i < size; i++) {
            PyObject* tempColor = PySequence_GetItem(py_colorList, i);
            if(!PySoy_atoms_Color_Check(tempColor)) {
                PyMem_Free(colorList);
                Py_DECREF(tempColor);
                Py_DECREF(self);
                PyErr_SetString(PyExc_TypeError,
                    "second argument must be a sequence of soy.atoms.Color");
                return NULL;
            }
            colorList[i] = ((PySoy_atoms_Color_Object*) tempColor)->g;
            Py_DECREF(tempColor);
        }
    }

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
      return NULL;

    // new gobject for PNG file
    if (png)
        self->g = soy_textures_texture_new_from_png(filename, &error);

    // new gobject for SVG/SGK file
    else if (svg)
        self->g = soy_textures_texture_new_from_svg(filename, &error);

    // new gobject for SVG string
    else if (svgstr)
        self->g = soy_textures_texture_new_from_svg_string((guint8 *) filename,
                                                           strlen(filename),
                                                           &error);

    // new pattern gobject
    else if (pattern)
        self->g = soy_textures_texture_new_pattern(pattern, colorList, size,
                                                   x, y, 0);

    // new gobject
    else
        self->g = soy_textures_texture_new();

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

    // generate "<Texture>" string
    str = g_strdup_printf("<Texture>");

    // return string as unicode object
    ret = PyUnicode_FromString(str);
    g_free(str);
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Number Methods

// TODO


///////////////////////////////////////////////////////////////////////////////
// Sequence Methods

static Py_ssize_t
sq_length(SELF self) {
    soyatomsSize* size;
    float width, height;

    size = soy_textures_texture_get_size(self->g);
    width = soy_atoms_size_get_width(size);
    height = soy_atoms_size_get_height(size);
    g_object_unref(size);

    return (Py_ssize_t) (width * height);
}


static PyObject*
sq_item(SELF self, Py_ssize_t index) {
    soyatomsColor* g = soy_textures_texture_get(self->g, index);
    PyObject* ret;

    // Raise exception if NULL was returned
    if (!g) {
        PyErr_SetString(PyExc_IndexError, "Texture index out of range");
        return NULL;
    }

    ret = PyType_GenericNew(&PySoy_atoms_Color_Type, NULL, NULL);

    // Raise exception if new Color object couldn't be created
    if (!ret) {
        PyErr_SetString(PyExc_RuntimeError, "Could not create return object");
        return NULL;
    }

    // Set backend storage and return
    ((PySoy_atoms_Color_Object*) ret)->g = g;
    return ret;
}


//Set a specific give soyatomsColor at a given index in the texture
static int
sq_ass_item(SELF self, Py_ssize_t index, PyObject* value) {
    soyatomsSize* size;

    // Ensure value is a Color
    if (!PySoy_atoms_Color_Check(value)) {
        PyErr_SetString(PyExc_TypeError, "value must be soy.atoms.Color");
        return -1;
    }

    // Ensure index is in range
    size = soy_textures_texture_get_size(self->g);
    if (index < 0 || index >=
        soy_atoms_size_get_width(size)*soy_atoms_size_get_height(size)) {
        g_object_unref(size);
        PyErr_SetString(PyExc_IndexError, "Texture index out of range");
        return -1;
    }
    g_object_unref(size);

    // Set texel using backend set function
    soy_textures_texture_set(self->g, index,
                             (GObject*)((PySoy_atoms_Color_Object*) value)->g);
    return 0;
}


///////////////////////////////////////////////////////////////////////////////
// General Methods

// TODO


///////////////////////////////////////////////////////////////////////////////
// Properties

// TODO animate

static char
aspect_doc[] = ".. py:attribute:: aspect\n"
"\n"
"    The aspect ratio is a float of width/height, eg, 1.333 for 4:3.\n";
PYSOY_PROP_FLOAT_RO(textures, texture, aspect)
#define aspect_setter NULL


static char
channels_doc[] = ".. py:attribute:: channels\n"
"\n"
"    Number of Channels (L, LA, RGB, or RGBA)\n";
PYSOY_PROP_FLOAT(textures, texture, channels)


static char
size_doc[] = ".. py:attribute:: size\n"
"\n"
"    This is the :py:class:`~soy.atoms.Size` of the texture, the depth\n"
"    parameter is ignored.\n";
PYSOY_PROP_OBJECT(textures, texture, size, atoms_Size)


static char
smooth_doc[] = ".. py:attribute:: smooth\n"
"\n"
"    This boolean property controls whether texels which are rendered\n"
"    larger than a single pixel are scaled up with smooth transition. If\n"
"    False, pixels will rendered will use the nearest texel value.\n"
"\n"
"    This property defaults to True.\n";
PYSOY_PROP_BOOL(textures, texture, smooth)


static char
wrap_doc[] = ".. py:attribute:: wrap\n"
"\n"
"    This boolean property controls whether texture coordinates wrap.\n"
"\n"
"    If False, texture coordinates less than 0.0 and greater than 1.0 are\n"
"    clamped to the edges. This can be used to clean up edge artifacts.\n"
"\n"
"    If True, texture coordinates less than 0.0 wrap to 1.0 which results\n"
"    in smoother transitions when a texture is repeated.\n"
"\n"
"    This property defaults to True.\n"
"\n";
PYSOY_PROP_BOOL(textures, texture, wrap)


///////////////////////////////////////////////////////////////////////////////
// Type structs


// TODO numer methods

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


static PyMethodDef tp_methods[] = {
    // TODO
    {NULL},                                                // sentinel
};


static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(aspect),
    PYSOY_PROPSTRUCT(channels),
    PYSOY_PROPSTRUCT(size),
    PYSOY_PROPSTRUCT(smooth),
    PYSOY_PROPSTRUCT(wrap),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_textures_Texture_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.textures.Texture",                                // tp_name
    sizeof(PySoy_textures_Texture_Object),                 // tp_basicsize
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
    tp_methods,                                            // tp_methods
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

