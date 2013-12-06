/*
    PySoy - soy.atoms.Rotation Type
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
#define SELF PySoy_atoms_Rotation_Object*


static char
tp_doc[] = ".. py:class:: Rotation(alpha, beta [, gamma = 0.0])\n"
"\n"
"    This type stores the rotation of an object as three floats\n"
"    (alpha, beta, gamma) measured in radians.\n"
"\n"
"    Wherever a Rotation may be used, a sequence of 2 or 3 items may be used\n"
"    instead.  This is primarily a return value which modifies the object\n"
"    that created it when changed.\n"
"\n"
"    Example::\n"
"\n"
"       >>> rotation = soy.atoms.Rotation(1, 3.14, 2)\n"
"       >>> rotation\n"
"       (1, 3.14, 2)\n"
"\n"
"    :param float alpha: angle of rotation in radians\n"
"    :param float beta: angle of rotation in radians\n"
"    :param float gamma: angle of rotation in radians\n"
"\n";
//"    If window.rotation returned a plain list changing one of its items\n"
//"    would not move the window by itself, you would instead have to:\n"
//"        window.rotation = (window.rotation[0] += 10, window.rotation[1], 0)\n"
//"\n"
//"    You may use the latter syntax if you prefer it, but its slower and not\n"
//"    as readable.  Embracing this little magic will make your code happier.\n"
//"\n";


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    float a, b, c = 0;

    // Ensure no keywords were given
    if (!_PyArg_NoKeywords("soy.atoms.Rotation", kwds));

    // Try to parse 2 or 3 dimensions
    if (!PyArg_ParseTuple(args, "(ff)", &a, &b)) {
        PyErr_Clear();
        if (!PyArg_ParseTuple(args, "(fff)", &a, &b, &c))
            return NULL;
    }

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // new gobject
    self->g = soy_atoms_rotation_new(a, b, c);

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    char* str;
    PyObject* ret;

    // We can't use PyUnicode_FromFormat because it doesn't support floats
    str = g_strdup_printf("<Rotation (%f, %f, %f)>",
                          soy_atoms_rotation_get_alpha(self->g),
                          soy_atoms_rotation_get_beta (self->g),
                          soy_atoms_rotation_get_gamma(self->g));
    ret = PyUnicode_FromString(str);

    // Free str and return
    g_free(str);
    return ret;
}


static PyObject*
tp_str (SELF self) {
    char* str;
    PyObject* ret;

    // We can't use PyUnicode_FromFormat because it doesn't support floats
    str = g_strdup_printf("(%f, %f, %f)",
                          soy_atoms_rotation_get_alpha(self->g),
                          soy_atoms_rotation_get_beta (self->g),
                          soy_atoms_rotation_get_gamma(self->g));
    ret = PyUnicode_FromString(str);

    // Free str and return
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
        if (soy_atoms_rotation_cmp_eq(c1, c2))
            return Py_True;
    }
    else if (op == Py_NE) {
        if (soy_atoms_rotation_cmp_ne(c1, c2))
            return Py_True;
    }
    else {
        PyErr_SetString(PyExc_NotImplementedError,
                        "only == and != are supported for soy.atoms.Rotation");
        return NULL;
    }
    return Py_False;
}


///////////////////////////////////////////////////////////////////////////////
// Number Methods

static PyObject*
nb_add (PyObject* o1, PyObject* o2) {
    float o1x = 0, o1y = 0, o1z = 0;
    float o2x = 0, o2y = 0, o2z = 0;
    PyObject *args, *result;
    PySoy_atoms_Rotation_Object *so1, *so2;

    // parse object 1
    if (PyLong_Check(o1)) {
        o1x = o1y = o1z = PyLong_AsDouble(o1);
    }
    else if (PyFloat_Check(o1)) {
        o1x = o1y = o1z = PyFloat_AsDouble(o1);
    }
    else if (PySoy_atoms_Rotation_Check(o1)) {
        so1 = (PySoy_atoms_Rotation_Object*)o1;
        o1x = soy_atoms_rotation_get_alpha(so1->g);
        o1y = soy_atoms_rotation_get_beta(so1->g);
        o1z = soy_atoms_rotation_get_gamma(so1->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // parse object 2
    if (PyLong_Check(o2)) {
        o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2x = soy_atoms_rotation_get_alpha(so2->g);
        o2y = soy_atoms_rotation_get_beta(so2->g);
        o2z = soy_atoms_rotation_get_gamma(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // build args with calculated values
    args = Py_BuildValue("((fff))", o1x + o2x, o1y + o2y, o1z + o2z);

    // create result object
    result = tp_new(&PySoy_atoms_Rotation_Type, args, NULL);

    // decref args tuple and tmp
    Py_DECREF(args);

    // return calculated result
    return result;
}


static PyObject*
nb_subtract (PyObject* o1, PyObject* o2) {
    float o1x = 0, o1y = 0, o1z = 0;
    float o2x = 0, o2y = 0, o2z = 0;
    PyObject *args, *result;
    PySoy_atoms_Rotation_Object *so1, *so2;

    // parse object 1
    if (PyLong_Check(o1)) {
        o1x = o1y = o1z = PyLong_AsDouble(o1);
    }
    else if (PyFloat_Check(o1)) {
        o1x = o1y = o1z = PyFloat_AsDouble(o1);
    }
    else if (PySoy_atoms_Rotation_Check(o1)) {
        so1 = (PySoy_atoms_Rotation_Object*)o1;
        o1x = soy_atoms_rotation_get_alpha(so1->g);
        o1y = soy_atoms_rotation_get_beta(so1->g);
        o1z = soy_atoms_rotation_get_gamma(so1->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // parse object 2
    if (PyLong_Check(o2)) {
        o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2x = soy_atoms_rotation_get_alpha(so2->g);
        o2y = soy_atoms_rotation_get_beta(so2->g);
        o2z = soy_atoms_rotation_get_gamma(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // build args with calculated values
    args = Py_BuildValue("((fff))", o1x - o2x, o1y - o2y, o1z - o2z);

    // create result object
    result = tp_new(&PySoy_atoms_Rotation_Type, args, NULL);

    // decref args tuple and tmp
    Py_DECREF(args);

    // return calculated result
    return result;
}


static PyObject*
nb_multiply (PyObject* o1, PyObject* o2) {
    double o1x, o1y, o1z = 0;
    double o2x, o2y, o2z = 0;
    PyObject *args, *result;
    PySoy_atoms_Rotation_Object *so1, *so2;

    // parse object 1
    if (PyLong_Check(o1)) {
        o1x = o1y = o1z = PyLong_AsDouble(o1);
    }
    else if (PyFloat_Check(o1)) {
        o1x = o1y = o1z = PyFloat_AsDouble(o1);
    }
    else if (PySoy_atoms_Rotation_Check(o1)) {
        so1 = (PySoy_atoms_Rotation_Object*)o1;
        o1x = soy_atoms_rotation_get_alpha(so1->g);
        o1y = soy_atoms_rotation_get_beta(so1->g);
        o1z = soy_atoms_rotation_get_gamma(so1->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // parse object 2
    if (PyLong_Check(o2)) {
        o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2x = soy_atoms_rotation_get_alpha(so2->g);
        o2y = soy_atoms_rotation_get_beta(so2->g);
        o2z = soy_atoms_rotation_get_gamma(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // build args with calculated values
    args = Py_BuildValue("((fff))", o1x * o2x, o1y * o2y, o1z * o2z);

    // create result object
    result = tp_new(&PySoy_atoms_Rotation_Type, args, NULL);

    // decref args tuple
    Py_DECREF(args);

    // return calculated result
    return result;
}


static PyObject*
nb_inplace_add (PyObject* this, PyObject* o2) {
    SELF self = (SELF) this;
    double o2x, o2y, o2z = 0;
    PySoy_atoms_Rotation_Object *so2;

    // parse object 2
    if (PyLong_Check(o2)) {
        o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2x = soy_atoms_rotation_get_alpha(so2->g);
        o2y = soy_atoms_rotation_get_beta(so2->g);
        o2z = soy_atoms_rotation_get_gamma(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // increment self object's x,y by the other object's x,y FIXME comment
    soy_atoms_rotation_set_alpha(self->g,
                                 soy_atoms_rotation_get_alpha(self->g) + o2x);
    soy_atoms_rotation_set_beta(self->g,
                                soy_atoms_rotation_get_beta(self->g) + o2y);
    soy_atoms_rotation_set_gamma(self->g,
                                 soy_atoms_rotation_get_gamma(self->g) + o2z);

    // incref self before returning
    Py_INCREF(this);

    // return self object with the new calculated values
    return this;
}


static PyObject*
nb_inplace_subtract (PyObject* this, PyObject* o2) {
    SELF self = (SELF) this;
    double o2x, o2y, o2z = 0;
    PySoy_atoms_Rotation_Object *so2;

    // parse object 2
    if (PyLong_Check(o2)) {
        o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2x = soy_atoms_rotation_get_alpha(so2->g);
        o2y = soy_atoms_rotation_get_beta(so2->g);
        o2z = soy_atoms_rotation_get_gamma(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // decrement self object's x,y by the other object's x,y FIXME comment
    soy_atoms_rotation_set_alpha(self->g,
                                 soy_atoms_rotation_get_alpha(self->g) - o2x);
    soy_atoms_rotation_set_beta(self->g,
                                soy_atoms_rotation_get_beta(self->g) - o2y);
    soy_atoms_rotation_set_gamma(self->g,
                                 soy_atoms_rotation_get_gamma(self->g) - o2z);

    // incref self before returning
    Py_INCREF(this);

    // return self object with the new calculated values
    return this;
}


static PyObject*
nb_inplace_multiply (PyObject* this, PyObject* o2) {
    SELF self = (SELF) this;
    double o2x, o2y, o2z = 0;
    PySoy_atoms_Rotation_Object *so2;

    // parse object 2
    if (PyLong_Check(o2)) {
        o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2x = soy_atoms_rotation_get_alpha(so2->g);
        o2y = soy_atoms_rotation_get_beta(so2->g);
        o2z = soy_atoms_rotation_get_gamma(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // multiply self object's x,y by the other object's x,y
    soy_atoms_rotation_set_alpha(self->g,
                                 soy_atoms_rotation_get_alpha(self->g) * o2x);
    soy_atoms_rotation_set_beta(self->g,
                                soy_atoms_rotation_get_beta(self->g) * o2y);
    soy_atoms_rotation_set_gamma(self->g,
                                 soy_atoms_rotation_get_gamma(self->g) * o2z);

    // incref self before returning
    Py_INCREF(this);

    // return self object with the new calculated values
    return this;
}


static PyObject*
nb_true_divide (PyObject* o1, PyObject* o2) {
    double o1x, o1y, o1z = 0;
    double o2x, o2y, o2z = 0;
    PyObject *args, *result;
    PySoy_atoms_Rotation_Object *so1, *so2;

    // parse object 1
    if (PyLong_Check(o1)) {
        o1x = o1y = o1z = PyLong_AsDouble(o1);
    }
    else if (PyFloat_Check(o1)) {
        o1x = o1y = o1z = PyFloat_AsDouble(o1);
    }
    else if (PySoy_atoms_Rotation_Check(o1)) {
        so1 = (PySoy_atoms_Rotation_Object*)o1;
        o1x = soy_atoms_rotation_get_alpha(so1->g);
        o1y = soy_atoms_rotation_get_beta(so1->g);
        o1z = soy_atoms_rotation_get_gamma(so1->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // parse object 2
    if (PyLong_Check(o2)) {
        o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2x = soy_atoms_rotation_get_alpha(so2->g);
        o2y = soy_atoms_rotation_get_beta(so2->g);
        o2z = soy_atoms_rotation_get_gamma(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // check if there's a division by zero in x, y, or z
    if (o2x == 0 || o2y == 0 || o2z == 0) {
        PyErr_SetString(PyExc_ZeroDivisionError, "float division by zero");
        return NULL;
    }

    // build args with calculated values
    args = Py_BuildValue("((fff))", o1x / o2x, o1y / o2y, o1z / o2z);

    // create result object
    result = tp_new(&PySoy_atoms_Rotation_Type, args, NULL);

    // decref args tuple
    Py_DECREF(args);

    // return calculated result
    return result;
}


static PyObject*
nb_inplace_true_divide (PyObject* this, PyObject* o2) {
    SELF self = (SELF) this;
    double o2x, o2y, o2z = 0;
    PySoy_atoms_Rotation_Object *so2;

    // parse object 2
    if (PyLong_Check(o2)) {
        o2x = o2y = o2z = PyLong_AsDouble(o2);
    }
    else if (PyFloat_Check(o2)) {
        o2x = o2y = o2z = PyFloat_AsDouble(o2);
    }
    else if (PySoy_atoms_Rotation_Check(o2)) {
        so2 = (PySoy_atoms_Rotation_Object*)o2;
        o2x = soy_atoms_rotation_get_alpha(so2->g);
        o2y = soy_atoms_rotation_get_beta(so2->g);
        o2z = soy_atoms_rotation_get_gamma(so2->g);
    }
    else {
        PyErr_SetString(PyExc_TypeError, "unsupported operand type(s)");
        return NULL;
    }

    // check if there's a division by zero in x, y, or z
    if (o2x == 0 || o2y == 0 || o2z == 0 ) {
        PyErr_SetString(PyExc_ZeroDivisionError, "float division by zero");
        return NULL;
    }

    // divide self object's x,y,z by the other object's x,y,z
    soy_atoms_rotation_set_alpha(self->g,
                                 soy_atoms_rotation_get_alpha(self->g) / o2x);
    soy_atoms_rotation_set_beta(self->g,
                                soy_atoms_rotation_get_beta(self->g) / o2y);
    soy_atoms_rotation_set_gamma(self->g,
                                 soy_atoms_rotation_get_gamma(self->g) / o2z);

    // incref self before returning
    Py_INCREF(this);

    // return self object with the new calculated values
    return this;
}


///////////////////////////////////////////////////////////////////////////////
// Sequence Methods

static Py_ssize_t
sq_length(SELF self) {
    return 3;
}


static PyObject*
sq_item(SELF self, Py_ssize_t index) {
    if (index == 0)
        return PyFloat_FromDouble(soy_atoms_rotation_get_alpha(self->g));

    if (index == 1)
        return PyFloat_FromDouble(soy_atoms_rotation_get_beta (self->g));

    if (index == 2)
        return PyFloat_FromDouble(soy_atoms_rotation_get_gamma(self->g));

    PyErr_SetString(PyExc_IndexError, "Rotation index out of range");
    return NULL;
}


static int
sq_ass_item(SELF self, Py_ssize_t index, PyObject* value) {
    // Ensure value is a number
    if (!PyNumber_Check(value)) {
        PyErr_SetString(PyExc_TypeError, "value must be float");
        return -1;
    }

    if (index == 0)
        soy_atoms_rotation_set_alpha(self->g, PyFloat_AsDouble(value));

    else if (index == 1)
        soy_atoms_rotation_set_beta (self->g, PyFloat_AsDouble(value));

    else if (index == 2)
        soy_atoms_rotation_set_gamma(self->g, PyFloat_AsDouble(value));

    else {
        PyErr_SetString(PyExc_IndexError, "Rotation index out of range");
        return -1;
    }
    return 0;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
alpha_doc[] = ".. py:attribute:: alpha\n"
"\n"
"   Rotation Around X Axis";
PYSOY_PROP_FLOAT(atoms, rotation, alpha)


static char
beta_doc[] = ".. py:attribute:: beta\n"
"\n"
"   Rotation Around X Axis";
PYSOY_PROP_FLOAT(atoms, rotation, beta)


static char
gamma_doc[] = ".. py:attribute:: gamma\n"
"\n"
"   Rotation Around X Axis";
PYSOY_PROP_FLOAT(atoms, rotation, gamma)


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyNumberMethods tp_as_number = {
    nb_add,                                                // nb_add
    nb_subtract,                                           // nb_subtract
    nb_multiply,                                           // nb_multiply
    0,                                                     // nb_remainder
    0,                                                     // nb_divmod
    0,                                                     // nb_power
    0,                                                     // nb_negative
    0,                                                     // nb_positive
    0,                                                     // nb_absolute
    0,                                                     // nb_bool
    0,                                                     // nb_invert
    0,                                                     // nb_lshift
    0,                                                     // nb_rshift
    0,                                                     // nb_and
    0,                                                     // nb_xor
    0,                                                     // nb_or
    0,                                                     // nb_int
    0,                                                     // nb_reserved
    0,                                                     // nb_float
    nb_inplace_add,                                        // nb_inplace_add
    nb_inplace_subtract,                                   // nb_inplace_subt..
    nb_inplace_multiply,                                   // nb_inplace_mult..
    0,                                                     // nb_inplace_rema..
    0,                                                     // nb_inplace_power
    0,                                                     // nb_inplace_lshift
    0,                                                     // nb_inplace_rshift
    0,                                                     // nb_inplace_and
    0,                                                     // nb_inplace_xor
    0,                                                     // nb_inplace_or
    0,                                                     // nb_floor_divide
    nb_true_divide,                                        // nb_true_divide
    0,                                                     // nb_inplace_floo..
    nb_inplace_true_divide,                                // nb_inplace_true..
    0,                                                     // nb_index
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


static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(alpha),
    PYSOY_PROPSTRUCT(beta),
    PYSOY_PROPSTRUCT(gamma),
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_atoms_Rotation_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.atoms.Rotation",                                  // tp_name
    sizeof(PySoy_atoms_Rotation_Object),                   // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    &tp_as_number,                                         // tp_as_number
    &tp_as_sequence,                                       // tp_as_sequence
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

