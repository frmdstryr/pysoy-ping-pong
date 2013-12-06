/* gles.vapi
 *
 *  Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

#if GLES_AVAILABLE
[CCode (lower_case_cprefix="", cheader_filename="GLES/gl.h,GLES/glext.h")]
#else
#if WINDOWS
[CCode (cheader_filename="windows.h")]
#endif
[CCode (lower_case_cprefix="", cheader_filename="GL/gl.h,GL/glext.h")]
#endif

namespace GL {
    [CCode (cname="GLvoid")]
    public struct GLvoid { }
    [CCode (cname="GLchar")]
    public struct GLchar { }
    [CCode (cname="GLenum")]
    public struct GLenum : uint { }
    [CCode (cname="GLboolean")]
    public struct GLboolean : bool { }
    [CCode (cname="GLbitfield")]
    public struct GLbitfield : uint { }
    [CCode (cname="GLbyte")]
    public struct GLbyte : char { }
    [CCode (cname="GLshort")]
    public struct GLshort : short { }
    [CCode (cname="GLint")]
    public struct GLint : int { }
    [CCode (cname="GLsizei")]
    public struct GLsizei : int { }
    [CCode (cname="GLubyte")]
    public struct GLubyte : uchar { }
    [CCode (cname="GLushort")]
    public struct GLushort : ushort { }
    [CCode (cname="GLuint")]
    public struct GLuint : uint { }
    [CCode (cname="GLfloat")]
    [FloatingType (rank = 1)]
    public struct GLfloat : float { }
    [CCode (cname="GLclampf")]
    [FloatingType (rank = 1)]
    public struct GLclampf : float { }
    [CCode (cname="GLfixed")]
    public struct GLfixed : int { }
    [CCode (cname="GLclampx")]
    public struct GLclampx : int { }

    // ClearBufferMask
    public const GLenum GL_DEPTH_BUFFER_BIT;
    public const GLenum GL_STENCIL_BUFFER_BIT;
    public const GLenum GL_COLOR_BUFFER_BIT;

    // Boolean
    public const GLenum GL_FALSE;
    public const GLenum GL_TRUE;

    // BeginMode
    public const GLenum GL_POINTS;
    public const GLenum GL_LINES;
    public const GLenum GL_LINE_LOOP;
    public const GLenum GL_LINE_STRIP;
    public const GLenum GL_TRIANGLES;
    public const GLenum GL_TRIANGLE_STRIP;
    public const GLenum GL_TRIANGLE_FAN;

    // AlphaFunction
    public const GLenum GL_NEVER;
    public const GLenum GL_LESS;
    public const GLenum GL_EQUAL;
    public const GLenum GL_LEQUAL;
    public const GLenum GL_GREATER;
    public const GLenum GL_NOTEQUAL;
    public const GLenum GL_GEQUAL;
    public const GLenum GL_ALWAYS;

    // BlendingFactorDest
    public const GLenum GL_ZERO;
    public const GLenum GL_ONE;
    public const GLenum GL_SRC_COLOR;
    public const GLenum GL_ONE_MINUS_SRC_COLOR;
    public const GLenum GL_SRC_ALPHA;
    public const GLenum GL_ONE_MINUS_SRC_ALPHA;
    public const GLenum GL_DST_ALPHA;
    public const GLenum GL_ONE_MINUS_DST_ALPHA;

    // BlendingFactorSrc
    public const GLenum GL_DST_COLOR;
    public const GLenum GL_ONE_MINUS_DST_COLOR;
    public const GLenum GL_SRC_ALPHA_SATURATE;

    // ClipPlaneName
    public const GLenum GL_CLIP_PLANE0;
    public const GLenum GL_CLIP_PLANE1;
    public const GLenum GL_CLIP_PLANE2;
    public const GLenum GL_CLIP_PLANE3;
    public const GLenum GL_CLIP_PLANE4;
    public const GLenum GL_CLIP_PLANE5;

    // CullFaceMode
    public const GLenum GL_FRONT;
    public const GLenum GL_BACK;
    public const GLenum GL_FRONT_AND_BACK;

    // EnableCap
    public const GLenum GL_FOG;
    public const GLenum GL_LIGHTING;
    public const GLenum GL_TEXTURE_2D;
    public const GLenum GL_CULL_FACE;
    public const GLenum GL_ALPHA_TEST;
    public const GLenum GL_BLEND;
    public const GLenum GL_COLOR_LOGIC_OP;
    public const GLenum GL_DITHER;
    public const GLenum GL_STENCIL_TEST;
    public const GLenum GL_DEPTH_TEST;
    public const GLenum GL_POINT_SMOOTH;
    public const GLenum GL_LINE_SMOOTH;
    public const GLenum GL_COLOR_MATERIAL;
    public const GLenum GL_NORMALIZE;
    public const GLenum GL_RESCALE_NORMAL;
    public const GLenum GL_VERTEX_ARRAY;
    public const GLenum GL_NORMAL_ARRAY;
    public const GLenum GL_COLOR_ARRAY;
    public const GLenum GL_TEXTURE_COORD_ARRAY;
    public const GLenum GL_MULTISAMPLE;
    public const GLenum GL_SAMPLE_ALPHA_TO_COVERAGE;
    public const GLenum GL_SAMPLE_ALPHA_TO_ONE;
    public const GLenum GL_SAMPLE_COVERAGE;

    // ErrorCode
    public const GLenum GL_NO_ERROR;
    public const GLenum GL_INVALID_ENUM;
    public const GLenum GL_INVALID_VALUE;
    public const GLenum GL_INVALID_OPERATION;
    public const GLenum GL_STACK_OVERFLOW;
    public const GLenum GL_STACK_UNDERFLOW;
    public const GLenum GL_OUT_OF_MEMORY;

    // FogMode
    public const GLenum GL_EXP;
    public const GLenum GL_EXP2;

    // FogParameter
    public const GLenum GL_FOG_DENSITY;
    public const GLenum GL_FOG_START;
    public const GLenum GL_FOG_END;
    public const GLenum GL_FOG_MODE;
    public const GLenum GL_FOG_COLOR;

    // FrontFaceDirection
    public const GLenum GL_CW;
    public const GLenum GL_CCW;

    // GetPName
    public const GLenum GL_CURRENT_COLOR;
    public const GLenum GL_CURRENT_NORMAL;
    public const GLenum GL_CURRENT_TEXTURE_COORDS;
    public const GLenum GL_POINT_SIZE;
    public const GLenum GL_POINT_SIZE_MIN;
    public const GLenum GL_POINT_SIZE_MAX;
    public const GLenum GL_POINT_FADE_THRESHOLD_SIZE;
    public const GLenum GL_POINT_DISTANCE_ATTENUATION;
    public const GLenum GL_SMOOTH_POINT_SIZE_RANGE;
    public const GLenum GL_LINE_WIDTH;
    public const GLenum GL_SMOOTH_LINE_WIDTH_RANGE;
    public const GLenum GL_ALIASED_POINT_SIZE_RANGE;
    public const GLenum GL_ALIASED_LINE_WIDTH_RANGE;
    public const GLenum GL_CULL_FACE_MODE;
    public const GLenum GL_FRONT_FACE;
    public const GLenum GL_SHADE_MODEL;
    public const GLenum GL_DEPTH_RANGE;
    public const GLenum GL_DEPTH_WRITEMASK;
    public const GLenum GL_DEPTH_CLEAR_VALUE;
    public const GLenum GL_DEPTH_FUNC;
    public const GLenum GL_STENCIL_CLEAR_VALUE;
    public const GLenum GL_STENCIL_FUNC;
    public const GLenum GL_STENCIL_VALUE_MASK;
    public const GLenum GL_STENCIL_FAIL;
    public const GLenum GL_STENCIL_PASS_DEPTH_FAIL;
    public const GLenum GL_STENCIL_PASS_DEPTH_PASS;
    public const GLenum GL_STENCIL_REF;
    public const GLenum GL_STENCIL_WRITEMASK;
    public const GLenum GL_MATRIX_MODE;
    public const GLenum GL_VIEWPORT;
    public const GLenum GL_MODELVIEW_STACK_DEPTH;
    public const GLenum GL_PROJECTION_STACK_DEPTH;
    public const GLenum GL_TEXTURE_STACK_DEPTH;
    public const GLenum GL_MODELVIEW_MATRIX;
    public const GLenum GL_PROJECTION_MATRIX;
    public const GLenum GL_TEXTURE_MATRIX;
    public const GLenum GL_ALPHA_TEST_FUNC;
    public const GLenum GL_ALPHA_TEST_REF;
    public const GLenum GL_BLEND_DST;
    public const GLenum GL_BLEND_SRC;
    public const GLenum GL_LOGIC_OP_MODE;
    public const GLenum GL_SCISSOR_BOX;
    public const GLenum GL_SCISSOR_TEST;
    public const GLenum GL_COLOR_CLEAR_VALUE;
    public const GLenum GL_COLOR_WRITEMASK;
    public const GLenum GL_MAX_LIGHTS;
    public const GLenum GL_MAX_CLIP_PLANES;
    public const GLenum GL_MAX_TEXTURE_SIZE;
    public const GLenum GL_MAX_MODELVIEW_STACK_DEPTH;
    public const GLenum GL_MAX_PROJECTION_STACK_DEPTH;
    public const GLenum GL_MAX_TEXTURE_STACK_DEPTH;
    public const GLenum GL_MAX_VIEWPORT_DIMS;
    public const GLenum GL_MAX_TEXTURE_UNITS;
    public const GLenum GL_SUBPIXEL_BITS;
    public const GLenum GL_RED_BITS;
    public const GLenum GL_GREEN_BITS;
    public const GLenum GL_BLUE_BITS;
    public const GLenum GL_ALPHA_BITS;
    public const GLenum GL_DEPTH_BITS;
    public const GLenum GL_STENCIL_BITS;
    public const GLenum GL_POLYGON_OFFSET_UNITS;
    public const GLenum GL_POLYGON_OFFSET_FILL;
    public const GLenum GL_POLYGON_OFFSET_FACTOR;
    public const GLenum GL_TEXTURE_BINDING_2D;
    public const GLenum GL_VERTEX_ARRAY_SIZE;
    public const GLenum GL_VERTEX_ARRAY_TYPE;
    public const GLenum GL_VERTEX_ARRAY_STRIDE;
    public const GLenum GL_NORMAL_ARRAY_TYPE;
    public const GLenum GL_NORMAL_ARRAY_STRIDE;
    public const GLenum GL_COLOR_ARRAY_SIZE;
    public const GLenum GL_COLOR_ARRAY_TYPE;
    public const GLenum GL_COLOR_ARRAY_STRIDE;
    public const GLenum GL_TEXTURE_COORD_ARRAY_SIZE;
    public const GLenum GL_TEXTURE_COORD_ARRAY_TYPE;
    public const GLenum GL_TEXTURE_COORD_ARRAY_STRIDE;
    public const GLenum GL_VERTEX_ARRAY_POINTER;
    public const GLenum GL_NORMAL_ARRAY_POINTER;
    public const GLenum GL_COLOR_ARRAY_POINTER;
    public const GLenum GL_TEXTURE_COORD_ARRAY_POINTER;
    public const GLenum GL_SAMPLE_BUFFERS;
    public const GLenum GL_SAMPLES;
    public const GLenum GL_SAMPLE_COVERAGE_VALUE;
    public const GLenum GL_SAMPLE_COVERAGE_INVERT;
    public const GLenum GL_NUM_COMPRESSED_TEXTURE_FORMATS;
    public const GLenum GL_COMPRESSED_TEXTURE_FORMATS;

    // HintMode
    public const GLenum GL_DONT_CARE;
    public const GLenum GL_FASTEST;
    public const GLenum GL_NICEST;

    // HintTarget
    public const GLenum GL_PERSPECTIVE_CORRECTION_HINT;
    public const GLenum GL_POINT_SMOOTH_HINT;
    public const GLenum GL_LINE_SMOOTH_HINT;
    public const GLenum GL_FOG_HINT;
    public const GLenum GL_GENERATE_MIPMAP_HINT;

    // LightModelParameter
    public const GLenum GL_LIGHT_MODEL_AMBIENT;
    public const GLenum GL_LIGHT_MODEL_TWO_SIDE;

    // LightParameter
    public const GLenum GL_AMBIENT;
    public const GLenum GL_DIFFUSE;
    public const GLenum GL_SPECULAR;
    public const GLenum GL_POSITION;
    public const GLenum GL_SPOT_DIRECTION;
    public const GLenum GL_SPOT_EXPONENT;
    public const GLenum GL_SPOT_CUTOFF;
    public const GLenum GL_CONSTANT_ATTENUATION;
    public const GLenum GL_LINEAR_ATTENUATION;
    public const GLenum GL_QUADRATIC_ATTENUATION;

    // DataType
    public const GLenum GL_BYTE;
    public const GLenum GL_UNSIGNED_BYTE;
    public const GLenum GL_SHORT;
    public const GLenum GL_UNSIGNED_SHORT;
    public const GLenum GL_FLOAT;
    public const GLenum GL_FIXED;

    // LogicOp
    public const GLenum GL_CLEAR;
    public const GLenum GL_AND;
    public const GLenum GL_AND_REVERSE;
    public const GLenum GL_COPY;
    public const GLenum GL_AND_INVERTED;
    public const GLenum GL_NOOP;
    public const GLenum GL_XOR;
    public const GLenum GL_OR;
    public const GLenum GL_NOR;
    public const GLenum GL_EQUIV;
    public const GLenum GL_INVERT;
    public const GLenum GL_OR_REVERSE;
    public const GLenum GL_COPY_INVERTED;
    public const GLenum GL_OR_INVERTED;
    public const GLenum GL_NAND;
    public const GLenum GL_SET;

    // MaterialParameter
    public const GLenum GL_EMISSION;
    public const GLenum GL_SHININESS;
    public const GLenum GL_AMBIENT_AND_DIFFUSE;

    // MatrixMode
    public const GLenum GL_MODELVIEW;
    public const GLenum GL_PROJECTION;
    public const GLenum GL_TEXTURE;

    // PixelFormat
    public const GLenum GL_ALPHA;
    public const GLenum GL_RGB;
    public const GLenum GL_RGBA;
    public const GLenum GL_LUMINANCE;
    public const GLenum GL_LUMINANCE_ALPHA;

    // PixelStoreParameter
    public const GLenum GL_UNPACK_ALIGNMENT;
    public const GLenum GL_PACK_ALIGNMENT;

    // PixelType
    public const GLenum GL_UNSIGNED_SHORT_4_4_4_4;
    public const GLenum GL_UNSIGNED_SHORT_5_5_5_1;
    public const GLenum GL_UNSIGNED_SHORT_5_6_5;

    // ShadingModel
    public const GLenum GL_FLAT;
    public const GLenum GL_SMOOTH;

    // StencilOp
    public const GLenum GL_KEEP;
    public const GLenum GL_REPLACE;
    public const GLenum GL_INCR;
    public const GLenum GL_DECR;

    // StringName
    public const GLenum GL_VENDOR;
    public const GLenum GL_RENDERER;
    public const GLenum GL_VERSION;
    public const GLenum GL_EXTENSIONS;

    // TextureEnvMode
    public const GLenum GL_MODULATE;
    public const GLenum GL_DECAL;
    public const GLenum GL_ADD;

    // TextureEnvParameter
    public const GLenum GL_TEXTURE_ENV_MODE;
    public const GLenum GL_TEXTURE_ENV_COLOR;

    // TextureEnvTarget
    public const GLenum GL_TEXTURE_ENV;

    // TextureMagFilter
    public const GLenum GL_NEAREST;
    public const GLenum GL_LINEAR;

    // TextureMinFilter
    public const GLenum GL_NEAREST_MIPMAP_NEAREST;
    public const GLenum GL_LINEAR_MIPMAP_NEAREST;
    public const GLenum GL_NEAREST_MIPMAP_LINEAR;
    public const GLenum GL_LINEAR_MIPMAP_LINEAR;

    // TextureParameterName
    public const GLenum GL_TEXTURE_MAG_FILTER;
    public const GLenum GL_TEXTURE_MIN_FILTER;
    public const GLenum GL_TEXTURE_WRAP_S;
    public const GLenum GL_TEXTURE_WRAP_T;
    public const GLenum GL_GENERATE_MIPMAP;

    // TextureUnit
    public const GLenum GL_TEXTURE0;
    public const GLenum GL_TEXTURE1;
    public const GLenum GL_TEXTURE2;
    public const GLenum GL_TEXTURE3;
    public const GLenum GL_TEXTURE4;
    public const GLenum GL_TEXTURE5;
    public const GLenum GL_TEXTURE6;
    public const GLenum GL_TEXTURE7;
    public const GLenum GL_TEXTURE8;
    public const GLenum GL_TEXTURE9;
    public const GLenum GL_TEXTURE10;
    public const GLenum GL_TEXTURE11;
    public const GLenum GL_TEXTURE12;
    public const GLenum GL_TEXTURE13;
    public const GLenum GL_TEXTURE14;
    public const GLenum GL_TEXTURE15;
    public const GLenum GL_TEXTURE16;
    public const GLenum GL_TEXTURE17;
    public const GLenum GL_TEXTURE18;
    public const GLenum GL_TEXTURE19;
    public const GLenum GL_TEXTURE20;
    public const GLenum GL_TEXTURE21;
    public const GLenum GL_TEXTURE22;
    public const GLenum GL_TEXTURE23;
    public const GLenum GL_TEXTURE24;
    public const GLenum GL_TEXTURE25;
    public const GLenum GL_TEXTURE26;
    public const GLenum GL_TEXTURE27;
    public const GLenum GL_TEXTURE28;
    public const GLenum GL_TEXTURE29;
    public const GLenum GL_TEXTURE30;
    public const GLenum GL_TEXTURE31;
    public const GLenum GL_ACTIVE_TEXTURE;
    public const GLenum GL_CLIENT_ACTIVE_TEXTURE;

    // TextureWrapMode
    public const GLenum GL_REPEAT;
    public const GLenum GL_CLAMP_TO_EDGE;

    // LightName
    public const GLenum GL_LIGHT0;
    public const GLenum GL_LIGHT1;
    public const GLenum GL_LIGHT2;
    public const GLenum GL_LIGHT3;
    public const GLenum GL_LIGHT4;
    public const GLenum GL_LIGHT5;
    public const GLenum GL_LIGHT6;
    public const GLenum GL_LIGHT7;

    // Buffer Objects
    public const GLenum GL_ARRAY_BUFFER;
    public const GLenum GL_ELEMENT_ARRAY_BUFFER;

    public const GLenum GL_ARRAY_BUFFER_BINDING;
    public const GLenum GL_ELEMENT_ARRAY_BUFFER_BINDING;
    public const GLenum GL_VERTEX_ARRAY_BUFFER_BINDING;
    public const GLenum GL_NORMAL_ARRAY_BUFFER_BINDING;
    public const GLenum GL_COLOR_ARRAY_BUFFER_BINDING;
    public const GLenum GL_TEXTURE_COORD_ARRAY_BUFFER_BINDING;

    public const GLenum GL_STATIC_DRAW;
    public const GLenum GL_DYNAMIC_DRAW;

    public const GLenum GL_BUFFER_SIZE;
    public const GLenum GL_BUFFER_USAGE;

    // Texture combine + dot3
    public const GLenum GL_SUBTRACT;
    public const GLenum GL_COMBINE;
    public const GLenum GL_COMBINE_RGB;
    public const GLenum GL_COMBINE_ALPHA;
    public const GLenum GL_RGB_SCALE;
    public const GLenum GL_ADD_SIGNED;
    public const GLenum GL_INTERPOLATE;
    public const GLenum GL_CONSTANT;
    public const GLenum GL_PRIMARY_COLOR;
    public const GLenum GL_PREVIOUS;
    public const GLenum GL_OPERAND0_RGB;
    public const GLenum GL_OPERAND1_RGB;
    public const GLenum GL_OPERAND2_RGB;
    public const GLenum GL_OPERAND0_ALPHA;
    public const GLenum GL_OPERAND1_ALPHA;
    public const GLenum GL_OPERAND2_ALPHA;

    public const GLenum GL_ALPHA_SCALE;

    public const GLenum GL_SRC0_RGB;
    public const GLenum GL_SRC1_RGB;
    public const GLenum GL_SRC2_RGB;
    public const GLenum GL_SRC0_ALPHA;
    public const GLenum GL_SRC1_ALPHA;
    public const GLenum GL_SRC2_ALPHA;

    public const GLenum GL_DOT3_RGB;
    public const GLenum GL_DOT3_RGBA;


    /*************************************************************/
    // Available only in Common profile

    public static void glAlphaFunc (GLenum func, GLclampf @ref);
    public static void glClearColor (GLclampf red, GLclampf green,
                                     GLclampf blue, GLclampf alpha);
    public static void glClearDepthf (GLclampf depth);
    public static void glClipPlanef (GLenum plane,
                                     [CCode (array_length = false)]
                                     GLfloat[] equation);
    public static void glColor4f (GLfloat red, GLfloat green,
                                  GLfloat blue, GLfloat alpha);
    public static void glDepthRangef (GLclampf near_val, GLclampf far_val);
    public static void glFogf (GLenum pname, GLfloat param);
    public static void glFogfv (GLenum pname,
                                [CCode (array_length = false)]
                                GLfloat[] params);
    public static void glFrustumf (GLfloat left, GLfloat right,
                                   GLfloat bottom, GLfloat top,
                                   GLfloat near_val, GLfloat far_val);
    public static void glGetClipPlanef (GLenum plane,
                                        [CCode (array_length = false)]
                                        GLfloat[] equation);
    public static void glGetFloatv (GLenum pname,
                                    [CCode (array_length = false)]
                                    GLfloat[] params);
    public static void glGetLightfv (GLenum light, GLenum pname,
                                     [CCode (array_length = false)]
                                     GLfloat[] params);
    public static void glGetMaterialfv (GLenum face, GLenum pname,
                                        [CCode (array_length = false)]
                                        GLfloat[] params);
    public static void glGetTexEnvfv (GLenum target, GLenum pname,
                                      [CCode (array_length = false)]
                                      GLfloat[] params);
    public static void glGetTexParameterfv (GLenum target, GLenum pname,
                                            [CCode (array_length = false)]
                                            GLfloat[] params);
    public static void glLightModelf (GLenum pname, GLfloat param);
    public static void glLightModelfv (GLenum pname,
                                       [CCode (array_length = false)]
                                       GLfloat[] params);
    public static void glLightf (GLenum light, GLenum pname, GLfloat param);
    public static void glLightfv (GLenum light, GLenum pname,
                                  [CCode (array_length = false)]
                                  GLfloat[] params);
    public static void glLineWidth (GLfloat width);
    public static void glLoadMatrixf ([CCode (array_length = false)]
                                      GLfloat[] m);
    public static void glMaterialf (GLenum face, GLenum pname, GLfloat param);
    public static void glMaterialfv (GLenum face, GLenum pname,
                                     [CCode (array_length = false)]
                                     GLfloat[] params);
    public static void glMultMatrixf ([CCode (array_length = false)]
                                      GLfloat[] m);
    public static void glMultiTexCoord4f (GLenum target, GLfloat s, GLfloat t,
                                          GLfloat r, GLfloat q);
    public static void glNormal3f (GLfloat nx, GLfloat ny, GLfloat nz);
    public static void glOrthof (GLfloat left, GLfloat right, GLfloat bottom,
                                 GLfloat top, GLfloat near_val,
                                 GLfloat far_val);
    public static void glPointParameterf (GLenum pname, GLfloat param);
    public static void glPointParameterfv (GLenum pname,
                                           [CCode (array_length = false)]
                                           GLfloat[] params);
    public static void glPointSize (GLfloat size);
    public static void glPolygonOffset (GLfloat factor, GLfloat units);
    public static void glRotatef (GLfloat angle, GLfloat x, GLfloat y,
                                  GLfloat z);
    public static void glScalef (GLfloat x, GLfloat y, GLfloat z);
    public static void glTexEnvf (GLenum target, GLenum pname, GLfloat param);
    public static void glTexEnvfv (GLenum target, GLenum pname,
                                   [CCode (array_length = false)]
                                   GLfloat[] params);
    public static void glTexParameterf (GLenum target, GLenum pname,
                                        GLfloat param);
    public static void glTexParameterfv (GLenum target, GLenum pname,
                                         [CCode (array_length = false)]
                                         GLfloat[] params);
    public static void glTranslatef (GLfloat x, GLfloat y, GLfloat z);


    /*************************************************************/
    // Available in both Common and Common-Lite profiles

    public static void glActiveTexture (GLenum texture);
    public static void glAlphaFuncx (GLenum func, GLclampx ref);
    public static void glBindBuffer (GLenum target, GLuint id);
    public static void glBindTexture (GLenum target, GLuint texture);
    public static void glBlendFunc (GLenum sfactor, GLenum dfactor);
    public static void glBufferData (GLenum target, GLsizei size,
                                     void* data, GLenum usage);
    public static void glBufferSubData (GLenum target, GLint offset,
                                        GLsizei size, void* data);
    public static void glClear (GLbitfield mask);
    public static void glClearColorx (GLclampx red, GLclampx green,
                                      GLclampx blue, GLclampx alpha);
    public static void glClearDepthx (GLclampx depth);
    public static void glClearStencil (GLint s);
    public static void glClientActiveTexture (GLenum texture);
    public static void glClipPlanex (GLenum plane,
                                     [CCode (array_length = false)]
                                     GLfixed[] equation);
    public static void glColor4ub (GLubyte red, GLubyte green, GLubyte blue,
                                   GLubyte alpha);
    public static void glColor4x (GLfixed red, GLfixed green, GLfixed blue,
                                  GLfixed alpha);
    public static void glColorMask (GLboolean red, GLboolean green,
                                    GLboolean blue, GLboolean alpha);
    public static void glColorPointer (GLint size, GLenum type, GLsizei stride,
                                       GLvoid* ptr);
    public static void glCompressedTexImage2D (GLenum target, GLint level,
                                               GLenum internalformat,
                                               GLsizei width, GLsizei height,
                                               GLint border, GLsizei imageSize,
                                               GLvoid* data);
    public static void glCompressedTexSubImage2D (GLenum target, GLint level,
                                                  GLint xoffset, GLint yoffset,
                                                  GLsizei width,
                                                  GLsizei height,
                                                  GLenum format,
                                                  GLsizei imageSize,
                                                  GLvoid* data);
    public static void glCopyTexImage2D (GLenum target, GLint level,
                                         GLenum internalformat, GLint x,
                                         GLint y, GLsizei width,
                                         GLsizei height, GLint border);
    public static void glCopyTexSubImage2D (GLenum target, GLint level,
                                            GLint xoffset, GLint yoffset,
                                            GLint x, GLint y, GLsizei width,
                                            GLsizei height);
    public static void glCullFace (GLenum mode);
    public static void glDeleteBuffers (GLsizei n, GLuint* buffers);
    public static void glDeleteTextures (GLsizei n,
                                         [CCode (array_length = false)]
                                         GLuint[] textures);
    public static void glDepthFunc (GLenum func);
    public static void glDepthMask (GLboolean flag);
    public static void glDepthRangex (GLclampx nNear, GLclampx zFar);
    public static void glDisable (GLenum cap);
    public static void glDisableClientState (GLenum array);
    public static void glDrawArrays (GLenum mode, GLint first, GLsizei count);
    public static void glDrawElements (GLenum mode, GLsizei count, GLenum type,
                                       GLvoid* indices);
    public static void glEnable (GLenum cap);
    public static void glEnableClientState (GLenum array);
    public static void glFinish ( );
    public static void glFlush ( );
    public static void glFogx (GLenum pname, GLfixed param);
    public static void glFogxv (GLenum pname,
                                [CCode (array_length = false)]
                                GLfixed[] params);
    public static void glFrontFace (GLenum mode);
    public static void glFrustumx (GLfixed left, GLfixed right, GLfixed bottom,
                                   GLfixed top, GLfixed zNear, GLfixed zFar);
    public static void glGetBooleanv (GLenum pname,
                                      [CCode (array_length = false)]
                                      GLboolean[] params);
    public static void glGetBufferParameteriv (GLenum target, GLenum pname,
                                               [CCode (array_length = false)]
                                               GLint[] params);
    public static void glGetClipPlanex (GLenum pname,
                                        [CCode (array_length = false)]
                                        GLfixed[] eqn);
    public static void glGenBuffers (GLsizei n, out GLuint buffers);
    public static void glGenTextures (GLsizei n, out GLuint textures);
    public static GLenum glGetError ( );
    public static void glGetFixedv (GLenum pname,
                                    [CCode (array_length = false)]
                                    GLfixed[] params);
    public static void glGetIntegerv (GLenum pname, out GLint param);
    public static void glGetLightxv (GLenum light, GLenum pname,
                                     [CCode (array_length = false)]
                                     GLfixed[] params);
    public static void glGetMaterialxv (GLenum face, GLenum pname,
                                        [CCode (array_length = false)]
                                        GLfixed[] params);
    public static void glGetPointerv (GLenum pname, GLvoid** params);
    public static unowned string glGetString (GLenum name);
    public static void glGetTexEnviv (GLenum env, GLenum pname,
                                      [CCode (array_length = false)]
                                      GLint[] params);
    public static void glGetTexEnvxv (GLenum env, GLenum pname,
                                      [CCode (array_length = false)]
                                      GLfixed[] params);
    public static void glGetTexParameteriv (GLenum target, GLenum pname,
                                            [CCode (array_length = false)]
                                            GLint[] params);
    public static void glGetTexParameterxv (GLenum target, GLenum pname,
                                            [CCode (array_length = false)]
                                            GLfixed[] params);
    public static void glHint (GLenum target, GLenum mode);
    public static GLboolean glIsBuffer (GLuint buffer);
    public static GLboolean glIsEnabled (GLenum cap);
    public static GLboolean glIsTexture (GLuint texture);
    public static void glLightModelx (GLenum pname, GLfixed param);
    public static void glLightModelxv (GLenum pname,
                                       [CCode (array_length = false)]
                                       GLfixed[] params);
    public static void glLightx (GLenum light, GLenum pname, GLfixed param);
    public static void glLightxv (GLenum light, GLenum pname,
                                  [CCode (array_length = false)]
                                  GLfixed[] params);
    public static void glLineWidthx (GLfixed width);
    public static void glLoadIdentity ( );
    public static void glLoadMatrixx ([CCode (array_length = false)]
                                      GLfixed[] m);
    public static void glLogicOp (GLenum opcode);
    public static void glMaterialx (GLenum face, GLenum pname, GLfixed param);
    public static void glMaterialxv (GLenum face, GLenum pname,
                                     [CCode (array_length = false)]
                                     GLfixed[] params);
    public static void glMatrixMode (GLenum mode);
    public static void glMultMatrixx ([CCode (array_length = false)]
                                      GLfixed[] m);
    public static void glMultiTexCoord4x (GLenum target, GLfixed s, GLfixed t,
                                          GLfixed r, GLfixed q);
    public static void glNormal3x (GLfixed nx, GLfixed ny, GLfixed nz);
    public static void glNormalPointer (GLenum type, GLsizei stride,
                                        GLvoid* pointer);
    public static void glOrthox (GLfixed left, GLfixed right, GLfixed bottom,
                                 GLfixed top, GLfixed zNear, GLfixed zFar);
    public static void glPixelStorei (GLenum pname, GLint param);
    public static void glPointParameterx (GLenum pname, GLfixed param);
    public static void glPointParameterxv (GLenum pname,
                                           [CCode (array_length = false)]
                                           GLfixed[] params);
    public static void glPointSizex (GLfixed size);
    public static void glPolygonOffsetx (GLfixed factor, GLfixed units);
    public static void glPopMatrix ( );
    public static void glPushMatrix ( );
    public static void glReadPixels (GLint x, GLint y, GLsizei width,
                                     GLsizei height, GLenum format,
                                     GLenum type, GLvoid *pixels);
    public static void glRotatex (GLfixed angle, GLfixed x, GLfixed y,
                                  GLfixed z);
    public static void glSampleCoverage (GLclampf value, GLboolean invert);
    public static void glSampleCoveragex (GLclampx value, GLboolean invert);
    public static void glScalex (GLfixed x, GLfixed y, GLfixed z);
    public static void glScissor (GLint x, GLint y, GLsizei width,
                                  GLsizei height);
    public static void glShadeModel (GLenum mode);
    public static void glStencilFunc (GLenum func, GLint ref, GLuint mask);
    public static void glStencilMask (GLuint mask);
    public static void glStencilOp (GLenum fail, GLenum zfail, GLenum zpass);
    public static void glTexCoordPointer (GLint size, GLenum type,
                                          GLsizei stride, GLvoid *pointer);
    public static void glTexEnvi (GLenum target, GLenum pname, GLint param);
    public static void glTexEnvx (GLenum target, GLenum pname, GLfixed param);
    public static void glTexEnviv (GLenum target, GLenum pname,
                                   [CCode (array_length = false)]
                                   GLint[] params);
    public static void glTexEnvxv (GLenum target, GLenum pname,
                                   [CCode (array_length = false)]
                                   GLfixed[] params);
    public static void glTexImage2D (GLenum target, GLint level,
                                     GLint internalformat, GLsizei width,
                                     GLsizei height, GLint border,
                                     GLenum format, GLenum type,
                                     GLvoid* pixels);
    public static void glTexParameteri (GLenum target, GLenum pname,
                                        GLint param);
    public static void glTexParameterx (GLenum target, GLenum pname,
                                        GLfixed param);
    public static void glTexParameteriv (GLenum target, GLenum pname,
                                         [CCode (array_length = false)]
                                         GLint[] params);
    public static void glTexParameterxv (GLenum target, GLenum pname,
                                         [CCode (array_length = false)]
                                         GLfixed[] params);
    public static void glTexSubImage2D (GLenum target, GLint level,
                                        GLint xoffset, GLint yoffset,
                                        GLsizei width, GLsizei height,
                                        GLenum format, GLenum type,
                                        GLvoid* pixels);
    public static void glTranslatex (GLfixed x, GLfixed y, GLfixed z);
    public static void glVertexPointer (GLint size, GLenum type,
                                        GLsizei stride,
                                        GLvoid* pointer);
    public static void glViewport (GLint x, GLint y, GLsizei width,
                                   GLsizei height);


