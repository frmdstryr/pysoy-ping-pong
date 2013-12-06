/*
    PySoy - soy.atoms.Vertex Type
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
#define SELF PySoy_atoms_Vertex_Object*


static char
tp_doc[] = ".. py:class:: Vertex(position, normal, texcoord, tangent)\n"
"\n"
"    This type stores the vertex of an object.\n"
"\n"
"    :param soy.atoms.Position position: position of the vertex\n"
"    :param soy.atoms.Vector normal: normal vector of the vertex\n"
"    :param soy.atoms.Position texcoord: texcoords of the vertex\n"
"    :param soy.atoms.Vector tangent: tangent vector of the vertex\n"
"\n";


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    static char* kw[] = {"position","normal","texcoord","tangent",NULL};
    PySoy_atoms_Position_Object* pos;
    PySoy_atoms_Vector_Object* norm;
    PySoy_atoms_Position_Object* tex;
    PySoy_atoms_Vector_Object* tan;

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "O!O!O!O!", kw,
                                    &PySoy_atoms_Position_Type, &pos,
                                    &PySoy_atoms_Vector_Type, &norm,
                                    &PySoy_atoms_Position_Type, &tex,
                                    &PySoy_atoms_Vector_Type, &tan))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // new gobject
    self->g = soy_atoms_vertex_new(pos->g, norm->g, tex->g, tan->g);

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    char* str;
    PyObject* ret;

    str = g_strdup_printf("<Vertex at (%f, %f, %f)>",
                            soy_atoms_position_get_x(
                                soy_atoms_vertex_get_position(self->g)),
                            soy_atoms_position_get_y(
                                soy_atoms_vertex_get_position(self->g)),
                            soy_atoms_position_get_z(
                                soy_atoms_vertex_get_position(self->g)));
    ret = PyUnicode_FromString(str);

    g_free(str);
    return ret;
}


static PyObject*
tp_str (SELF self) {
    char* str;
    PyObject* ret;

    str = g_strdup_printf("<Vertex at (%f, %f, %f)>",
                            soy_atoms_position_get_x(
                                soy_atoms_vertex_get_position(self->g)),
                            soy_atoms_position_get_y(
                                soy_atoms_vertex_get_position(self->g)),
                            soy_atoms_position_get_z(
                                soy_atoms_vertex_get_position(self->g)));
    ret = PyUnicode_FromString(str);

    g_free(str);
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
        if (soy_atoms_vertex_cmp_eq(c1, c2))
            return Py_True;
    }
    else if (op == Py_NE) {
        if (soy_atoms_vertex_cmp_ne(c1, c2))
            return Py_True;
    }
    else {
        PyErr_SetString(PyExc_NotImplementedError,
                        "only == and != are supported for soy.atoms.Vertex");
        return NULL;
    }
    return Py_False;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
position_doc[] = ".. py:attribute:: position\n"
"\n"
"    :class:`soy.atoms.Position` that the texcoord is at in space\n"
"\n";
PYSOY_PROP_OBJECT_OWNED(atoms, vertex, position, atoms_Position)


static char
normal_doc[] = ".. py:attribute:: normal\n"
"\n"
"    :class:`soy.atoms.Vector` that represents the normal vector\n"
"\n";
PYSOY_PROP_OBJECT_OWNED(atoms, vertex, normal, atoms_Vector)


static char
texcoord_doc[] = ".. py:attribute:: texcoord\n"
"\n"
"    :class:`soy.atoms.Position` that represents the texcoord\n"
"\n";
PYSOY_PROP_OBJECT_OWNED(atoms, vertex, texcoord, atoms_Position)


static char
tangent_doc[] = ".. py:attribute:: tangent\n"
"\n"
"    :class:`soy.atoms.Vector` that represents the tangent vector\n"
"\n";
PYSOY_PROP_OBJECT_OWNED(atoms, vertex, tangent, atoms_Vector)


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(position),
    PYSOY_PROPSTRUCT(normal),
    PYSOY_PROPSTRUCT(texcoord),
    PYSOY_PROPSTRUCT(tangent),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_atoms_Vertex_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.atoms.Vertex",                                    // tp_name
    sizeof(PySoy_atoms_Vertex_Object),                     // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
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
    (reprfunc) tp_str,                                     // tp_str
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

