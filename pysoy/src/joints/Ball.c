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
#define SELF PySoy_joints_Ball_Object*


static char
tp_doc[] = ".. py:class:: Ball(src, dst, anchor[, material])\n"
"\n"
"    Ball joints connect one or two bodies such that they maintain distance\n"
"    specified anchor point. When connected to a scene the anchor point is\n"
"    fixed to the scene, where with two bodies the anchor point can move.\n"
"\n"
"    Example::\n"
"\n"
"        >>> s = soy.scenes.Scene()\n"
"        >>> b = soy.bodies.Body(s)\n"
"        >>> b2 = soy.bodies.Body(s)\n"
"        >>> j = soy.joints.Ball(b, b2, soy.atoms.Position((1, 2, 3))\n"
"        >>> j\n"
"        <Ball Joint>\n"
"        >>> j = soy.joints.Ball(b, s, soy.atoms.Position((1, 2, 3))\n"
"        >>> j\n"
"        <Ball Joint>\n"
"\n"
"    :param src: source connection\n"
"    :type src: :class:`~soy.bodies.Body`\n"
"    :param dst: destination connection\n"
"    :type dst: :class:`~soy.bodies.Body` or :class:`~soy.scenes.Scene`\n"
"    :param anchor: anchor point for ball/socket\n"
"    :type anchor: :class:`~soy.atoms.Position`\n"
"    :param material: joint will be rendered when set\n"
"    :type material: :class:`~soy.materials.Material` or None\n"
"\n";


static PyObject*
tp_new(PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;

    soyscenesScene* scene;
    PySoy_scenes_Scene_Object* pyscene;
    PySoy_bodies_Body_Object* bodyOne;
    PySoy_bodies_Body_Object* bodyTwo;
    PySoy_atoms_Position_Object* anchor;
    PySoy_materials_Material_Object* py_material = NULL;
    soymaterialsMaterial* material;
    static char* kw[] = {"bodyA", "bodyB", "anchor", "material", NULL};

    if(PyArg_ParseTupleAndKeywords(args, kwds, "O!O!O!|O!", kw,
                         &PySoy_bodies_Body_Type, &bodyOne,
                         &PySoy_bodies_Body_Type, &bodyTwo,
                         &PySoy_atoms_Position_Type, &anchor,
                         &PySoy_materials_Material_Type, &py_material))
        scene = bodyTwo->g->scene;
    else {
        static char* kw[] = {"body", "scene", "anchor", "material", NULL};
        bodyTwo = NULL;
        PyErr_Clear();
        if (PyArg_ParseTupleAndKeywords(args, kwds, "O!O!O!|O!", kw,
            &PySoy_bodies_Body_Type, &bodyOne,
            &PySoy_scenes_Scene_Type, &pyscene,
            &PySoy_atoms_Position_Type, &anchor,
            &PySoy_materials_Material_Type, &py_material)) {
            scene = pyscene->g;
        }
        else
            return NULL;
    }

    // Grab material
    material = (py_material) ? py_material->g : NULL;

    // Ensure bodies are in the same scene
    if (bodyOne->g->scene != scene) {
        PyErr_SetString(PyExc_ValueError, "Bodies must be in the same scene");
        return NULL;
    }

    self = (SELF) PyType_GenericNew(type, args, NULL);

    if(!self)
        return NULL;

    if(!bodyTwo)
        self->g = soy_joints_ball_new(bodyOne->g, NULL,
                                      anchor->g,
                                      material);
    else
        self->g = soy_joints_ball_new(bodyOne->g, bodyTwo->g,
                                      anchor->g,
                                      material);


    return (PyObject*) self;
}


static PyObject*
tp_repr(SELF self) {
    PyObject* ret;

    ret = PyUnicode_FromFormat("<Ball Joint>");

    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Properties
static char anchor_doc[] = ".. py:attribute:: Ball.anchor\n"
"\n"
"    The :class:`~soy.atoms.Position` of the joint's ball/socket.\n"
"\n"
"    When connected to two bodies this will float respective both bodies,\n"
"    but when connecting a body to its scene this will remain fixed.\n"
"\n";
PYSOY_PROP_OBJECT_OWNED(joints, ball, anchor, atoms_Position);


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(anchor),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_joints_Ball_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.joints.Ball",                                     // tp_name
    sizeof(PySoy_joints_Ball_Object),                      // tp_basicsize
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

