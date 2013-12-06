/*
    PySoy - soy._Importer Type
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
#define SELF PySoy__Importer_Object*


static char
tp_doc[] = "soy._Importer Type\n"
"\n"
"    This is a Python importer hook class.  It is added to sys.path_hooks\n"
"    when PySoy is imported to handle importing .soy archives.\n"
"\n"
"    It has little use for the end user.\n";


static int
tp_init (SELF self, PyObject* args, PyObject* kwds) {
    char* path;

    // Ensure no keywords were provided
    if (!_PyArg_NoKeywords("soy._Importer", kwds))
        return -1;

    // parse args
    if (!PyArg_ParseTuple(args, "z:soy._Importer", &path))
        return -1;

    // Duplicate path string so we can safely use it later
    self->path = g_strdup(path);

    // return
    return 0;
}


static void
tp_dealloc (SELF self) {

    // Free path string that we duplicated in _init
    g_free(self->path);

    // delete object
    PyObject_Del(self);
}


static PyObject*
tp_repr (PyObject* this) {
    SELF self = (SELF) this;
    gchar* str;
    PyObject* ret;
    char* path;

    // generate "<Importer for [URI]>" string
    str = g_strdup_printf("<PySoy Importer for \"%s\">", self->path);

    // return string as unicode object after freeing strings
    ret = PyUnicode_FromString(str);
    g_free(str);
    return ret;
}


/////////////////////////////////////////////////////////////////////////////
// Internal Functions

static char*
name_to_path (char* base, char* fullname) {
    // This function converts a dotted module name to an absolute path
    char* relpath;
    char* abspath;
    GFile* basefile;
    GFile* pathfile;
    gchar** array;
    int i = 0;

    // grab only fullname after last "." since path is already in base
    array = g_strsplit(fullname, ".", -1); // needs to be free'd
    while(array[i] != NULL) i++;
    relpath = array[i-1];

    basefile = g_file_new_for_path(base);
    pathfile = g_file_resolve_relative_path(basefile, relpath);
    abspath = g_file_get_parse_name(pathfile);

    g_strfreev(array);
    g_object_unref(basefile);
    g_object_unref(pathfile);
    return abspath;
}


static GFile*
get_ext (char* abspath, char* ext) {
    // This adds the ext to abspath and checks to see if that file exists,
    // and if so returns the GFile* for it
    char* extpath;
    GFile* extfile;
    int ret;

    // Combine the two paths.
    extpath = g_strdup_printf("%s%s", abspath, ext);

    // Get a file object for it.
    extfile = g_file_parse_name(extpath);
    g_free(extpath);
    //printf("%s\n", g_file_get_parse_name(extfile)); // DEBUG

    // Either return a GFile or NULL
    if (g_file_query_exists(extfile, NULL))
        return extfile;
    else {
        g_object_unref(extfile);
        return NULL;
    }
}


static int
check_ext (char* abspath, char* ext) {
    GFile* extfile;
    extfile = get_ext(abspath, ext);

    if (extfile) {
        g_object_unref(extfile);
        return 1;
    }
    return 0;
}

/////////////////////////////////////////////////////////////////////////////
// Methods

static PyObject*
find_module (SELF self, PyObject* args, PyObject* kwds) {
    char* fullname;
    PyObject* path = NULL;
    char* abspath;
    PyObject* ret = Py_None;
    static char* kw[] = {"fullname", "path", NULL};

    if (!PyArg_ParseTupleAndKeywords(args, kwds,
                                     "s|O:soy._Importer.find_module", kw,
                                     &fullname, &path))
        return NULL;

    // If path is None but the absolute path was provided to __init__
    if (path == Py_None && self->path) {
        // Get the absolute path for the fullname
        abspath = name_to_path(self->path, fullname);

        // Check for .soy module or package
        if (check_ext(abspath, ".soy") ||
            check_ext(abspath, "/__init__.soy")) {
            ret = (PyObject*) self;
        }

        // Cleanup
        g_free(abspath);
    }

    // We need to search through a number of paths to find the module
    else {
        int i;
        Py_ssize_t path_size;

        // If path is None, use sys.path instead
        if (path == Py_None) {
            PyObject* sys;
            sys = PyImport_ImportModule("sys");
            path = PyDict_GetItemString(PyModule_GetDict(sys), "path");
            Py_DECREF(sys);
        }

        // Get path size for iterating
        path_size = PySequence_Size(path);

        // Iterate path, checking each for the module
        for (i=0; i<path_size; i++) {
            PyObject* u_path;   // Python string of path
            PyObject* b_path;   // Python bytes of path

            // Get unicode string
            u_path = PySequence_GetItem(path, i);
            if (!u_path) return NULL;

            // Decode it to bytes
            b_path = PyUnicode_AsEncodedString(u_path, "utf-8", "strict");
            if (!b_path) {
                Py_DECREF(u_path);
                return NULL;
            }

            // Get the absolute path for the fullname
            abspath = name_to_path(PyBytes_AsString(b_path), fullname);

            // Check for .soy module or package
            if (check_ext(abspath, ".soy") ||
                check_ext(abspath, "/__init__.soy")) {
                PyObject* args = Py_BuildValue("(O)", u_path);
                ret = PyObject_Call((PyObject*) &PySoy__Importer_Type, args,
                                     NULL);
                Py_DECREF(args);
            }

            // Cleanup
            g_free(abspath);
            Py_DECREF(b_path);
            Py_DECREF(u_path);
        }
    }

    // incref and return
    Py_INCREF(ret);
    return ret;
}


static PyObject*
load_module (SELF self, PyObject* args) {
    char* fullname;
    char* abspath;
    char* filename;
    int ispkg = 0;
    PyObject* module;
    PyObject* dict;

    // Parse arguments, we don't allow keywords as per MethodDef entry
    if (!PyArg_ParseTuple(args, "s:soy._Importer.load_module", &fullname))
        return NULL;

    // Get the absolute path for the fullname, this needs to be free'd
    abspath = name_to_path(self->path, fullname);

    if (check_ext(abspath, ".soy")) {
        // This is a .soy module
        filename = g_strdup_printf("%s%s", abspath, ".py");
    }
    else if (check_ext(abspath, "/__init__.soy")) {
        // This is a .soy package
        ispkg = 1;
        filename = g_strdup_printf("%s%s", abspath, "/__init__.py");
    }
    else {
        // Don't know what happened, raise ImportError.
        g_free(abspath);
        PyErr_SetString(PyExc_ImportError,"not a .soy module or package");
        return NULL;
    }

    // Create an empty module object
    module = PyImport_AddModule(fullname);
    if (!module) {
        g_free(abspath);
        g_free(filename);
        return NULL;
    }
    dict = PyModule_GetDict(module);

    // Set self to module.__loader__
    PyDict_SetItemString(dict, "__loader__", (PyObject *)self);

    // if this is a package, set __path__
    if (ispkg) {
        PyObject* path_list = PyList_New(1);
        PyObject* py_abspath = PyUnicode_FromString(abspath);

        PyList_SetItem(path_list, 0, py_abspath);
        PyDict_SetItemString(dict, "__path__", path_list);
    }

    // TODO Parse table of contents, create objects, store in a local HashMap

    /////////////////////////////////////////////////////////////////////////
    // No Python code in this block
    Py_BEGIN_ALLOW_THREADS

    // TODO Process chapter 1+ of .soy file using local HashMap

    Py_END_ALLOW_THREADS
    /////////////////////////////////////////////////////////////////////////

    // Cleanup and return
    g_free(abspath);
    g_free(filename);
    return module;
}


/////////////////////////////////////////////////////////////////////////////
// Properties

static PyObject*
path_getter (SELF self, void* closure) {
    PyObject* ret;
    char* path;

    // return string as unicode object after freeing path string
    ret = PyUnicode_FromString(self->path);
    return ret;
}


/////////////////////////////////////////////////////////////////////////////
// Type structs

static PyMethodDef tp_methods[] = {
    {"find_module",                                        // ml_name
     (PyCFunction) find_module,                            // ml_meth
     METH_VARARGS | METH_KEYWORDS,                         // ml_flags
     "Find a .soy module or package"},                     // ml_doc
    {"load_module",                                        // ml_name
     (PyCFunction) load_module,                            // ml_meth
     METH_VARARGS,                                         // ml_flags
     "Load a .soy module or package"},                     // ml_doc
    {NULL},                                                // sentinel
};


static PyGetSetDef tp_getset[] = {
    {"path",                                               // name
     (getter) path_getter,                                 // getter
     NULL,                                                 // setter
     "Importer path",                                      // doc
     NULL},                                                // closure
    {NULL},                                                // sentinel
};


PyTypeObject PySoy__Importer_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy._Importer",                                       // tp_name
    sizeof(PySoy__Importer_Object),                        // tp_basicsize
    0,                                                     // tp_itemsize
    (destructor) tp_dealloc,                               // tp_dealloc
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
    tp_methods,                                            // tp_methods
    0,                                                     // tp_members
    tp_getset,                                             // tp_getset
    0,                                                     // tp_base
    0,                                                     // tp_dict
    0,                                                     // tp_descr_get
    0,                                                     // tp_descr_set
    0,                                                     // tp_dictoffset
    (initproc) tp_init,                                    // tp_init
    PyType_GenericAlloc,                                   // tp_alloc
    PyType_GenericNew,                                     // tp_new
    PyObject_GC_Del,                                       // tp_free
    0,                                                     // tp_is_gc
};

