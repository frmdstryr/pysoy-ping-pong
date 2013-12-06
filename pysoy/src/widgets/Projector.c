/*
    PySoy - soy.widgets.Projector Type
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
#define SELF PySoy_widgets_Projector_Object*


static char
tp_doc[] = ".. py:class:: Projector(camera) \n"
"\n"
"    Instances of this class are used to project, as if to a movie screen,\n"
"    the output of a soy.bodies.Camera to a 2d area of a Window.\n"
"\n"
"    The camera property can be changed at any time to switch the rendering\n"
"    perspective to a different position.  Setting the camera property to\n"
"    None disables rendering.\n"
"\n"
"    :param soy.bodies.Camera camera: the projected camera \n"
"\n";


static SELF
tp_new (PyTypeObject* type, PyObject* args,
                             PyObject* kwds) {
    SELF self;
    PySoy_bodies_Camera_Object* camera;
    static char* kw[] = {"camera", NULL};

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "O!", kw,
                                     &PySoy_bodies_Camera_Type, &camera))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
      return NULL;

    // new gobject
    self->g = soy_widgets_projector_new(camera->g);

    // return self
    return self;
}


static PyObject*
tp_repr (SELF self) {
    return PyUnicode_FromFormat("<Projector>");
}


///////////////////////////////////////////////////////////////////////////////
// Properties

PYSOY_PROP_OBJECT(widgets, projector, camera, bodies_Camera)
static char
camera_doc[] = ".. py:attribute:: camera \n"
"\n"
"Camera object or none \n"
"\n"
"Defaults to none \n"
"\n";


PYSOY_PROP_OBJECT(widgets, widget, size, atoms_Size)
static char
size_doc[] = ".. py:attribute:: size \n"
"\n"
"Projector size \n"
"\n";


///////////////////////////////////////////////////////////////////////////////
// Type structs


static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(camera),
    PYSOY_PROPSTRUCT(size),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_widgets_Projector_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.widgets.Projector",                               // tp_name
    sizeof(PySoy_widgets_Projector_Object),                // tp_basicsize
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
    &PySoy_widgets_Widget_Type,                            // tp_base
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
