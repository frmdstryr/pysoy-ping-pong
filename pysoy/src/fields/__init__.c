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
m_doc[] = "soy.fields module\n"
"\n"
"   This module is a collection of fields that are used to affect scenes";

static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy.fields",                      /*m_name*/
    m_doc,                             /*m_doc*/
    0,                                 /*m_size*/
    NULL,                              /*m_methods*/
    NULL,                              /*m_reload*/
    NULL,                              /*m_traverse*/
    NULL,                              /*m_clear*/
    NULL                               /*m_free*/
};

PyMODINIT_FUNC
PyInit_soy_fields (void) {
    PyObject *module;

    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    // init Accelerate type
    PYSOY_TYPEINIT(fields, Accelerate);

    // init Buoyancy type
    PYSOY_TYPEINIT(fields, Buoyancy);

    // init Field type
    PYSOY_TYPEINIT(fields, Field);

    // init Monopole type
    PYSOY_TYPEINIT(fields, Monopole);

    // init Shockwave type
    PYSOY_TYPEINIT(fields, Shockwave);

    // init Wind type
    PYSOY_TYPEINIT(fields, Wind);

    module = PyModule_Create(&module_def);

    // add extra pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);

    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    PYSOY_TYPEADD_G(fields, accelerate, Accelerate);
    PYSOY_TYPEADD_G(fields, buoyancy, Buoyancy);
    PYSOY_TYPEADD_G(fields, field, Field);
    PYSOY_TYPEADD_G(fields, monopole, Monopole);
    PYSOY_TYPEADD_G(fields, shockwave, Shockwave);
    PYSOY_TYPEADD_G(fields, wind, Wind);

    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "PySoy_fields: init failed");
        return NULL;
    }

    return module;
}

