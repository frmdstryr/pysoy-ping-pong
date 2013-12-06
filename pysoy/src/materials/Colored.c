/*
    PySoy - soy.materials.Colored Type
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
#define SELF PySoy_materials_Colored_Object*


static char
tp_doc[] = ".. py:class:: Colored([color_name])\n"
"\n"
"    A colored material allows you to add color to a body.\n"
"    This can be done by utilizing the built in named materials or a named\n"
"    :class:`~soy.atoms.Color` ."
"\n"
"    Example::\n"
"\n"
"        >>> colored = soy.materials.Colored(\"blue\")\n"
"        >>> colored.ambient\n"
"        <Color (0, 0, 255, 255)>\n"
"        >>> colored.specular\n"
"        <Color (0, 0, 255, 255)>\n"
"        >>> colored.diffuse = soy.atoms.Color(\"red\")\n"
"        >>> colored.diffuse\n"
"        <Color (255, 0, 0, 255)>\n"
"        >>> colored.emission\n"
"        <Color (0, 0, 0, 255)>\n"
"        >>> colored.shininess\n"
"        10.0\n"
"        >>> b = soy.bodies.Box()\n"
"        >>> b.material = colored\n"
"        >>> b.material\n"
"        <Colored>\n"
"\n"
"   :param string color_name: name of the builtin color to use\n"
"\n";


static SELF
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    const gchar* name = NULL;

    // Ensure no keywords were provided
    if (!_PyArg_NoKeywords("soy.materials.Colored", kwds))
        return NULL;

    // Parse arguments
    if (!PyArg_ParseTuple(args, "s", &name)) {
        PyErr_Clear();
        if (!PyArg_ParseTuple(args, ""))
            return NULL;
    }

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // new gobject
    self->g = soy_materials_colored_new(name);

    // return self
    return self;
}


static PyObject*
tp_repr (SELF self) {
    return PyUnicode_FromFormat("<Colored>");
}


///////////////////////////////////////////////////////////////////////////////
// Properties

PYSOY_PROP_OBJECT_OWNED(materials, colored, ambient, atoms_Color)
static char
ambient_doc[] = ".. py:attribute:: ambient\n"
"\n"
"   Color of the reflected ambient light which is scattered equally in\n"
"   all directions. Is a :py:class:`~soy.atoms.Color` and defaults\n"
"   to white.\n"
"\n";


PYSOY_PROP_OBJECT_OWNED(materials, colored, diffuse, atoms_Color)
static char
diffuse_doc[] = ".. py:attribute:: diffuse\n"
"\n"
"   Color of the reflected diffuse light which is scattered equally in\n"
"   all directions. Is a :py:class:`~soy.atoms.Color` and defaults\n"
"   to white.\n"
"\n";


PYSOY_PROP_OBJECT_OWNED(materials, colored, specular, atoms_Color)
static char
specular_doc[] = ".. py:attribute:: specular\n"
"\n"
"   Color of the specular reflection which depends on the location of\n"
"   the viewpoint - brightest along the direct angle of reflection. Is\n"
"   a :py:class:`~soy.atoms.Color` and defaults to white.\n"
"\n";

PYSOY_PROP_OBJECT_OWNED(materials, colored, emission, atoms_Color)
static char
emission_doc[] = ".. py:attribute:: emissive\n"
"\n"
"   Simulates light originating from the object. It adds intensity to\n"
"   the object, but is unaffected by light sources and does not\n"
"   introduce additional light into the scene. Is a\n"
"   :py:class:`~soy.atoms.Color` and defaults to a completely\n"
"   transparent color.\n"
"\n";

// TODO
static char
shades_doc[] = ".. py:attribute:: shades\n"
"\n"
"   This property determines how many \"shades\" a face may have:\n"
"       0 == \"smooth\"\n"
"       1 == \"flat\"\n"
"   For a better description of the different types of shading look\n"
"  `here <http://www.khronos.org/opengles/sdk/1.1/docs/man/glShadeModel.xml>`\n"
"   Is an integer and defaults to 0.\n"
"\n"
"    In the future 2+ may be permitted for cell shading effects.\n"
"\n";
// PYSOY_PROP_INT(materials, colored, shades);


//TODO PYSOY_PROP_FLOAT(materials, Colored, shininess);
/*
static char
shininess_doc[] = "Shininess Value\n"
"\n"
"    How large the specular \"dot\" is.\n";
PYSOY_PROP_FLOAT(materials, colored, shininess); */


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(ambient),
    PYSOY_PROPSTRUCT(diffuse),
    PYSOY_PROPSTRUCT(specular),
    PYSOY_PROPSTRUCT(emission),
    //PYSOY_PROPSTRUCT(shades),
    /*PYSOY_PROPSTRUCT(shininess),*/
    {NULL}                                                 // sentinel
};


PyTypeObject PySoy_materials_Colored_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.materials.Colored",                               // tp_name
    sizeof(PySoy_materials_Colored_Object),                // tp_basicsize
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
    &PySoy_materials_Material_Type,                        // tp_base
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

