/*
  PySoy - soy.Client Type
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

static char
PySoy_Client_doc[] = "soy.Client Type\n"
"\n"
"    PySoy clients manage the state of a specific game instance including\n"
"    windows, audio input/output, controllers, and object data state.\n"
"\n"
"    Instances of this type represent PySoy clients, either local or remote.\n"
"    Local clients are created by instantating a new soy.Client object and\n"
"    adding it to a Server.  Remote clients are added by the Server itself\n"
"    when a request is made over XMPP.\n"
"\n"
"    Local clients are intended primarily for developing and debugging games\n"
"    though they may be used for playing downloaded games or local 3D access\n"
"    for server administrators.\n"
"\n"
"    Due to differing hardware, some properties (position, size, title, etc)\n"
"    may be read-only for some clients where these values cannot be changed.\n"
"    An exception will be raised when a Client property cannot be changed.\n"
"\n";


///////////////////////////////////////////////////////////////////////////////
// Globals

static GThread* PySoy_Client_thread = NULL;
static GMainContext* PySoy_Client_thread_context = NULL;
static Display* x11Display;
static XVisualInfo* x11VisInfo;
static Window rootWindow;
static EGLDisplay eglDisplay;
static EGLConfig eglConfig;
static EGLContext eglContext;
static int xi2_opcode;
static GHashTable* PySoy_windows;
static GMutex init_mutex;
static GCond init_cond;
static gboolean inited = FALSE;
static gchar* background_GThread = NULL;
static Atom wm_delete_window;

///////////////////////////////////////////////////////////////////////////////
// Function Prototypes

static void
PySoy_Client_window_resize (PySoy_Client_Object* self, soyatomsSize* size);

static int
PySoy_Client_thread_init (void);

static gpointer
PySoy_Client_thread_loop (gpointer data);

static gboolean
PySoy_Client_thread_step (PySoy_Client_Object* self);

static int
PySoy_Client_set_WM_hints(PySoy_Client_Object* self);

///////////////////////////////////////////////////////////////////////////////
// Type Functions

static int
PySoy_Client_init (PySoy_Client_Object* self, PyObject* args, PyObject* kwds) {
    static char* kw[] = {NULL};
    soywidgetsWindow* soyWindow;
    GSource* source;

    // Ensure no arguments or keywords were provided
    if (!PyArg_ParseTupleAndKeywords(args, kwds, "", kw))
        return -1;

    // Set empty address
    self->address = "";

    // Clear X11/EGL storage
    self->window_id = 0;
    self->window_surface = NULL;

    // Set empty controllermap
    self->controllers = (PySoy_Client__ControllerMap_Object*)
        PyType_GenericNew(&PySoy_Client__ControllerMap_Type,
                          NULL, NULL);
    self->controllers->map = g_hash_table_new_full(g_int_hash, g_int_equal,
                                                   g_free, g_object_unref);
    self->pointer = NULL;
    self->keyboard = NULL;

    // Launch background thread if it hasn't already
    if (PySoy_Client_thread == NULL) {
        if (PySoy_Client_thread_init() == -1)
            // Return error if thread could not be launched.
            return -1;
    }

    // Create new window
    self->window = PyType_GenericNew(&PySoy_widgets_Window_Type, NULL, NULL);
    if (!self->window)
        return -1;
    soyWindow = soy_widgets_window_new();
    ((PySoy_widgets_Window_Object*) self->window)->g = soyWindow;

    // Get a hook for the new window's size
    self->window_size = soy_widgets_widget_get_size((gpointer) soyWindow);
    // g_signal_connect(instance to connect to, detailed signal, gcallback handler, data to pass)
    // Called before default signal handler
    g_signal_connect(self->window_size, "on-set",
                     (GCallback) PySoy_Client_window_resize, self);

    // TODO hook into position, title, icon, etc

    // Hold X11 mutex

    // Add X11 event source to be called every 25ms (40fps)
    source = g_timeout_source_new((guint) 25);
    g_source_set_callback(source, (GSourceFunc) PySoy_Client_thread_step, self,
                          NULL);
    g_source_attach(source, PySoy_Client_thread_context);
    g_source_unref(source);

    // Wait for X11 mutex to unlock

    // return successfully
    return 0;
}


static void
PySoy_Client_dealloc (PySoy_Client_Object* self) {
    guint signal;

    // Disconnect window size signal
    g_signal_parse_name ("on-set", soy_atoms_size_get_type(),
                         &signal, NULL, FALSE);
    g_signal_handlers_disconnect_matched(self->window_size,
                                         G_SIGNAL_MATCH_ID |
                                         G_SIGNAL_MATCH_FUNC |
                                         G_SIGNAL_MATCH_DATA,
                                         signal, 0, NULL,
                                         (GCallback) PySoy_Client_window_resize,
                                         self);

    // Decref window
    // TODO this should "orphan" the window as well, such that if its ref'd
    // outside this class it can be added to a Container widget
    Py_DECREF(self->window);

    // Decref controllers list
    Py_DECREF(self->controllers);
    Py_DECREF(self->pointer);
    Py_DECREF(self->keyboard);

    // delete object
    PyObject_Del(self);
}


static PyObject*
PySoy_Client_repr (PySoy_Client_Object* self) {
    // return string as unicode object
    return PyUnicode_FromString("<PySoy Client>");
}


///////////////////////////////////////////////////////////////////////////////
// Window Callbacks

static void
PySoy_Client_window_resize (PySoy_Client_Object* self, soyatomsSize* size) {
    return;
}


///////////////////////////////////////////////////////////////////////////////
// Properties

static PyObject*
PySoy_Client_address_getter (PySoy_Client_Object* self, void* closure) {
    // return string as unicode object
    return PyUnicode_FromString(self->address);
}


static PyObject*
PySoy_Client_window_getter (PySoy_Client_Object* self, void* closure) {
    // Return Window object
    Py_INCREF(self->window);
    return self->window;
}


static PySoy_Client__ControllerMap_Object*
PySoy_Client_controllers_getter (PySoy_Client_Object* self, void* closure) {
    // Block until init completes
    g_mutex_lock (&init_mutex);
    while (!inited) {
        g_cond_wait (&init_cond, &init_mutex);
    }
    g_mutex_unlock (&init_mutex);

    // Return controllers list
    Py_INCREF(self->controllers);
    return self->controllers;
}


static PySoy_controllers_Pointer_Object*
PySoy_Client_pointer_getter (PySoy_Client_Object* self, void* closure) {
    PySoy_controllers_Pointer_Object* ret;

    // Block until init completes
    g_mutex_lock (&init_mutex);
    while (!inited) {
        g_cond_wait (&init_cond, &init_mutex);
    }
    g_mutex_unlock (&init_mutex);

    ret = (PySoy_controllers_Pointer_Object*)
        PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(self->pointer),
                                           GPyObject), NULL, NULL);

    if (!ret) {
        return NULL;
    }

    // Set GObject ref
    ret->g = self->pointer;
    g_object_ref(self->pointer);
    return ret;
}


static PySoy_controllers_Keyboard_Object*
PySoy_Client_keyboard_getter (PySoy_Client_Object* self, void* closure) {
    PySoy_controllers_Keyboard_Object* ret;

    // Block until init completes
    g_mutex_lock (&init_mutex);
    while (!inited) {
        g_cond_wait (&init_cond, &init_mutex);
    }
    g_mutex_unlock (&init_mutex);

    ret = (PySoy_controllers_Keyboard_Object*)
        PyType_GenericNew(g_type_get_qdata(G_OBJECT_TYPE(self->keyboard),
                                           GPyObject), NULL, NULL);

    if (!ret) {
        return NULL;
    }

    // Set GObject ref
    ret->g = self->keyboard;
    g_object_ref(self->keyboard);
    return ret;
}


///////////////////////////////////////////////////////////////////////////////
// Event Source

static gboolean
PySoy_Client_events_prepare (GSource* source, gint* timeout) {
    // Before a poll is called, this is called to see if an event is ready.
    // If not, it'll poll for 10ms before checking again.

    if (XPending(x11Display) > 0)
        return TRUE;
    *timeout = 10;
    return FALSE;
}


static gboolean
PySoy_Client_events_check (GSource* source) {
    // After MainLoop's poll has timed out, this will be called to determine
    // if the source needs to be dispatched.
    return (XPending(x11Display) > 0);
}


static gboolean
PySoy_Client_events_dispatch (GSource* source, GSourceFunc sf, gpointer data) {
    // This is called when there are pending events to be processed.
    while (XPending(x11Display) > 0) {
        PySoy_Client_Object* self;
        XEvent event;

        // Get event
        XNextEvent(x11Display, &event);

        // First check to see if its a XI2 event
        if (XGetEventData(x11Display, &event.xcookie)) {
            // Convenience
            XIDeviceEvent* data = event.xcookie.data;
            soycontrollersController* controller;

            // Ignore cookie events that are not XI2
            if (event.xcookie.type != GenericEvent ||
                event.xcookie.extension != xi2_opcode) {
                XFreeEventData(x11Display, &event.xcookie);
                continue;
            }

            // Know thy self
            self = (PySoy_Client_Object*)
                g_hash_table_lookup(PySoy_windows, &data->event);

            // Get controller object for given device id
            controller = (soycontrollersController*)
                g_hash_table_lookup(self->controllers->map,
                                    &data->deviceid);

            switch (data->evtype) {
            case XI_Motion :
                if (SOY_CONTROLLERS_IS_POINTER (controller))
                    // Pointer motion
                    soy_controllers_pointer_motion(self->pointer,
                                                   lround(data->event_x),
                                                   lround(data->event_y));
                break;

            case XI_ButtonPress :
            case XI_ButtonRelease :
            case XI_KeyPress :
            case XI_KeyRelease : 
                break;


                /* This is for when we actually care about versionator data
                   int i, j;
                   int axis = 0;
                   int axis_ids[16];
                   double axis_values[16];

                   // Count axis and get axis_ids
                   for (i = 0; i < data->valuators.mask_len; i++)
                   for (j = 0; j < 8; j++)
                   if (data->valuators.mask[i] & (1<<j) && axis<16) {
                   axis_ids[axis] = i*8+j;
                   axis++;
                   }

                   // Get axis_values
                   for (i = 0; i < axis; i++) {
                   axis_values[i] = data->valuators.values[i];
                   printf("Axis %d = %f\n", i, axis_values[i]);
                   }

                */
                break;

            default :
                printf("Event type %d received\n", event.xcookie.evtype);
            }

            XFreeEventData(x11Display, &event.xcookie);
            continue;
        }

        // Know thy self
        if (event.type == CreateNotify)
            self = (PySoy_Client_Object*)
                g_hash_table_lookup(PySoy_windows,
                                    &event.xcreatewindow.window);
        else
            self = (PySoy_Client_Object*)
                g_hash_table_lookup(PySoy_windows, &event.xany.window);
        
        // Close the window if the X is clicked 
        if (event.type == ClientMessage) {
            if ((Atom)event.xclient.data.l[0] == wm_delete_window) {
                soy_atoms_size_set(self->window_size, 0, 0, 0);
                XDestroyWindow(x11Display, self->window_id);
                XCloseDisplay(x11Display);
                PySoy_Client_thread = NULL;
                g_thread_exit(NULL);
                exit(EXIT_SUCCESS);
            }
        }

        if (self == NULL)
            continue;


        switch (event.type) {
        case CreateNotify :
            // Map new window
            XMapWindow(x11Display, self->window_id);

            // Kill window stuff
            wm_delete_window = XInternAtom(x11Display, "WM_DELETE_WINDOW", False);
            XSetWMProtocols(x11Display, self->window_id, &wm_delete_window, 1);


            // Get EGLSurface
            self->window_surface = eglCreateWindowSurface(eglDisplay,
                                                          eglConfig,
                                                          self->window_id,
                                                          NULL);

            XFlush(x11Display);
            break;

        case UnmapNotify :
        case MapNotify :
        case ReparentNotify :
            break;
        case DestroyNotify :
            break;

        case ClientMessage :
            break;

        case ConfigureNotify : 
            /* Fired if:
             *  Window size, border, position or stacking order reconfigured
             *  Window moved
             *  Window remapped
             *  If override-redirect flag is false
             */
            soy_atoms_size_set(self->window_size,
                               (double) event.xconfigure.width,
                               (double) event.xconfigure.height, 0.0);

            // Clear the resized flag so that XResizeWindow isn't called leading to a 
            // ConfigureNotify event loop.
            ((PySoy_widgets_Widget_Object*) self->window)->g->resized = FALSE;
            break;

        case Expose :
            // Ensure window has been created first
            if (!self->window_surface)
                break;

            // Activate window
            eglMakeCurrent(eglDisplay, self->window_surface,
                           self->window_surface, eglContext);

            // Draw window
            soy_widgets_window_draw(((PySoy_widgets_Window_Object*)
                                     self->window)->g);

            // Push color buffer to window
            eglSwapBuffers(eglDisplay, self->window_surface);
            break;

            // Default is to ignore unknown events.
        default :
            // ... except for debugging
            printf("Unknown event %d received\n", event.type);
            break;
        }
    }
    return TRUE;
}


