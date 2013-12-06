'''
Created on Nov 21, 2013

@author: jrm
'''
import socket
import threading
import pickle
#import time
import logging
import queue
import soy
import math
#import numpy
#import game.transforms as trans
log = logging.getLogger("AndroidController")

class AndroidSensorEvent(object):
    INITIAL_ROTATION = None
    
    def __init__(self,data):
        '''
        @See http://developer.android.com/reference/android/hardware/SensorEvent.html
        @See http://developer.android.com/reference/android/hardware/SensorListener.html
        @See http://developer.android.com/guide/topics/sensors/sensors_motion.html#sensors-motion-gyro
        @see http://www.mathworks.com/matlabcentral/fileexchange/40876-android-sensor-support-from-matlab/content/sensorgroup/Examples/html/CapturingAzimuthRollPitchExample.html
        
        
        rotation.alpha --> -pi/2 to pi/2 (-90 deg to 90 deg)
        rotation.beta --> -pi to pi? (-180 deg to 180 deg)
        rotation.gamma --> -pi to pi? (-180 deg to 180 deg)
        
        data = {'data': 
            {'roll': -0.0382021889090538,  # Roll, rotation around Y axis (-90<=roll<=90), with positive values when the z-axis moves toward the x-axis.
            'yforce': -0.36958146, # force applied by the device on the y-axis
            'time': 1385072610.811, 
            'yMag': -30.818802, 
            'zforce': 9.708811, # force applied by the device on the z-axis
            'zMag': 0.62345886, 
            'light': 4.094892, 
            'pitch': 0.038020502775907516, # Pitch, rotation around X axis (-180<=pitch<=180), with positive values when the z-axis moves toward the y-axis. 
            'accuracy': 3, 
            'xMag': -17.799988, 
            'azimuth': 2.617283582687378,  # Azimuth, rotation around the Z axis (0<=azimuth<360). 0 = North, 90 = East, 180 = South, 270 = West
            'xforce': 0.37107834}, # force applied by the device on the x-axis
        'name': 'sensors', 
        'time': 1385072610811000
        }
        '''
        print(data)
        #self.force = soy.atoms.Vector((data['data']['xforce'],data['data']['yforce'],data['data']['zforce']))
        # orientationvalues[0] --> data['data']['azimuth']
        # orientationvalues[1] --> data['data']['pitch']
        # orientationvalues[2] --> data['data']['roll']
        cazimuth,sazimuth = math.cos(data['data']['azimuth']),math.sin(data['data']['azimuth'])
        cpitch,spitch = math.cos(data['data']['pitch']),math.sin(data['data']['pitch'])
        croll,sroll = math.cos(data['data']['roll']),math.sin(data['data']['roll'])
        
        #         v1 = soy.atoms.Vector(((croll*cazimuth+sroll)*spitch*sazimuth, cpitch*sazimuth, (-sroll)*cazimuth+croll*spitch*sazimuth)))
        #         v1t = soy.atoms.Vector((0,0,croll*spitch*sazimuth))
        #         v2 = soy.atoms.Vector((-croll*sazimuth+sroll)*spitch*cazimuth, cpitch*cazimuth, (sroll)*sazimuth+croll*spitch*cazimuth)))
        #         v2t = soy.atoms.Vector((0,0,croll*spitch*cazimuth))
        #         v3 = soy.atoms.Vector((sroll*cpitch, -spitch, croll*cpitch))
        # http://stackoverflow.com/questions/5464847/transforming-accelerometers-data-from-devices-coordinates-to-real-world-coordi
        self.force = soy.atoms.Vector((
              (data['data']['xforce']*(croll*cazimuth+sroll)*spitch*sazimuth + data['data']['yforce']*(cpitch*sazimuth) + data['data']['zforce']*(-sroll)*cazimuth+croll*spitch*sazimuth),
              (data['data']['xforce']*(-croll*sazimuth+sroll)*spitch*cazimuth + data['data']['yforce']*(cpitch*cazimuth) + data['data']['zforce']*(sroll)*sazimuth+croll*spitch*cazimuth),
              (data['data']['xforce']*(sroll)*cpitch + data['data']['yforce']*(-spitch) + data['data']['zforce']*(croll*cpitch))
        ))
        
        # Map pitch, roll, azimuth to x,y,z
#         xaxis, yaxis, zaxis = [1,0,0,0], [0,1,0,0], [0,0,1,0]
#         rx = trans.rotation_matrix(data['data']['roll'], yaxis)
#         rz = trans.rotation_matrix(data['data']['pitch'], xaxis)
#         nzaxis = [0,0,-1,0] 
#         ry = trans.rotation_matrix(data['data']['azimuth'], nzaxis)
#         rm = trans.concatenate_matrices(rx,rz,ry)
#         alpha,beta,gamma = trans.euler_from_matrix(rm)
        #self.rotation = soy.atoms.Rotation((alpha,beta,gamma))
        self.rotation = soy.atoms.Rotation((
                                            -data['data']['roll'],
                                            data['data']['azimuth'], 
                                            data['data']['pitch'] # pi/6 # 1.0471975511965976 pi/3, 0.5235987755982988 # pi/6
                                        ))
        if self.INITIAL_ROTATION is not None:
            self.rotation = self.rotation - self.INITIAL_ROTATION
        
        self.time = data['time']
        
    def __add__(self,evt):
        self.force = self.force+evt.force
        self.rotation = self.rotation+evt.rotation
    __radd__ = __add__ 
    
    def __sub__(self,evt):
        self.force = self.force-evt.force
        self.rotation = self.rotation-evt.rotation
        
    def __repr__(self):
        return "AndroidSensorEvent(force=%s,rotation=%s)"%(self.force,self.rotation)

class AndroidController(object):
    '''Creates a bluetooth connection to an android device receives sensor data
    so we can use the phone as a controller.
    
    To find the port see: http://people.csail.mit.edu/albert/bluez-intro/x290.html
    '''

    def __init__(self,addr,q=None):
        '''Constructor'''
        self.q = q or queue.Queue() 
        self.event_thread = threading.Thread(target=self.event_loop,args=[addr,self.q])
        self.event_thread.start()
    
    def event_loop(self,addr,q):
        bt = socket.socket(socket.AF_BLUETOOTH,socket.SOCK_STREAM,socket.BTPROTO_RFCOMM)
        sep = bytes(";;","utf-8")
        buffer = bytes()
        
        
        try:
            bt.connect(addr)
            with open('sensord.csv','w') as f:
                f.write("time, azimuth, pitch, roll, xforce, yforce, zforce\n")
                while True:
                    buffer += bt.recv(512)
                    i = buffer.find(sep)
                    while i>0:
                        evt = pickle.loads(buffer[0:i])
                        f.write("%s, %s, %s, %s, %s, %s, %s\n"%(evt['time'],evt['data']['azimuth'],evt['data']['pitch'],evt['data']['roll'],evt['data']['xforce'],evt['data']['yforce'],evt['data']['zforce']))
                        evt = AndroidSensorEvent(evt)
                        if AndroidSensorEvent.INITIAL_ROTATION is None: 
                            AndroidSensorEvent.INITIAL_ROTATION = evt.rotation
                        q.put(evt)
                        if len(buffer)>i+len(sep):
                            buffer = buffer[i+len(sep):]
                            i = buffer.find(sep)
                        else:
                            buffer = bytes()
                            break
        finally:
            bt.close()
        
                
if __name__ == '__main__':
    c = AndroidController( ('38:0A:94:36:CB:F3', 8))
    while True:
        evt = c.q.get()
        print(evt)
 
        