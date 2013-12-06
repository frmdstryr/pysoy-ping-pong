using GLib;
using Gtk;
using Gdk;
using GL;

public class Simple : GLib.Object
{
        public MainLoop mainloop;
        public Gdk.Window window;
        public Gdk.GL.Context glcontext;
        
        private void on_configure_event (Gdk.Window window, Gdk.EventConfigure event)
        {
                Gdk.GL.Drawable gldrawable = Gdk.GL.GdkWindowExtension.get_gl_drawable (window);

                if (!gldrawable.gl_begin (glcontext))
                    return;

                glViewport (0, 0, (GLsizei)event.width, (GLsizei)event.height);

                gldrawable.gl_end ();
        }

        
        private void on_expose_event (Gdk.Window window, Gdk.EventExpose event)
        {
                Gdk.GL.Drawable gldrawable = Gdk.GL.GdkWindowExtension.get_gl_drawable (window);

                if (!gldrawable.gl_begin (glcontext))
                        return;

                glClear (GL_COLOR_BUFFER_BIT);
                
                glBegin (GL_TRIANGLES);
                        glIndexi (0);
                        glColor3f (1.0f, 0.0f, 0.0f);
                        glVertex2i (0, 1);
                        glIndexi (0);
                        glColor3f (0.0f, 1.0f, 0.0f);
                        glVertex2i (-1, -1);
                        glIndexi (0);
                        glColor3f (0.0f, 0.0f, 1.0f);
                        glVertex2i (1, -1);
                glEnd ();

                if (gldrawable.is_double_buffered ())
                        gldrawable.swap_buffers ();
                else
                        glFlush ();

                gldrawable.gl_end ();
        }

        construct
        {
                var windowattrs = Gdk.WindowAttr();
                windowattrs.title = "Test";
                windowattrs.window_type = Gdk.WindowType.TOPLEVEL;
                windowattrs.width = 200;
                windowattrs.height = 200;
                windowattrs.event_mask = Gdk.EventMask.ALL_EVENTS_MASK;
                
                this.window = new Gdk.Window(null,windowattrs , 0);

                Gdk.GL.Config glconfig = new Gdk.GL.Config.by_mode (Gdk.GL.ConfigMode.RGB | Gdk.GL.ConfigMode.DOUBLE);
                
                // var glwindow = new Gdk.GL.Window(glconfig, window, null);
                var glwindow = Gdk.GL.GdkWindowExtension.set_gl_capability(window, glconfig, null);
                
                stdout.printf("glwindow is at %p\n", glwindow);
                
                Gdk.GL.Drawable gldrawable = Gdk.GL.GdkWindowExtension.get_gl_drawable(window);
                
                stdout.printf("drawable is at %p\n", gldrawable);
                glcontext = new Gdk.GL.Context(gldrawable, null, true, Gdk.GL.RenderType.RGBA_TYPE);
                
                window.show();
                
                Gdk.Event.handler_set(this.event_func);
                
                //DrawingArea drawing_area = new DrawingArea ();
                //drawing_area.set_size_request (200, 200);

                //Gtk.GL.GtkWidgetExtension.set_gl_capability (drawing_area, glconfig, null, true, Gdk.GL.RenderType.RGBA_TYPE);
                
                //gdk_event_handler_set
                //window.configure_event += on_configure_event;
                //window.expose_event += on_expose_event;
                //window.gdk_window_set_gl_capability(glconfig,NULL);
                
                //add (drawing_area);
        }
        
        public void event_func(Gdk.Event event)
        {
            if (event.type == Gdk.EventType.EXPOSE) {
        	    on_expose_event(event.expose.window, event.expose);
            } else if (event.type == Gdk.EventType.CONFIGURE) {
        	    on_configure_event(event.configure.window, event.configure);
            } else if (event.type == Gdk.EventType.DELETE ) {
              stdout.printf("Test: Delete Event\n");
              this.window.destroy();
              mainloop.quit();
            } else if (event.type == Gdk.EventType.MOTION_NOTIFY ) {
              // Mouse has moved
            } else {
              stdout.printf("Test: Unprocessed event %d\n", event.type);
            }
        }

        public static void main (string[] args)
        {
                Gdk.init (ref args);
                Gtk.GL.init (ref args);

                var simple = new Simple ();
                //simple.show_all ();
                
                simple.mainloop = new MainLoop(null,true);
                simple.mainloop.run();
        }
}