#if GLES_AVAILABLE

    /*--------------------------------------------------------------------*
     * Required OES extension functions
     *--------------------------------------------------------------------*/

    // TODO


    ////////////////////////////////////////////////////////////////////////
    // glext.h

    // GL_OES_texture_cube_map
    public const GLenum GL_NORMAL_MAP_OES;
    public const GLenum GL_REFLECTION_MAP_OES;
    public const GLenum GL_TEXTURE_CUBE_MAP_OES;
    public const GLenum GL_TEXTURE_BINDING_CUBE_MAP_OES;
    public const GLenum GL_TEXTURE_CUBE_MAP_POSITIVE_X_OES;
    public const GLenum GL_TEXTURE_CUBE_MAP_NEGATIVE_X_OES;
    public const GLenum GL_TEXTURE_CUBE_MAP_POSITIVE_Y_OES;
    public const GLenum GL_TEXTURE_CUBE_MAP_NEGATIVE_Y_OES;
    public const GLenum GL_TEXTURE_CUBE_MAP_POSITIVE_Z_OES;
    public const GLenum GL_TEXTURE_CUBE_MAP_NEGATIVE_Z_OES;
    public const GLenum GL_MAX_CUBE_MAP_TEXTURE_SIZE_OES;
    public const GLenum GL_TEXTURE_GEN_MODE_OES;
    public const GLenum GL_TEXTURE_GEN_STR_OES;

    // GL_OES_texture_cube_map
    public const GLenum GL_OES_texture_cube_map;
    public static void glTexGenfOES (GLenum coord, GLenum pname, GLfloat parm);
    public static void glTexGenfvOES (GLenum coord, GLenum pname,
                                      GLfloat* parms);
    public static void glTexGeniOES (GLenum coord, GLenum pname, GLint parm);
    public static void glTexGenivOES (GLenum coord, GLenum pname,
                                      GLint* parms);
    public static void glTexGenxOES (GLenum coord, GLenum pname, GLfixed parm);
    public static void glTexGenxvOES (GLenum coord, GLenum pname,
                                      GLfixed* parms);
    public static void glGetTexGenfvOES (GLenum coord, GLenum pname,
                                         GLfloat* parms);
    public static void glGetTexGenivOES (GLenum coord, GLenum pname,
                                         GLint* parms);
    public static void glGetTexGenxvOES (GLenum coord, GLenum pname,
                                         GLfixed* parms);

    public delegate void PFNGLTEXGENFOESPROC (GLenum coord, GLenum pname,
                                              GLfloat parm);
    public delegate void PFNGLTEXGENFVOESPROC (GLenum coord, GLenum pname,
                                               GLfloat* parms);
    public delegate void PFNGLTEXGENIOESPROC (GLenum coord, GLenum pname,
                                              GLint param);
    public delegate void PFNGLTEXGENIVOESPROC (GLenum coord, GLenum pname,
                                               GLint* parms);
    public delegate void PFNGLTEXGENXOESPROC (GLenum coord, GLenum pname,
                                              GLfixed parm);
    public delegate void PFNGLTEXGENXVOESPROC (GLenum coord, GLenum pname,
                                               GLfixed* parms);
    public delegate void PFNGLGETTEXGENFVOESPROC (GLenum coord, GLenum pname,
                                                  GLfloat* parms);
    public delegate void PFNGLGETTEXGENIVOESPROC (GLenum coord, GLenum pname,
                                                  GLint* parms);
    public delegate void PFNGLGETTEXGENXVOESPROC (GLenum coord, GLenum pname,
                                                  GLfixed* parms);