GSourceFuncs PySoy_Client_events = {
    PySoy_Client_events_prepare,                            // prepare
    PySoy_Client_events_check,                              // check
    PySoy_Client_events_dispatch,                           // dispatch
    NULL,                                                   // finalize
    NULL,                                                   // closure_callback
    NULL,                                                   // closure_marshal
};


///////////////////////////////////////////////////////////////////////////////
// Background thread

static int
PySoy_Client_thread_init (void) {
    GError* error = NULL;

    PySoy_Client_thread_context = g_main_context_new();
    PySoy_Client_thread = g_thread_new(background_GThread, 
                                          PySoy_Client_thread_loop, FALSE);

    // Check for errors
    if (error != NULL) {
        PyErr_SetString(PyExc_SystemError, "cannot create Client thread.");
        g_clear_error(&error);
        return -1;
    }

    return 0;
}

static gpointer
PySoy_Client_thread_loop (gpointer data) {
    // Create hashtable for windows
    PySoy_windows = g_hash_table_new(g_int_hash, g_int_equal);

    // This function runs a mainloop on events added to the Client context.
    GMainLoop* mainloop = g_main_loop_new (PySoy_Client_thread_context, TRUE);
    g_main_loop_run(mainloop);

    // Destroy window lookup hashtable
    g_hash_table_destroy(PySoy_windows);

    // Destroy Mainloop and Maincontext
    g_main_loop_unref(mainloop);
    g_main_context_unref(PySoy_Client_thread_context);
    PySoy_Client_thread_context = NULL;

    // Free visInfo struct
    XFree(x11VisInfo);

    // Clear GThread so it can be used again
    PySoy_Client_thread = NULL;
    g_thread_exit(NULL);

    // For muting compiler warning
    return NULL;
}


