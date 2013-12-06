/* _init.c generated by valac 0.20.1, the Vala compiler
 * generated from _init.gs, do not modify */

/*
 *  libsoy - soy._init
 *  Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

#include <glib.h>
#include <glib-object.h>
#include <stdlib.h>
#include <string.h>
#include <gee.h>


#define SOY_MATERIALS_TYPE_MATERIAL (soy_materials_material_get_type ())
#define SOY_MATERIALS_MATERIAL(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_MATERIALS_TYPE_MATERIAL, soymaterialsMaterial))
#define SOY_MATERIALS_MATERIAL_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_MATERIALS_TYPE_MATERIAL, soymaterialsMaterialClass))
#define SOY_MATERIALS_IS_MATERIAL(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_MATERIALS_TYPE_MATERIAL))
#define SOY_MATERIALS_IS_MATERIAL_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_MATERIALS_TYPE_MATERIAL))
#define SOY_MATERIALS_MATERIAL_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_MATERIALS_TYPE_MATERIAL, soymaterialsMaterialClass))

typedef struct _soymaterialsMaterial soymaterialsMaterial;
typedef struct _soymaterialsMaterialClass soymaterialsMaterialClass;

typedef GObject* (*soyloadable_func) (const gchar* packet);

extern GeeHashMap* soy_loadable;
GeeHashMap* soy_loadable = NULL;
extern soymaterialsMaterial* soy_default_material;
soymaterialsMaterial* soy_default_material = NULL;

GType soy_materials_material_get_type (void) G_GNUC_CONST;
void soy_init (void);



