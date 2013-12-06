import android
import time
import pickle

droid = android.Android()
droid.toggleBluetoothState(True)
# droid.dialogCreateAlert('Be a server?')
# droid.dialogSetPositiveButtonText('Yes')
# droid.dialogSetNegativeButtonText('No')
# droid.dialogShow()
# result = droid.dialogGetResponse()
is_server = True# result.result['which'] == 'positive'
if is_server:
    droid.bluetoothMakeDiscoverable()
    droid.bluetoothAccept()
else:
    droid.bluetoothConnect()

print("Connected!")

# Start dispatching all sensor events
droid.startEventDispatcher()
droid.startSensingTimed(1,100)
print("Started sensing!")

while True:
    evt = droid.eventPoll()#('sensors',10000)
    if evt.result is not None and len(evt.result)>0 and evt.result[0]['name']=='sensors':
        droid.bluetoothWrite(pickle.dumps(evt.result[0])+";;")
    #if droid.bluetoothReadReady():
    #    if droid.bluetoothReadLine().find("stop")>=0:
    #        break
print("Stopping...")

droid.stopSensing()
droid.stopEventDispatcher()

droid.exit()
