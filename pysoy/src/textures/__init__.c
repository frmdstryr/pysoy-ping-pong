/*
    PySoy - soy.textures module
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
m_doc[] = "soy.textures module\n"
"\n";


static PyMethodDef m_methods[] = {
    {NULL, NULL}
};


static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy.textures",                                        // m_name
    m_doc,                                                 // m_doc
    0,                                                     // m_size
    m_methods,                                             // m_methods
    NULL,                                                  // m_reload
    NULL,                                                  // m_traverse
    NULL,                                                  // m_clear
    NULL                                                   // m_free
};


PyMODINIT_FUNC
PyInit_soy_textures(void) {
    PyObject *module, *dict;

    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    // init Texture type
    PYSOY_TYPEINIT(textures, Texture);

    // init Cubemap type
    PYSOY_TYPEINIT(textures, Cubemap);

    // init Bumpmap type
    PYSOY_TYPEINIT(textures, Bumpmap);

    // init Heightmap type
    PYSOY_TYPEINIT(textures, Heightmap);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    module = PyModule_Create(&module_def);
    dict = PyModule_GetDict(module);
    
    // add additional pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);


    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    // add Texture type
    PYSOY_TYPEADD_G(textures, texture, Texture);

    // add Cubemap type
    PYSOY_TYPEADD_G(textures, cubemap, Cubemap);

    // add Bumpmap type
    PYSOY_TYPEADD_G(textures, bumpmap, Bumpmap);

    // add Heightmap type
    PYSOY_TYPEADD_G(textures, heightmap, Heightmap);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "PySoy_textures: init failed");
        return NULL;
    }
    else
        return module;
}

