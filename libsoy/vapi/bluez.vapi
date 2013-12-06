/*
 *  Vala API for bluez (bluez.vapi)
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
 
using Posix;

[CCode (cheader_filename = "bluetooth/bluetooth.h,bluetooth/hci.h,bluetooth/hci_lib.h")]
namespace bluez {
    
    
    [CCode (cname="struct bt_security")]
    public struct security {
	    uint8 level;
    }
    
 	[CCode (cprefix="BT_")]
	public enum state {
		CONNECTED = 1, /* Equal to TCP_ESTABLISHED to make net code happy */
		OPEN,
		BOUND,
		LISTEN,
		CONNECT,
		CONNECT2,
		CONFIG,
		DISCONN,
		CLOSED
	}
	

	
	/* BD Address */
	[CCode (cname="bdaddr_t")]
    public struct bdaddr_t{
	    uint8 b[6];
    }
    
    [CCode (cname="inquiry_info")]
    public struct inquiry_info{
	    bdaddr_t	bdaddr;
	    uint8		pscan_rep_mode;
	    uint8		pscan_period_mode;
	    uint8		pscan_mode;
	    uint8		dev_class[3];
	    uint16	clock_offset;
    }

    [CCode (cname="BDADDR_ANY")]
   	public bdaddr_t* BDADDR_ANY;
    /* Copy, swap, convert BD Address */
    public static int bacmp(bdaddr_t *ba1, bdaddr_t *ba2)
    {
	    return memcmp(ba1, ba2, sizeof(bdaddr_t));
    }
    
    public static void bacpy(bdaddr_t *dst,  bdaddr_t *src)
    {
	    memcpy(dst, src, sizeof(bdaddr_t));
    }
    [CCode (cname="baswap")]
    public static void baswap(bdaddr_t *dst, bdaddr_t *src);
    [CCode (cname="strtoba")]
    public static bdaddr_t *strtoba( char *str);
    [CCode (cname="batostr")]
    public static char *batostr(bdaddr_t *ba);
    [CCode (cname="ba2str")]
    public static int ba2str(bdaddr_t *ba, char *str);
    [CCode (cname="str2ba")]
    public static int str2ba(char *str, bdaddr_t *ba);
    [CCode (cname="ba2oui")]
    public static int ba2oui(bdaddr_t *ba, char *oui);
    [CCode (cname="bachk")]
    public static int bachk(char *str);
    [CCode (cname="baprintf")]
    public static int baprintf(char *format, ...);
    //public int bafprintf(FILE *stream, const char *format, ...);
    [CCode (cname="basprintf")]
    public static int basprintf(char *str, char *format, ...);
    [CCode (cname="basnprintf")]
    public static int basnprintf(char *str, size_t size, char *format, ...);
    [CCode (cname="bt_malloc")]
    public static void *bt_malloc(size_t size);
    [CCode (cname="bt_free")]
    public static void bt_free(void *ptr);
    [CCode (cname="bt_error")]
    public static int bt_error(uint16 code);
    [CCode (cname="bt_compidtostr")]
    public static char *bt_compidtostr(int id);
    [CCode (cname="hci_get_route")]
    public static int hci_get_route(bdaddr_t *bdaddr);
	[CCode (cname="hci_open_dev")]
    public static int hci_open_dev(int dev_id);
    [CCode (cname="hci_inquiry")]
    public static int hci_inquiry(int dev_id, int len, int num_rsp, uint8 *lap, inquiry_info **ii, long flags);
    [CCode (cname="hci_read_remote_name")]
    public static int hci_read_remote_name(int dd, bdaddr_t *bdaddr, int len, char *name, int to);
}

