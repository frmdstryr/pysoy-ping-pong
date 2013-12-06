using GL;

public interface OggDecoder : Object // {{{
{
    public abstract bool packetin(Ogg.Packet pkt);
    public abstract void end_stream();
}
// }}}
public interface OggDecoderFactory : Object // {{{
{
    public abstract OggDecoder? tryconsume(Ogg.Packet pkt);
}
// }}}
public class TheoraDecoder : Object, OggDecoder // {{{
{
    public Theora.Info info;
    public Theora.Comment comment;
    public Theora.DecodeContext ctx;

    private Theora.SetupInfo *setup;
    private int setup_state;
    private Theora.ImagePlane[] _frame;

    public signal void frame_received(Theora.ImagePlane *frame, double frame_time);
    public signal void got_headers();
    public signal void stream_end();

    public TheoraDecoder() // {{{
    {
        info = Theora.Info();
        comment = Theora.Comment();
        setup = null;
        setup_state = 1;
        _frame = new Theora.ImagePlane[3];
    }
    // }}}
    ~TheoraDecoder() // {{{
    {
        if (setup != null)
            g_free(setup);
    }
    // }}}
    private void _readpacket(Ogg.Packet pkt) // {{{
    {
        int64 granpos;
        if (this.setup_state < 0) { // invalid stream, just toss
            return; 
        } else if (this.setup_state > 0) { // still getting headers or recognizing stream
            this.setup_state = Theora.decode_headerin(ref info, ref comment, ref setup, pkt);
            if (this.setup_state != 0)
                return; // error or not to video data yet, done with this packet

            // else headers done, start decoding video
            ctx = new Theora.DecodeContext(ref info, setup);
            got_headers(); // fire signal
        }

        // if we get here, we are ready to decode some video data
        // every packet that gets here produces either a video frame or
        // an error condition
        int status = ctx.packetin(pkt, out granpos);
        if (status == Theora.DUPFRAME) {
            // skip packet containing dropped frame
        } else if (status != 0) {
            this.setup_state = status;
            return;
        } else {
            ctx.ycbcr_out(_frame); // get image data
            double frame_time = ctx.granule_time(granpos);
            frame_received(_frame, frame_time); // emit signal
        }
    }
    // }}}
    public virtual bool packetin(Ogg.Packet pkt) // {{{
    {
        this._readpacket(pkt);
        return (this.setup_state >= 0);
    }
    // }}}
    public virtual void end_stream() // {{{
    {
        this.stream_end();
    }
    // }}}
}
// }}}
public class TheoraDecoderFactory : Object, OggDecoderFactory // {{{
{
    public signal void got_theora(TheoraDecoder decode);
    public virtual OggDecoder? tryconsume(Ogg.Packet pkt)
    {
        var decoder = new TheoraDecoder();
        if (decoder.packetin(pkt)) {
            this.got_theora(decoder);
            return decoder;
        }
        return null;
    }
}
// }}}
public class OggDemuxer : Object // {{{
{
    // decode state:
    private const int HEADER = 1; // still possibly expecting more stream starts
    private const int BODY = 2;   // new stream start = start of new chain, close out old ones

    public class StreamData : Object // {{{
    {
        public Ogg.StreamState stream;
        public OggDecoder? decode;

        private weak OggDemuxer owner;
        private int64 lastPacket;

        public StreamData(int serialno, OggDemuxer owner) // {{{
        {
            this.stream = Ogg.StreamState(serialno);
            this.owner = owner;
            this.lastPacket = -1;
        }
        // }}}
        ~StreamData() { stream.clear(); }