#else

    /*--------------------------------------------------------------------*
     * Required OES extension functions
     *--------------------------------------------------------------------*/

    // TODO


    ////////////////////////////////////////////////////////////////////////
    // glext.h

    // GL_OES_texture_cube_map
    [CCode (cname="GL_NORMAL_MAP")]
    public const GLenum GL_NORMAL_MAP_OES;
    [CCode (cname="GL_REFLECTION_MAP")]
    public const GLenum GL_REFLECTION_MAP_OES;
    [CCode (cname="GL_TEXTURE_CUBE_MAP")]
    public const GLenum GL_TEXTURE_CUBE_MAP_OES;
    [CCode (cname="GL_TEXTURE_BINDING_CUBE_MAP")]
    public const GLenum GL_TEXTURE_BINDING_CUBE_MAP_OES;
    [CCode (cname="GL_TEXTURE_CUBE_MAP_POSITIVE_X")]
    public const GLenum GL_TEXTURE_CUBE_MAP_POSITIVE_X_OES;
    [CCode (cname="GL_TEXTURE_CUBE_MAP_NEGATIVE_X")]
    public const GLenum GL_TEXTURE_CUBE_MAP_NEGATIVE_X_OES;
    [CCode (cname="GL_TEXTURE_CUBE_MAP_POSITIVE_Y")]
    public const GLenum GL_TEXTURE_CUBE_MAP_POSITIVE_Y_OES;
    [CCode (cname="GL_TEXTURE_CUBE_MAP_NEGATIVE_Y")]
    public const GLenum GL_TEXTURE_CUBE_MAP_NEGATIVE_Y_OES;
    [CCode (cname="GL_TEXTURE_CUBE_MAP_POSITIVE_Z")]
    public const GLenum GL_TEXTURE_CUBE_MAP_POSITIVE_Z_OES;
    [CCode (cname="GL_TEXTURE_CUBE_MAP_NEGATIVE_Z")]
    public const GLenum GL_TEXTURE_CUBE_MAP_NEGATIVE_Z_OES;
    [CCode (cname="GL_TEXTURE_CUBE_MAP_TEXTURE_SIZE")]
    public const GLenum GL_MAX_CUBE_MAP_TEXTURE_SIZE_OES;
    [CCode (cname="GL_TEXTURE_GEN_MODE")]
    public const GLenum GL_TEXTURE_GEN_MODE_OES;
    [CCode (cname="GL_TEXTURE_GEN_STR")]
    public const GLenum GL_TEXTURE_GEN_STR_OES;

    // GL_OES_texture_cube_map
    public const GLenum GL_OES_texture_cube_map;
    public static void glTexGenfOES (GLenum coord, GLenum pname, GLfloat parm);
    public static void glTexGenfvOES (GLenum coord, GLenum pname,
                                      GLfloat* parms);
    public static void glTexGeniOES (GLenum coord, GLenum pname, GLint parm);
    public static void glTexGenivOES (GLenum coord, GLenum pname,
                                      GLint* parms);
    public static void glTexGenxOES (GLenum coord, GLenum pname, GLfixed parm);
    public static void glTexGenxvOES (GLenum coord, GLenum pname,
                                      GLfixed* parms);
    public static void glGetTexGenfvOES (GLenum coord, GLenum pname,
                                         GLfloat* parms);
    public static void glGetTexGenivOES (GLenum coord, GLenum pname,
                                         GLint* parms);
    public static void glGetTexGenxvOES (GLenum coord, GLenum pname,
                                         GLfixed* parms);

    public delegate void PFNGLTEXGENFOESPROC (GLenum coord, GLenum pname,
                                              GLfloat parm);
    public delegate void PFNGLTEXGENFVOESPROC (GLenum coord, GLenum pname,
                                               GLfloat* parms);
    public delegate void PFNGLTEXGENIOESPROC (GLenum coord, GLenum pname,
                                              GLint param);
    public delegate void PFNGLTEXGENIVOESPROC (GLenum coord, GLenum pname,
                                               GLint* parms);
    public delegate void PFNGLTEXGENXOESPROC (GLenum coord, GLenum pname,
                                              GLfixed parm);
    public delegate void PFNGLTEXGENXVOESPROC (GLenum coord, GLenum pname,
                                               GLfixed* parms);
    public delegate void PFNGLGETTEXGENFVOESPROC (GLenum coord, GLenum pname,
                                                  GLfloat* parms);
    public delegate void PFNGLGETTEXGENIVOESPROC (GLenum coord, GLenum pname,
                                                  GLint* parms);
    public delegate void PFNGLGETTEXGENXVOESPROC (GLenum coord, GLenum pname,
                                                  GLfixed* parms);

#endif
}