static void select_events(Window win) {
    XIEventMask evmasks[2];
    unsigned char mask1[(XI_LASTEVENT + 7)/8];
    unsigned char mask2[(XI_LASTEVENT + 7)/8];

    memset(mask1, 0, sizeof(mask1));

    /* select for button and key events from all master devices */
    XISetMask(mask1, XI_ButtonPress);
    XISetMask(mask1, XI_ButtonRelease);
    XISetMask(mask1, XI_KeyPress);
    XISetMask(mask1, XI_KeyRelease);

    evmasks[0].deviceid = XIAllMasterDevices;
    evmasks[0].mask_len = sizeof(mask1);
    evmasks[0].mask = mask1;

    memset(mask2, 0, sizeof(mask2));

    /* Select for motion from the default cursor */
    XISetMask(mask2, XI_Motion);

    evmasks[1].deviceid = 2; /* the default cursor */
    evmasks[1].mask_len = sizeof(mask2);
    evmasks[1].mask = mask2;

    XISelectEvents(x11Display, win, evmasks, 2);
    XFlush(x11Display);
}


static gboolean
PySoy_Client_thread_step (PySoy_Client_Object* self) {
    int matches;
    XSetWindowAttributes winattr;
    XIEventMask mask;

    //
    // Invalidate the window for rendering if the window already exists.
    if (self->window_id) {

        // Retitle window (if retitled)
        if (soy_widgets_window_get_retitle(
                            ((PySoy_widgets_Window_Object*) self->window)->g)) {
            char* title = (char*) soy_widgets_window_get_title(
                              ((PySoy_widgets_Window_Object*) self->window)->g);
            XSetStandardProperties(x11Display, self->window_id, title, title,
                                   None, NULL, 0, NULL);
            soy_widgets_window_set_retitle(((PySoy_widgets_Window_Object*) self
                                      ->window)->g, FALSE);
        }

        if(((PySoy_widgets_Widget_Object*) self->window)->g->resized) {
            XResizeWindow(x11Display, self->window_id,
                          ((PySoy_widgets_Widget_Object*) self->window)->g->width,
                          ((PySoy_widgets_Widget_Object*) self->window)->g->height);
            ((PySoy_widgets_Widget_Object*) self->window)->g->resized = FALSE;
        }

        if (x11Display != NULL) {
            XClearArea(x11Display, self->window_id, 0, 0, 0, 0, TRUE);
        }
        
        XFlush(x11Display);
        return TRUE;

    }

    //
    // Open X11 connection if it is not yet
    if (x11Display == NULL) {
        // Open X11 display
        x11Display = XOpenDisplay(NULL);
        if (!x11Display) {
            printf("Could not open X11 display.\n");
            return FALSE;
        }

        // Get the current X11 depth
        x11VisInfo = XGetVisualInfo(x11Display, VisualNoMask, NULL,
                                    &matches);
        if (matches == 0) {
            printf("Could not get XVisual\n");
            raise(15);
        }

        // Get root window
        rootWindow = RootWindow(x11Display, XDefaultScreen(x11Display));

        // Check for XInput extension
        int event, err;
        if (!XQueryExtension(x11Display, "XInputExtension", &xi2_opcode,
                             &event, &err)) {
            printf("XInput extension not available.\n");
            return FALSE;
        }

        // Ensure XInput extension is version 2.0
        int major = 2, minor = 0;
        if (XIQueryVersion(x11Display, &major, &minor) == BadRequest) {
            printf("XInput version %d.%d is not supported.\n", major, minor);
            return FALSE;
        }

        // Initialize EGL
        setenv("EGL_PLATFORM", "x11", TRUE);                // Mesa hack
        eglDisplay = eglGetDisplay(x11Display);
        if (!eglInitialize(eglDisplay, &major, &minor)) {
            printf("Failed to initialize EGL.\n");
            raise(15);
        }

        // Check EGL version
        if (major != 1 || minor < 3) {
            printf("EGL version %d.%d not supported.\n", major, minor);
            raise(15);
        }

        // Copy X11 depth into EGL attributes
        EGLint attrs[] = {
            EGL_RENDERABLE_TYPE, EGL_OPENGL_ES_BIT,     // OpenGL ES 1.1
            EGL_NATIVE_VISUAL_ID, x11VisInfo->visualid, // Use X11 VisualID
            EGL_DEPTH_SIZE, 16,                         // Depth
            EGL_STENCIL_SIZE, 1,                        // Stencil
            EGL_NONE
        };

        const EGLint ctx_attrs[] = {
            EGL_CONTEXT_CLIENT_VERSION, 1,              // OpenGL ES 1.1
            EGL_NONE
        };

        if (!eglChooseConfig(eglDisplay, attrs, &eglConfig, 1, &matches)
            || matches == 0) {
            printf("EGL configuration failed.\n");
            raise(15);
        }
        eglBindAPI(EGL_OPENGL_ES_API);

        // Get eglContext
        eglContext = eglCreateContext(eglDisplay, eglConfig,
                                      EGL_NO_CONTEXT, ctx_attrs);

        // Listen for CreateNotify events on root window
        winattr.event_mask = SubstructureNotifyMask;
        XChangeWindowAttributes(x11Display, rootWindow, CWEventMask, &winattr);

        // Listen for changes to device hierarchy

        // Setup events timeout source for every 10ms
        GSource* source = g_source_new(&PySoy_Client_events, sizeof(GSource));
        g_source_attach(source, PySoy_Client_thread_context);
        g_source_unref(source);

    }

    //
    // Create window if it doesn't yet exist 
    if (self->window_id == 0) {
        // Create colormap
        winattr.colormap = XCreateColormap(x11Display, rootWindow,
                                           x11VisInfo->visual, AllocNone);

        // Since we're using XI2 we only care about these two events
        winattr.event_mask = ExposureMask | StructureNotifyMask;

        // TODO add window fullscreen and borderless modes
        //if fullScreen || borderless
        //    winattr.override_redirect = 1;
        winattr.override_redirect = 0;

        // Create new X11 window
        self->window_id = XCreateWindow(
            x11Display,                                     // display
            rootWindow,                                     // parent
            0,                                              // x
            0,                                              // y
            1023,                                           // width
            768,                                            // height
            0,                                              // border_width
            x11VisInfo->depth,                              // depth
            InputOutput,                                    // class
            x11VisInfo->visual,                             // visual
            CWColormap | CWEventMask | CWOverrideRedirect,  // valuemask
            &winattr                                        // attributes
        );

        //select events
        select_events(self->window_id);

        // Set window title
        {
            char* title = (char*) soy_widgets_window_get_title(
                             ((PySoy_widgets_Window_Object*) self->window)->g);
            XSetStandardProperties(x11Display, self->window_id, title, title,
                                   None, NULL, 0, NULL);
        }

        // Set window manager hints
        PySoy_Client_set_WM_hints(self);

        // Add new window to windows hashtable
        g_hash_table_insert(PySoy_windows, &self->window_id, self);

        // Add device hierarchy to controllers
        {
            int i, num_devices;
            int* device_id;
            XIDeviceInfo* devices;
            gpointer controller;

            devices = XIQueryDevice(x11Display, XIAllDevices, &num_devices);
            for (i = 0; i < num_devices; i++) {
                switch(devices[i].use) {
                case XIMasterPointer :
                    controller = soy_controllers_pointer_new();
                    self->pointer = controller;
                    break;
                case XIMasterKeyboard :
                    controller = soy_controllers_keyboard_new();
                    self->keyboard = controller;
                    break;
                    //slave devices?
                default :
                    // Controller type not understood, skip to the next
                    continue;
                }

                // Store device_id
                device_id = (int*) g_malloc(sizeof(int));
                device_id[0] = devices[i].deviceid;

                // Add new controller to our controllers hashtable
                g_hash_table_insert(self->controllers->map,
                                    device_id, controller);
            }
            XIFreeDeviceInfo(devices);

        }

        XFlush(x11Display);
    }

    g_mutex_lock (&init_mutex);
    inited = TRUE;
    g_cond_broadcast (&init_cond);
    g_mutex_unlock (&init_mutex);
    return TRUE;
}


