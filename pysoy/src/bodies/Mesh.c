/*
    PySoy - soy.bodies.Mesh Type
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
#define SELF PySoy_bodies_Mesh_Object*


static char
tp_doc[] = "soy.bodies.Mesh Type\n"
"\n";
// TODO


static SELF
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    soyatomsPosition* position = NULL;

    // Ensure no keywords were given
    if (!_PyArg_NoKeywords("soy.bodies.Mesh", kwds))
        return NULL;

    // Parse arguments
    // TODO optional position
    if (!PyArg_ParseTuple(args, "")) {
        return NULL;
    }

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
      return NULL;

    // new gobject
    self->g = soy_bodies_mesh_new(position);

    return self;
}


static PyObject*
tp_repr (SELF self) {
    return PyUnicode_FromFormat("<Mesh>");
}


///////////////////////////////////////////////////////////////////////////////
// Sequence methods


static Py_ssize_t
sq_length(SELF self) {
    return (Py_ssize_t) soy_bodies_mesh_get_length(self->g);
}


static PySoy_atoms_Face_Object*
sq_item(SELF self, Py_ssize_t index) {
    PySoy_atoms_Face_Object* ret;

    // check that index is in range
    if (!(index < soy_bodies_mesh_get_length(self->g))){
        PyErr_SetString(PyExc_IndexError, "Mesh index out of range");
        return NULL;
    }

    // generate base object
    ret = (PySoy_atoms_Face_Object*)
          PyType_GenericNew(&PySoy_atoms_Face_Type, NULL, NULL);
    if(!ret){
        PyErr_SetString(PyExc_RuntimeError, "Could not create return object");
        return NULL;
    }

    // set object's self
    ret->g = soy_bodies_mesh_get(self->g, index);

    // increase reference count
    Py_INCREF(ret);
    return ret;
}


static int
sq_ass_item(SELF self, Py_ssize_t index, PySoy_atoms_Face_Object* value) {

    // check value type
    if (!PySoy_atoms_Face_Check(value)) {
        PyErr_SetString(PyExc_TypeError, "value must be soy.atoms.Face");
        return -1;
    }

    // ensure index is in range
    if (!(index < soy_bodies_mesh_get_length(self->g))){
        PyErr_SetString(PyExc_IndexError, "Mesh assignment index out of range");
        return -1;
    }

    // set index to value
    // we have to cast it to GObject* so we can do event handling
    soy_bodies_mesh_set(self->g, index, (GObject*) value->g);

    return 0;
}


///////////////////////////////////////////////////////////////////////////////
// Method Definitions

static PyObject*
append(SELF self, PyObject* args){
    PySoy_atoms_Face_Object* face;
    gint l;

    if (!PyArg_ParseTuple(args, "O!",
                        &PySoy_atoms_Face_Type, &face))
        return NULL;

    // to resize mesh, we get the current length and add 1 to it
    l = soy_bodies_mesh_get_length(self->g);
    soy_bodies_mesh_set_length(self->g, l + (gint) 1);

    // set last face
    sq_ass_item(self, l, face);

    // increase reference count
    Py_INCREF(Py_None);
    return Py_None;
}


static SELF
dp_copy(SELF self) {

    SELF ret;

    // get base object
    ret = (SELF) PyType_GenericNew(&PySoy_bodies_Mesh_Type, NULL, NULL);

    if(!ret){
        PyErr_SetString(PyExc_RuntimeError, "Could not create return object");
        return NULL;
    }

    // set object's self
    ret->g = soy_bodies_mesh_clone(self->g);

    // increase reference count
    Py_INCREF(ret);
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PySequenceMethods tp_as_sequence = {
    (lenfunc) sq_length,                                   // sq_length
    0,                                                     // sq_concat
    0,                                                     // sq_repeat
    (ssizeargfunc) sq_item,                                // sq_item
    0,                                                     // was_sq_slice
    (ssizeobjargproc) sq_ass_item,                         // sq_ass_item
    0,                                                     // was_sq_ass_slice
    0,                                                     // sq_contains
    0,                                                     // sq_inplace_concat
    0,                                                     // sq_inplace_repeat
};


static PyMethodDef tp_methods[] = {
    {"append",                                             // ml_name
     (PyCFunction) append,                                 // ml_meth
     METH_VARARGS,                                         // ml_flags
     "Append a face to the mesh"},                         // ml_doc
    {"clone",                                              // ml_name
     (PyCFunction) dp_copy,                                // ml_meth
     METH_NOARGS,                                          // ml_flags
     "Synonym for __deepcopy__()"},                        // ml_doc
    {"__deepcopy__",                                       // ml_name
     (PyCFunction) dp_copy,                                // ml_meth
     // the argument signature for dp_copy contains no arguments
     // but we have to use METH_VARARGS due to a bug in python
     // the user will use clone = deepcopy(mesh), which is translated to clone = mesh.__deepcopy()__, but only AFTER checking ml_flags
     METH_VARARGS,                                         // ml_flags
     "Performs a deep copy on the mesh\n"                  // ml_doc
    "\n"
    "\n This preserves the vertex data, but changes to the original Face atoms will have no effect on the copy"},
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_bodies_Mesh_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.bodies.Mesh",                                     // tp_name
    sizeof(PySoy_bodies_Mesh_Object),                      // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    0,                                                     // tp_as_number
    &tp_as_sequence,                                       // tp_as_sequence
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
    0,                                                     // tp_getset
    &PySoy_bodies_Body_Type,                               // tp_base
    0,                                                     // tp_dict
    0,                                                     // tp_descr_get
    0,                                                     // tp_descr_set
    0,                                                     // tp_dictoffset
    0,                                                     // tp_init
    0,                                                     // tp_alloc
    (newfunc) tp_new,                                      // tp_new
    0,                                                     // tp_free
    0,                                                     // tp_is_gc
};

