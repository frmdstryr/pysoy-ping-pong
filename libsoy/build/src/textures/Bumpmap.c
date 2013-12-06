/* Bumpmap.c generated by valac 0.20.1, the Vala compiler
 * generated from Bumpmap.gs, do not modify */

/*
 *  libsoy - soy.textures.Bumpmap
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
#include <gee.h>
#include <stdlib.h>
#include <string.h>
#include <float.h>
#include <math.h>


#define SOY_TEXTURES_TYPE_TEXTURE (soy_textures_texture_get_type ())
#define SOY_TEXTURES_TEXTURE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_TEXTURES_TYPE_TEXTURE, soytexturesTexture))
#define SOY_TEXTURES_TEXTURE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_TEXTURES_TYPE_TEXTURE, soytexturesTextureClass))
#define SOY_TEXTURES_IS_TEXTURE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_TEXTURES_TYPE_TEXTURE))
#define SOY_TEXTURES_IS_TEXTURE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_TEXTURES_TYPE_TEXTURE))
#define SOY_TEXTURES_TEXTURE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_TEXTURES_TYPE_TEXTURE, soytexturesTextureClass))

typedef struct _soytexturesTexture soytexturesTexture;
typedef struct _soytexturesTextureClass soytexturesTextureClass;
typedef struct _soytexturesTexturePrivate soytexturesTexturePrivate;

#define SOY_TEXTURES_TYPE_BUMPMAP (soy_textures_bumpmap_get_type ())
#define SOY_TEXTURES_BUMPMAP(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_TEXTURES_TYPE_BUMPMAP, soytexturesBumpmap))
#define SOY_TEXTURES_BUMPMAP_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_TEXTURES_TYPE_BUMPMAP, soytexturesBumpmapClass))
#define SOY_TEXTURES_IS_BUMPMAP(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_TEXTURES_TYPE_BUMPMAP))
#define SOY_TEXTURES_IS_BUMPMAP_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_TEXTURES_TYPE_BUMPMAP))
#define SOY_TEXTURES_BUMPMAP_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_TEXTURES_TYPE_BUMPMAP, soytexturesBumpmapClass))

typedef struct _soytexturesBumpmap soytexturesBumpmap;
typedef struct _soytexturesBumpmapClass soytexturesBumpmapClass;
typedef struct _soytexturesBumpmapPrivate soytexturesBumpmapPrivate;

#define SOY_ATOMS_TYPE_VECTOR (soy_atoms_vector_get_type ())
#define SOY_ATOMS_VECTOR(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_VECTOR, soyatomsVector))
#define SOY_ATOMS_VECTOR_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_VECTOR, soyatomsVectorClass))
#define SOY_ATOMS_IS_VECTOR(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_VECTOR))
#define SOY_ATOMS_IS_VECTOR_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_VECTOR))
#define SOY_ATOMS_VECTOR_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_VECTOR, soyatomsVectorClass))

typedef struct _soyatomsVector soyatomsVector;
typedef struct _soyatomsVectorClass soyatomsVectorClass;
#define _g_object_unref0(var) ((var == NULL) ? NULL : (var = (g_object_unref (var), NULL)))

#define SOY_ATOMS_TYPE_SIZE (soy_atoms_size_get_type ())
#define SOY_ATOMS_SIZE(obj) (G_TYPE_CHECK_INSTANCE_CAST ((obj), SOY_ATOMS_TYPE_SIZE, soyatomsSize))
#define SOY_ATOMS_SIZE_CLASS(klass) (G_TYPE_CHECK_CLASS_CAST ((klass), SOY_ATOMS_TYPE_SIZE, soyatomsSizeClass))
#define SOY_ATOMS_IS_SIZE(obj) (G_TYPE_CHECK_INSTANCE_TYPE ((obj), SOY_ATOMS_TYPE_SIZE))
#define SOY_ATOMS_IS_SIZE_CLASS(klass) (G_TYPE_CHECK_CLASS_TYPE ((klass), SOY_ATOMS_TYPE_SIZE))
#define SOY_ATOMS_SIZE_GET_CLASS(obj) (G_TYPE_INSTANCE_GET_CLASS ((obj), SOY_ATOMS_TYPE_SIZE, soyatomsSizeClass))

typedef struct _soyatomsSize soyatomsSize;
typedef struct _soyatomsSizeClass soyatomsSizeClass;

struct _soytexturesTexture {
	GObject parent_instance;
	soytexturesTexturePrivate * priv;
	gboolean translucent;
	guchar* texels;
	guchar* mipmaps;
	gboolean updated;
};

struct _soytexturesTextureClass {
	GObjectClass parent_class;
	void (*enable) (soytexturesTexture* self);
	void (*disable) (soytexturesTexture* self);
};

struct _soytexturesBumpmap {
	soytexturesTexture parent_instance;
	soytexturesBumpmapPrivate * priv;
};

struct _soytexturesBumpmapClass {
	soytexturesTextureClass parent_class;
};

struct _soytexturesBumpmapPrivate {
	GeeHashMap* _texel_objs;
	GMutex _mutex;
};

typedef enum  {
	IO_ERROR_FILE_NOT_FOUND,
	IO_ERROR_READ_ERROR
} IOError;
#define IO_ERROR io_error_quark ()
typedef enum  {
	MEMORY_ERROR_OUT_OF_MEMORY
} MemoryError;
#define MEMORY_ERROR memory_error_quark ()

static gpointer soy_textures_bumpmap_parent_class = NULL;

GType soy_textures_texture_get_type (void) G_GNUC_CONST;
GType soy_textures_bumpmap_get_type (void) G_GNUC_CONST;
GType soy_atoms_vector_get_type (void) G_GNUC_CONST;
#define SOY_TEXTURES_BUMPMAP_GET_PRIVATE(o) (G_TYPE_INSTANCE_GET_PRIVATE ((o), SOY_TEXTURES_TYPE_BUMPMAP, soytexturesBumpmapPrivate))
enum  {
	SOY_TEXTURES_BUMPMAP_DUMMY_PROPERTY
};
GQuark io_error_quark (void);
GQuark memory_error_quark (void);
soytexturesBumpmap* soy_textures_bumpmap_new_from_png (const gchar* filename, GError** error);
soytexturesBumpmap* soy_textures_bumpmap_construct_from_png (GType object_type, const gchar* filename, GError** error);
soytexturesTexture* soy_textures_texture_new_from_png (const gchar* filename, GError** error);
soytexturesTexture* soy_textures_texture_construct_from_png (GType object_type, const gchar* filename, GError** error);
soytexturesBumpmap* soy_textures_bumpmap_new_emboss (soytexturesTexture* texture);
soytexturesBumpmap* soy_textures_bumpmap_construct_emboss (GType object_type, soytexturesTexture* texture);
soytexturesTexture* soy_textures_texture_new (void);
soytexturesTexture* soy_textures_texture_construct (GType object_type);
GType soy_atoms_size_get_type (void) G_GNUC_CONST;
soyatomsSize* soy_textures_texture_get_size (soytexturesTexture* self);
gfloat soy_atoms_size_get_width (soyatomsSize* self);
gfloat soy_atoms_size_get_height (soyatomsSize* self);
void soy_textures_texture_resize (soytexturesTexture* self, gint c, gint x, gint y);
soyatomsVector* soy_textures_bumpmap_get (soytexturesBumpmap* self, gint index);
soyatomsVector* soy_atoms_vector_new (gfloat x, gfloat y, gfloat z);
soyatomsVector* soy_atoms_vector_construct (GType object_type, gfloat x, gfloat y, gfloat z);
static void _soy_textures_bumpmap_texel_set (soytexturesBumpmap* self, soyatomsVector* vector);
static void __soy_textures_bumpmap_texel_set_soy_atoms_vector_on_set (soyatomsVector* _sender, soyatomsVector* vector, gpointer self);
static void _soy_textures_bumpmap_texel_weak (soytexturesBumpmap* self, GObject* vector);
static void __soy_textures_bumpmap_texel_weak_gweak_notify (gpointer self, GObject* object);
void soy_textures_bumpmap_set (soytexturesBumpmap* self, gint index, GObject* value);
gfloat soy_atoms_vector_get_x (soyatomsVector* self);
void soy_atoms_vector_set_x (soyatomsVector* self, gfloat value);
gfloat soy_atoms_vector_get_y (soyatomsVector* self);
void soy_atoms_vector_set_y (soyatomsVector* self, gfloat value);
gfloat soy_atoms_vector_get_z (soyatomsVector* self);
void soy_atoms_vector_set_z (soyatomsVector* self, gfloat value);
soytexturesBumpmap* soy_textures_bumpmap_new (void);
soytexturesBumpmap* soy_textures_bumpmap_construct (GType object_type);
static GObject * soy_textures_bumpmap_constructor (GType type, guint n_construct_properties, GObjectConstructParam * construct_properties);
void soy_textures_texture_set_channels (soytexturesTexture* self, gint value);
static void soy_textures_bumpmap_finalize (GObject* obj);
static void _vala_clear_GMutex (GMutex * mutex);
static void _vala_clear_GRecMutex (GRecMutex * mutex);
static void _vala_clear_GRWLock (GRWLock * mutex);
static void _vala_clear_GCond (GCond * mutex);


soytexturesBumpmap* soy_textures_bumpmap_construct_from_png (GType object_type, const gchar* filename, GError** error) {
	soytexturesBumpmap * self = NULL;
	const gchar* _tmp0_;
	GError * _inner_error_ = NULL;
	g_return_val_if_fail (filename != NULL, NULL);
	_tmp0_ = filename;
	self = (soytexturesBumpmap*) soy_textures_texture_construct_from_png (object_type, _tmp0_, &_inner_error_);
	if (_inner_error_ != NULL) {
		if ((_inner_error_->domain == IO_ERROR) || (_inner_error_->domain == MEMORY_ERROR)) {
			g_propagate_error (error, _inner_error_);
			_g_object_unref0 (self);
			return NULL;
		} else {
			g_critical ("file %s: line %d: uncaught error: %s (%s, %d)", __FILE__, __LINE__, _inner_error_->message, g_quark_to_string (_inner_error_->domain), _inner_error_->code);
			g_clear_error (&_inner_error_);
			return NULL;
		}
	}
	return self;
}


soytexturesBumpmap* soy_textures_bumpmap_new_from_png (const gchar* filename, GError** error) {
	return soy_textures_bumpmap_construct_from_png (SOY_TEXTURES_TYPE_BUMPMAP, filename, error);
}


soytexturesBumpmap* soy_textures_bumpmap_construct_emboss (GType object_type, soytexturesTexture* texture) {
	soytexturesBumpmap * self = NULL;
	soytexturesTexture* _tmp0_;
	guchar* _tmp1_;
	guchar* tex;
	soytexturesTexture* _tmp2_;
	soyatomsSize* _tmp3_;
	soyatomsSize* _tmp4_;
	soyatomsSize* _tmp5_;
	gfloat _tmp6_;
	gfloat _tmp7_;
	gfloat _tmp8_;
	gfloat width;
	soytexturesTexture* _tmp9_;
	soyatomsSize* _tmp10_;
	soyatomsSize* _tmp11_;
	soyatomsSize* _tmp12_;
	gfloat _tmp13_;
	gfloat _tmp14_;
	gfloat _tmp15_;
	gfloat height;
	gfloat _tmp16_;
	gfloat _tmp17_;
	g_return_val_if_fail (texture != NULL, NULL);
	self = (soytexturesBumpmap*) soy_textures_texture_construct (object_type);
	_tmp0_ = texture;
	_tmp1_ = _tmp0_->texels;
	tex = _tmp1_;
	_tmp2_ = texture;
	_tmp3_ = soy_textures_texture_get_size (_tmp2_);
	_tmp4_ = _tmp3_;
	_tmp5_ = _tmp4_;
	_tmp6_ = soy_atoms_size_get_width (_tmp5_);
	_tmp7_ = _tmp6_;
	_tmp8_ = _tmp7_;
	_g_object_unref0 (_tmp5_);
	width = _tmp8_;
	_tmp9_ = texture;
	_tmp10_ = soy_textures_texture_get_size (_tmp9_);
	_tmp11_ = _tmp10_;
	_tmp12_ = _tmp11_;
	_tmp13_ = soy_atoms_size_get_height (_tmp12_);
	_tmp14_ = _tmp13_;
	_tmp15_ = _tmp14_;
	_g_object_unref0 (_tmp12_);
	height = _tmp15_;
	_tmp16_ = width;
	_tmp17_ = height;
	soy_textures_texture_resize ((soytexturesTexture*) self, 3, (gint) _tmp16_, (gint) _tmp17_);
	{
		gint i;
		i = 0;
		{
			gboolean _tmp18_;
			_tmp18_ = TRUE;
			while (TRUE) {
				gboolean _tmp19_;
				gfloat _tmp21_;
				_tmp19_ = _tmp18_;
				if (!_tmp19_) {
					gint _tmp20_;
					_tmp20_ = i;
					i = _tmp20_ + 1;
				}
				_tmp18_ = FALSE;
				_tmp21_ = height;
				if (!(i <= (_tmp21_ - 1))) {
					break;
				}
				{
					gint j;
					j = 0;
					{
						gboolean _tmp22_;
						_tmp22_ = TRUE;
						while (TRUE) {
							gboolean _tmp23_;
							gfloat _tmp25_;
							guchar* _tmp26_;
							gint _tmp27_;
							gdouble _tmp28_ = 0.0;
							gfloat _tmp29_;
							gint _tmp30_;
							gdouble _tmp31_ = 0.0;
							guchar _tmp32_;
							guchar ul;
							guchar* _tmp33_;
							gint _tmp34_;
							gdouble _tmp35_ = 0.0;
							gfloat _tmp36_;
							gint _tmp37_;
							guchar _tmp38_;
							guchar u;
							guchar* _tmp39_;
							gint _tmp40_;
							gdouble _tmp41_ = 0.0;
							gfloat _tmp42_;
							gfloat _tmp43_;
							gint _tmp44_;
							gdouble _tmp45_ = 0.0;
							guchar _tmp46_;
							guchar ur;
							guchar* _tmp47_;
							gint _tmp48_;
							gfloat _tmp49_;
							gint _tmp50_;
							gdouble _tmp51_ = 0.0;
							guchar _tmp52_;
							guchar l;
							guchar* _tmp53_;
							gint _tmp54_;
							gfloat _tmp55_;
							gfloat _tmp56_;
							gint _tmp57_;
							gdouble _tmp58_ = 0.0;
							guchar _tmp59_;
							guchar r;
							guchar* _tmp60_;
							gfloat _tmp61_;
							gint _tmp62_;
							gdouble _tmp63_ = 0.0;
							gfloat _tmp64_;
							gint _tmp65_;
							gdouble _tmp66_ = 0.0;
							guchar _tmp67_;
							guchar dl;
							guchar* _tmp68_;
							gfloat _tmp69_;
							gint _tmp70_;
							gdouble _tmp71_ = 0.0;
							gfloat _tmp72_;
							gint _tmp73_;
							guchar _tmp74_;
							guchar d;
							guchar* _tmp75_;
							gfloat _tmp76_;
							gint _tmp77_;
							gdouble _tmp78_ = 0.0;
							gfloat _tmp79_;
							gfloat _tmp80_;
							gint _tmp81_;
							gdouble _tmp82_ = 0.0;
							guchar _tmp83_;
							guchar dr;
							guchar _tmp84_;
							guchar _tmp85_;
							guchar _tmp86_;
							guchar _tmp87_;
							guchar _tmp88_;
							guchar _tmp89_;
							gint x;
							guchar _tmp90_;
							guchar _tmp91_;
							guchar _tmp92_;
							guchar _tmp93_;
							guchar _tmp94_;
							guchar _tmp95_;
							gint y;
							gfloat z;
							gint _tmp96_;
							gint _tmp97_;
							gint _tmp98_;
							gint _tmp99_;
							gfloat _tmp100_;
							gfloat _tmp101_;
							gfloat _tmp102_ = 0.0F;
							gfloat mag;
							guchar* _tmp103_;
							gint _tmp104_;
							gfloat _tmp105_;
							gint _tmp106_;
							gint _tmp107_;
							gfloat _tmp108_;
							guchar _tmp109_;
							guchar* _tmp110_;
							gint _tmp111_;
							gfloat _tmp112_;
							gint _tmp113_;
							gint _tmp114_;
							gfloat _tmp115_;
							guchar _tmp116_;
							guchar* _tmp117_;
							gint _tmp118_;
							gfloat _tmp119_;
							gint _tmp120_;
							gfloat _tmp121_;
							gfloat _tmp122_;
							guchar _tmp123_;
							_tmp23_ = _tmp22_;
							if (!_tmp23_) {
								gint _tmp24_;
								_tmp24_ = j;
								j = _tmp24_ + 1;
							}
							_tmp22_ = FALSE;
							_tmp25_ = width;
							if (!(j <= (_tmp25_ - 1))) {
								break;
							}
							_tmp26_ = tex;
							_tmp27_ = i;
							_tmp28_ = fmax ((gdouble) 0, (gdouble) (_tmp27_ - 1));
							_tmp29_ = width;
							_tmp30_ = j;
							_tmp31_ = fmax ((gdouble) 0, (gdouble) (_tmp30_ - 1));
							_tmp32_ = _tmp26_[(gint) ((_tmp28_ * _tmp29_) + _tmp31_)];
							ul = _tmp32_;
							_tmp33_ = tex;
							_tmp34_ = i;
							_tmp35_ = fmax ((gdouble) 0, (gdouble) (_tmp34_ - 1));
							_tmp36_ = width;
							_tmp37_ = j;
							_tmp38_ = _tmp33_[(gint) ((_tmp35_ * _tmp36_) + _tmp37_)];
							u = _tmp38_;
							_tmp39_ = tex;
							_tmp40_ = i;
							_tmp41_ = fmax ((gdouble) 0, (gdouble) (_tmp40_ - 1));
							_tmp42_ = width;
							_tmp43_ = width;
							_tmp44_ = j;
							_tmp45_ = fmin ((gdouble) (_tmp43_ - 1), (gdouble) (_tmp44_ + 1));
							_tmp46_ = _tmp39_[(gint) ((_tmp41_ * _tmp42_) + _tmp45_)];
							ur = _tmp46_;
							_tmp47_ = tex;
							_tmp48_ = i;
							_tmp49_ = width;
							_tmp50_ = j;
							_tmp51_ = fmax ((gdouble) 0, (gdouble) (_tmp50_ - 1));
							_tmp52_ = _tmp47_[(gint) ((_tmp48_ * _tmp49_) + _tmp51_)];
							l = _tmp52_;
							_tmp53_ = tex;
							_tmp54_ = i;
							_tmp55_ = width;
							_tmp56_ = width;
							_tmp57_ = j;
							_tmp58_ = fmin ((gdouble) (_tmp56_ - 1), (gdouble) (_tmp57_ + 1));
							_tmp59_ = _tmp53_[(gint) ((_tmp54_ * _tmp55_) + _tmp58_)];
							r = _tmp59_;
							_tmp60_ = tex;
							_tmp61_ = height;
							_tmp62_ = i;
							_tmp63_ = fmin ((gdouble) (_tmp61_ - 1), (gdouble) (_tmp62_ + 1));
							_tmp64_ = width;
							_tmp65_ = j;
							_tmp66_ = fmax ((gdouble) 0, (gdouble) (_tmp65_ - 1));
							_tmp67_ = _tmp60_[(gint) ((_tmp63_ * _tmp64_) + _tmp66_)];
							dl = _tmp67_;
							_tmp68_ = tex;
							_tmp69_ = height;
							_tmp70_ = i;
							_tmp71_ = fmin ((gdouble) (_tmp69_ - 1), (gdouble) (_tmp70_ + 1));
							_tmp72_ = width;
							_tmp73_ = j;
							_tmp74_ = _tmp68_[(gint) ((_tmp71_ * _tmp72_) + _tmp73_)];
							d = _tmp74_;
							_tmp75_ = tex;
							_tmp76_ = height;
							_tmp77_ = i;
							_tmp78_ = fmin ((gdouble) (_tmp76_ - 1), (gdouble) (_tmp77_ + 1));
							_tmp79_ = width;
							_tmp80_ = width;
							_tmp81_ = j;
							_tmp82_ = fmin ((gdouble) (_tmp80_ - 1), (gdouble) (_tmp81_ + 1));
							_tmp83_ = _tmp75_[(gint) ((_tmp78_ * _tmp79_) + _tmp82_)];
							dr = _tmp83_;
							_tmp84_ = ul;
							_tmp85_ = ur;
							_tmp86_ = l;
							_tmp87_ = r;
							_tmp88_ = dl;
							_tmp89_ = dr;
							x = ((((_tmp84_ - _tmp85_) + (2 * _tmp86_)) - (2 * _tmp87_)) + _tmp88_) - _tmp89_;
							_tmp90_ = ul;
							_tmp91_ = u;
							_tmp92_ = ur;
							_tmp93_ = dl;
							_tmp94_ = d;
							_tmp95_ = dr;
							y = ((((_tmp90_ + (2 * _tmp91_)) + _tmp92_) - _tmp93_) - (2 * _tmp94_)) - _tmp95_;
							z = 0.5f;
							_tmp96_ = x;
							_tmp97_ = x;
							_tmp98_ = y;
							_tmp99_ = y;
							_tmp100_ = z;
							_tmp101_ = z;
							_tmp102_ = sqrtf (((_tmp96_ * _tmp97_) + (_tmp98_ * _tmp99_)) + (_tmp100_ * _tmp101_));
							mag = _tmp102_;
							_tmp103_ = ((soytexturesTexture*) self)->texels;
							_tmp104_ = i;
							_tmp105_ = width;
							_tmp106_ = j;
							_tmp107_ = x;
							_tmp108_ = mag;
							_tmp103_[((gint) ((_tmp104_ * _tmp105_) + _tmp106_)) * 3] = (guchar) (((_tmp107_ / _tmp108_) + 1) * 127.5f);
							_tmp109_ = _tmp103_[((gint) ((_tmp104_ * _tmp105_) + _tmp106_)) * 3];
							_tmp110_ = ((soytexturesTexture*) self)->texels;
							_tmp111_ = i;
							_tmp112_ = width;
							_tmp113_ = j;
							_tmp114_ = y;
							_tmp115_ = mag;
							_tmp110_[(((gint) ((_tmp111_ * _tmp112_) + _tmp113_)) * 3) + 1] = (guchar) (((_tmp114_ / _tmp115_) + 1) * 127.5f);
							_tmp116_ = _tmp110_[(((gint) ((_tmp111_ * _tmp112_) + _tmp113_)) * 3) + 1];
							_tmp117_ = ((soytexturesTexture*) self)->texels;
							_tmp118_ = i;
							_tmp119_ = width;
							_tmp120_ = j;
							_tmp121_ = z;
							_tmp122_ = mag;
							_tmp117_[(((gint) ((_tmp118_ * _tmp119_) + _tmp120_)) * 3) + 2] = (guchar) (((_tmp121_ / _tmp122_) + 1) * 127.5f);
							_tmp123_ = _tmp117_[(((gint) ((_tmp118_ * _tmp119_) + _tmp120_)) * 3) + 2];
						}
					}
				}
			}
		}
	}
	return self;
}


soytexturesBumpmap* soy_textures_bumpmap_new_emboss (soytexturesTexture* texture) {
	return soy_textures_bumpmap_construct_emboss (SOY_TEXTURES_TYPE_BUMPMAP, texture);
}


static gpointer _g_object_ref0 (gpointer self) {
	return self ? g_object_ref (self) : NULL;
}


static void __soy_textures_bumpmap_texel_set_soy_atoms_vector_on_set (soyatomsVector* _sender, soyatomsVector* vector, gpointer self) {
	_soy_textures_bumpmap_texel_set (self, vector);
}


static void __soy_textures_bumpmap_texel_weak_gweak_notify (gpointer self, GObject* object) {
	_soy_textures_bumpmap_texel_weak (self, object);
}


soyatomsVector* soy_textures_bumpmap_get (soytexturesBumpmap* self, gint index) {
	soyatomsVector* result = NULL;
	soyatomsVector* ret;
	gboolean _tmp0_ = FALSE;
	gint _tmp1_;
	gboolean _tmp13_;
	GeeHashMap* _tmp14_;
	gint _tmp15_;
	gboolean _tmp16_ = FALSE;
	soyatomsVector* _tmp34_;
	soyatomsVector* _tmp35_;
	GeeHashMap* _tmp36_;
	gint _tmp37_;
	soyatomsVector* _tmp38_;
	soyatomsVector* _tmp39_;
	g_return_val_if_fail (self != NULL, NULL);
	ret = NULL;
	_tmp1_ = index;
	if (_tmp1_ < 0) {
		_tmp0_ = TRUE;
	} else {
		gint _tmp2_;
		soyatomsSize* _tmp3_;
		soyatomsSize* _tmp4_;
		soyatomsSize* _tmp5_;
		gfloat _tmp6_;
		gfloat _tmp7_;
		soyatomsSize* _tmp8_;
		soyatomsSize* _tmp9_;
		soyatomsSize* _tmp10_;
		gfloat _tmp11_;
		gfloat _tmp12_;
		_tmp2_ = index;
		_tmp3_ = soy_textures_texture_get_size ((soytexturesTexture*) self);
		_tmp4_ = _tmp3_;
		_tmp5_ = _tmp4_;
		_tmp6_ = soy_atoms_size_get_width (_tmp5_);
		_tmp7_ = _tmp6_;
		_tmp8_ = soy_textures_texture_get_size ((soytexturesTexture*) self);
		_tmp9_ = _tmp8_;
		_tmp10_ = _tmp9_;
		_tmp11_ = soy_atoms_size_get_height (_tmp10_);
		_tmp12_ = _tmp11_;
		_tmp0_ = ((gfloat) _tmp2_) >= (_tmp7_ * _tmp12_);
		_g_object_unref0 (_tmp10_);
		_g_object_unref0 (_tmp5_);
	}
	_tmp13_ = _tmp0_;
	if (_tmp13_) {
		result = NULL;
		_g_object_unref0 (ret);
		return result;
	}
	_tmp14_ = self->priv->_texel_objs;
	_tmp15_ = index;
	_tmp16_ = gee_abstract_map_has_key ((GeeAbstractMap*) _tmp14_, (gpointer) ((gintptr) _tmp15_));
	if (_tmp16_) {
		GeeHashMap* _tmp17_;
		gint _tmp18_;
		gpointer _tmp19_ = NULL;
		soyatomsVector* _tmp20_;
		_tmp17_ = self->priv->_texel_objs;
		_tmp18_ = index;
		_tmp19_ = gee_abstract_map_get ((GeeAbstractMap*) _tmp17_, (gpointer) ((gintptr) _tmp18_));
		_tmp20_ = _g_object_ref0 ((soyatomsVector*) _tmp19_);
		_g_object_unref0 (ret);
		ret = _tmp20_;
	} else {
		guchar* _tmp21_;
		gint _tmp22_;
		guchar _tmp23_;
		gfloat x;
		guchar* _tmp24_;
		gint _tmp25_;
		guchar _tmp26_;
		gfloat y;
		guchar* _tmp27_;
		gint _tmp28_;
		guchar _tmp29_;
		gfloat z;
		gfloat _tmp30_;
		gfloat _tmp31_;
		gfloat _tmp32_;
		soyatomsVector* _tmp33_;
		_tmp21_ = ((soytexturesTexture*) self)->texels;
		_tmp22_ = index;
		_tmp23_ = _tmp21_[_tmp22_ * 3];
		x = (_tmp23_ - 127) / 128.0f;
		_tmp24_ = ((soytexturesTexture*) self)->texels;
		_tmp25_ = index;
		_tmp26_ = _tmp24_[(_tmp25_ * 3) + 1];
		y = (_tmp26_ - 127) / 128.0f;
		_tmp27_ = ((soytexturesTexture*) self)->texels;
		_tmp28_ = index;
		_tmp29_ = _tmp27_[(_tmp28_ * 3) + 2];
		z = (_tmp29_ - 127) / 128.0f;
		_tmp30_ = x;
		_tmp31_ = y;
		_tmp32_ = z;
		_tmp33_ = soy_atoms_vector_new (_tmp30_, _tmp31_, _tmp32_);
		_g_object_unref0 (ret);
		ret = _tmp33_;
	}
	_tmp34_ = ret;
	g_signal_connect_object (_tmp34_, "on-set", (GCallback) __soy_textures_bumpmap_texel_set_soy_atoms_vector_on_set, self, 0);
	_tmp35_ = ret;
	g_object_weak_ref ((GObject*) _tmp35_, __soy_textures_bumpmap_texel_weak_gweak_notify, self);
	_tmp36_ = self->priv->_texel_objs;
	_tmp37_ = index;
	_tmp38_ = ret;
	gee_abstract_map_set ((GeeAbstractMap*) _tmp36_, (gpointer) ((gintptr) _tmp37_), _tmp38_);
	_tmp39_ = ret;
	ret = NULL;
	result = _tmp39_;
	_g_object_unref0 (ret);
	return result;
}


void soy_textures_bumpmap_set (soytexturesBumpmap* self, gint index, GObject* value) {
	soyatomsVector* vector = NULL;
	GObject* _tmp0_;
	GObject* _tmp1_;
	soyatomsVector* _tmp2_;
	soyatomsVector* _tmp3_;
	gfloat _tmp4_;
	gfloat _tmp5_;
	soyatomsVector* _tmp11_;
	gfloat _tmp12_;
	gfloat _tmp13_;
	soyatomsVector* _tmp19_;
	gfloat _tmp20_;
	gfloat _tmp21_;
	GeeHashMap* _tmp27_;
	gint _tmp28_;
	gboolean _tmp29_ = FALSE;
	GeeHashMap* _tmp37_;
	gint _tmp38_;
	soyatomsVector* _tmp39_;
	soyatomsVector* _tmp40_;
	soyatomsVector* _tmp41_;
	guchar* _tmp42_;
	gint _tmp43_;
	soyatomsVector* _tmp44_;
	gfloat _tmp45_;
	gfloat _tmp46_;
	guchar _tmp47_;
	guchar* _tmp48_;
	gint _tmp49_;
	soyatomsVector* _tmp50_;
	gfloat _tmp51_;
	gfloat _tmp52_;
	guchar _tmp53_;
	guchar* _tmp54_;
	gint _tmp55_;
	soyatomsVector* _tmp56_;
	gfloat _tmp57_;
	gfloat _tmp58_;
	guchar _tmp59_;
	g_return_if_fail (self != NULL);
	g_return_if_fail (value != NULL);
	_tmp0_ = value;
	if (!G_TYPE_CHECK_INSTANCE_TYPE (_tmp0_, SOY_ATOMS_TYPE_VECTOR)) {
		_g_object_unref0 (vector);
		return;
	}
	_tmp1_ = value;
	_tmp2_ = _g_object_ref0 (G_TYPE_CHECK_INSTANCE_CAST (_tmp1_, SOY_ATOMS_TYPE_VECTOR, soyatomsVector));
	_g_object_unref0 (vector);
	vector = _tmp2_;
	_tmp3_ = vector;
	_tmp4_ = soy_atoms_vector_get_x (_tmp3_);
	_tmp5_ = _tmp4_;
	if (_tmp5_ > 1.0f) {
		soyatomsVector* _tmp6_;
		_tmp6_ = vector;
		soy_atoms_vector_set_x (_tmp6_, 1.0f);
	} else {
		soyatomsVector* _tmp7_;
		gfloat _tmp8_;
		gfloat _tmp9_;
		_tmp7_ = vector;
		_tmp8_ = soy_atoms_vector_get_x (_tmp7_);
		_tmp9_ = _tmp8_;
		if (_tmp9_ < (-1.0f)) {
			soyatomsVector* _tmp10_;
			_tmp10_ = vector;
			soy_atoms_vector_set_x (_tmp10_, -1.0f);
		}
	}
	_tmp11_ = vector;
	_tmp12_ = soy_atoms_vector_get_y (_tmp11_);
	_tmp13_ = _tmp12_;
	if (_tmp13_ > 1.0f) {
		soyatomsVector* _tmp14_;
		_tmp14_ = vector;
		soy_atoms_vector_set_y (_tmp14_, 1.0f);
	} else {
		soyatomsVector* _tmp15_;
		gfloat _tmp16_;
		gfloat _tmp17_;
		_tmp15_ = vector;
		_tmp16_ = soy_atoms_vector_get_y (_tmp15_);
		_tmp17_ = _tmp16_;
		if (_tmp17_ < (-1.0f)) {
			soyatomsVector* _tmp18_;
			_tmp18_ = vector;
			soy_atoms_vector_set_y (_tmp18_, -1.0f);
		}
	}
	_tmp19_ = vector;
	_tmp20_ = soy_atoms_vector_get_z (_tmp19_);
	_tmp21_ = _tmp20_;
	if (_tmp21_ > 1.0f) {
		soyatomsVector* _tmp22_;
		_tmp22_ = vector;
		soy_atoms_vector_set_z (_tmp22_, 1.0f);
	} else {
		soyatomsVector* _tmp23_;
		gfloat _tmp24_;
		gfloat _tmp25_;
		_tmp23_ = vector;
		_tmp24_ = soy_atoms_vector_get_z (_tmp23_);
		_tmp25_ = _tmp24_;
		if (_tmp25_ < (-1.0f)) {
			soyatomsVector* _tmp26_;
			_tmp26_ = vector;
			soy_atoms_vector_set_z (_tmp26_, -1.0f);
		}
	}
	_tmp27_ = self->priv->_texel_objs;
	_tmp28_ = index;
	_tmp29_ = gee_abstract_map_has_key ((GeeAbstractMap*) _tmp27_, (gpointer) ((gintptr) _tmp28_));
	if (_tmp29_) {
		GeeHashMap* _tmp30_;
		gint _tmp31_;
		gpointer _tmp32_ = NULL;
		soyatomsVector* _tmp33_;
		soyatomsVector* old;
		soyatomsVector* _tmp34_;
		guint _tmp35_ = 0U;
		soyatomsVector* _tmp36_;
		_tmp30_ = self->priv->_texel_objs;
		_tmp31_ = index;
		_tmp32_ = gee_abstract_map_get ((GeeAbstractMap*) _tmp30_, (gpointer) ((gintptr) _tmp31_));
		_tmp33_ = _g_object_ref0 ((soyatomsVector*) _tmp32_);
		old = _tmp33_;
		_tmp34_ = old;
		g_signal_parse_name ("on-set", SOY_ATOMS_TYPE_VECTOR, &_tmp35_, NULL, FALSE);
		g_signal_handlers_disconnect_matched (_tmp34_, G_SIGNAL_MATCH_ID | G_SIGNAL_MATCH_FUNC | G_SIGNAL_MATCH_DATA, _tmp35_, 0, NULL, (GCallback) __soy_textures_bumpmap_texel_set_soy_atoms_vector_on_set, self);
		_tmp36_ = old;
		g_object_weak_unref ((GObject*) _tmp36_, __soy_textures_bumpmap_texel_weak_gweak_notify, self);
		_g_object_unref0 (old);
	}
	_tmp37_ = self->priv->_texel_objs;
	_tmp38_ = index;
	_tmp39_ = vector;
	gee_abstract_map_set ((GeeAbstractMap*) _tmp37_, (gpointer) ((gintptr) _tmp38_), _tmp39_);
	_tmp40_ = vector;
	g_signal_connect_object (_tmp40_, "on-set", (GCallback) __soy_textures_bumpmap_texel_set_soy_atoms_vector_on_set, self, 0);
	_tmp41_ = vector;
	g_object_weak_ref ((GObject*) _tmp41_, __soy_textures_bumpmap_texel_weak_gweak_notify, self);
	_tmp42_ = ((soytexturesTexture*) self)->texels;
	_tmp43_ = index;
	_tmp44_ = vector;
	_tmp45_ = soy_atoms_vector_get_x (_tmp44_);
	_tmp46_ = _tmp45_;
	_tmp42_[_tmp43_ * 3] = (guchar) ((gchar) (_tmp46_ * 128.0f));
	_tmp47_ = _tmp42_[_tmp43_ * 3];
	_tmp48_ = ((soytexturesTexture*) self)->texels;
	_tmp49_ = index;
	_tmp50_ = vector;
	_tmp51_ = soy_atoms_vector_get_y (_tmp50_);
	_tmp52_ = _tmp51_;
	_tmp48_[(_tmp49_ * 3) + 1] = (guchar) ((gchar) (_tmp52_ * 128.0f));
	_tmp53_ = _tmp48_[(_tmp49_ * 3) + 1];
	_tmp54_ = ((soytexturesTexture*) self)->texels;
	_tmp55_ = index;
	_tmp56_ = vector;
	_tmp57_ = soy_atoms_vector_get_z (_tmp56_);
	_tmp58_ = _tmp57_;
	_tmp54_[(_tmp55_ * 3) + 2] = (guchar) ((gchar) (_tmp58_ * 128.0f));
	_tmp59_ = _tmp54_[(_tmp55_ * 3) + 2];
	g_mutex_lock (&self->priv->_mutex);
	((soytexturesTexture*) self)->updated = TRUE;
	g_mutex_unlock (&self->priv->_mutex);
	_g_object_unref0 (vector);
}


static void _soy_textures_bumpmap_texel_set (soytexturesBumpmap* self, soyatomsVector* vector) {
	g_return_if_fail (self != NULL);
	g_return_if_fail (vector != NULL);
	{
		GeeHashMap* _tmp0_;
		GeeSet* _tmp1_;
		GeeSet* _tmp2_;
		GeeSet* _tmp3_;
		GeeIterator* _tmp4_ = NULL;
		GeeIterator* _tmp5_;
		GeeIterator* _index_it;
		_tmp0_ = self->priv->_texel_objs;
		_tmp1_ = gee_abstract_map_get_keys ((GeeMap*) _tmp0_);
		_tmp2_ = _tmp1_;
		_tmp3_ = _tmp2_;
		_tmp4_ = gee_iterable_iterator ((GeeIterable*) _tmp3_);
		_tmp5_ = _tmp4_;
		_g_object_unref0 (_tmp3_);
		_index_it = _tmp5_;
		while (TRUE) {
			GeeIterator* _tmp6_;
			gboolean _tmp7_ = FALSE;
			GeeIterator* _tmp8_;
			gpointer _tmp9_ = NULL;
			gint index;
			GeeHashMap* _tmp10_;
			gint _tmp11_;
			gpointer _tmp12_ = NULL;
			soyatomsVector* _tmp13_;
			_tmp6_ = _index_it;
			_tmp7_ = gee_iterator_next (_tmp6_);
			if (!_tmp7_) {
				break;
			}
			_tmp8_ = _index_it;
			_tmp9_ = gee_iterator_get (_tmp8_);
			index = (gint) ((gintptr) _tmp9_);
			_tmp10_ = self->priv->_texel_objs;
			_tmp11_ = index;
			_tmp12_ = gee_abstract_map_get ((GeeAbstractMap*) _tmp10_, (gpointer) ((gintptr) _tmp11_));
			_tmp13_ = vector;
			if (((soyatomsVector*) _tmp12_) == _tmp13_) {
				guchar* _tmp14_;
				gint _tmp15_;
				soyatomsVector* _tmp16_;
				gfloat _tmp17_;
				gfloat _tmp18_;
				guchar _tmp19_;
				guchar* _tmp20_;
				gint _tmp21_;
				soyatomsVector* _tmp22_;
				gfloat _tmp23_;
				gfloat _tmp24_;
				guchar _tmp25_;
				guchar* _tmp26_;
				gint _tmp27_;
				soyatomsVector* _tmp28_;
				gfloat _tmp29_;
				gfloat _tmp30_;
				guchar _tmp31_;
				_tmp14_ = ((soytexturesTexture*) self)->texels;
				_tmp15_ = index;
				_tmp16_ = vector;
				_tmp17_ = soy_atoms_vector_get_x (_tmp16_);
				_tmp18_ = _tmp17_;
				_tmp14_[_tmp15_ * 3] = (guchar) ((gchar) (_tmp18_ * 128.0f));
				_tmp19_ = _tmp14_[_tmp15_ * 3];
				_tmp20_ = ((soytexturesTexture*) self)->texels;
				_tmp21_ = index;
				_tmp22_ = vector;
				_tmp23_ = soy_atoms_vector_get_y (_tmp22_);
				_tmp24_ = _tmp23_;
				_tmp20_[(_tmp21_ * 3) + 1] = (guchar) ((gchar) (_tmp24_ * 128.0f));
				_tmp25_ = _tmp20_[(_tmp21_ * 3) + 1];
				_tmp26_ = ((soytexturesTexture*) self)->texels;
				_tmp27_ = index;
				_tmp28_ = vector;
				_tmp29_ = soy_atoms_vector_get_z (_tmp28_);
				_tmp30_ = _tmp29_;
				_tmp26_[(_tmp27_ * 3) + 2] = (guchar) ((gchar) (_tmp30_ * 128.0f));
				_tmp31_ = _tmp26_[(_tmp27_ * 3) + 2];
			}
		}
		_g_object_unref0 (_index_it);
	}
	g_mutex_lock (&self->priv->_mutex);
	((soytexturesTexture*) self)->updated = TRUE;
	g_mutex_unlock (&self->priv->_mutex);
}


static void _soy_textures_bumpmap_texel_weak (soytexturesBumpmap* self, GObject* vector) {
	GeeArrayList* _tmp0_;
	GeeArrayList* garbage;
	g_return_if_fail (self != NULL);
	g_return_if_fail (vector != NULL);
	_tmp0_ = gee_array_list_new (G_TYPE_INT, NULL, NULL, NULL);
	garbage = _tmp0_;
	{
		GeeHashMap* _tmp1_;
		GeeSet* _tmp2_;
		GeeSet* _tmp3_;
		GeeSet* _tmp4_;
		GeeIterator* _tmp5_ = NULL;
		GeeIterator* _tmp6_;
		GeeIterator* _index_it;
		_tmp1_ = self->priv->_texel_objs;
		_tmp2_ = gee_abstract_map_get_keys ((GeeMap*) _tmp1_);
		_tmp3_ = _tmp2_;
		_tmp4_ = _tmp3_;
		_tmp5_ = gee_iterable_iterator ((GeeIterable*) _tmp4_);
		_tmp6_ = _tmp5_;
		_g_object_unref0 (_tmp4_);
		_index_it = _tmp6_;
		while (TRUE) {
			GeeIterator* _tmp7_;
			gboolean _tmp8_ = FALSE;
			GeeIterator* _tmp9_;
			gpointer _tmp10_ = NULL;
			gint index;
			GeeHashMap* _tmp11_;
			gint _tmp12_;
			gpointer _tmp13_ = NULL;
			GObject* _tmp14_;
			_tmp7_ = _index_it;
			_tmp8_ = gee_iterator_next (_tmp7_);
			if (!_tmp8_) {
				break;
			}
			_tmp9_ = _index_it;
			_tmp10_ = gee_iterator_get (_tmp9_);
			index = (gint) ((gintptr) _tmp10_);
			_tmp11_ = self->priv->_texel_objs;
			_tmp12_ = index;
			_tmp13_ = gee_abstract_map_get ((GeeAbstractMap*) _tmp11_, (gpointer) ((gintptr) _tmp12_));
			_tmp14_ = vector;
			if (G_TYPE_CHECK_INSTANCE_CAST ((soyatomsVector*) _tmp13_, G_TYPE_OBJECT, GObject) == _tmp14_) {
				GeeArrayList* _tmp15_;
				gint _tmp16_;
				_tmp15_ = garbage;
				_tmp16_ = index;
				gee_abstract_collection_add ((GeeAbstractCollection*) _tmp15_, (gpointer) ((gintptr) _tmp16_));
			}
		}
		_g_object_unref0 (_index_it);
	}
	{
		GeeArrayList* _tmp17_;
		GeeArrayList* _tmp18_;
		GeeArrayList* _index_list;
		GeeArrayList* _tmp19_;
		gint _tmp20_;
		gint _tmp21_;
		gint _index_size;
		gint _index_index;
		_tmp17_ = garbage;
		_tmp18_ = _g_object_ref0 (_tmp17_);
		_index_list = _tmp18_;
		_tmp19_ = _index_list;
		_tmp20_ = gee_abstract_collection_get_size ((GeeCollection*) _tmp19_);
		_tmp21_ = _tmp20_;
		_index_size = _tmp21_;
		_index_index = -1;
		while (TRUE) {
			gint _tmp22_;
			gint _tmp23_;
			gint _tmp24_;
			GeeArrayList* _tmp25_;
			gint _tmp26_;
			gpointer _tmp27_ = NULL;
			gint index;
			GeeHashMap* _tmp28_;
			gint _tmp29_;
			_tmp22_ = _index_index;
			_index_index = _tmp22_ + 1;
			_tmp23_ = _index_index;
			_tmp24_ = _index_size;
			if (!(_tmp23_ < _tmp24_)) {
				break;
			}
			_tmp25_ = _index_list;
			_tmp26_ = _index_index;
			_tmp27_ = gee_abstract_list_get ((GeeAbstractList*) _tmp25_, _tmp26_);
			index = (gint) ((gintptr) _tmp27_);
			_tmp28_ = self->priv->_texel_objs;
			_tmp29_ = index;
			gee_abstract_map_unset ((GeeAbstractMap*) _tmp28_, (gpointer) ((gintptr) _tmp29_), NULL);
		}
		_g_object_unref0 (_index_list);
	}
	_g_object_unref0 (garbage);
}


soytexturesBumpmap* soy_textures_bumpmap_construct (GType object_type) {
	soytexturesBumpmap * self = NULL;
	self = (soytexturesBumpmap*) soy_textures_texture_construct (object_type);
	return self;
}


soytexturesBumpmap* soy_textures_bumpmap_new (void) {
	return soy_textures_bumpmap_construct (SOY_TEXTURES_TYPE_BUMPMAP);
}


static GObject * soy_textures_bumpmap_constructor (GType type, guint n_construct_properties, GObjectConstructParam * construct_properties) {
	GObject * obj;
	GObjectClass * parent_class;
	soytexturesBumpmap * self;
	GeeHashMap* _tmp0_;
	parent_class = G_OBJECT_CLASS (soy_textures_bumpmap_parent_class);
	obj = parent_class->constructor (type, n_construct_properties, construct_properties);
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_TEXTURES_TYPE_BUMPMAP, soytexturesBumpmap);
	_tmp0_ = gee_hash_map_new (G_TYPE_INT, NULL, NULL, SOY_ATOMS_TYPE_VECTOR, NULL, NULL, NULL, NULL, NULL);
	_g_object_unref0 (self->priv->_texel_objs);
	self->priv->_texel_objs = _tmp0_;
	_vala_clear_GMutex (&self->priv->_mutex);
	g_mutex_init (&self->priv->_mutex);
	soy_textures_texture_set_channels ((soytexturesTexture*) self, 3);
	((soytexturesTexture*) self)->translucent = FALSE;
	return obj;
}


static void soy_textures_bumpmap_class_init (soytexturesBumpmapClass * klass) {
	soy_textures_bumpmap_parent_class = g_type_class_peek_parent (klass);
	g_type_class_add_private (klass, sizeof (soytexturesBumpmapPrivate));
	G_OBJECT_CLASS (klass)->constructor = soy_textures_bumpmap_constructor;
	G_OBJECT_CLASS (klass)->finalize = soy_textures_bumpmap_finalize;
}


static void soy_textures_bumpmap_instance_init (soytexturesBumpmap * self) {
	self->priv = SOY_TEXTURES_BUMPMAP_GET_PRIVATE (self);
}


static void soy_textures_bumpmap_finalize (GObject* obj) {
	soytexturesBumpmap * self;
	self = G_TYPE_CHECK_INSTANCE_CAST (obj, SOY_TEXTURES_TYPE_BUMPMAP, soytexturesBumpmap);
	_g_object_unref0 (self->priv->_texel_objs);
	_vala_clear_GMutex (&self->priv->_mutex);
	G_OBJECT_CLASS (soy_textures_bumpmap_parent_class)->finalize (obj);
}


GType soy_textures_bumpmap_get_type (void) {
	static volatile gsize soy_textures_bumpmap_type_id__volatile = 0;
	if (g_once_init_enter (&soy_textures_bumpmap_type_id__volatile)) {
		static const GTypeInfo g_define_type_info = { sizeof (soytexturesBumpmapClass), (GBaseInitFunc) NULL, (GBaseFinalizeFunc) NULL, (GClassInitFunc) soy_textures_bumpmap_class_init, (GClassFinalizeFunc) NULL, NULL, sizeof (soytexturesBumpmap), 0, (GInstanceInitFunc) soy_textures_bumpmap_instance_init, NULL };
		GType soy_textures_bumpmap_type_id;
		soy_textures_bumpmap_type_id = g_type_register_static (SOY_TEXTURES_TYPE_TEXTURE, "soytexturesBumpmap", &g_define_type_info, 0);
		g_once_init_leave (&soy_textures_bumpmap_type_id__volatile, soy_textures_bumpmap_type_id);
	}
	return soy_textures_bumpmap_type_id__volatile;
}


static void _vala_clear_GMutex (GMutex * mutex) {
	GMutex zero_mutex = { 0 };
	if (memcmp (mutex, &zero_mutex, sizeof (GMutex))) {
		g_mutex_clear (mutex);
		memset (mutex, 0, sizeof (GMutex));
	}
}


static void _vala_clear_GRecMutex (GRecMutex * mutex) {
	GRecMutex zero_mutex = { 0 };
	if (memcmp (mutex, &zero_mutex, sizeof (GRecMutex))) {
		g_rec_mutex_clear (mutex);
		memset (mutex, 0, sizeof (GRecMutex));
	}
}


static void _vala_clear_GRWLock (GRWLock * mutex) {
	GRWLock zero_mutex = { 0 };
	if (memcmp (mutex, &zero_mutex, sizeof (GRWLock))) {
		g_rw_lock_clear (mutex);
		memset (mutex, 0, sizeof (GRWLock));
	}
}


static void _vala_clear_GCond (GCond * mutex) {
	GCond zero_mutex = { 0 };
	if (memcmp (mutex, &zero_mutex, sizeof (GCond))) {
		g_cond_clear (mutex);
		memset (mutex, 0, sizeof (GCond));
	}
}