        private void do_packet(ref Ogg.Packet pkt) // {{{
        {
            if (this.lastPacket == -1) {
                // find a decoder
                foreach (var factory in this.owner.codecs) {
                    this.decode = factory.tryconsume(pkt);
                    if (this.decode != null)
                        return; // found one
                }
            } else if (this.decode != null) {
               decode.packetin(pkt);
            }
            // discard packet otherwise
        }
        // }}}
        public int pagein(ref Ogg.Page page) { // {{{
            int rv = stream.pagein(ref page);
            if (rv != 0) // error, don't bother asking for new packets
                return rv;

            Ogg.Packet pkt;
            int status = stream.packetout(out pkt);
            while (status != 0) {
                if (status == 1) {
                    if (lastPacket == pkt.packetno) break; // nasty hack due to getting dupe packets from packetout

                    this.do_packet(ref pkt);

                    lastPacket = pkt.packetno;
                }
            }
            return rv;
        }
        // }}}
        public void end() { // {{{
            if (this.decode != null)
                this.decode.end_stream();
        }
        // }}}
    } // }}}
    
    int state; // == either HEADER or BODY as defined above
    Ogg.SyncState sync;
    Gee.HashMap<int, StreamData> streams;
    InputStream in_stream;
    bool foundPages;
    public Gee.ArrayList<OggDecoderFactory> codecs;
    private bool need_more;

    public signal void got_theora(TheoraDecoder decode);

    private InputStream? _open(string filename) // {{{
    {
        stdout.printf("Attempting to load '%s'...\n", filename);

        File file;
        InputStream in_stream;
        try {
            file = File.new_for_path(filename);
            in_stream = file.read(null);
        } catch (IOError e) {
            stderr.printf("Could not open '%s': %s\n", filename, e.message);
            return null;
        }
        return in_stream;
    }
    // }}}
    public OggDemuxer(string filename) // {{{
    {
        this.in_stream = this._open(filename);
        this.state = HEADER;
        this.sync = Ogg.SyncState();
        this.streams = new Gee.HashMap<int, StreamData>();
        this.foundPages = false;
        this.need_more = false;
        this.codecs = new Gee.ArrayList<OggDecoderFactory>();

        var theora_factory = new TheoraDecoderFactory();
        theora_factory.got_theora += (factory, decoder) => { this.got_theora(decoder); };
        this.codecs.add(theora_factory);
    }
    // }}}
    private void clearStreams() { // {{{ 
        foreach (var stream in this.streams.get_values())
            stream.end();
        this.streams.clear();
    } // }}}
    public void processPage(Ogg.Page page) // {{{
    {
        if (page.bos() != 0) {
            if (this.state != HEADER) { // New chain, close old streams
                this.clearStreams();
                this.state = HEADER;
            }
        } else {
            if (this.state == HEADER) { // Headers over, move to body
                this.state = BODY;
            }
        }
        
        int serialno = page.serialno();

        if (!this.streams.contains(serialno)) {
            this.streams.set(serialno, new StreamData(serialno, this));
        }

        this.streams.get(serialno).pagein(ref page);
    }
    // }}}
    public bool run() { // {{{
        if (this.in_stream == null)
            return true;

        this.need_more = true;
        while (this.need_more) {
            Ogg.Page page;
            while (sync.pageout(out page) == 1) {
                foundPages = true;
                this.processPage(page);

                if (!this.need_more)
                    break;
            }
            
            uchar *buf = sync.buffer(4096);
            try {
                ssize_t bytesread = in_stream.read(buf, 4096, null);
                sync.wrote(bytesread);
                if (bytesread == 0) {
                    this.in_stream = null;
                    this.clearStreams();
                    return true; // end of file
                }
            } catch (IOError e) {
                stderr.printf("Error reading data: %s\n", e.message);
                this.clearStreams();
                this.in_stream = null;
                return true;
            }
        }

        return false;
    }
    // }}}
    public void stop() { this.need_more = false; }
}
// }}}
class GLVideoDisplay : Gtk.Window // {{{
{
    private Gdk.GL.Context? glcontext;
    private Gdk.GL.Drawable? gldrawable;

    private uchar[] rgbframe;
    private GLsizei tex_width;
    private GLsizei tex_height;
    private GLsizei pic_width;
    private GLsizei pic_height;
    private GLuint[] textures;
    private GLuint curTexture;

    private OggDemuxer demux;

