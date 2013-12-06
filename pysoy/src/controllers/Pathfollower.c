/*
    PySoy - soy.controllers.Pathfollower
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
#include "pysoy-utils.h"
#define SELF PySoy_controllers_Pathfollower_Object*

static char
tp_doc[] = "soy.controllers.Pathfollower Type\n"
"\n"
"This class will make an object follow a predefined path at a given speed\n"
"\n"
"the initializer for this class has the following signature::\n"
"\n"
"    soy.controllers.Pathfollower(scene, controlled, path, speed, fuzziness = None, paused = False)\n"
"\n"
"================ ====================================== ================================================================================================================================\n"
"Argument         Type                                   Explanation\n"
"================ ====================================== ================================================================================================================================\n"
"scene            soy.scenes.Scene                       The scene being simulated.\n"
"controlled       soy.bodies.Body                        The body being controlled.\n"
"path             list or iterator of soy.atoms.Position The list of waypoints to follow.\n"
"speed            float                                  The speed of the object in ____ per ____.\n" //TODO Figure out what the units are.
"fuzziness = None float or None                          The distance around a waypoint that one is to consider being part of the waypoint. If None it is set to 1/100 the speed.\n"
"paused = False   bool                                   True when this controller should be initially paused, and False when should not be.\n"
"================ ====================================== ================================================================================================================================\n"
"\n"
"\n"
"Examples::\n"
"\n"
"   scene = soy.scenes.Scene()\n"
"   body = soy.bodies.Body(s)\n"
"   controller = soy.controllers.Pathfollower(scene, body, (soy.atoms.Position((10,10,10)), soy.atoms.Position((-3,5,12)), soy.atoms.Position((0,0,0))), 0.1)\n"
"\n"
"You can also use generators as the path::\n"
"\n"
"   def switcher(a,b):\n"
"       while 1:\n"
"           yield a\n"
"           yield b\n"
"   \n"
"   scene = soy.scenes.Scene()\n"
"   body = soy.bodies.Body()\n"
"   controller = soy.controllers.Pathfollower(scene, body, switcher(soy.atoms.Position((10,10,10)), soy.atoms.Position((0,0,0))), 0.1)\n"
"\n";
//TODO Add documentation


static PyObject*
tp_new (PyTypeObject *type, PyObject *args, PyObject *kwds) {
    SELF self;
    static char* kw[] = {"scene", "controlled", "path", "speed", "fuzziness", "paused", NULL};
    PySoy_scenes_Scene_Object* scene;
    PySoy_bodies_Body_Object*  controlled;
    PyObject *py_path, *iter, *item, *pyfuzziness = Py_None;
    GeeIterable* gee_path;

    float speed, fuzziness;
    int paused = FALSE;

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "O!O!Of|Oi", kw,
                                     &PySoy_scenes_Scene_Type, &scene,
                                     &PySoy_bodies_Body_Type,  &controlled,
                                     &py_path, 
                                     &speed, 
                                     &pyfuzziness,
                                     &paused))
        return NULL;

    if (pyfuzziness == Py_None) {
        fuzziness = speed/10000.0f;
    } else if (!PyNumber_Check(pyfuzziness)) {
        PyErr_SetString(PyExc_TypeError, "'fuzziness' must be a number greater than 0 or None");
        return NULL;
    } else {
        PyObject* fuzz_as_float = PyNumber_Float(pyfuzziness);
        if (!fuzz_as_float) {
            PyErr_SetString(PyExc_TypeError, "'fuzziness' must be a number greater than 0 or None");
            return NULL;
        }
        fuzziness = (float)PyFloat_AsDouble(fuzz_as_float);
        if (PyErr_Occurred()) {
            PyErr_SetString(PyExc_TypeError, "'fuzziness' must be a number greater than 0 or None");
            return NULL;
        }
        if (fuzziness <= 0.0f) {
            PyErr_SetString(PyExc_ValueError, "'fuzziness' must be a number greater than 0 or None");
            return NULL;
        }
    }
    if (PyIter_Check(py_path)) {
        gee_path = (GeeIterable*)soy_iterator_wrapper_new(SOY_ATOMS_TYPE_POSITION,
                                                          (GBoxedCopyFunc) g_object_ref,
                                                          g_object_unref,
                                                          (GeeIterator*) soy_generator_new_soy(&PySoy_atoms_Position_Type, 
                                                                                               SOY_ATOMS_TYPE_POSITION,
                                                                                               py_path));
    } else {

        iter = PyObject_GetIter(py_path);
        if (iter == NULL) {
            PyErr_SetString(PyExc_TypeError, "'path' must be an iterable collection of soy.atoms.Position");
            return NULL;
        }

        gee_path = (GeeIterable*) gee_linked_list_new(SOY_ATOMS_TYPE_POSITION, 
                                                      (GBoxedCopyFunc) g_object_ref,
                                                      g_object_unref,
                                                      NULL);

        while ((item = PyIter_Next(iter))) {
            if (!PySoy_atoms_Position_Check(item)) {
                //clean up and return an error
                PyErr_SetString(PyExc_TypeError, "All elements of path must be soy.atoms.Position");
                Py_DECREF(item);
                g_object_unref(gee_path);
                return NULL;
            }
            gee_abstract_collection_add((GeeAbstractCollection*) gee_path, ((PySoy_atoms_Position_Object*) item)->g);    
            Py_DECREF(item);
        }
        Py_DECREF(iter);

        if (PyErr_Occurred()) {
            g_object_unref(gee_path);
            return NULL;
        }
    }
    

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
        return NULL;

    // new gobject
    self->g = soy_controllers_pathfollower_new(scene->g,
                                               controlled->g,
                                               speed,
                                               fuzziness,
                                               paused,
                                               gee_path);

    g_object_unref(gee_path);
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    PyObject *result;

    result = PyUnicode_FromFormat("<Pathfollower at %p,%p>", self, self->g);
//    result = PyUnicode_FromFormat("<Pathfollower with %i waypoints>", 
//                                  gee_collection_get_size((GeeCollection*) soy_controllers_pathfollower_get_path(self->g)));

    return result;
}

///////////////////////////////////////////////////////////////////////////////
// Properties

static char
path_doc[] = "path Property\n\n"
"The tuple of the waypoints this controller is going to traverse.\n"
"\n"
"When this property is set the iterable is copied so changing the original will not alter the path.\n";

// I am not using the macro because I want to return a tuple, since i don't want anybody
// trying to alter it.
// Also the List macro does not work for some reason.
// I might transition this to a new macro sometime soon.
static PyObject* path_getter(SELF self, void* closure) {
    GeeIterable* iter_lst =  soy_controllers_pathfollower_get_path(self->g);
    if (!GEE_IS_LIST(iter_lst)) {
        return (PyObject*) PySoy__GeeIterable_new(iter_lst);
    }
    GeeAbstractList* lst = (GeeAbstractList*)iter_lst;
    gint size = gee_collection_get_size((GeeCollection*) lst);
    GeeIterator* lst_iter = (GeeIterator*) gee_abstract_list_list_iterator(lst);
    PyObject* ret = PyTuple_New(size);
    soyatomsPosition* pos;
    int cnt = 0;

    while (gee_iterator_next(lst_iter)) {
        pos = gee_iterator_get(lst_iter);
        g_object_ref(pos);
        PySoy_atoms_Position_Object* pypos = (PySoy_atoms_Position_Object*) PyType_GenericNew(&PySoy_atoms_Position_Type, NULL, NULL);
        pypos->g = pos;
        PyTuple_SetItem(ret, cnt++, (PyObject*) pypos);
    }

    g_object_unref(lst_iter);

    return ret;
}

static int path_setter(SELF self, PyObject* value, void* closure) {
    PyObject* iter = PyObject_GetIter(value);
    PyObject* item;
    if (iter == NULL) {
        return -1;
    }
    GeeLinkedList* gee_path = gee_linked_list_new(SOY_ATOMS_TYPE_POSITION, 
                                                  (GBoxedCopyFunc) g_object_ref, 
                                                  g_object_unref, 
                                                  NULL);
    while ((item = PyIter_Next(iter))) {
        if (!PySoy_atoms_Position_Check(item)) {
            //clean up and return an error
            PyErr_SetString(PyExc_TypeError, "All elements of path must be soy.atoms.Position");
            Py_DECREF(item);
            g_object_unref(gee_path);
            return -1;
        }
        gee_abstract_collection_add((GeeAbstractCollection*) gee_path, (soyatomsPosition*)((PySoy_atoms_Position_Object*) item)->g);
        Py_DECREF(item);
    }

    Py_DECREF(iter);

    if (PyErr_Occurred()) {
        g_object_unref(gee_path);
        return -1;
    }

    g_rec_mutex_lock(&(self->g->path_lock));
    soy_controllers_pathfollower_set_path((soycontrollersPathfollower*)self->g, (GeeIterable*) gee_path);
    g_rec_mutex_unlock(&(self->g->path_lock));
    g_object_unref(gee_path);
    return 0;
}

static char
speed_doc[] = "speed property\n"
"\n"
"The distance that the object being controlled will move every second.\n"
"\n";
PYSOY_PROP_FLOAT_RO(controllers, pathfollower, speed)

static int speed_setter(SELF self, PyObject* value, void* closure) {
    PyObject* as_float = PyNumber_Float(value);
    if(as_float == NULL) {
        PyErr_Clear();
        PyErr_SetString(PyExc_ValueError, "'speed' must be a number greater then 0.");
        return -1;
    }
    float val = (float)PyFloat_AsDouble(as_float);
    if (val < 0) {
        PyErr_SetString(PyExc_ValueError, "'speed' must be greater then 0");
        return -1;
    }
    soy_controllers_pathfollower_set_speed(self->g, val);
    return 0;
}

static char
fuzziness_doc[] = "fuzziness property\n"
"\n"
"The radius around a waypoint in which the object will be considered to have arrived at it.\n"
"\n";
PYSOY_PROP_FLOAT_RO(controllers, pathfollower, fuzziness)

static int fuzziness_setter(SELF self, PyObject* value, void* closure) {
    PyObject* as_float = PyNumber_Float(value);
    if(as_float == NULL) {
        PyErr_Clear();
        PyErr_SetString(PyExc_ValueError, "'fuzziness' must be a number greater then 0.");
        return -1;
    }
    float val = (float)PyFloat_AsDouble(as_float);
    if (val < 0) {
        PyErr_SetString(PyExc_ValueError, "'fuzziness' must be greater then 0");
        return -1;
    }
    soy_controllers_pathfollower_set_fuzziness(self->g, val);
    return 0;
}

static char
paused_doc[] = "paused Property\n"
"\n"
"Whether or not this controller's execution is currently paused.\n"
"\n";
PYSOY_PROP_BOOL(controllers, pathfollower, paused)

///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyMethodDef tp_methods[] = {
    {NULL, NULL}
};

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(path),
    PYSOY_PROPSTRUCT(speed),
    PYSOY_PROPSTRUCT(fuzziness),
    PYSOY_PROPSTRUCT(paused),
    {NULL}                                                 // sentinel
};


PyTypeObject PySoy_controllers_Pathfollower_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.controllers.Pathfollower",                        // tp_name
    sizeof(PySoy_controllers_Pathfollower_Object),         // tp_basicsize
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
    &PySoy_controllers_VirtualController_Type,             // tp_base
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
