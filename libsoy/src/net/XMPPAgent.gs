/*
 *  libsoy - soy.net.XMPPAgent
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
 *  soy.net.XMPPAgent - an ICE Agent that uses XMPP to share and negotiate candidates.
 */


[indent=4]
uses
    GLib
    Lm
    Nice

/*

XMPPAgent is the bridge between Nice Candidates and data structures and XMPP.
It includes methods for extracting nice candidates from <transport> elements and 
creating <transport> elements from a list of nice candidates.

*/

class soy.net.XMPPAgent : Object
    
    agent : Nice.Agent
    lcands : SList of unowned Candidate?
    rcands : SList of unowned Candidate?
    
    // lookup array for nice CandidateType/ XEP-0166 candidate type attribute values.
    candidate_type_strs : static dict of int, string
    // lookup dictionary for XEP-0166 candidate type values / nice CandidateType
    candidate_type_dict : static dict of string, int

    init static
        if soy.net._thread == null
            soy.net._thread = new soy.net._NetworkThread()

    init
        candidate_type_strs = new dict of int, string
        candidate_type_strs[Nice.CandidateType.HOST] = "host"
        candidate_type_strs[Nice.CandidateType.SERVER_REFLEXIVE] = "srflx"
        candidate_type_strs[Nice.CandidateType.PEER_REFLEXIVE] = "prflx"
        candidate_type_strs[Nice.CandidateType.RELAYED] = "relay"

        candidate_type_dict = new dict of string, int
        candidate_type_dict["host"] = Nice.CandidateType.HOST
        candidate_type_dict["srflx"] = Nice.CandidateType.SERVER_REFLEXIVE
        candidate_type_dict["prflx"] = Nice.CandidateType.PEER_REFLEXIVE
        candidate_type_dict["relay"] = Nice.CandidateType.RELAYED
    
    construct ()
        agent = new Nice.Agent(soy.net._thread.context, Nice.Compatibility.RFC5245)
        agent.stun_server = "132.177.123.13"
        agent.stun_server_port = 3478

        // Nice Agent callbacks
        agent.component_state_changed.connect(this.component_state_changed)
        agent.initial_binding_request_received.connect(this.initial_binding_request_received)
        agent.new_candidate.connect(this.new_candidate)
        agent.new_remote_candidate.connect(this.new_remote_candidate)
        agent.new_selected_pair.connect(this.new_selected_pair)
        agent.reliable_transport_writable.connect(this.reliable_transport_writable)
    
    // Stub nice callbacks
    def component_state_changed (p0 : uint,  p1 : uint, p2 : Nice.ComponentState) : void
        print "component_state_changed"
        print " state %s", p2.to_string()

    def initial_binding_request_received (p0 : uint) : void
        print "initial_binding_request_received"

    def new_candidate (p0 : uint, p1 :uint, p2 : string) : void
        print "new_candidate"

    def new_remote_candidate (p0 : uint, p1 :uint, p2 : string) : void
        print "new_remote_candidate"

    def new_selected_pair (p0 : uint, p1 :uint, p2 : string, p3 : string) : void
        print "new_selected_pair"

    def reliable_transport_writable (p0 : uint,  p1 :uint) : void
        print "reliable_transport_writable"

    /* Add local candidates to a target transport MessageNode given a List of nice candidates  */
    def add_local_candidates (transport : Lm.MessageNode, lcands : SList of unowned Candidate?) : void
        for nice_candidate in lcands
            addr : string = (string)new array of char[100];
            nice_candidate.addr.to_string(addr)

            var candidate = transport.add_child("candidate", null)
            candidate.set_attribute("component", nice_candidate.stream_id.to_string())
            candidate.set_attribute("foundation",  (string) nice_candidate.foundation)
            
            // TODO: generate candidate id, probably keep a reference to it (using hashmap?)
            candidate.set_attribute("id", "TBD")
            candidate.set_attribute("ip",  addr)

            // libnice should have a way of knowing which network this candidate is on.
            candidate.set_attribute("network", "0") 
            candidate.set_attribute("port",     nice_candidate.addr.get_port().to_string())
            candidate.set_attribute("priority", nice_candidate.priority.to_string())
            candidate.set_attribute("protocol", "udp") // libnice currently only has UDP
            candidate.set_attribute("type",     candidate_type_strs[nice_candidate.type])

    /* Get remote candidates from a transport MessageNode */
    def get_remote_candidates(transport : Lm.MessageNode, stream_id : uint) : SList of unowned Candidate?
        rcands : SList of unowned Candidate? = new SList of unowned Candidate?()
        var candidate  = transport.get_child("candidate")
        
        /* If there are no candidates, return empty list. */
        if candidate == null
            return rcands
        
        while candidate != null
            // Create new remote candidate
            rcand : Candidate = new Candidate(candidate_type_dict[candidate.get_attribute("type")])

            print "Remote Candidate"
            print (candidate.get_attribute("ip"))
            print "port: %s", candidate.get_attribute("port")
            print "priority:  %s", candidate.get_attribute("priority")
            print "component %s", (candidate.get_attribute("component"))

            // Parse and Extract out remote candidate data
            rcand.addr.set_from_string(candidate.get_attribute("ip"))
            rcand.addr.set_port(int.parse(candidate.get_attribute("port")))
            rcand.transport = Nice.CandidateTransport.UDP
            rcand.priority  = int.parse(candidate.get_attribute("priority"))
            rcand.component_id = int.parse(candidate.get_attribute("component"))
            rcand.stream_id = stream_id
            //rcand.foundation = candidate.get_attribute("foundation") // have to copy a maximum of 33 bytes !
            print rcand.addr.is_valid().to_string()
            rcands.append(rcand.copy())
            candidate = candidate.next
        return rcands.copy()