    private bool on_configure_event(Gtk.DrawingArea drawingarea, Gdk.EventConfigure event) // {{{
    {
        this.gldrawable = Gtk.GL.GtkWidgetExtension.get_gl_drawable(drawingarea);
        this.glcontext = Gtk.GL.GtkWidgetExtension.get_gl_context(drawingarea);

        if (this.gldrawable == null || !this.gldrawable.gl_begin(this.glcontext))
            return false;

        glViewport(0, 0, (GLsizei)drawingarea.allocation.width, (GLsizei)drawingarea.allocation.height);

        this.gldrawable.gl_end();
        return true;
    }
    // }}}
    private bool update() // {{{
    {
        bool done = this.demux.run();
        render();
        return !done;
    }
    //}}}
    private bool on_expose_event(Gtk.DrawingArea drawingarea, Gdk.EventExpose event) // {{{
    {
        this.gldrawable = Gtk.GL.GtkWidgetExtension.get_gl_drawable(drawingarea);
        this.glcontext = Gtk.GL.GtkWidgetExtension.get_gl_context(drawingarea);

        if (this.gldrawable == null || this.glcontext == null) {
            stderr.printf("GL not initialized!\n");
            Gtk.main_quit();
        }
        if (this.textures[0] == 0) {
            if (this.demux.run()) {
                stderr.printf("demux error\n");
                Gtk.main_quit();
            }
            drawingarea.set_size_request(this.pic_width, this.pic_height);

            if (this.gldrawable.gl_begin(this.glcontext))
            {
                glEnable(GL_TEXTURE_2D);

                glGenTextures(2, textures);
                curTexture = textures[0];

                for (int i = 0; i < rgbframe.length; i++) {
                    this.rgbframe[i] = (uchar)i;
                }
                for (int i = 0; i < 2; i++) {
                    glBindTexture(GL_TEXTURE_2D, textures[i]);
                    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
                    stdout.printf("Creating %dx%d texture...\n", this.tex_width, this.tex_height);
                    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, this.tex_width,
                                 this.tex_height, 0, GL_RGBA, GL_UNSIGNED_BYTE,
                                 this.rgbframe);
                }

                glMatrixMode(GL_TEXTURE);
                glScalef((GLfloat)this.pic_width/this.tex_width, (GLfloat)this.pic_height/this.tex_height, 1);

                gldrawable.gl_end();

                GLib.Idle.add(this.update);
            } else {
                stderr.printf("Could not set up textures\n");
                Gtk.main_quit();
            }
        }
        return render();
    }
    // }}}
    private bool render() // {{{
    {
        if (this.gldrawable == null || this.glcontext == null) {
            stderr.printf("Could not get gldrawable for render\n");
            Gtk.main_quit();
        }

        if (!gldrawable.gl_begin (glcontext)) {
            stderr.printf("Could not render\n");
            Gtk.main_quit();
        }

        glBindTexture(GL_TEXTURE_2D, curTexture);

        glBegin (GL_QUADS);
            glTexCoord2d(0, 0);
            glVertex2i (-1,  1);
            glTexCoord2d(1, 0);
            glVertex2i ( 1,  1);
            glTexCoord2d(1, 1);
            glVertex2i ( 1, -1);
            glTexCoord2d(0, 1);
            glVertex2i (-1, -1);
        glEnd ();

        if (gldrawable.is_double_buffered())
            gldrawable.swap_buffers();
        else
            glFlush();

        gldrawable.gl_end();
        return true;
    }
    // }}}
    public void render_from_decoder(TheoraDecoder decoder) { // {{{
        decoder.got_headers += on_theora_headers;
        decoder.frame_received += on_theora_frame;
    }
    // }}}
    public void on_theora_headers(TheoraDecoder decoder) { // {{{
        stdout.printf("Got Theora stream: %ud x %ud video, pixel format %d\n",
            decoder.info.pic_width, decoder.info.pic_height, (int)decoder.info.pixel_fmt);
        stdout.printf("                 : frame is %ud x %ud\n",
            decoder.info.frame_width, decoder.info.frame_height);
        stdout.printf("                 : pic offset is %ud x %ud\n",
            decoder.info.pic_x, decoder.info.pic_y);

        this.pic_width = (GLsizei)decoder.info.pic_width;
        this.pic_height = (GLsizei)decoder.info.pic_height;
        uint fwidth = decoder.info.frame_width;
        uint fheight = decoder.info.frame_height;

        for (this.tex_width = 1; this.tex_width < fwidth; this.tex_width *= 2) {}
        for (this.tex_height = 1; this.tex_height < fheight; this.tex_height *= 2) {}

        this.rgbframe = new uchar[tex_width*tex_height*4];

        this.demux.stop();
    }
    // }}}
    public void on_theora_frame(TheoraDecoder decoder, Theora.ImagePlane* frame, double time) { // {{{
        uint row;
        var fwidth = decoder.info.frame_width;
        var fheight = decoder.info.frame_height;
        for (row = 0; row < fheight; row++) {
            uchar* outRow = &this.rgbframe[row*this.tex_width*4];
            uchar* inRowY = frame[0].data + row*frame[0].stride;
            uchar* inRowU = frame[1].data + row*frame[1].stride;
            uchar* inRowV = frame[2].data + row*frame[2].stride;
            switch (decoder.info.pixel_fmt) {
                case Theora.PixelFormat._420:
                    inRowU = frame[1].data + row/2*frame[1].stride;
                    inRowV = frame[2].data + row/2*frame[2].stride;
                    Oil.yuv2rgbx_sub2_u8(outRow, inRowY, inRowU, inRowV, (int)fwidth);
                    break;
                case Theora.PixelFormat._422:
                    Oil.yuv2rgbx_sub4_u8(outRow, inRowY, inRowU, inRowV, (int)fwidth);
                    break;
                case Theora.PixelFormat._444:
                    Oil.yuv2rgbx_sub4_u8(outRow, inRowY, inRowU, inRowV, (int)fwidth);
                    break;
            }
        }
        if (this.gldrawable == null || !this.gldrawable.gl_begin(glcontext)) {
            stderr.printf("Could not render frame\n");
            Gtk.main_quit();
        }
        
        uint start_row = fheight - this.pic_height - decoder.info.pic_y;
        uchar *pic_start = &this.rgbframe[start_row*this.tex_width*4 + 4*decoder.info.pic_x];
        
        GLuint nextTexture = (curTexture == textures[0] ? textures[1] : textures[0]);

        glBindTexture(GL_TEXTURE_2D, nextTexture);
        
        glPixelStorei(GL_UNPACK_ROW_LENGTH, (GLuint)this.tex_width);
        glTexSubImage2D(GL_TEXTURE_2D, 0, 0, 0, this.pic_width, this.pic_height,
                     GL_RGBA, GL_UNSIGNED_BYTE, pic_start);

        gldrawable.gl_end();

        this.curTexture = nextTexture;
        this.demux.stop();
    }
    // }}}
    public void loadOgg(string filename) // {{{
    {
        this.demux = new OggDemuxer(filename);
        this.demux.got_theora += (demuxer, decoder) => { this.render_from_decoder(decoder); };
    }
    // }}}
    construct // {{{
    {
        title = "Test Theora Decode";
        set_reallocate_redraws(true);
        destroy += Gtk.main_quit;

        this.textures = new GLuint[2];

        var drawingarea = new Gtk.DrawingArea();
        drawingarea.set_size_request(200, 200);
        drawingarea.configure_event += on_configure_event;
        drawingarea.expose_event += on_expose_event;

        var glconfig = new Gdk.GL.Config.by_mode(Gdk.GL.ConfigMode.RGB | Gdk.GL.ConfigMode.DOUBLE);
        Gtk.GL.GtkWidgetExtension.set_gl_capability(
                drawingarea, glconfig,
                null, true, Gdk.GL.RenderType.RGBA_TYPE);
    
        add(drawingarea);
    }
    // }}}

    public static int main (string[] args) { // {{{
        if (args.length < 2) {
            stderr.printf("Usage: %s <ogg filename>\n", args[0]);
            return 1;
        }

        Oil.init();
        Gtk.init(ref args);
        Gtk.GL.init(ref args);

        var player = new GLVideoDisplay();
        player.loadOgg(args[1]);
        player.show_all();

        Gtk.main();
        return 0;
    }
    // }}}
} // }}}

