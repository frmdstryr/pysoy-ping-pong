/*
    PySoy - soy.bodies.Camera Type
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
#define SELF PySoy_bodies_Camera_Object*


static char
tp_doc[] = ".. py:class:: Camera([position, radius])\n"
"\n"
"    A camera is an invisible object in 3d space through which the scene can\n"
"    be rendered.  It must be attached to a :class:`soy.widgets.Projector`\n"
"    or other rendering class to be activated::\n"
"\n"
"        >>> room = soy.scenes.Room(3.0)\n"
"        >>> cam = soy.bodies.Camera(room)\n"
"        >>> client = soy.Client() # doctest:+SKIP\n"
"        >>> projector = soy.widgets.Projector(client.window, cam) # doctest:+SKIP\n"
"\n"
"    The first line creates a scene called room.\n"
"    The second line creates a Camera inside the scene called cam.\n"
"    The third line creates a local Client called client.\n"
"    The forth line creates a Projector that projects the image from cam on\n"
"    to the window of the client.\n"
"    To project an image with a Projector, you need a Widget such as a\n"
"    window to project it on, and a Camera.\n"
"\n"
"    A camera can be used by multiple output objects at the same time.\n"
"    You can move the Camera like any other body.\n"
"    For example:\n"
"    room['cam'].position.z = 15\n"
"    This moves the Camera's coordinate z to 15\n"
"    Like other bodies, Camera can also have physics applied to it; such as\n"
"    velocity.\n"
"    Unlike other bodies, however, Camera do not effect other bodies when\n"
"    they collide.\n"
"    The position of the camera will specify where the scene will be viewed\n"
"    from.\n"
"\n"
":param position: The X,Y,Z position of the camera \n"
":type position: soy.atoms.Position\n"
"\n";


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    PyObject* py_position = NULL;
    soyatomsPosition* position = NULL;
    float x, y, z;
    float radius = 1.0f;
    static char* kw[] = {"position", "radius", NULL};

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(
            args, kwds, "|Of", kw,
            &py_position, &radius))
        return NULL;

    // Parse py_position if its neither NULL or a Position type
    if (py_position) {
        if (PySoy_atoms_Position_Check(py_position)) {
            position = (soyatomsPosition*) ((PySoy__G_Object*) py_position)->g;
            g_object_ref(position);
        }
        else {
            if (!PyArg_ParseTuple(py_position, "fff", &x, &y, &z)) {
                // TODO set appropriate error
                return NULL;
            }
            position = soy_atoms_position_new(x, y, z);
        }
    }

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
      return NULL;

    // new gobject
    self->g = soy_bodies_camera_new(position, radius);

    // unref position
    if (position) g_object_unref(position);

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    PyObject* ret;

    ret = PyUnicode_FromFormat("<Camera>"); // TODO position etc

    // return string as unicode object
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
lens_doc[] = "..py:attribte:: Lens(len) \n"
"Camera Lens\n"
"\n"
":param len: This is the (vertical) angle which the lens can view.\n"
"Defaults to 45.0\n"
":type len: float \n"
"\n";
PYSOY_PROP_FLOAT(bodies, camera, lens)


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(lens),
    {NULL}                                                 // sentinel
};


PyTypeObject PySoy_bodies_Camera_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.bodies.Camera",                                   // tp_name
    sizeof(PySoy_bodies_Camera_Object),                    // tp_basicsize
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
    &PySoy_bodies_Body_Type,                               // tp_base
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

