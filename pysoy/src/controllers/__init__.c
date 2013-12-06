/*
    PySoy - soy.controllers module
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
m_doc[] = "soy.controllers module\n"
"\n"
"    This module is a collection of controllers.\n";

static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy.controllers",                                      // m_name
    m_doc,                                                  // m_doc
    0,                                                      // m_size
    NULL,                                                   // m_methods
    NULL,                                                   // m_reload
    NULL,                                                   // m_traverse
    NULL,                                                   // m_clear
    NULL                                                    // m_free
};

PyMODINIT_FUNC
PyInit_soy_controllers(void) {
    PyObject *module;

    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    PYSOY_TYPEINIT(controllers, BaseNavigator);
    PYSOY_TYPEINIT(controllers, Controller);
    PYSOY_TYPEINIT(controllers, GridNavigator);
    PYSOY_TYPEINIT(controllers, Keyboard);
    PYSOY_TYPEINIT(controllers, Pathfollower);
    PYSOY_TYPEINIT(controllers, Pointer);
    PYSOY_TYPEINIT(controllers, SpaceNavigator);
    PYSOY_TYPEINIT(controllers, VirtualController);
    PYSOY_TYPEINIT(controllers, Wiimote);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////

    module = PyModule_Create(&module_def);

    // add additional pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);


    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    PYSOY_TYPEADD_G(controllers, base_navigator, BaseNavigator);
    PYSOY_TYPEADD_G(controllers, controller, Controller);
    PYSOY_TYPEADD_G(controllers, grid_navigator, GridNavigator);
    PYSOY_TYPEADD_G(controllers, keyboard, Keyboard);
    PYSOY_TYPEADD_G(controllers, pathfollower, Pathfollower);
    PYSOY_TYPEADD_G(controllers, pointer, Pointer);
    PYSOY_TYPEADD_G(controllers, space_navigator, SpaceNavigator);
    PYSOY_TYPEADD_G(controllers, virtual_controller, VirtualController);
    PYSOY_TYPEADD_G(controllers, wiimote, Wiimote);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "PySoy_controllers: init failed");
        return NULL;
    }
    else
        return module;
}
