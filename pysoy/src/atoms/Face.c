/*
    PySoy - soy.atoms.Face Type
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
#define SELF PySoy_atoms_Face_Object*


static char
tp_doc[] = ".. py:class:: Face(a, b, c, material)\n"
"\n"
"    This type stores the face of an object as three vertices and a material\n"
"\n"
"    :param soy.atoms.Vertex a: The first vertex that describes the face\n"
"    :param soy.atoms.Vertex b: The second vertex that describes the face\n"
"    :param soy.atoms.Vertex c: The third vertex that describes the face\n"
"    :param soy.materials.Material material: material the face uses\n"
"\n";


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    static char* kw[] = {"a","b","c","material",NULL};
    PySoy_atoms_Vertex_Object* a;
    PySoy_atoms_Vertex_Object* b;
    PySoy_atoms_Vertex_Object* c;
    PySoy_materials_Material_Object* mat = NULL;

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "O!O!O!|O!", kw,
                                    &PySoy_atoms_Vertex_Type, &a,
                                    &PySoy_atoms_Vertex_Type, &b,
                                    &PySoy_atoms_Vertex_Type, &c,
                                    &PySoy_materials_Material_Type, &mat))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // new gobject
    if (mat)
        self->g = soy_atoms_face_new_with_material(a->g, b->g, c->g, mat->g);
    else
        self->g = soy_atoms_face_new(a->g, b->g, c->g);

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    PyObject* ret;

    ret = PyUnicode_FromFormat("<Face at %p>", self);

    return ret;
}


static PyObject*
tp_richcompare (PyObject *left, PyObject *right, int op) {
    GObject* c1 = NULL;
    GObject* c2 = NULL;

    if (!PySoy__G_Check(left) || !PySoy__G_Check(right))
        return Py_False;

    c1 = ((PySoy__G_Object*) left)->g;
    c2 = ((PySoy__G_Object*) right)->g;

    if (op == Py_EQ) {
        if (soy_atoms_face_cmp_eq(c1, c2))
            return Py_True;
    }
    else if (op == Py_NE) {
        if (soy_atoms_face_cmp_ne(c1, c2))
            return Py_True;
    }
    else {
        PyErr_SetString(PyExc_NotImplementedError,
                        "only == and != are supported for soy.atoms.Face");
        return NULL;
    }
    return Py_False;
}


///////////////////////////////////////////////////////////////////////////////
// Sequence Methods

static Py_ssize_t
sq_length(SELF self) {
    return 3;
}


static PySoy_atoms_Vertex_Object*
sq_item(SELF self, Py_ssize_t index) {
    PySoy_atoms_Vertex_Object* ret;

    if (index >= 0 && index <= 2) {

        //allocate vertex object
        ret = (PySoy_atoms_Vertex_Object*)
              PyType_GenericNew(&PySoy_atoms_Vertex_Type, NULL, NULL);
        if(!ret)
            //should really through an error here
            return NULL;

        // new vertex
        ret->g = soy_atoms_face_get(self->g, index);

        //return the vertex object
        return ret;
    }
    else {
        PyErr_SetString(PyExc_IndexError, "Face index out of range");
        return NULL;
    }
}


static int
sq_ass_item(SELF self, Py_ssize_t index, PySoy_atoms_Vertex_Object* value) {
    // Ensure value is a number
    if (!PySoy_atoms_Vertex_Check(value)) {
        PyErr_SetString(PyExc_TypeError, "value must be soy.atoms.Vertex");
        return -1;
    }

    if (index >= 0 && index <= 2)
        soy_atoms_face_set(self->g, index, value->g);
    else {
        PyErr_SetString(PyExc_IndexError,
                        "Face assignment index out of range");
        return -1;
    }
    return 0;
}


//TODO -- write a setter, there is no setter defined in libsoy, so we cannot
// implement one here


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
material_doc[] = ".. py:attribute:: material\n"
"\n"
"    :class:`soy.materials.Material` with which the face is rendered.\n"
"\n";
PYSOY_PROP_OBJECT(atoms, face, material, materials_Material)


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(material),
    {NULL},                                                // sentinel
};


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


PyTypeObject PySoy_atoms_Face_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.atoms.Face",                                      // tp_name
    sizeof(PySoy_atoms_Face_Object),                       // tp_basicsize
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
    (reprfunc) tp_repr,                                    // tp_str
    (getattrofunc) 0,                                      // tp_getattro
    (setattrofunc) 0,                                      // tp_setattro
    0,                                                     // tp_as_buffer
    Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE,              // tp_flags
    tp_doc,                                                // tp_doc
    0,                                                     // tp_traverse
    0,                                                     // tp_clear
    tp_richcompare,                                        // tp_richcompare
    0,                                                     // tp_weaklistoffset
    0,                                                     // tp_iter
    0,                                                     // tp_iternext
    0,                                                     // tp_methods
    0,                                                     // tp_members
    tp_getset,                                             // tp_getset
    &PySoy__G_Type,                                        // tp_base
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

