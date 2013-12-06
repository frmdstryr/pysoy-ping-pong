/*
    PySoy-Generator - C Header
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

#ifndef __PYSOY_UTILS_H__
#define __PYSOY_UTILS_H__

#include "pysoy2.h"
#include <glib-object.h>


/////////////////////////////////////////////////////////////////////////////
// Implementation of: 
//     Generator of G : GLib.Object implements Gee.Iterator of G

typedef gpointer (*PySoyConvertFunc)(PyObject*);

#define SOY_TYPE_GENERATOR                  (soy_generator_get_type ())
#define SOY_GENERATOR(obj)                  (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_TYPE_GENERATOR, soyGenerator))
#define SOY_IS_GENERATOR(obj)               (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_TYPE_GENERATOR))
#define SOY_GENERATOR_CLASS(klass)          (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_TYPE_GENERATOR, soyGeneratorClass))
#define SOY_IS_GENERATOR_CLASS(klass)       (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_TYPE_GENERATOR))
#define SOY_GENERATOR_GET_CLASS(obj)        (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_TYPE_GENERATOR, soyGeneratorClass))

typedef struct _soyGenerator        soyGenerator;
typedef struct _soyGeneratorClass   soyGeneratorClass;

struct _soyGenerator
{
    GObject parent_instance;

    /* instance members */
    /* < private > */
    gpointer  next;
    gpointer  current;
    PyObject* iter;
    gboolean  has_next;
    gboolean  has_current;

    GType soy_type;
    PyTypeObject* py_type;

    GBoxedCopyFunc dup_func;
    GDestroyNotify destroy_func;
    PySoyConvertFunc convert_func;

};

struct _soyGeneratorClass
{
    GObjectClass parent_class;

    /* class members */
};

/* used by SOY_TYPE_GENERATOR */
GType soy_generator_get_type (void);

/*
 * Method definitions.
 */

soyGenerator* soy_generator_construct (GType type, PyTypeObject* py_type, GType soy_type, GBoxedCopyFunc g_dup, GDestroyNotify g_destroy, PySoyConvertFunc convert, PyObject* iter);
soyGenerator* soy_generator_new_soy   (PyTypeObject* py_type, GType soy_type, PyObject* iter);
soyGenerator* soy_generator_new       (PyTypeObject* py_type, GType soy_type, GBoxedCopyFunc g_dup, GDestroyNotify g_destroy, PySoyConvertFunc convert, PyObject* iter);

/////////////////////////////////////////////////////////////////////////////
// PySoy__GeeIterable_Object

PyObject* PySoy__GeeIterable_new (GeeIterable* iterable);

#endif /* __PYSOY_UTILS_H__ */
