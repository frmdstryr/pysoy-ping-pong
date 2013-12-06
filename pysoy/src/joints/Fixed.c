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
#define SELF PySoy_joints_Fixed_Object*


static char
tp_doc[] = ".. py:class:: Fixed(src, dst[, material])\n"
"\n"
"    Fixed joints maintain a relative position and orientation between two\n"
"    bodies or a body to its scene.\n"
"\n"
"    Example::\n"
"\n"
"        >>> s = soy.scenes.Scene()\n"
"        >>> s['b'] = soy.bodies.Body()\n"
"        >>> s['b2'] = soy.bodies.Body()\n"
"        >>> j = soy.joints.Fixed(s['b'], s['b2'])\n"
"        >>> j\n"
"        <Fixed Joint>\n"
"        >>> j = soy.joints.Fixed(s['b'], s)\n"
"        >>> j\n"
"        <Fixed Joint>\n"
"\n"
"    :param src: source connection\n"
"    :type src: :class:`~soy.bodies.Body`\n"
"    :param dst: destination connection\n"
"    :type dst: :class:`~soy.bodies.Body` or :class:`~soy.scenes.Scene`\n"
"    :param material: joint will be rendered when set\n"
"    :type material: :class:`~soy.materials.Material` or None\n"
"\n";


static PyObject*
tp_new(PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;

    PySoy_bodies_Body_Object* py_bodyA;
    PySoy_bodies_Body_Object* py_bodyB;
    PySoy_materials_Material_Object* py_material = NULL;
    soyscenesScene* scene;
    soybodiesBody* bodyB;
    soymaterialsMaterial* material;
    static char* kw[] = {"bodyA", "bodyB", "material", NULL};

    if (!PyArg_ParseTupleAndKeywords(args, kwds, "O!O|O!", kw,
            &PySoy_bodies_Body_Type, &py_bodyA,
            &py_bodyB,
            &PySoy_materials_Material_Type, &py_material))
        return NULL;

    // When bodyB is a Body
    if (PyObject_TypeCheck(py_bodyB, &PySoy_bodies_Body_Type)) {
        scene = py_bodyB->g->scene;
        bodyB = py_bodyB->g;
    }

    // When bodyB is a Scene
    else if (PyObject_TypeCheck(py_bodyB, &PySoy_scenes_Scene_Type)) {
        scene = ((PySoy_scenes_Scene_Object*) py_bodyB)->g;
        bodyB = NULL;
    }

    // Otherwise raise exception
    else {
        PyErr_SetString(PyExc_ValueError,
                        "Second argument must be a Body or Scene");
        return NULL;
    }

    // Ensure bodies are in the same scene
    if (py_bodyA->g->scene != scene) {
        PyErr_SetString(PyExc_ValueError, "Scene mismatch");
        return NULL;
    }

    // Grab material
    material = (py_material) ? py_material->g : NULL;

    // Inherit base type
    self = (SELF) PyType_GenericNew(type, args, NULL);
    if(!self)
        return NULL;

    // Create gobject and return
    self->g = soy_joints_fixed_new(py_bodyA->g, bodyB, material);
    return (PyObject*) self;
}


static PyObject*
tp_repr(SELF self) {
    PyObject* ret;

    ret = PyUnicode_FromFormat("<Fixed Joint>");

    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_joints_Fixed_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.joints.Fixed",                                    // tp_name
    sizeof(PySoy_joints_Fixed_Object),                     // tp_basicsize
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
    &PySoy_joints_Joint_Type,                              // tp_base
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

