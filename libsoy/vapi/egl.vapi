/* egl.vapi
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

[CCode (lower_case_cprefix ="", cheader_filename="EGL/egl.h")]
namespace EGL {
    [CCode (cname="EGLBoolean")]
    public struct EGLBoolean : bool { }
    [CCode (cname="EGLenum")]
    public struct EGLenum : uint { }
    [CCode (cname="EGLint")]
    public struct EGLint : int { }
    [CCode (cname="EGLint")]
    public struct EGLint : int { }
    [CCode (cname="EGLConfig")]
    public struct EGLConfig : void* { }
    [CCode (cname="EGLContext")]
    public struct EGLContext : void* { }
    [CCode (cname="EGLDisplay")]
    public struct EGLDisplay : void* { }
    [CCode (cname="EGLSurface")]
    public struct EGLSurface : void* { }
    [CCode (cname="EGLClientBuffer")]
    public struct EGLClientBuffer : void* { }

    // Platform
    [CCode (cname="EGLNativeDisplayType")]
    public struct EGLNativeDisplayType { }
    [CCode (cname="EGLNativeWindowType")]
    public struct EGLNativeWindowType { }
    [CCode (cname="EGLNativePixmapType")]
    public struct EGLNativePixmapType { }

    // Boolean
    public const EGLenum EGL_FALSE;
    public const EGLenum EGL_TRUE;

    // Out-of-band handle values
    public const EGLenum EGL_DEFAULT_DISPLAY;
    public const EGLenum EGL_NO_CONTEXT;
    public const EGLenum EGL_NO_DISPLAY;
    public const EGLenum EGL_NO_SURFACE;

    // Out-of-band attribute value
    public const EGLenum EGL_DONT_CARE;

    // Errors
    public const EGLenum EGL_SUCCESS;
    public const EGLenum EGL_NOT_INITIALIZED;
    public const EGLenum EGL_BAD_ACCESS;
    public const EGLenum EGL_BAD_ALLOC;
    public const EGLenum EGL_BAD_ATTRIBUTE;
    public const EGLenum EGL_BAD_CONFIG;
    public const EGLenum EGL_BAD_CONTEXT;
    public const EGLenum EGL_BAD_CURRENT_SURFACE;
    public const EGLenum EGL_BAD_DISPLAY;
    public const EGLenum EGL_BAD_MATCH;
    public const EGLenum EGL_BAD_NATIVE_PIXMAP;
    public const EGLenum EGL_BAD_NATIVE_WINDOW;
    public const EGLenum EGL_BAD_PARAMETER;
    public const EGLenum EGL_BAD_SURFACE;
    public const EGLenum EGL_CONTEXT_LOST;

    // Config attributes
    public const EGLenum EGL_BUFFER_SIZE;
    public const EGLenum EGL_ALPHA_SIZE;
    public const EGLenum EGL_BLUE_SIZE;
    public const EGLenum EGL_GREEN_SIZE;
    public const EGLenum EGL_RED_SIZE;
    public const EGLenum EGL_DEPTH_SIZE;
    public const EGLenum EGL_STENCIL_SIZE;
    public const EGLenum EGL_CONFIG_CAVEAT;
    public const EGLenum EGL_CONFIG_ID;
    public const EGLenum EGL_LEVEL;
    public const EGLenum EGL_MAX_PBUFFER_HEIGHT;
    public const EGLenum EGL_MAX_PBUFFER_PIXELS;
    public const EGLenum EGL_MAX_PBUFFER_WIDTH;
    public const EGLenum EGL_NATIVE_RENDERABLE;
    public const EGLenum EGL_NATIVE_VISUAL_ID;
    public const EGLenum EGL_NATIVE_VISUAL_TYPE;
    public const EGLenum EGL_SAMPLES;
    public const EGLenum EGL_SAMPLE_BUFFERS;
    public const EGLenum EGL_SURFACE_TYPE;
    public const EGLenum EGL_TRANSPARENT_TYPE;
    public const EGLenum EGL_TRANSPARENT_BLUE_VALUE;
    public const EGLenum EGL_TRANSPARENT_GREEN_VALUE;
    public const EGLenum EGL_TRANSPARENT_RED_VALUE;
    public const EGLenum EGL_NONE;
    public const EGLenum EGL_BIND_TO_TEXTURE_RGB;
    public const EGLenum EGL_BIND_TO_TEXTURE_RGBA;
    public const EGLenum EGL_MIN_SWAP_INTERVAL;
    public const EGLenum EGL_MAX_SWAP_INTERVAL;
    public const EGLenum EGL_LUMINANCE_SIZE;
    public const EGLenum EGL_ALPHA_MASK_SIZE;
    public const EGLenum EGL_COLOR_BUFFER_TYPE;
    public const EGLenum EGL_RENDERABLE_TYPE;
    public const EGLenum EGL_MATCH_NATIVE_PIXMAP;
    public const EGLenum EGL_CONFORMANT;

    // Config attribute values
    public const EGLenum EGL_SLOW_CONFIG;
    public const EGLenum EGL_NON_CONFORMANT_CONFIG;
    public const EGLenum EGL_TRANSPARENT_RGB;
    public const EGLenum EGL_RGB_BUFFER;
    public const EGLenum EGL_LUMINANCE_BUFFER;
    
    // More config attribute values, for EGL_TEXTURE_FORMAT
    public const EGLenum EGL_NO_TEXTURE;
    public const EGLenum EGL_TEXTURE_RGB;
    public const EGLenum EGL_TEXTURE_RGBA;
    public const EGLenum EGL_TEXTURE_2D;
    
    // EGL_SURFACE_TYPE mask bits
    public const EGLenum EGL_PBUFFER_BIT;
    public const EGLenum EGL_PIXMAP_BIT;
    public const EGLenum EGL_WINDOW_BIT;
    public const EGLenum EGL_VG_COLORSPACE_LINEAR_BIT;
    public const EGLenum EGL_VG_ALPHA_FORMAT_PRE_BIT;
    public const EGLenum EGL_MULTISAMPLE_RESOLVE_BOX_BIT;
    public const EGLenum EGL_SWAP_BEHAVIOR_PRESERVED_BIT;
    
    // EGL_RENDERABLE_TYPE mask bits
    public const EGLenum EGL_OPENGL_ES_BIT;
    public const EGLenum EGL_OPENVG_BIT;
    public const EGLenum EGL_OPENGL_ES2_BIT;
    public const EGLenum EGL_OPENGL_BIT;
    
    // QueryString targets
    public const EGLenum EGL_VENDOR;
    public const EGLenum EGL_VERSION;
    public const EGLenum EGL_EXTENSIONS;
    public const EGLenum EGL_CLIENT_APIS;
    
    // QuerySurface / SurfaceAttrib / CreatePbufferSurface targets
    public const EGLenum EGL_HEIGHT;
    public const EGLenum EGL_WIDTH;
    public const EGLenum EGL_LARGEST_PBUFFER;
    public const EGLenum EGL_TEXTURE_FORMAT;
    public const EGLenum EGL_TEXTURE_TARGET;
    public const EGLenum EGL_MIPMAP_TEXTURE;
    public const EGLenum EGL_MIPMAP_LEVEL;
    public const EGLenum EGL_RENDER_BUFFER;
    public const EGLenum EGL_VG_COLORSPACE;
    public const EGLenum EGL_VG_ALPHA_FORMAT;
    public const EGLenum EGL_HORIZONTAL_RESOLUTION;
    public const EGLenum EGL_VERTICAL_RESOLUTION;
    public const EGLenum EGL_PIXEL_ASPECT_RATIO;
    public const EGLenum EGL_SWAP_BEHAVIOR;
    public const EGLenum EGL_MULTISAMPLE_RESOLVE;
    
    // EGL_RENDER_BUFFER values / BindTexImage / ReleaseTexImage buffer targets
    public const EGLenum EGL_BACK_BUFFER;
    public const EGLenum EGL_SINGLE_BUFFER;
    
    // OpenVG color spaces
    public const EGLenum EGL_VG_COLORSPACE_sRGB;
    public const EGLenum EGL_VG_COLORSPACE_LINEAR;
    
    // OpenVG alpha formats
    public const EGLenum EGL_VG_ALPHA_FORMAT_NONPRE;
    public const EGLenum EGL_VG_ALPHA_FORMAT_PRE;
    
    // Constant scale factor by which fractional display resolutions &
    // aspect ratio are scaled when queried as integer values.
    public const EGLenum EGL_DISPLAY_SCALING;

    // Unknown display resolution/aspect ratio
    public const EGLenum EGL_UNKNOWN;

    // Back buffer swap behaviors
    public const EGLenum EGL_BUFFER_PRESERVED;
    public const EGLenum EGL_BUFFER_DESTROYED;

    // CreatePbufferFromClientBuffer buffer types
    public const EGLenum EGL_OPENVG_IMAGE;
    
    // QueryContext targets
    public const EGLenum EGL_CONTEXT_CLIENT_TYPE;
    
    // CreateContext attributes
    public const EGLenum EGL_CONTEXT_CLIENT_VERSION;
    
    // Multisample resolution behaviors
    public const EGLenum EGL_MULTISAMPLE_RESOLVE_DEFAULT;
    public const EGLenum EGL_MULTISAMPLE_RESOLVE_BOX;
    
    // BindAPI/QueryAPI targets
    public const EGLenum EGL_OPENGL_ES_API;
    public const EGLenum EGL_OPENVG_API;
    public const EGLenum EGL_OPENGL_API;
    
    // GetCurrentSurface targets
    public const EGLenum EGL_DRAW;
    public const EGLenum EGL_READ;
    
    // WaitNative engines
    public const EGLenum EGL_CORE_NATIVE_ENGINE;
    
    // EGL 1.2 tokens renamed for consistency in EGL 1.3
    public const EGLenum EGL_COLORSPACE;
    public const EGLenum EGL_ALPHA_FORMAT;
    public const EGLenum EGL_COLORSPACE_sRGB;
    public const EGLenum EGL_COLORSPACE_LINEAR;
    public const EGLenum EGL_ALPHA_FORMAT_NONPRE;
    public const EGLenum EGL_ALPHA_FORMAT_PRE;
    
    
    /*************************************************************/
    // EGL Functions

    public static void glAlphaFunc (GLenum func, GLclampf @ref);
                                     [CCode (array_length = false)]
                                     GLfloat[] equation);
    public static EGLint eglGetError ( );
    public static EGLDisplay eglGetDisplay (EGLNativeDisplayType display_id);
    public static EGLBoolean eglInitialize (EGLDisplay dpy, out EGLint major,
                                            out EGLint minor);
    public static EGLBoolean eglTerminate (EGLDisplay dpy);
    public static string eglQueryString (EGLDisplay dpy, EGLint name);
    // FIXME http://www.khronos.org/opengles/documentation/opengles1_0/html/eglGetConfigs.html
    public static EGLBoolean eglGetConfigs (EGLDisplay dpy,
                                            out EGLConfig configs,
                                            EGLint config_size,
                                            out EGLint num_config);
    // FIXME http://www.khronos.org/opengles/documentation/opengles1_0/html/eglChooseConfig.html
    public static EGLBoolean eglChooseConfig (EGLDisplay dpy,
                                              EGLint[] attrib_list,
                                              out EGLConfig configs,
                                              EGLint config_size,
                                              EGLint *num_config);
    public static EGLBoolean eglGetConfigAttrib (EGLDisplay dpy,
                                                 EGLConfig config,
                                                 EGLint attribute,
                                                 out EGLint val);
    public static EGLSurface eglCreateWindowSurface (EGLDisplay dpy,
                                                     EGLConfig config,
                                                     EGLNativeWindowType win,
                                                     [CCode (array_length = false)]
                                                     EGLint[] attrib_list);
    public static EGLSurface eglCreatePbufferSurface (EGLDisplay dpy,
                                                      EGLConfig config,
                                                     [CCode (array_length = false)]
                                                      EGLint[] attrib_list);
    public static EGLSurface eglCreatePixmapSurface (EGLDisplay dpy,
                                                     EGLConfig config,
                                                     EGLNativePixmapType pixmap,
                                                     [CCode (array_length = false)]
                                                     EGLint[] attrib_list);
    public static EGLBoolean eglDestroySurface (EGLDisplay dpy,
                                                EGLSurface surface);
    public static EGLBoolean eglQuerySurface (EGLDisplay dpy,
                                              EGLSurface surface,
                                              EGLint attribute, out EGLint val);
    public static EGLBoolean eglBindAPI (EGLenum api);
    public static EGLenum eglQueryAPI ( );
    public static EGLBoolean eglWaitClient ( );
    public static EGLBoolean eglReleaseThread ( );
    public static EGLSurface eglCreatePbufferFromClientBuffer (
        EGLDisplay dpy, EGLenum buftype, EGLClientBuffer buffer, 
        EGLConfig config, 
        [CCode (array_length = false)] EGLint[] attrib_list);
    public static EGLBoolean eglSurfaceAttrib (EGLDisplay dpy,
                                               EGLSurface surface,
                                               EGLint attribute, EGLint val);
    public static EGLBoolean eglBindTexImage (EGLDisplay dpy,
                                              EGLSurface surface,
                                              EGLint buffer);
    public static EGLBoolean eglReleaseTexImage (EGLDisplay dpy,
                                                 EGLSurface surface,
                                                 EGLint buffer);
    public static EGLBoolean eglSwapInterval (EGLDisplay dpy, EGLint interval);
    public static EGLContext eglCreateContext (EGLDisplay dpy, EGLConfig config,
                                               EGLContext share_context,
                                               [CCode (array_length = false)]
                                               EGLint[] attrib_list);
    public static EGLBoolean eglDestroyContext (EGLDisplay dpy, EGLContext ctx);
    public static EGLBoolean eglMakeCurrent (EGLDisplay dpy, EGLSurface draw,
                                             EGLSurface read, EGLContext ctx);
    public static EGLContext eglGetCurrentContext ( );
    public static EGLSurface eglGetCurrentSurface (EGLint readdraw);
    public static EGLDisplay eglGetCurrentDisplay ( );
    public static EGLBoolean eglQueryContext (EGLDisplay dpy, EGLContext ctx,
                                              EGLint attribute, out EGLint val);
    public static EGLBoolean eglWaitGL ( );
    public static EGLBoolean eglWaitNative (EGLint engine);
    public static EGLBoolean eglSwapBuffers (EGLDisplay dpy,
                                             EGLSurface surface);
    public static EGLBoolean eglCopyBuffers (EGLDisplay dpy,
                                             EGLSurface surface,
                                             EGLNativePixmapType target);
}
