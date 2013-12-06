#!/usr/bin/env python3
'''
Created on Nov 20, 2013

@author: jrm
'''
import configparser
import soy
import re
import math
import os
import threading,queue
from time import sleep
import pymouse, pykeyboard
from game.controllers import AndroidController
from game.agent import PingPongAgent
from game.utils import setup_logging
import logging
log = logging.getLogger("PongGame")

class MouseHandler(pymouse.PyMouseEvent):
    """ Since pysoy doesn't handle click/mouse event yet..."""
    def __init__(self,click_queue=None):
        pymouse.PyMouseEvent.__init__(self)
        self.handlers = []
        self.cq = click_queue or queue.Queue()
    
    def click(self,x,y,btn,press):
        evt = {'pos':(x,y,0),'btn':btn,'press':press}
        self.cq.put(evt)
        #for hdlr in self.handlers:
        #    hdlr(evt)
        #print("x=%s,y=%s,btn=%s,press=%s"%(x,y,btn,press))

class KeyHandler(pykeyboard.PyKeyboardEvent):
    """ Since pysoy doesn't handle key events yet...
    @see https://github.com/SavinaRoja/PyUserInput/blob/master/pykeyboard/base.py
    """
    def __init__(self,key_queue=None):
        pykeyboard.PyKeyboardEvent.__init__(self)
        self.handlers = []
        self.kq = key_queue or queue.Queue()
    
    def tap(self, keycode, character, press):
        """
        Subclass this method with your key event handler. It will receive
        the keycode associated with the key event, as well as string name for
        the key if one can be assigned (keyboard mask states will apply). The
        argument 'press' will be True if the key was depressed and False if the
        key was released.
        """
        evt = {'key':keycode,'char':character,'press':press}
        self.kq.put(evt)
        #for hdlr in self.handlers:
        #    hdlr(evt)
        
