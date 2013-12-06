/*
    PySoy - soy Module
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
m_doc[] = "soy Package\n"
"\n";


/////////////////////////////////////////////////////////////////////////
// PySoy methods

static char
quit_doc[] = "Terminate the program execution.\n";

static PyObject*
quit(PyObject* self, PyObject* args) {
    /* This signal is caught to terminate all threads */
    raise(15);
    Py_RETURN_NONE;
}

// additional methods above this line in alphabetical order
/////////////////////////////////////////////////////////////////////////


static PyMethodDef m_methods[] = {
    {"quit",
     &quit,
     METH_NOARGS,
     quit_doc},
    {NULL},                                                // sentinel
};


static struct PyModuleDef module_def = {
    PyModuleDef_HEAD_INIT,
    "soy",                                                 // m_name
    m_doc,                                                 // m_doc
    0,                                                     // m_size
    m_methods,                                             // m_methods
    NULL,                                                  // m_reload
    NULL,                                                  // m_traverse
    NULL,                                                  // m_clear
    NULL                                                   // m_free
};


PyMODINIT_FUNC
PyInit_soy(void) {
    PyObject *module, *dict, *sys, *args, *meta_path, *modules, *submodule;

    /////////////////////////////////////////////////////////////////////////
    // Initialize libsoy

    soy_init();
    GPyObject = g_quark_from_string("PyObject");


    /////////////////////////////////////////////////////////////////////////
    // Initialize all types prior to module creation
    //
    //  int PyType_Ready(PyTypeObject*)
    //    Finalize a type object. This should be called on all type objects to
    //    finish their initialization. This function is responsible for adding
    //    inherited slots from a type's base class.
    //    Return 0 on success, or return -1 and sets an exception on error.

    // Note: we can't use the PYSOY_TYPEINIT macro here because this isn't
    // a submodule

    // init _G type
    if (PyType_Ready(&PySoy__G_Type) < 0)
      return NULL;

    // init _GeeIterable type
    if (PyType_Ready(&PySoy__GeeIterable_Type) < 0)
      return NULL;

    // init _GeeMap type
    if (PyType_Ready(&PySoy__GeeMap_Type) < 0)
      return NULL;

    // init _Importer type
    if (PyType_Ready(&PySoy__Importer_Type) < 0)
      return NULL;

    // init Client type
    if (PyType_Ready(&PySoy_Client_Type) < 0)
      return NULL;

    // init Client._ControllerMap type
    if (PyType_Ready(&PySoy_Client__ControllerMap_Type) < 0)
      return NULL;

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////


    module = PyModule_Create(&module_def);
    dict = PyModule_GetDict(module);

    // add additional pydoc strings
    PyModule_AddStringConstant(module, "__credits__", PYSOY_CREDITS);
    PyModule_AddStringConstant(module, "__version__", SOY_VERSION);


    /////////////////////////////////////////////////////////////////////////
    // add each type to the module object

    // Note: we can't use the PYSOY_TYPEADD macro here because this isn't
    // a submodule

    // add _G type
    Py_INCREF(&PySoy__G_Type);
    PyModule_AddObject(module, "_G", (PyObject*) &PySoy__G_Type);

    // add _GeeIterator type
    Py_INCREF(&PySoy__GeeIterable_Type);
    PyModule_AddObject(module, "_GeeIterable",
                       (PyObject*) &PySoy__GeeIterable_Type);

    // add _GeeMap type
    Py_INCREF(&PySoy__GeeMap_Type);
    PyModule_AddObject(module, "_GeeMap", (PyObject*) &PySoy__GeeMap_Type);
    g_type_set_qdata(soy_atoms_color_colormap_get_type (), GPyObject,
                     &PySoy__GeeMap_Type);

    // add _Importer type
    Py_INCREF(&PySoy__Importer_Type);
    PyModule_AddObject(module, "_Importer", (PyObject*) &PySoy__Importer_Type);

    // add Client type
    Py_INCREF(&PySoy_Client_Type);
    PyModule_AddObject(module, "Client", (PyObject*) &PySoy_Client_Type);

    // add Client._ControllerMap type
    Py_INCREF(&PySoy_Client__ControllerMap_Type);
    PyMapping_SetItemString(PySoy_Client_Type.tp_dict, "_ControllerMap",
                            (PyObject*) &PySoy_Client__ControllerMap_Type);

    // additional types above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////
    // initialize each submodule and add it to this module's namespace

    sys = PyImport_ImportModule("sys");
    modules = PyDict_GetItemString(PyModule_GetDict(sys), "modules");

    // Module Add Macro
    #define PYSOY_MODULEADD(n) \
        submodule  = PyInit_soy_ ##n ();\
        if (!PyModule_AddObject(module, #n, submodule))\
            PyDict_SetItemString(modules, "soy." #n, submodule);\
        else {\
            Py_DECREF(sys);\
            return NULL;\
        }

    // soy.atoms
    PYSOY_MODULEADD(atoms);

    // soy.bodies
    PYSOY_MODULEADD(bodies);

    //soy.controllers
    PYSOY_MODULEADD(controllers);

    // soy.fields
    PYSOY_MODULEADD(fields);

    // soy.joints
    PYSOY_MODULEADD(joints);

    // soy.materials
    PYSOY_MODULEADD(materials);

    // soy.scenes
    PYSOY_MODULEADD(scenes);

    // soy.textures
    PYSOY_MODULEADD(textures);

    // soy.widgets
    PYSOY_MODULEADD(widgets);

    // additional modules above this line in alphabetical order
    /////////////////////////////////////////////////////////////////////////
    // add soy._Importer to sys.meta_path

    args = Py_BuildValue("(z)", NULL);

    meta_path = PyDict_GetItemString(PyModule_GetDict(sys), "meta_path");
    PyList_Append(meta_path, PyObject_Call((PyObject*) &PySoy__Importer_Type,
                                           args, NULL));

    Py_DECREF(args);
    Py_DECREF(sys);

    if (PyErr_Occurred()) {
        PyErr_SetString(PyExc_ImportError, "soy: module init failed");
        return NULL;
    }

    return module;
}

