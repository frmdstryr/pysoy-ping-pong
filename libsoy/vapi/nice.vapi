/*
 *  Vala API for libnice (nice-0.1.vapi)
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

using GLib;

[CCode (lower_case_cprefix ="nice_", cheader_filename = "agent.h")]
namespace Nice {
	public static void debug_enable(bool ws);

	[CCode (unref_function="g_object_unref")]
	public class Agent {
		// ctx is a GMainContext
		public Agent(void * ctx, int compat);
		public Agent.reliable(void * ctx, int compat);
		
		[NoAccessorMethod]
		public uint compatibility { get; construct; }
		[NoAccessorMethod]
		public bool controlling_mode { get; set; }
		[NoAccessorMethod]
		public bool full_mode { get; construct; }
		[NoAccessorMethod]
		public void* main_context { get; construct; }
		[NoAccessorMethod]
		public uint max_connectivity_checks { get; set; }
		[NoAccessorMethod]
		public string proxy_ip { owned get; set; }
		[NoAccessorMethod]
		public string proxy_password { owned get; set; }
		[NoAccessorMethod]
		public uint proxy_port { get; set; }
		[NoAccessorMethod]
		public uint proxy_type { get; set; }
		[NoAccessorMethod]
		public string proxy_username { owned get; set; }
		[NoAccessorMethod]
		public uint stun_pacing_timer { get; construct; }
		[NoAccessorMethod]
		public string stun_server { owned get; set; }
		[NoAccessorMethod]
		public uint stun_server_port { get; set; }
		[NoAccessorMethod]
		public bool upnp { get; set construct; }
		[NoAccessorMethod]
		public uint upnp_timeout { get; set construct; }

		public signal void candidate_gathering_done(uint stream_id);
		public signal void component_state_changed (uint p0, uint p1, Nice.ComponentState p2);
		public signal void initial_binding_request_received (uint p0);
		public signal void new_candidate (uint p0, uint p1, string p2);
		public signal void new_remote_candidate (uint p0, uint p1, string p2);
		public signal void new_selected_pair (uint p0, uint p1, string p2, string p3);
		public signal void reliable_transport_writable (uint p0, uint p1);		
		
		public bool add_local_address(Address addr);
		public void set_port_range (uint stream_id, uint component_id, uint min_port, uint max_port);
		
		public uint add_stream  (uint n_components);
		public void remove_stream (uint stream_id);
		
		public bool set_relay_info (uint stream_id, uint component_id, string server_ip, uint server_port, string username, string password, uint type);
		public bool gather_candidates(uint stream_id);
		
		public bool set_remote_credentials (uint stream_id, string ufrag, string pwd);
		public bool get_local_credentials  (uint stream_id, char** user, char** pw);
		
		public unowned SList<Candidate?> get_remote_candidates(uint stream_id, uint component_id);
		public unowned SList<Candidate?> get_local_candidates (uint stream_id, uint component_id);
		public int set_remote_candidates (uint stream_id, uint component_id, SList<Candidate?> candidates);

		public int send (uint stream_id, uint component_id, uint len, char * data);
		
		public delegate void NiceAgentRecvFunc(Nice.Agent agent, uint stream_id, uint component_id, uint len, string buf);
		public bool attach_recv (uint stream_id, uint component_id, GLib.MainContext ctx, NiceAgentRecvFunc func);

		public bool set_selected_pair (uint stream_id, uint component_id, string lfoundation, string rfoundation);
		public bool set_selected_remote_candidate(uint stream_id, uint component_id, Candidate candidate);
		
		public void set_stream_tos (uint stream_id, int tos);
		public void set_software (string software);
		public bool restart();
	}
	
	public struct Address {
		public Address();
		public void	init();
		public void set_ipv4 (uint32 addr_ipv4);
		public void set_ipv6 (string addr);
		public void set_port (uint port);
		public uint get_port ();
		public bool set_from_string (string addr);
		public void copy_to_sockaddr (void* sin);
		public void set_from_sockaddr (void* sin);

		/* compare this address to input address */
		public bool equal (Address b);
		public void to_string (string dst);
		public bool is_private ();
		public bool is_valid ();
	}
	[CCode (cname="ICE_CANDIDATE_MAX_FOUNDATION")]
	public const int NICE_CANDIDATE_MAX_FOUNDATION;
	

	[CCode (cheader_filename = "nice/agent.h", copy_function = "nice_candidate_copy")]
        [Compact]
        public class Candidate {
                public Nice.Address addr;
                public Nice.Address base_addr;
                public uint component_id;
                [CCode (array_length = false)]
                public weak char[] foundation;
                public weak string password;
                public uint32 priority;
                public void* sockptr;
                public uint stream_id;
                public Nice.CandidateTransport transport;
                public weak Nice.TurnServer turn;
                public Nice.CandidateType type;
                public weak string username;
                [CCode (has_construct_function = false)]
                public Candidate (uint type);
                public unowned Nice.Candidate copy ();
                public uint32 ice_priority ();
                public static uint32 ice_priority_full (uint type_pref, uint local_pref, uint component_id);
                public uint32 jingle_priority ();
                public uint32 msn_priority ();
                public static uint64 pair_priority (uint32 o_prio, uint32 a_prio);
        }
	/* [Compact]
	// nice_candidate_copy doesn't work cause it returns the copy instead of to an out dest parameter.
	[CCode (copy_function = "nice_candidate_copya")] 
	public class Candidate{
		[CCode (has_construct_function = false)]
		public Candidate (uint type);
		public CandidateType type;
		public CandidateTransport transport;
		public Address addr;
		public Address base_addr;
		public uint32 priority;
		public uint stream_id;
		public uint component_id;
		This array size, in reality, should be NICE_CANDIDATE_MAX_FOUNDATION,
		 but vala lacks the ability to #DEFINE, and I can't figure 
		 out a way to access the C define from vala.
		public char foundation[33];
		public string username;
		public string password;
		public TurnServer* turn;
		public void * sockptr;
		public unowned Nice.Candidate copy ();
	}*/

	[CCode (cname="TurnServer")]
	public struct TurnServer {
		Address server;
		string username;
		string password;
		RelayType type;
	}
	
	[CCode (cprefix="NICE_CANDIDATE_TYPE_")]
	public enum CandidateType {
		HOST,
		SERVER_REFLEXIVE,
		PEER_REFLEXIVE,
		RELAYED
	}

	[CCode (cprefix="NICE_CANDIDATE_TRANSPORT_")]
	public enum CandidateTransport {
		UDP
	}
	[CCode (cprefix="NICE_RELAY_TYPE_TURN_")]
	public enum RelayType {
		UDP,
		TCP,
		TLS
	}

	public enum Compatibility {
        RFC5245,
        GOOGLE,
        MSN,
        WLM2009,
        OC2007,
        OC2007R2,
        DRAFT19,
        LAST
    }
    
    [CCode (cprefix = "NICE_COMPONENT_STATE_", has_type_id = false)]
	public enum ComponentState {
        DISCONNECTED,
        GATHERING,
        CONNECTING,
        CONNECTED,
        READY,
        FAILED,
        LAST
    }
	
	public enum ComponentType {
        RTP,
        RTCP
    }

}