///////////////////////////////////////////////////////////////////////////////
// Window manager hints

static int PySoy_Client_set_WM_hints(PySoy_Client_Object* self) {
    soywidgetsWindow* soyWindow = ((PySoy_widgets_Window_Object*) self->window)->g;
    
    XSizeHints* window_size_hints = XAllocSizeHints();
    if(!window_size_hints) {
        fprintf(stderr, "XAllocSizeHints - Out of memory\n");
        exit(1);
    }

    window_size_hints->flags = PSize | PMinSize;
    window_size_hints->min_width = soy_atoms_size_get_width(self->window_size);
    window_size_hints->min_height = soy_atoms_size_get_height(self->window_size);
    window_size_hints->base_width = soy_atoms_size_get_width(self->window_size);
    window_size_hints->base_height = soy_atoms_size_get_height(self->window_size);

    // Setting the max+min dimension hints to the same values disables resizing
    if(!soy_widgets_window_get_resizable((gpointer) soyWindow)) {
        window_size_hints->flags = PSize | PMinSize | PMaxSize;
        window_size_hints->max_width = (
            soy_atoms_size_get_width(self->window_size));
        window_size_hints->max_height = (
            soy_atoms_size_get_height(self->window_size));
    }

    XSetWMNormalHints(x11Display, self->window_id, window_size_hints);
    XFree(window_size_hints);
    return 0;
}


