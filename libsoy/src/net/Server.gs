/*
 *  libsoy - soy.net.Server
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
 *  soy.net.Server - a networked pysoy server. The server connects to a jabber
 *  server and sits there until a client wants to connect (sends Jingle session
 *  -initiate).
 */


[indent=4]
uses
    GLib
    Lm
    Nice

class soy.net.Server : Object
    username   : string
    password   : string
    connection : Lm.Connection
    agent      : XMPPAgent
    
    // jingle session id
    sid   : string = "somesid"
    stream_id : uint
    client_jid : string

    // Client Data is found using Nice generated stream_id.
    clients : dict of uint, ClientData?;

    rcands : SList of unowned Candidate?

    init static
        soy.net._thread = new soy.net._NetworkThread()

    construct (usr : string, pwd : string, server : string, port : int)
        username = usr
        password = pwd

        clients = new dict of uint, unowned ClientData?;

        agent = new XMPPAgent();
        agent.agent.candidate_gathering_done.connect(this.can_done)

        connection = new Lm.Connection.with_context(server, soy.net._thread.context)
        connection.set_port(port)
        connection.set_jid(usr)

        // Loudmouth callbacks
        var iqh = new Lm.MessageHandler(iq_handler, null)
        connection.register_message_handler(iqh, Lm.MessageType.IQ, Lm.HandlerPriority.NORMAL)
        
        try
            connection.open(this.connection_handler, null)
        except err : GLib.Error
            print "[-] Unable to open connection - %s", err.message
    
    def connection_handler (connection: Lm.Connection, success : bool) : void
        if success
            print "[+] Connection Success"
            try
                connection.authenticate(this.username, this.password, "soy", auth_handler, null)
            except err : GLib.Error
                print "[-] Authentication failure - %s", err.message
        else
            print "[-] Connection Failure"

    def auth_handler (connection: Lm.Connection, success : bool) : void
        if success
            print "[+] Auth Success"
            var m = new Lm.Message.with_sub_type(null, Lm.MessageType.PRESENCE, Lm.MessageSubType.AVAILABLE)
            try
                connection.send(m)
            except err : GLib.Error
                print "Unable to send message - %s", err.message // TODO retry
        else
            print "[-] Auth failed"
    
    def can_done(stream_id : uint) : void
        print "[+] candidate gathering complete"
        src_res :  int = agent.agent.set_remote_candidates(this.stream_id, Nice.ComponentType.RTP, rcands)
        print "set_remote_candidates added:  %d candidates", src_res

        client : ClientData = clients[stream_id]

        // reply with session-accept containing our local candidates
        //  Create session-accept stanza
        var message = new Lm.Message(this.client_jid, Lm.MessageType.IQ)
        
        var iq = message.get_node()
        iq.set_attribute("from", username)
        iq.set_attribute("type","set")
        
        var jingle = iq.add_child("jingle", null)
        jingle.set_attribute("xmlns", "urn:xmpp:jingle:1")
        jingle.set_attribute("action", "session-accept")
        jingle.set_attribute("initiator", client.jid)
        jingle.set_attribute("responder", this.username)
        jingle.set_attribute("sid", client.sid)

        var content = jingle.add_child("content", null)
        content.set_attribute("creator", "initiator")
        content.set_attribute("name", "voice")

        var description = content.add_child("description", null)
        description.set_attribute("xmlns","urn:xmpp:jingle:apps:rtp:1") 
        description.set_attribute("media", "audio")

        var payload = description.add_child("payload-type",null)
        payload.set_attribute("id","96")
        payload.set_attribute("name", "speex")
        payload.set_attribute("clockrate", "8000")

        ufrag : char* = new array of char[100]
        pwd   : char* = new array of char[100]
        agent.agent.get_local_credentials(stream_id, &ufrag, &pwd)

        var transport = content.add_child("transport", null)
        transport.set_attribute("xmlns","urn:xmpp:jingle:transports:ice-udp:1")
        transport.set_attribute("ufrag", (string)ufrag)
        transport.set_attribute("pwd", (string)pwd)

        //  Add local candidates
        var lcands = agent.agent.get_local_candidates(stream_id, 1).copy()
        agent.add_local_candidates(transport, lcands)

        try
            connection.send(message)
        except err : GLib.Error
            print "Unable to send message - %s", err.message

    def iq_handler (handler : Lm.MessageHandler, connection : Lm.Connection, m:  Lm.Message) : Lm.HandlerResult
        // handle session init, etc
        print "iq_handler"
        var iq = m.get_node();
        var jingle = iq.get_child("jingle")
        if jingle != null && jingle.get_attribute("action") == "session-initiate"
            this.client_jid = iq.get_attribute("from")
            this.sid = jingle.get_attribute("sid")
            
            var jingle_sid =  jingle.get_attribute("sid")

            if (jingle_sid == null)
                print "empty sid!"
                return Lm.HandlerResult.REMOVE_MESSAGE

            // start gathering local candidates
            this.stream_id  = agent.agent.add_stream(1)
            agent.agent.attach_recv(this.stream_id, 1, soy.net._thread.context, this.recv);
            agent.agent.gather_candidates(this.stream_id)

            this.clients[stream_id] = new ClientData()
            this.clients[stream_id].jid = client_jid
            this.clients[stream_id].sid = jingle_sid

            // set remote candidates
            var content = jingle.get_child("content")
            if content != null
                var transport = content.get_child("transport")
                if transport != null
                    var ufrag = transport.get_attribute("ufrag")
                    var tpwd  = transport.get_attribute("pwd")
                    agent.agent.set_remote_credentials(stream_id, ufrag, tpwd)
                    rcands = agent.get_remote_candidates(transport, this.stream_id)

        return Lm.HandlerResult.REMOVE_MESSAGE

    def recv(agent : Agent, stream_id : uint, component_id: uint, len: uint, buf : string) : void
        stdout.printf("*****************NICE RECV!\n");
        stdout.printf("*****************Recv: %s\n", buf);
        stdout.printf("*****************Sent: %d bytes back\n", agent.send(stream_id, component_id, 6, "hello\x00"));


//[Compact]
class ClientData
    jid : string
    sid : string
    cands : unowned SList of unowned Candidate?
    
