/*
 *  libsoy - soy.net.Client
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
 *  soy.net.Client - a networked pysoy client. Uses ICE-UDP (XEP-0166) to setup a direct UDP connection
 *  regardless of firewalls/NATs/routers etc.
 */

[indent=4]
uses
    GLib
    Lm
    Nice

class soy.net.Client : Object
    server_jid : string
    username   : string
    password   : string
    connection : Lm.Connection
    agent : soy.net.XMPPAgent

    window : soy.widgets.Window
    scene  : soy.scenes.Scene

    // jingle session id
    sid   : string
    stream_id : uint

    // Whether or not the client has connected to a server.
    connected : bool = true

    // Lerp between these two colors while processing. I think it's cool.
    glow  : soy.atoms.Color = new soy.atoms.Color(128, 128, 128)
    glow2 : soy.atoms.Color = new soy.atoms.Color(255, 255, 255)
    glow_amt : float = 1

    // array of the IQ ids, and named indexes.
    // This might be overkill, probably only need to keep one ID at any given time (to check for response)
    ids   : array of string
    const session_init_iq     :  int = 0

    init static
        soy.net._thread = new soy.net._NetworkThread()

    construct (usr : string, pwd : string, sjid : string, server : string, port : int)
        server_jid = sjid
        username = usr
        password = pwd

        ids = new array of string[1]

        create_window()


    // Login to XMPP
    def login () : void
        agent = new XMPPAgent();
        agent.agent.candidate_gathering_done.connect(this.can_done)

        connection = new Lm.Connection.with_context("jabber.de", soy.net._thread.context)
        connection.set_port(5222)
        connection.set_jid(username)

        var mh = new Lm.MessageHandler(message_handler, null)
        connection.register_message_handler(mh, Lm.MessageType.MESSAGE, Lm.HandlerPriority.NORMAL)

        var iqh = new Lm.MessageHandler(iq_handler, null)
        connection.register_message_handler(iqh, Lm.MessageType.IQ, Lm.HandlerPriority.NORMAL)

        try
            connection.open(this.connection_handler, null)
        except err : GLib.Error
            print "[-] Unable to open connection - %s", err.message // TODO try reconnect

    def connection_handler (connection: Lm.Connection, success : bool) : void
        if success
            print "[+] Connection Success"
            try
                connection.authenticate(this.username, this.password, "soyclient", auth_handler, null)
            except err : GLib.Error
                print "[-] Authentication error - %s", err.message
        else
            print "[-] Connection Failure"

    def auth_handler (connection: Lm.Connection, success : bool) : void
        if success
            print "[+] Auth Success"
            this.connected = true

            var m = new Lm.Message.with_sub_type(null, Lm.MessageType.PRESENCE, Lm.MessageSubType.AVAILABLE)
            print "[+] Gathering Candidates"
            this.stream_id = agent.agent.add_stream(1)
            agent.agent.attach_recv(this.stream_id, 1, soy.net._thread.context, this.recv);
            agent.agent.gather_candidates(this.stream_id)
            try
                connection.send(m)
            except err : GLib.Error
                print "[-] Sending failed, unable to set availability - %s", err.message // TODO try again
        else
            print "[-] Auth failed"

    def message_handler (handler : Lm.MessageHandler, connection : Lm.Connection, m:  Lm.Message) : Lm.HandlerResult
        var body = m.get_node().get_child("body")
        if body != null
            print "[ ] Message %s", body.value
            if body.value == "start"
                this.glow = new soy.atoms.Color(255, 255, 0)
                this.glow_amt = 0

                // initiate ICE session: gather candidates using a nice agent
                print "[+] Gathering Candidates"
                this.stream_id = agent.agent.add_stream(1)
                agent.agent.attach_recv(this.stream_id, 1, soy.net._thread.context, this.recv);
                agent.agent.gather_candidates(this.stream_id)
        return Lm.HandlerResult.REMOVE_MESSAGE

    def iq_handler (handler : Lm.MessageHandler, connection : Lm.Connection, m:  Lm.Message) : Lm.HandlerResult
        /* It'd be great if this existed in separate message handler for the session-init result IQ */
        var mn = m.get_node()
        if mn.get_attribute("id") == ids[session_init_iq]
            // This is a reply IQ to our jingle session-init
            // I don't think we actually need to do anything with it, just for information.
            if m.get_sub_type() == Lm.MessageSubType.ERROR
                print "Session init failed!"
            if m.get_sub_type() == Lm.MessageSubType.RESULT
                print "Session init ack"

        // Validate this against the schema given in XEP-0166

        var jingle = mn.get_child("jingle")
        if jingle != null && jingle.get_attribute("sid") == "somesid"
            var content = jingle.get_child("content")
                if content != null
                    var transport = content.get_child("transport")
                        var ufrag = transport.get_attribute("ufrag")
                        var tpwd  = transport.get_attribute("pwd")
                        agent.agent.set_remote_credentials(this.stream_id, ufrag, tpwd)

                        var candidate  = transport.get_child("candidate")
                        if candidate == null
                            return Lm.HandlerResult.REMOVE_MESSAGE

                        rcands : SList of unowned Candidate?
                        rcands = agent.get_remote_candidates(transport, this.stream_id)

                        src_res :  int = agent.agent.set_remote_candidates(this.stream_id, Nice.ComponentType.RTP, rcands)
                        print "set_remote_candidates result:  %d", src_res

        return Lm.HandlerResult.REMOVE_MESSAGE

    def can_done(stream_id : uint) : void
        print "[+] candidate gathering complete"
        new_ice_xmpp_stanza(stream_id)

    def new_ice_xmpp_stanza(stream_id : uint) : void
        var mess = new Lm.Message(server_jid, Lm.MessageType.IQ); // todo: use .with_sub_type Lm.MessageSubType.Set instead.
        var iq = mess.get_node()
        iq.set_attribute("from", username)
        iq.set_attribute("type","set")
        // save message ID
        this.ids[session_init_iq] = iq.get_attribute("id")

        var jingle = iq.add_child("jingle", null)
        jingle.set_attribute("xmlns", "urn:xmpp:jingle:1")
        jingle.set_attribute("action", "session-initiate")
        jingle.set_attribute("initiator", this.username)
        jingle.set_attribute("sid", "somesid") // hardcoded session id, TODO!

        var content = jingle.add_child("content", null)
        content.set_attribute("creator", "initiator")
        content.set_attribute("name", "voice")

        var description =  content.add_child("description", null)
        description.set_attribute("xmlns","urn:xmpp:jingle:apps:rtp:1")
        description.set_attribute("media", "audio") // To test out with an existing ice-udp client, I use an audio payload description

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

        // loop through nice candidates slist and add them to the transport.
        var lcands = agent.agent.get_local_candidates(stream_id, 1).copy() // NICE_COMPONENT_TYPE_RTP = 1, also todo

        agent.add_local_candidates(transport, lcands)

        print iq.to_string()
        
        try
            connection.send(mess)
        except err : GLib.Error
            print "Unable to send message - %s", err.message // TODO retry

    def recv(agent : Agent, stream_id : uint, component_id: uint, len: uint, buf : string) : void
        stdout.printf("*****************NICE RECV!\n");
        stdout.printf("*****************Steam %u, Component: %u\n", stream_id, component_id);
        stdout.printf("*****************Recv: %s\n", buf);

    def send_message (to : string, body : string) : void
        var mess = new Lm.Message(to, Lm.MessageType.MESSAGE)
        var mnode = mess.get_node()
        mnode.add_child("body", body)
        //Android.log_print(Android.LogPriority.VERBOSE, "libsoy", "Sending message!!");
        try        
            connection.send(mess)
        except err : GLib.Error
            print "Unable to send message - %s", err.message // TODO retry

    def create_window() : void
        this.window = new soy.widgets.Window()
        this.scene = new soy.scenes.Room(5.0f)

        this.scene["light"] = new soy.bodies.Light(new soy.atoms.Position(-2, 3, -5), 0.0f, new soy.textures.Texture())

        this.scene["cam"] = new soy.bodies.Camera(new soy.atoms.Position(0, 0, 20))

        this.window.add_child(new soy.widgets.Projector((soy.bodies.Camera) this.scene["cam"]))
        for var i = 0 to 9
            cube(i)

    def cube (pos : int)
        //Android.log_print(Android.LogPriority.VERBOSE, "sweetsoy", "Creating a cube!!");
        // TODO make this work for numbers > 9
        this.scene["box"+"0123456789".substring(pos,1)] = new soy.bodies.Box(new soy.atoms.Position(pos, 0, 0),
                                     new soy.atoms.Size(1, 1, 1),
                                     new soy.materials.Colored())

        this.scene["box"+"0123456789".substring(pos,1)].addForce(0.01f, 1.01f, 0.01f)
        this.scene["box"+"0123456789".substring(pos,1)].addTorque(0.01f, 1.1f, 0.01f)


    def process_glow() : void
        if connected
            return

        if this.glow_amt < 0.2f
            this.glow_amt += 0.01f // this should be proportional to time, but its just a glow animation
            this.window.background.red   = lerp(this.window.background.red,   this.glow.red,   glow_amt)
            this.window.background.green = lerp(this.window.background.green, this.glow.green, glow_amt)
            this.window.background.blue  = lerp(this.window.background.blue,  this.glow.blue,  glow_amt)
        else
            var temp = this.glow
            this.glow = this.glow2
            this.glow2 = temp
            this.glow_amt = 0.0f

    def lerp (in : uchar, in2 : uchar, amt : float) : uchar
        return (uchar) (in + amt * (in2 - in))