///////////////////////////////////////////////////////////////////////////////
// Type structs

static PyMethodDef PySoy_Client_Methods[] = {
    {NULL},                                                // sentinel
};


static PyGetSetDef PySoy_Client_GetSet[] = {
    {"address",                                            // name
     (getter) PySoy_Client_address_getter,                 // getter
     NULL,                                                 // setter
     "Client address",                                     // doc
     NULL},                                                // closure

    {"window",                                             // name
     (getter) PySoy_Client_window_getter,                  // getter
     NULL,                                                 // setter
     "Client window",                                      // doc
     NULL},                                                // closure

    {"controllers",                                        // name
     (getter) PySoy_Client_controllers_getter,             // getter
     NULL,                                                 // setter
     "Enumeration of attached input devices",              // doc
     NULL},                                                // closure

    {"pointer",                                            // name
     (getter) PySoy_Client_pointer_getter,                 // getter
     NULL,                                                 // setter
     "Pointer controller",                                 // doc
     NULL},                                                // closure

    {"keyboard",                                           // name
     (getter) PySoy_Client_keyboard_getter,                // getter
     NULL,                                                 // setter
     "Keyboard controller",                                // doc
     NULL},                                                // closure
    {NULL},                                                // sentinel
};


PyTypeObject PySoy_Client_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "soy.Client",                                          // tp_name
    sizeof(PySoy_Client_Object),                           // tp_basicsize
    0,                                                     // tp_itemsize
    (destructor) PySoy_Client_dealloc,                     // tp_dealloc
    0,                                                     // tp_print
    (getattrfunc) 0,                                       // tp_getattr
    (setattrfunc) 0,                                       // tp_setattr
    0,                                                     // RESERVED
    (reprfunc) PySoy_Client_repr,                          // tp_repr
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
    PySoy_Client_doc,                                      // tp_doc
    0,                                                     // tp_traverse
    0,                                                     // tp_clear
    0,                                                     // tp_richcompare
    0,                                                     // tp_weaklistoffset
    0,                                                     // tp_iter
    0,                                                     // tp_iternext
    PySoy_Client_Methods,                                  // tp_methods
    0,                                                     // tp_members
    PySoy_Client_GetSet,                                   // tp_getset
    0,                                                     // tp_base
    0,                                                     // tp_dict
    0,                                                     // tp_descr_get
    0,                                                     // tp_descr_set
    0,                                                     // tp_dictoffset
    (initproc) PySoy_Client_init,                          // tp_init
    PyType_GenericAlloc,                                   // tp_alloc
    PyType_GenericNew,                                     // tp_new
    PyObject_GC_Del,                                       // tp_free
    0,                                                     // tp_is_gc
};

