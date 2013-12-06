'''
Created on Nov 29, 2013

@author: jrm
'''
import soy
import time
import threading,queue
import random
import math
import logging
log = logging.getLogger("Agent")

NO_ROTATION = soy.atoms.Rotation((0,0,0))

class IAgentAction(object):
    def __init__(self,game):
        self.game = game
    
    def priority(self):
        """ Determine how important this action is given the current state 
        @return float
        """
        raise NotImplementedError("")
    
    def do(self):
        """ When called, do the action """
        raise NotImplementedError("")
    
    def learn(self):
        """ When called after the action """
        raise NotImplementedError("")
    
    def __repr__(self):
        return self.__class__.__name__
    
class PingPongAgent(threading.Thread):
    '''An AI Agent that plays ping pong against the user.
    '''
    BLINDNESS = 0.02 # sigma (std dev) used in the gauss function for position tracking
    
    def __init__(self,game):
        '''
        Constructor
        '''
        threading.Thread.__init__(self)
        self.game = game
        self.tasks = queue.Queue()
        
        self.actions = [
            PingPongAgent.ActionMirror(game),
            PingPongAgent.ActionReflect(game),
            PingPongAgent.ActionSwing(game),
            PingPongAgent.ActionNothing(game),
            PingPongAgent.ActionAim(game),
        ]
        
    class ActionNothing(IAgentAction):
        def priority(self):
            #if not self.game.MATCH_STARTED.is_set():
            #    return 1000.0
            return 0.0
            
        def do(self):
            """ Do nothing lol"""
            nav = soy.controllers.Pathfollower(scene=self.game.room, controlled=self.game.agent, path=(soy.atoms.Position((0,-20,-15)),), speed=50)
            while not nav.finished:
                time.sleep(0.1)
        
        def learn(self):
            pass
    
    
    # List of actions that can be taken
    class ActionMirror(IAgentAction):
        DISTANCE = 10
        VELOCITY = soy.atoms.Vector((0,0,-10)) 
        NAV = None
        def priority(self):
            v = 40 + (-self.game.ball.position.z*self.DISTANCE)
            #log.debug("ActionMirror %s"%v)
            return v
        
        def do(self):
            """ Try to mirrors the position of the ball"""
            pos = soy.atoms.Position(self.game.agent.position)
            ball_pos = soy.atoms.Position(self.game.ball.position)
            pos.x = random.gauss(ball_pos.x,PingPongAgent.BLINDNESS) # A real agent wont be dead on every time 
            pos.y = random.gauss(ball_pos.y,PingPongAgent.BLINDNESS) # A real agent wont be dead on every time 
            if self.NAV is None or self.NAV.finished:
                self.NAV = soy.controllers.Pathfollower(scene=self.game.room, controlled=self.game.agent, path=(pos,), speed=50)#, bounds=soy.atoms.Size((1,1,1)))
                self.game.agent.rotation = NO_ROTATION
            
        def learn(self):
            pass
            
    class ActionReflect(IAgentAction):
        DISTANCE = 10
        VELOCITY = soy.atoms.Vector((0,0,10)) 
        NAV = None
        def priority(self):
            """ If the ball moving away from the agent, then this is a better thing to do"""
            v = self.game.ball.velocity.z*self.VELOCITY.z + self.game.ball.position.z*self.DISTANCE
            #log.debug("ActionReflect %s"%v)
            return v
        
        def do(self):
            """ Try to reverses the position of the other player"""
            pos = soy.atoms.Position(self.game.agent.position)
            player_pos = soy.atoms.Position(self.game.player.position)
            pos.x = -random.gauss(player_pos.x,PingPongAgent.BLINDNESS)
            pos.y = random.gauss(player_pos.y,PingPongAgent.BLINDNESS)
            pos.z = -15
            if self.NAV is None or self.NAV.finished:
                self.NAV = soy.controllers.Pathfollower(scene=self.game.room, controlled=self.game.agent, path=(pos,), speed=50)
            self.game.agent.rotation = NO_ROTATION
            
        def learn(self):
            # TODO: Tweak the velocity
            pass    
    
    class ActionSwing(IAgentAction):
        DISTANCE = 100
        SPEED = 12
        NAV = None
        def priority(self):
            """ If the ball is really close do this!"""
            d0 = (soy.atoms.Vector(self.game.agent.position) - soy.atoms.Vector(self.game.ball.position)).magnitude()
            d0 += 0.0001
            
            v =  self.DISTANCE/d0**2
            #log.debug("ActionSwing %s"%v)
            return v 
        
        def do(self):
            """ Move towards the position of the ball """
            pos = soy.atoms.Position(tuple(map(lambda x:random.gauss(x,PingPongAgent.BLINDNESS),self.game.ball.position)))
            if self.NAV is None or self.NAV.finished:
                self.NAV = soy.controllers.Pathfollower(scene=self.game.room, controlled=self.game.agent, path=(pos,), speed=self.SPEED)
            
        def learn(self):
            # TODO: update distance
            pass
    
    class ActionAim(IAgentAction):
        DISTANCE = 98 # Slightly less...
        ADJ_AIM = soy.atoms.Position((0,0,0)) # Tune the aim as the game goes on...
        
        def priority(self):
            """ If the paddle is not aimed at the table do this!"""
            # Pick a random spot on the  table to aim for
            self.AIM_POSITION = soy.atoms.Position((
                        self.game.table.position.x+random.gauss(0,self.game.table.size.width/4.0),
                        self.game.table.position.y+random.gauss(0,1),
                        self.game.table.position.z+random.gauss(self.game.table.size.depth/3.0,1)
                    ))
            p = soy.atoms.Position(self.game.agent.position)
            
            # Where the agent want's to aim
            self.AIM_DIRECTION = soy.atoms.Vector(self.AIM_POSITION) - soy.atoms.Vector(p)
            #print("Aiming at: %s"%self.AIM_POSITION)
            m = self.AIM_DIRECTION.magnitude()+0.000001 # Never 0
            
            # Angle where they want to aim
            self.AIM_ROTATION = soy.atoms.Rotation(tuple(map(lambda x:math.cos(x/m),self.AIM_DIRECTION)))
            #print("Aiming rot: %s"%self.AIM_ROTATION)
            # IDK why but they need adjusted
            self.AIM_ROTATION = soy.atoms.Rotation((self.AIM_ROTATION.alpha-math.pi/4.0,self.AIM_ROTATION.beta,self.AIM_ROTATION.gamma))
            
                                                   
            # Difference between current aim and where it wants to aim
            aim_error = soy.atoms.Vector(self.AIM_ROTATION - self.game.agent.rotation).magnitude()
            #print(aim_error)
            # This becomes critical as distance gets closer
            d0 = (soy.atoms.Vector(self.game.agent.position) - soy.atoms.Vector(self.game.ball.position)).magnitude()
            d0 += 0.0001
            
            v = (self.DISTANCE+aim_error)/d0**2
            #log.debug("ActionAim %s"%v)
            return v
        
        def do(self):
            """ Aim to the spot on the table """
            self.game.agent.rotation = self.AIM_ROTATION
            #self.game.agent.addForce(0,9.8,0)
            pos = soy.atoms.Position(self.game.agent.position)
            pos.y += 0.1
            nav = soy.controllers.Pathfollower(scene=self.game.room, controlled=self.game.agent, path=(pos,), speed=2000)
            
        def learn(self):
            pass
    
    def run(self):
        """ This is the observe, act, react loop of the agent. 
        
        Uses heuristics to determine what to do based on some pre defined actions
        that can be tweaked.
        """
        last_action = None
        action = None
        
        while self.game.client.window:
            time.sleep(self.game.UPDATE_INTERVAL)
            
            if action is not None:
                # check out the world reacted to the previous action and tweak the heuristics
                action.learn()
            
            # Check the heuristics for each action
            self.actions = sorted(self.actions,key=lambda action: -action.priority())
            
            # Choose the best action
            action = self.actions[0]
            
            # Log the action
            if action != last_action:
                log.debug(action)
            
            # take the action
            action.do()
            
            last_action = action
            
    