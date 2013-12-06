/*
 *  Vala API for libogg (ogg.vapi)
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

[CCode (lower_case_cprefix = "", cheader_filename = "ogg/ogg.h")]
namespace Ogg {
  [CCode (cname = "ogg_page", cprefix="ogg_page_")]
  public struct Page {
    public uchar  *header;
    public long    header_len;
    public uchar  *body;
    public long    body_len;
    
    public void    checksum_set();
    public int     version();
    public int     continued();
    public int     bos();
    public int     eos();
    public int     serialno();
    public long    pageno();
    public int     packets();
    public int64   granulepos();
  }

  [CCode (cname = "ogg_packet", cprefix="ogg_packet_")]
  public struct Packet {
    public uchar  *packet;
    public long    bytes;
    public long    b_o_s;
    public long    e_o_s;
    public int64   granulepos;
    public int64   packetno;

    public void    clear();
  }

  [CCode (cname = "ogg_stream_state", cprefix="ogg_stream_", destroy_function="ogg_stream_clear")]
  public struct StreamState {
    public uchar *body_data;    // bytes from packet bodies
    public long body_storage;          // storage elements allocated
    public long body_fill;             // elements stored; fill mark
    public long body_returned;         // elements of fill returned

    public int* lacing_vals;      // The values that will go to the segment table
    public int64 *granule_vals; // granulepos values for headers. Not compact
			// 	this way, but it is simple coupled to the
			// 	lacing fifo
    public long    lacing_storage;
    public long    lacing_fill;
    public long    lacing_packet;
    public long    lacing_returned;

    [CCode(array_length=false)]
    public uchar[282] header;      // working space for header encode
    public int     header_fill;

    public int     e_o_s;          // set when we have buffered the last packet in the
                             // logical bitstream
    public int     b_o_s;          // set after we've written the initial page
                             // of a logical bitstream
    public long    serialno;
    public long    pageno;
    public int64   packetno;      // sequence number for decode; the framing
                             // knows where there's a hole in the data,
                             // but we need coupling so that the codec
                             // (which is in a seperate abstraction
                             // layer) also knows about the gap
    public int64   granulepos;
    
    [CCode (cname = "ogg_stream_init")]
    public StreamState(int serialno);
    
    public int clear();
    public int reset();
    public int reset_serialno(int serialno);
    
    // decoding functions
    public int pagein(ref Page og);
    public int packetout(out Packet op);
    public int packetpeek(out Packet op);
    
    // encoding functions
    public int packetin(ref Packet op);
    public int pageout(out Page og);
    public int flush(out Page og);
  }
  
  [CCode (cname = "ogg_sync_state", cprefix="ogg_sync_", destroy_function="ogg_sync_clear")]
  public struct SyncState {
    public uchar *data;
    public int storage;
    public int fill;
    public int returned;

    public int unsynced;
    public int headerbytes;
    public int bodybytes;
    
    [CCode (cname = "ogg_sync_init")]
    public SyncState();
    
    public void clear();
    public void reset();
    public char *buffer(long size);
    public int wrote(long bytes);
    public int pageseek(ref Page og);
    public int pageout(out Page og);
  }


  /* Bit-Packing **************************************************** */
  [CCode (cname = "oggpack_buffer")]
  public struct PackBufferBase {
    public long    endbyte;
    public int     endbit;
    public uchar*  buffer;
    public uchar*  ptr;
    public long    storage;
  }
  
  [CCode (cname = "oggpack_buffer", cprefix="oggpack_")]
  public struct PackBuffer : PackBufferBase {
    public void    reset ();
    public long    bytes ();
    public long    bits ();
    public uchar*  get_buffer ();
  }
  
  [CCode (cname = "oggpack_buffer", cprefix="oggpack_", destroy_function="oggpack_reset")]
  public struct PackReadBuffer : PackBuffer {
    
    [CCode (cname = "oggpack_readinit")]
    public PackReadBuffer(uchar *buf, int len);
    
    public void    readinit (uchar* buf, int len);

    public long    look (int bits);
    public long    look1 ();
    public void    adv (int bits);
    public void    adv1 ();
    public long    read (int bits);
    public long    read1 ();
  }

  [CCode (cname = "oggpack_buffer", cprefix="oggpack_", destroy_function="oggpack_writeclear")]
  public struct PackWriteBuffer: PackBuffer {

    [CCode (cname = "oggpack_writeinit")]
    public PackWriteBuffer();
    
    public void    writeinit ();
    public void    writetrunc (long bits);
    public void    writealign ();
    public void    writecopy (void* source, long bits);
    public void    writeclear ();
    public void    write (ulong value, int bits);
  }

  [CCode (cname = "oggpack_buffer", cprefix="oggpackB_", destroy_function="oggpackB_reset")]
  public struct PackBufferB: PackBufferBase {
    public void    reset ();
    public long    bytes ();
    public long    bits ();
    public uchar*  get_buffer ();
  }

  [CCode (cname = "oggpack_buffer", cprefix="oggpackB_", destroy_function="oggpackB_writeclear")]
  public struct PackReadBufferB : PackBufferB {
    
    [CCode (cname = "oggpackB_readinit")]
    public PackReadBufferB(uchar *buf, int len);
    
    public void    readinit (string buf);

    public long    look (int bits);
    public long    look1 ();
    public void    adv (int bits);
    public void    adv1 ();
    public long    read (int bits);
    public long    read1 ();
  }

  [CCode (cname = "oggpack_buffer", cprefix="oggpackB_", free_function="oggpackB_writeclear")]
  public struct PackWriteBufferB: PackBufferB {

    [CCode (cname = "oggpackB_writeinit")]
    public PackWriteBufferB();
    
    public void    writeinit ();
    public void    writetrunc (long bits);
    public void    writealign ();
    public void    writecopy (void* source, long bits);
    public void    writeclear ();
    public void    write (ulong value, int bits);
  }
}
