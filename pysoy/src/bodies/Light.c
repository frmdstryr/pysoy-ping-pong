/*
    PySoy - soy.bodies.Light Type
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
#define SELF PySoy_bodies_Light_Object*


static char
tp_doc[] = ".. py:class:: Light([position, size, texture])"
"soy.bodies.Light Type\n"
"\n"
"soy.bodies.Light is light body used to illuminate objects in scene.\n"
"It's light source - point from where light comes. Each source has separate\n"
"ambient, diffuse, and specular components."
"\n"
"Usage::\n"
"\n"
"    import soy\n"
"    scene = soy.scenes.Room(3.0)\n"
"    variable = soy.bodies.Light(scene)\n"
"\n"
"\n"
"A perfect mirror has no diffuse reflection and tons of specular\n"
"reflection. Perfectly flat paint has diffuse reflection and no specular\n"
"reflection. Most things are in-between.\n"
"\n"
"Example::\n"
"\n"
"    scene = soy.scenes.Room(3.0)\n"
"    scene['light'] = soy.bodies.Light()\n"
"\n"
//FIXME
"    light.ambient = soy.atoms.Color(255, 127, 127, 255)\n"
"    light.diffuse = soy.atoms.Color(255, 155, 155, 127)\n"
"    light.specular = soy.atoms.Color(255, 255, 255, 255)\n"
///FIXME
"\n"
":param position: Light body position.\n"
":type position: soy.atoms.Position \n"
":param size: Light body size. \n"
":type size: soy.atoms.Size \n"
":param texture: Texture \n"
":type texture: soy.materials.Textured \n"
"\n";

// TODO


static PyObject*
tp_new (PyTypeObject* type, PyObject* args, PyObject* kwds) {
    SELF self;
    PyObject* py_position = NULL;
    PySoy_textures_Texture_Object* py_texture = NULL;
    soyatomsPosition* position = NULL;
    soytexturesTexture* texture = NULL;
    float size = 1.0;
    float x, y, z;
    static char* kw[] = {"position", "size", "texture", NULL};

    // Parse arguments
    if (!PyArg_ParseTupleAndKeywords(
            args, kwds, "|OfO!", kw,
            &py_position, &size, &PySoy_textures_Texture_Type, &py_texture))
        return NULL;

    // Parse py_position if its neither NULL or a Position type
    if (py_position) {
        if (PySoy_atoms_Position_Check(py_position)) {
            position = (soyatomsPosition*) ((PySoy__G_Object*) py_position)->g;
            g_object_ref(position);
        }
        else {
            if (!PyArg_ParseTuple(py_position, "fff", &x, &y, &z)) {
                // TODO set appropriate error
                return NULL;
            }
            position = soy_atoms_position_new(x, y, z);
        }
    }


    // Grab texture's gobject
    texture = (py_texture) ? py_texture->g : NULL;

    // inherit base type
    self = (SELF) PyType_GenericNew(type, args, kwds);
    if (!self)
      return NULL;

    // new gobject
    self->g = soy_bodies_light_new(position, size, texture);

    // unref position
    if (position) g_object_unref(position);

    // return self
    return (PyObject*) self;
}


static PyObject*
tp_repr (SELF self) {
    PyObject* ret;

    ret = PyUnicode_FromFormat("<Light>"); // TODO position etc

    // return string as unicode object
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static char
ambient_doc[] = ".. py:attribute:: Ambient(color) \n"
"Ambient Lighting\n"
"\n"
"    Ambient light is the average volume of light that is created by\n"
"    emission of light from all of the light sources in scene.  Ambient\n"
"    light comes from all directions.  If you set an ambient color the same\n"
"    as the diffuse color and use a small amount of ambient lighting, you'll\n"
"    be able to see all surfaces no matter where the light is::\n"
"\n"
"        >>> scene = soy.scenes.Scene()\n"
"        >>> light = soy.bodies.Light(scene)\n"
"        >>> light.ambient = soy.atoms.Color('red')\n"
"\n"
":param color: Default is (0, 0, 0, 255)\n"
":type color: soy.atoms.Color \n"
"\n";
PYSOY_PROP_OBJECT_OWNED(bodies, light, ambient, atoms_Color);


static char
diffuse_doc[] = ".. py:attribute:: Diffuse(color) \n"
"Diffuse Lighting\n"
"\n"
"    Diffuse light represents a directional light cast by a light source.\n"
"    Diffuse light can be described as the light that has a position in\n"
"    space and comes from a single direction. When diffuse light touches the\n"
"    surface of an object, it scatters and reflects evenly across that\n"
"    surface::\n"
"\n"
"        >>> scene = soy.scenes.Scene()\n"
"        >>> light = soy.bodies.Light(scene)\n"
"        >>> light.diffuse = soy.atoms.Color('pink')\n"
"\n"
":param color: Default is (127, 127, 127, 255)\n"
":type color: soy.atoms.Color \n"
"\n";
PYSOY_PROP_OBJECT_OWNED(bodies, light, diffuse, atoms_Color);


static char
specular_doc[] = ".. py:attribute:: Specular(color) \n"
"Specular Lighting\n"
"\n"
"    Specular Lighting is mirror-like reflection visible on object.  Just\n"
"    like Diffuse light, Specular light is a directional type of light.  It\n"
"    comes from one direction.  The difference between the two is that\n"
"    specular light reflects off the surface in a sharp and uniform way. The\n"
"    rendering of specular light relies on the angle between the viewer and\n"
"    the light source. From the viewer's standpoint specular light creates\n"
"    a highlighted area on the surface of the viewed object known as\n"
"    specular highlight or specular reflection.  Note that the specular\n"
"    for most surfaces is white, even if the surface is a different color.\n"
"\n"
"        >>> scene = soy.scenes.Scene()\n"
"        >>> light = soy.bodies.Light(scene)\n"
"        >>> light.specular = soy.atoms.Color('white')\n"
"\n"
":param color: Default is (255, 255, 255, 255)\n"
":type color: soy.atoms.Color \n"
"\n";
PYSOY_PROP_OBJECT_OWNED(bodies, light, specular, atoms_Color);

static char
size_doc[] = ".. py:attribute:: Size(size)"
"Size\n"
"\n"
"    If a light has a non-zero size, then it will render a circle with\n"
"    a texture. A texture is required.\n"
"\n"
"        >>> scene = soy.scenes.Scene()\n"
"        >>> light = soy.bodies.Light(scene)\n"
"        >>> light.size = 0.5\n"
"\n"
":param size: Default 0.0\n"
":type size: float\n"
"\n";
PYSOY_PROP_FLOAT(bodies, light, size);

static char
texture_doc[] = ".. py:attribute:: Texture(texture)"
"Texture\n"
"\n"
"    This is the texture the light will use in rendering when it has a\n"
"    non-zero size. Required for rendering.\n"
"\n"
"        >>> scene = soy.scenes.Scene()\n"
"        >>> light = soy.bodies.Light(scene)\n"
"        >>> light.texture = soy.textures.Texture('filename.png')\n"
":param texture: Texture\n"
":type texture: soy.textures.Texture"
"\n";
PYSOY_PROP_OBJECT(bodies, light, texture, textures_Texture);

// TODO radius


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyGetSetDef tp_getset[] = {
    PYSOY_PROPSTRUCT(ambient),
    PYSOY_PROPSTRUCT(diffuse),
    PYSOY_PROPSTRUCT(specular),
    PYSOY_PROPSTRUCT(size),
    PYSOY_PROPSTRUCT(texture),
    {NULL}                                                  // sentinel
};


PyTypeObject PySoy_bodies_Light_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.bodies.Light",                                    // tp_name
    sizeof(PySoy_bodies_Light_Object),                     // tp_basicsize
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
    0,                                                     // tp_methods
    0,                                                     // tp_members
    tp_getset,                                             // tp_getset
    &PySoy_bodies_Body_Type,                               // tp_base
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

