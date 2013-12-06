/*
    PySoy - soy.scenes.Scene Type
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
#define SELF PySoy_scenes_Scene_Object*


static char
tp_doc[] = "soy.scenes.Scene Type\n"
"\n"
"    Scenes are containers in physics space for bodies. \n"
"    Objects in different scenes cannot interact, for example, \n"
"    bodies in two different scenes cannot collide. \n"
"\n"
"    Scenes also apply gravity to bodies.\n"
"\n"
"    Scene has properties for ambient lighting, fog and gravity."
"\n";


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    static char* kw[] = {NULL};

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "|", kw))
        return NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // new gobject
    self->g = soy_scenes_scene_new();

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    PyObject* old = PyUnicode_FromString("{");
    PyObject* comma = PyUnicode_FromString(", ");
    PyObject* new;
    PyObject* ret;
    GeeSet* keys_set = gee_abstract_map_get_keys((GeeAbstractMap*)
                                                 self->g->bodies);
    GeeIterator* iterator = gee_iterable_iterator((GeeIterable*) keys_set);

    if (gee_iterator_next(iterator)) {
        while (1) {
            gchar* quoted;
            gpointer g;
            PySoy__G_Object* value;
            char* key = (char*) gee_iterator_get(iterator);

            // Get new PySoy.bodies.Body object
            g = gee_abstract_map_get((GeeAbstractMap*) self->g->bodies, key);
            value = (PySoy__G_Object*)
                    PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(g),
                                                       GPyObject),
                                      NULL, NULL);
            if (!value) return NULL;
            value->g = g;
            g_object_ref(g);

            // Add key to ret
            quoted = g_strdup_printf("'%s': ", key);
            new = PyUnicode_FromString(quoted);
            g_free(quoted);
            ret = PySequence_Concat(old, new);
            Py_DECREF(old);
            Py_DECREF(new);
            old = ret;

            // Add new value to ret (temporarily, cat)
            new = PyObject_Repr((PyObject*) value);
            Py_DECREF(value);
            ret = PySequence_Concat(old, new);
            Py_DECREF(old);
            Py_DECREF(new);

            // Add a ", " if we have another value
            if (gee_iterator_next(iterator)) {
                old = PySequence_Concat(ret, comma);
                Py_DECREF(ret);
            }
            else {
                old = ret;
                break;
            }
        }
    }

    // Add final '}'
    new = PyUnicode_FromString("}");
    ret = PySequence_Concat(old, new);

    // Cleanup pyobjects
    Py_DECREF(old);
    Py_DECREF(new);
    Py_DECREF(comma);

    // Cleanup gobjects
    g_object_unref(keys_set);
    g_object_unref(iterator);

    // return string as unicode object
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Sequence methods

static Py_ssize_t
sq_length (SELF self) {
    return soy_scenes_scene_get_length(self->g);
}


static int
sq_contains (SELF self, PyObject* key) {
    PyObject* name;
    int ret;

    // Require key to be either a bytes or unicode object
    if (PyBytes_Check(key)) {
        // Use a bytes string verbatim as UTF-8 name
        Py_INCREF(key);
        name = key;
    }
    else if (PyUnicode_Check(key)) {
        // Encode unicode string as UTF-8 bytes object
        name = PyUnicode_AsUTF8String(key);
    }
    else
        return FALSE;

    // We need to decref name before returning
    ret = soy_scenes_scene_has_key(self->g, PyBytes_AsString(name));
    Py_DECREF(name);

    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Mapping methods

static PyObject*
mp_subscript (SELF self, PyObject* key) {
    PyObject* name;
    gpointer g;
    PySoy__G_Object* value;

    // Require key to be either a bytes or unicode object
    if (PyBytes_Check(key)) {
        // Use a bytes string verbatim as UTF-8 name
        Py_INCREF(key);
        name = key;
    }
    else if (PyUnicode_Check(key)) {
        // Encode unicode string as UTF-8 bytes object
        name = PyUnicode_AsUTF8String(key);
    }
    else {
        // Raise exception
        PyErr_SetString(PyExc_TypeError, "attribute name must be a string");
        return NULL;
    }

    // Raise exception if not found
    if (!soy_scenes_scene_has_key(self->g, PyBytes_AsString(name))) {
        PyErr_SetString(PyExc_KeyError, "attribute not found");
        Py_DECREF(name);
        return NULL;
    }

    g = soy_scenes_scene_get(self->g, PyBytes_AsString(name));
    Py_DECREF(name);

    // This should never happen
    if (!g) Py_RETURN_NONE;

    // Create PyObject for libsoy body
    value = (PySoy__G_Object*)
            PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(g), GPyObject),
                              NULL, NULL);
    if (!value) return NULL;
    value->g = g;
    g_object_ref(g);

    return (PyObject*) value;
}


static int
mp_ass_subscript (SELF self, PyObject* key, PyObject* value) {
    PyObject* name;

    // Require key to be either a bytes or unicode object
    if (PyBytes_Check(key)) {
        // Use a bytes string verbatim as UTF-8 name
        Py_INCREF(key);
        name = key;
    }
    else if (PyUnicode_Check(key)) {
        // Encode unicode string as UTF-8 bytes object
        name = PyUnicode_AsUTF8String(key);
    }
    else {
        // Raise exception
        PyErr_SetString(PyExc_TypeError, "attribute name must be a string");
        return -1;
    }

    // If v == NULL then delete object
    if (value == NULL) {
        gee_abstract_map_unset((GeeAbstractMap*) self->g->bodies,
                               PyBytes_AsString(name), NULL);

        // Successfully deleted body
        Py_DECREF(name);
        return 0;
    }

    // Require value to be either a bytes or unicode object
    if (!PySoy_bodies_Body_Check(value)) {
        // Raise exception
        Py_DECREF(name);
        PyErr_SetString(PyExc_TypeError, "attribute value must be a body");
        return -1;
    }

    soy_scenes_scene_set(self->g, PyBytes_AsString(name),
                         ((PySoy_bodies_Body_Object*) value)->g);

    // Successfully assigned new value
    Py_DECREF(name);
    return 0;
}


///////////////////////////////////////////////////////////////////////////////
// Methods

static char
keys_doc[] = "Return keys of the scene";

static PyObject*
keys (SELF self, PyObject* args, PyObject* kwds) {
    // Ensure no keywords were provided
    if (!_PyArg_NoKeywords("soy.materials.Colored", kwds))
        return NULL;

    // Parse arguments
    if (!PyArg_ParseTuple(args, ""))
        return NULL;

    PyObject* ret = PyList_New(sq_length(self));
    GeeSet* keys_set = gee_abstract_map_get_keys(
        (GeeAbstractMap*) self->g->bodies);
    GeeIterator* iterator = gee_iterable_iterator ((GeeIterable*) keys_set);
    int i = 0;

    while (gee_iterator_next(iterator))
        PyList_SetItem(ret, i++,
                       (PyObject*)
                       PyUnicode_FromString(gee_iterator_get(iterator)));

    // Cleanup gobjects
    g_object_unref(keys_set);
    g_object_unref(iterator);

    return (PyObject*) ret;
}


static char
values_doc[] = "Return values of the scene";

static PyObject*
values (SELF self, PyObject* args, PyObject* kwds) {
    // Ensure no keywords were provided
    if (!_PyArg_NoKeywords("soy.materials.Colored", kwds))
        return NULL;

    // Parse arguments
    if (!PyArg_ParseTuple(args, ""))
        return NULL;

    PyObject* ret = PyList_New(sq_length(self));
    GeeSet* keys_set = gee_abstract_map_get_keys(
        (GeeAbstractMap*) self->g->bodies);
    GeeIterator* iterator = gee_iterable_iterator((GeeIterable*) keys_set);
    int i = 0;

    while (gee_iterator_next(iterator)) {
        gpointer g;
        PySoy__G_Object* value;
        char* key = (char*) gee_iterator_get(iterator);

        // Get new PySoy.bodies.Body object
        g = gee_abstract_map_get((GeeAbstractMap*) self->g->bodies, key);
        value = (PySoy__G_Object*)
                PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(g), GPyObject),
                                  NULL, NULL);
        if (!value) return NULL;
        value->g = g;

        g_object_ref(g);
        PyList_SetItem(ret, i++, (PyObject*) value);
    }

    // Cleanup gobjects
    g_object_unref(keys_set);
    g_object_unref(iterator);

    return (PyObject*) ret;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
ambient_doc[] = "Ambient color intensity\n"
"\n"
"    This is the ambient color intensity for scene lighting."
"\n";
PYSOY_PROP_OBJECT_OWNED(scenes, scene, ambient, atoms_Color);


static char
fog_doc[] = "Scene fog\n"
"\n"
"    This is a scene-wide layer of fog of which the density is set by the\n"
"    color's alpha channel.\n"
"\n"
"    Defaults to Color('clear')\n"
"\n";
PYSOY_PROP_OBJECT_OWNED(scenes, scene, fog, atoms_Color)


static char
gravity_doc[] = "Scene gravity\n"
"\n"
"    Gravity is Vector atom which applies a scene-wide gravity on all the bodies of the scene.\n"
"\n"
"    Disabled on default\n"
"\n";
PYSOY_PROP_OBJECT_OWNED(scenes, scene, gravity, atoms_Vector)

static char
skybox_doc[] = "Scene skybox\n"
"\n"
"   The skybox is a cubemap that is used as the scene's background.\n";
PYSOY_PROP_OBJECT_OWNED(scenes, scene, skybox, textures_Cubemap)


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PySequenceMethods tp_as_sequence = {
    (lenfunc) sq_length,                                   // sq_length
    0,                                                     // sq_concat
    0,                                                     // sq_repeat
    0,                                                     // sq_item
    0,                                                     // was_sq_slice
    0,                                                     // sq_ass_item
    0,                                                     // was_sq_ass_slice
    (objobjproc) sq_contains,                              // sq_contains
    0,                                                     // sq_inplace_concat
    0,                                                     // sq_inplace_repeat
};


static PyMappingMethods tp_as_mapping = {
    0,                                                     // mp_length
    (binaryfunc) mp_subscript,                             // mp_subscript
    (objobjargproc) mp_ass_subscript,                      // mp_ass_subscript
};


static PyMethodDef tp_methods[] = {
    {"keys",                                               // ml_name
     (PyCFunction) keys,                                   // ml_meth
     METH_VARARGS,                                         // ml_flags
     keys_doc},                                            // ml_doc
    {"values",                                             // ml_name
     (PyCFunction) values,                                 // ml_meth
     METH_VARARGS,                                         // ml_flags
     values_doc},                                          // ml_doc
    {NULL},                                                // sentinel
};


static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(ambient),
    PYSOY_PROPSTRUCT(fog),
    PYSOY_PROPSTRUCT(gravity),
    PYSOY_PROPSTRUCT(skybox),
    {NULL}                                                 // sentinel
};


PyTypeObject PySoy_scenes_Scene_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.scenes.Scene",                                    // tp_name
    sizeof(PySoy_scenes_Scene_Object),                     // tp_basicsize
    0,                                                     // tp_itemsize
    0,                                                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) tp_repr,                                    // tp_repr
    0,                                                     // tp_as_number
    &tp_as_sequence,                                       // tp_as_sequence
    &tp_as_mapping,                                        // tp_as_mapping
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

