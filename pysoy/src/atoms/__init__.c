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
m_doc[] = ".. py:module:: Atoms\n"
"\n"
"    This module is a collection of data storage types that are used\n"
"    throughout PySoy.  These types store color, size, value, vertex, etc\n"
"    in a standard form.  Many of these types support math functions such as\n"
"    averaging two colors or adding a size to a point.\n"
"\n"
"    When in doubt, refer to the help() for these types or just experiment!";


static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy.atoms",                       /*m_name*/
    m_doc,                             /*m_doc*/
    0,                                 /*m_size*/
    NULL,                              /*m_methods*/
    NULL,                              /*m_reload*/
    NULL,                              /*m_traverse*/
    NULL,                              /*m_clear*/
    NULL                               /*m_free*/
};


PyMODINIT_FUNC
PyInit_soy_atoms (void) {
    PyObject *module;

    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    // init Area type
    PYSOY_TYPEINIT(atoms, Area);

    // init Axis type
    PYSOY_TYPEINIT(atoms, Axis);

    // init Color type
    PYSOY_TYPEINIT(atoms, Color);
    PYSOY_TYPEINIT_PROP(atoms, color, Color, names,
                        &soy_atoms_color_colormap_get_color,
                        &soy_atoms_color_colormap_set_color,
                        &soy_atoms_color_colormap_check_type);

    // init Face type
    PYSOY_TYPEINIT(atoms, Face);

    // init Morph type
    PYSOY_TYPEINIT(atoms, Morph);

    // init Position type
    PYSOY_TYPEINIT(atoms, Position);

    // init Rotation type
    PYSOY_TYPEINIT(atoms, Rotation);

    // init Size type
    PYSOY_TYPEINIT(atoms, Size);

    // init Vector type
    PYSOY_TYPEINIT(atoms, Vector);

    // init Vertex type
    PYSOY_TYPEINIT(atoms, Vertex);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    module = PyModule_Create(&module_def);

    // add additional pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);


    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    // add Area type
    PYSOY_TYPEADD_G(atoms, area, Area);

    // add Axis type
    PYSOY_TYPEADD_G(atoms, axis, Axis);

    // add Color type
    PYSOY_TYPEADD_G(atoms, color, Color);

    // add Face type
    PYSOY_TYPEADD_G(atoms, face, Face);

    // add Morph type
    PYSOY_TYPEADD_G(atoms, morph, Morph);

    // add Position type
    PYSOY_TYPEADD_G(atoms, position, Position);

    // add Rotation type
    PYSOY_TYPEADD_G(atoms, rotation, Rotation);

    // add Size type
    PYSOY_TYPEADD_G(atoms, size, Size);

    // add Vector type
    PYSOY_TYPEADD_G(atoms, vector, Vector);

    // add Vertex type
    PYSOY_TYPEADD_G(atoms, vertex, Vertex);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "PySoy_atoms: init failed");
        return NULL;
    }

    return module;
}