class PingPongGame(threading.Thread):
    """
    All units are in meters
    """
    
    ROOM_SIZE = 30.0
    UPDATE_INTERVAL = 0.05
    GRAVITY = soy.atoms.Vector((0,-9.8,0))
    NO_GRAVITY = soy.atoms.Vector((0,0,0))
    NO_VELOCITY = soy.atoms.Vector((0,0,0))
    NO_ROTATION = soy.atoms.Rotation((0,0,0))
    
    def __init__(self):
        setup_logging()
        threading.Thread.__init__(self)
        
        self.MATCH_STARTED = threading.Event()
        self._load_config()
        self._setup_scene()
        self._setup_mouse()
        self._setup_keyboard()
        
        self._setup_player()
        self._setup_ball()
        self._setup_agent()
        
        self.start_match()
        
    def _load_config(self,config_file='../config/settings.ini'):
        cfg = configparser.ConfigParser()
        self.CONFIG_FILE = os.path.abspath(config_file)
        cfg.read(self.CONFIG_FILE)
        self.CONFIG = cfg
        
    def _save_config(self):
        self.CONFIG['settings']['camera_pos'] = "(%s,%s,%s)"%(self.cam.position.x,self.cam.position.y,self.cam.position.z)
        self.CONFIG['settings']['camera_rot'] = "(%s,%s,%s)"%(self.cam.rotation.alpha,self.cam.rotation.beta,self.cam.rotation.gamma)
        
        with open(self.CONFIG_FILE, 'w') as configfile:
            self.CONFIG.write(configfile)
        log.info("Config saved!")
        
    def _setup_scene(self):
        # Setup the room, camera, and lights
        self.room = soy.scenes.Room(self.ROOM_SIZE)
        self.room.walls = soy.materials.Colored("#333")
        #self.room.material = soy.materials.Colored("#333")
        
        pos = tuple(map(float,re.search(".*\((.*),(.*),(.*)\)",self.CONFIG['settings']['camera_pos']).groups()))
        rot = tuple(map(float,re.search(".*\((.*),(.*),(.*)\)",self.CONFIG['settings']['camera_rot']).groups())) 
        
        self.cam = soy.bodies.Camera(soy.atoms.Position(pos))
        self.cam.rotation = soy.atoms.Rotation(rot)
        self.light = soy.bodies.Light(soy.atoms.Position((0, 20, 0)))
        self.room['cam'] = self.cam
        self.room['light'] = self.light
        
        # Setup the table
        self._create_table(pos=soy.atoms.Position((0,-self.ROOM_SIZE,0)))
        
        # Setup the client window
        self.client = soy.Client()
        self.client.window.append(soy.widgets.Projector(self.cam))
        self.client.window.title = "CSC 447 - Ping Pong"
        self.client.window.size = soy.atoms.Size((960,540)) # (width,height)
        self.client.window.background = soy.atoms.Color('#FFF')
    
    def _create_table(self,pos):
        """ Create a ping pong table
        Dimensions from:
        @see http://en.wikipedia.org/wiki/Table_tennis
        
        Assuming all size units are in meters
        """
        # Create the table
        table = soy.bodies.Box()
        table.size = soy.atoms.Size((15.25,0.2,27.4))
        table.position.y = 7.6 - table.size.height/2.0 
        table.material = soy.materials.Colored("#063")
        table.density = 1000 # make it really heavy so it doesnt want to move
        self.table = table
        self.room['table'] = table
        
        # Create the net
        net = soy.bodies.Box()
        net.size = soy.atoms.Size((table.size.width+3.05,1.525,0.1))
        net.position.y = table.position.y+table.size.height+net.size.height
        net.material = soy.materials.Colored("#CCC")
        net.density = 1000 # make it really heavy so it doesnt want to move
        net.material.diffuse.alpha = 240
        self.room['table_net'] = net
        
        # TODO: Create the legs
        leg_size = soy.atoms.Size((0.4,table.position.y-table.size.height/2.0,0.4))
        dw,dd = (table.size.width/2.0-2*leg_size.width,table.size.depth/2.0-2*leg_size.depth)
        leg_pos = [
                   soy.atoms.Position((table.position.x+dw,leg_size.height/2.0-table.size.height,table.position.z+dd)),
                   soy.atoms.Position((table.position.x-dw,leg_size.height/2.0-table.size.height,table.position.z+dd)),
                   soy.atoms.Position((table.position.x-dw,leg_size.height/2.0-table.size.height,table.position.z-dd)),
                   soy.atoms.Position((table.position.x+dw,leg_size.height/2.0-table.size.height,table.position.z-dd))
                ]
        legs = []
        for i in range(4):
            leg = soy.bodies.Box()
            leg.size = leg_size
            leg.position = leg_pos[i]
            net.density = 1000 # make it really heavy so it doesnt want to move
            leg.material = soy.materials.Colored("#EEE")
            legs.append(leg)
        
        for i in range(len(legs)):
            self.room["table_leg_%s"%i] = legs[i]
        
        # Set the position and fix it to the room
        table.position = pos+table.position
        
        for leg in legs:
            leg.position = leg.position + pos
            soy.joints.Fixed(leg,self.room)
        net.position = net.position + pos
        soy.joints.Fixed(net, self.room)
        soy.joints.Fixed(table,self.room)
        
    
    def _setup_agent(self):
        self.agent = soy.bodies.Cylinder()
        self.agent.radius = 1
        self.agent.length = 0.2
        self.agent.material = soy.materials.Colored('#EFC')
        self.agent.position = soy.atoms.Position((0,-20,-15))
        # TODO: Create a thread that binds the paddle positon to the agent's position
        #self.agent_last_rotation = self.NO_ROTATION
        self.room['pad2'] = self.agent
        #self.agent.addForce(0, 9.8, 0)
        self.ai = PingPongAgent(self)
        self.ai.daemon = True
        self.ai.start()
    
    def _setup_player(self):
        """ Create a paddle for the player """
        self.player = soy.bodies.Cylinder()
        self.player.radius = 1
        self.player.length = 0.2
        self.player.material = soy.materials.Colored('#EFC')
        self.player.position = soy.atoms.Position((0,-20,15))
        # TODO: Create a thread that binds the paddle positon to the mouse position
        #self.player_last_rotation = self.NO_ROTATION
        self.room['pad1'] = self.player
        #self.player.addForce(0, -self.room.gravity.y, 0)
        
    def _setup_keyboard(self):
        """ Add key bindings to quit"""
        self.KEY_QUEUE = queue.Queue()
        self.KEY_CTRL = False
        self.KEY_ALT = False
        self.KEY_SHIFT = False
        
        def run_key_hdlr():
            m = KeyHandler(key_queue=self.KEY_QUEUE)
            #m.handlers.append(self.on_keyboard_evt)
            m.run()
            
        self.mouse_right_pressed_evt = threading.Event()
        self.mouse_left_pressed_evt = threading.Event()
        self._keyboard_handler_thread = threading.Thread(target=run_key_hdlr) 
        self._keyboard_handler_thread.daemon = True
        self._keyboard_handler_thread.start() 
        
    def _setup_mouse(self):
        """ Add key bindings to quit"""
        self.MOUSE_QUEUE = queue.Queue()
        
        def run_mouse_hdlr():
            m = MouseHandler(click_queue=self.MOUSE_QUEUE)
            #m.handlers.append(self.on_mouse_evt)
            m.run()
            
        self.mouse_right_pressed_evt = threading.Event()
        self.mouse_left_pressed_evt = threading.Event()
        self._mouse_handler_thread = threading.Thread(target=run_mouse_hdlr) 
        self._mouse_handler_thread.daemon = True
        self._mouse_handler_thread.start() 
        
    def _handle_mouse_input(self):
        # Handle anything in the queue
        while not self.MOUSE_QUEUE.empty():
            evt = self.MOUSE_QUEUE.get()
            self.on_mouse_evt(evt)
    
    def on_mouse_evt(self,evt):
        """ evt = {'pos':(x,y,0),'btn':btn,'press':press} """
        # Start the game on the first click
        self.MATCH_STARTED.set()
        #print(evt)
        if evt['btn']==1:
            if evt['press']:
                self.mouse_left_pressed_evt.set()
            else:
                self.mouse_left_pressed_evt.clear()
        elif evt['btn']==2:
            if evt['press']:
                self.mouse_right_pressed_evt.set()
            else:
                self.mouse_right_pressed_evt.clear()
    
    def _handle_keyboard_input(self):
        # Handle anything in the queue
        while not self.KEY_QUEUE.empty():
            evt = self.KEY_QUEUE.get()
            self.on_keyboard_evt(evt)
    
    def on_keyboard_evt(self,evt):
        """ evt = {'key':keycode,'char':character,'press':press} """
        print(evt)
        if evt['char'] in ['Control_L','Control_R']:
            self.KEY_CTRL = evt['press']
        elif evt['char'] in ['Alt_L','Alt_R']:
            self.KEY_ALT = evt['press']
        elif evt['char'] in ['Shift_L','Shift_R']:
            self.KEY_SHIFT = evt['press']
        elif evt['char']=='Down':
            if self.KEY_CTRL:
                self.cam.rotation.gamma +=0.01
            else:
                self.cam.position.y -=0.1
        elif evt['char']=='Up':
            if self.KEY_CTRL:
                self.cam.rotation.gamma -=0.01
            else:
                self.cam.position.y +=0.1
        elif evt['char']=='Left':
            self.cam.rotation.alpha -=0.01
        elif evt['char']=='Right':
            self.cam.rotation.alpha +=0.01
        elif evt['char']=='r':
            if self.KEY_CTRL and not evt['press']:
                self._check_match_ended(stop_match=True)
        elif evt['char']=='s':
            if self.KEY_CTRL and not evt['press']:
                self._save_config()
            
        
    
    def _setup_ball(self):
        self.ball = soy.bodies.Sphere()
        self.ball.material = soy.materials.Colored('orange')
        self.ball.radius = 0.2
        self.room['ball'] = self.ball
    
    def start_match(self):
        """ At the beginning of a match, put the ball right in front of the serving players paddle.
        
        When the serving player clicks:
          1. Apply gravity to the room.
          2. 'Toss' the ball straight up by applying an upward force to the ball
        
        """
        log.warn("Match started!")
        self.MATCH_STARTED.clear()
        self.update_ball_position()
        
    
    def update_player_position(self):
        pos = soy.atoms.Position(self.client.pointer.position) # Copy it
        dw,dh = self.client.window.size.width/2.0,self.client.window.size.height/2.0
        # Shift relative to world origin and scale
        pos.x = ((pos.x)-dw)*20/self.client.window.size.width 
        pos.y = -((pos.y)-dh)*20/self.client.window.size.height - self.ROOM_SIZE+10
        pos.z = 10
        
        #d = soy.atoms.Vector(self.player.position-pos).magnitude()
        #print(d)
        #v = (d+0.1)
        #if d>0.1: #pass
        if self.mouse_right_pressed_evt.is_set():
            pos.z =self.player.position.z+0.3
        if self.mouse_left_pressed_evt.is_set():
            pos.z =self.player.position.z-0.3
            
        #self.player.position = pos
        #soy.controllers.Pathfollower(scene, controlled, path, speed, fuzziness = None, paused = False)
        nav = soy.controllers.Pathfollower(scene=self.room, controlled=self.player, path=(pos,), speed=500)#, bounds=soy.atoms.Size((1,1,1)))
        self.player.rotation = self.NO_ROTATION
        #while not nav.finished: 
        #    sleep(self.UPDATE_INTERVAL)
        
    def update_ball_position(self):
        """ Put the ball right in front of the player """
        p = soy.atoms.Position(self.player.position)
        p.z -=0.5
        self.ball.position = p 
    
    def _check_match_ended(self,stop_match=False):
        # TODO: Check if it hit twice on the table
        
        # If the ball hit one of the walls or floors
        border = 0.5
        p = self.ball.position
        if (stop_match or p.y < (-self.ROOM_SIZE+border) or  
            p.x<(-self.ROOM_SIZE+border) or p.x>(self.ROOM_SIZE-border) or 
            p.z>(self.ROOM_SIZE-border) or p.z<(-self.ROOM_SIZE+border)):
            log.warn("Match ended!")
            self.MATCH_STARTED.clear()
            self.ball.velocity = self.NO_VELOCITY
            
    def _zero_torques(self):
        """ Prevent paddles from spinning out of control by reducing the torques on the paddles """
        t = 0.001
        
        # Determine the angular velocity
        self.agent.rotation = self.NO_ROTATION
        dr = soy.atoms.Rotation(self.agent.rotation)
        sleep(t)
        dr -=soy.atoms.Rotation(self.agent.rotation)
        drdt = dr/t
        
        self.agent.addTorque(-drdt.alpha, -drdt.beta, -drdt.gamma)
        
        # Determine the angular velocity
        
        #for key in ['alpha','beta','gamma']:
        #    if getattr(dp0,key) > 0.09817477042468103: #pi/32 ~ 5 degress
        #self.player.addTorque(x, y, z)
        
        
            
    def run(self):
        #p0 = soy.atoms.Position(client.pointer.position)
        #room['ball'].addForce(0,0,10)
        #revt0 = ctrl.q.get()
        #cont = None
        ball_tossed = False
        while self.client.window:
            sleep(self.UPDATE_INTERVAL)
            
            # Handle any mouse/keyboard events
            self._handle_keyboard_input()
            self._handle_mouse_input()
            
            # Update player paddle position
            self.update_player_position()
            
            # Update ball position
            if not self.MATCH_STARTED.is_set():
                self.room.gravity = self.NO_GRAVITY
                ball_tossed = False
                self.update_ball_position()
            elif not ball_tossed:
                self.room.gravity = self.GRAVITY
                self.ball.addForce(0, 20, 0)
                ball_tossed = True
                
            # Check if the match ended
            self._check_match_ended()
            
            # Helper function so the paddles don't start spinning out of control
            #self._zero_torques()
                
            # Handle agent's task
            #pos = self.ai.tasks.get()
            #nav2 = soy.controllers.Pathfollower(scene=self.room, controlled=self.agent, path=(pos,), speed=2000)#, bounds=soy.atoms.Size((1,1,1))) 
            
            #d0 = p1-p0
            #print("Position: %s, Delta: %s"%(p1,d0))
            #evt = ctrl.q.get()
            #print(evt)
            #room['cube2'].addForce(evt.force.x,evt.force.y,evt.force.z)
            #room['cube2'].addForce(-1,0,0)
            #print(room['cube2'].position)
            #if cont is not None:
            #    del cont
            #cont = soy.controllers.SpaceNavigator(room, room['cube2'], soy.atoms.Position(((p1.x-500)*10/1000.0,-(p1.y-350)*10/768.0,-5)), 20, 1)#, bounds=soy.atoms.Size((1,1,1)))
            
            #room['ball'].addForce(0,0,-10*room['ball'].position.z)
            #room['cube2'].position.z = 0#/max(room.height,room.width)#evt.force + room['cube2'].position
            #room['cube2'].addTorque(evt.rotation.alpha*10,evt.rotation.beta*10,evt.rotation.gamma*10)
            #a,b,g = room['cube2'].rotation - soy.atoms.Rotation((0,0,0)) # how far away it is from the center
            #room['cube2'].addTorque(-a*a,-b*b,-g*g)
            #room['cube2'].rotation = soy.atoms.Rotation((evt.rotation.alpha,evt.rotation.beta,evt.rotation.gamma))
            
            #p0 = p1
        soy.quit()




#soy.controllers.SpaceNavigator(scene, controlled, dest, speed, granularity, fuzziness=None, bounds=None, updates=False, paused=False)

if __name__ == '__main__' :
    #ctrl = AndroidController( ('38:0A:94:36:CB:F3', 6))
    game = PingPongGame()
    game.start()
    game.join() # Wait until player quits    
