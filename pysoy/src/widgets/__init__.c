/*
    PySoy - soy.widgets module
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
m_doc[] = ".. py:module:: Widgets\n"
"\n"
"    Widgets are nested 2d rendering areas.  Root level widgets provide\n"
"    access to the windowing layer of a device, ie soy.widgets.Window.\n"
"    There are other container classes which subdivide their available\n"
"    rendering space to children (Container, Box, HBox).\n"
"\n"
"    To render a 3d scene (from soy.scenes) a Projector widget connected\n"
"    to a body in that scene (the camera) needs to be added to the widget\n"
"    tree.  Any body can serve as a camera and the camera can be switched\n"
"    at any time, multiple Projector widgets may be used in the same or\n"
"    different scenes and may be overlapped by placing them all in a\n"
"    Container widget for various effects (HUD, mini-map, etc).\n"
"\n"
"    Other widget classes provide other UI functionality, from rendering\n"
"    a 2d texture to a scrollable text box.  See the help on each class\n"
"    for details on what it provides and how to use it.\n";


static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy.widgets",                     /*m_name*/
    m_doc,                             /*m_doc*/
    0,                                 /*m_size*/
    NULL,                               /*m_methods*/
    NULL,                              /*m_reload*/
    NULL,                              /*m_traverse*/
    NULL,                              /*m_clear*/
    NULL                               /*m_free*/
};

PyMODINIT_FUNC
PyInit_soy_widgets(void) {
    PyObject *module, *dict;

    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    // init Widget type
    PYSOY_TYPEINIT(widgets, Widget);

    // init Canvas type
    PYSOY_TYPEINIT(widgets, Canvas);

    // init Container type
    PYSOY_TYPEINIT(widgets, Container);

    // init HBox type
    PYSOY_TYPEINIT(widgets, HBox);

    // init HBox type
    PYSOY_TYPEINIT(widgets, VBox);

    // init Projector type
    PYSOY_TYPEINIT(widgets, Projector);

    // init Window type
    PYSOY_TYPEINIT(widgets, Window);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    module = PyModule_Create(&module_def);
    dict = PyModule_GetDict(module);

    // add additional pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);


    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    // add Widget type
    PYSOY_TYPEADD_G(widgets, widget, Widget);

    // add Canvas type
    PYSOY_TYPEADD_G(widgets, canvas, Canvas);

    // add Container type
    PYSOY_TYPEADD_G(widgets, container, Container);

    // add HBox type
    PYSOY_TYPEADD_G(widgets, hbox, HBox);

    // add VBox type
    PYSOY_TYPEADD_G(widgets, vbox, VBox);

    // add Projector type
    PYSOY_TYPEADD_G(widgets, projector, Projector);

    // add Window type
    PYSOY_TYPEADD_G(widgets, window, Window);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "PySoy_widgets: init failed");
        return NULL;
    }
    else
        return module;
}

