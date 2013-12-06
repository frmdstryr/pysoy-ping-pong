/*
    PySoy - soy.atoms module
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

static char
m_doc[] = ".. py:module:: Joints\n"
"\n"
"   This module is a collection of joints that are used to connect bodies\n"
"   in the same scene or a scene with a body. They can be used to create\n"
"   complex structures from smaller bodies. Each joint has an anchor point\n"
"   in the scene. Each joint also can take either one body and a scene as \n"
"   an argumnent or two bodies.\n";

static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy.joints",                      /*m_name*/
    m_doc,                             /*m_doc*/
    0,                                 /*m_size*/
    NULL,                              /*m_methods*/
    NULL,                              /*m_reload*/
    NULL,                              /*m_traverse*/
    NULL,                              /*m_clear*/
    NULL                               /*m_free*/
};

PyMODINIT_FUNC
PyInit_soy_joints (void) {
    PyObject* module;

    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    // init Ball Type
    PYSOY_TYPEINIT(joints, Ball);

    // init Fixed Type
    PYSOY_TYPEINIT(joints, Fixed);

    // init Hinge Type
    PYSOY_TYPEINIT(joints, Hinge);

    // init Hinge2 Type
    PYSOY_TYPEINIT(joints, Hinge2);

    // init Joint Type
    PYSOY_TYPEINIT(joints, Joint);

    // init Piston Type
    PYSOY_TYPEINIT(joints, Piston);

    // init Plane2D Type
    //PYSOY_TYPEINIT(joints, Plane2D);

    // init Slider Type
    PYSOY_TYPEINIT(joints, Slider);

    // init Universal Type
    PYSOY_TYPEINIT(joints, Universal);

    module = PyModule_Create(&module_def);

    // add extra pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);

    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    PYSOY_TYPEADD_G(joints, ball, Ball);
    PYSOY_TYPEADD_G(joints, fixed, Fixed);
    PYSOY_TYPEADD_G(joints, hinge, Hinge);
    PYSOY_TYPEADD_G(joints, hinge2, Hinge2);
    PYSOY_TYPEADD_G(joints, joint, Joint);
    PYSOY_TYPEADD_G(joints, piston, Piston);
    //PYSOY_TYPEADD_G(joints, plane2d, Plane2D);
    PYSOY_TYPEADD_G(joints, slider, Slider);
    PYSOY_TYPEADD_G(joints, universal, Universal);

    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "PySoy_joints: init failed");
        return NULL;
    }

    return module;
}

