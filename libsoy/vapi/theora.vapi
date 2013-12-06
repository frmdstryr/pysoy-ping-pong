/*
 *  Vala API for libtheora (theora.vapi)
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

// TODO: structs for passing to th_decode_ctl

[CCode(lower_case_cprefix="th_", cheader_filename="theora/theoradec.h")]
namespace Theora
{
    // return values
    public const int EFAULT;
    public const int EINVAL;
    public const int EBADHEADER;
    public const int ENOTFORMAT;
    public const int EVERSION;
    public const int EIMPL;
    public const int EBADPACKET;
    public const int DUPFRAME;

    // decoder control constants for DecoderContext.ctl()
    public const int DECCTL_GET_PPLEVEL_MAX;
    public const int DECCTL_SET_GRANPOS;
    public const int DECCTL_SET_PPLEVEL;
    public const int DECCTL_SET_STRIPE_CB;

    public static unowned string version_string();
    public static int version_number();

    [CCode(cname="ogg_packet", cprefix="th_packet_")]
    public struct TheoraPacket: Ogg.Packet {
        public int isheader();
        public int iskeyframe();
    }

    [CCode(cname="th_colorspace", cprefix="TH_CS_")]
    public enum Colorspace {
        UNSPECIFIED, ITU_REC_470M, ITU_REC_470BG, NSPACES
    }

    [CCode(cname="th_pixel_fmt")]
    public enum PixelFormat {
        [CCode(cname="TH_PF_420")] _420,
        RSVD,
        [CCode(cname="TH_PF_422")] _422,
        [CCode(cname="TH_PF_444")] _444,
        [CCode(cname="TH_PF_NFORMATS")] NFORMATS,
    }

    [CCode(cname="th_info", cprefix="th_info_", destroy_function="th_info_clear")]
    public struct Info {
        
        public uchar version_major;
        public uchar version_minor;
        public uchar version_subminor;
        public uint  frame_width;
        public uint  frame_height;
        public uint  pic_width;
        public uint  pic_height;
        public uint  pic_x;
        public uint  pic_y;
        public uint  fps_numerator;
        public uint  fps_denominator;

        public uint  aspect_numerator;
        public uint  aspect_denominator;
        public Colorspace    colorspace;
        public PixelFormat   pixel_fmt;
        public int           target_bitrate;
        public int           quality;
        public int           keyframe_granule_shift;

        [CCode(cname="th_info_init")]
        public Info();

        public void clear();
    }

    [CCode(cname="th_comment", cprefix="th_comment_", destroy_function="th_comment_clear")]
    public struct Comment {
            [CCode(array_length=false)]
            public string[] user_comments;
            [CCode(array_length=false)]
            public int[]    comment_lengths;
            public int      comments;
            [CCode(array_length=false)]
            public string   vendor;

            [CCode(cname="th_comment_init")]
            public Comment();

            public void add(string comment);
            public void add_tag(string tag, string val);
            public char* query(string tag, int count);
            public int query_count(string tag);
            public void clear();
    }

    [CCode(cname="th_img_plane")]
    public struct ImagePlane {
        public int width;
        public int height;
        public int stride;
        public uchar *data;
    }

    [CCode(cname="th_stripe_decoded_func")]
    public static delegate
    void StripeDecoded(void *ctx, [CCode(array_length=false)] ImagePlane[] buf, int yfrag0, int yfrag_end);

    [CCode(cname="th_stripe_callback")]
    public struct StripCallback {
        void *ctx;
        StripeDecoded stripe_decoded;
    }

    [CCode(cname="th_setup_info", destroy_function="th_setup_free")]
    public struct SetupInfo {}
    
    [Compact]
    [CCode(cname="void")]
    public class Context {
        [CCode(cname="th_granule_frame")]
        public int64 granule_frame(int64 granpos);
        [CCode(cname="th_granule_time")]
        public double granule_time(int64 granpos);
    }

    [CCode(cname="th_decode_headerin")]
    static int decode_headerin(ref Info info, ref Comment comment, ref SetupInfo *setup, Ogg.Packet op);

    [Compact]
    [CCode(cname="th_dec_ctx", free_function="th_decode_free", cprefix="th_decode_")]
    public class DecodeContext: Context {

        [CCode(cname="th_decode_alloc")]
        DecodeContext(ref Info info, SetupInfo *setup);

        public int ctl(int req, void *buf, long buf_sz);
        public int packetin(Ogg.Packet op, out int64 granpos);
        public int ycbcr_out([CCode(array_length=false)] ImagePlane[] ycbcr);
    }
}

