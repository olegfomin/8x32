import websocket
import time
import rel
import json
import signal
import sys
from Command import RecordPlayer
from Command import TapeRecorder
from Command import Record


isRoverLoggedIn = False
roverToken = ""
roverName = ""

userName = "Unknown"

record = Record();
tapeRecorder = TapeRecorder(record)
recordPlayer = RecordPlayer(record)

def on_login_message(ws, message):
    loginResponse = json.loads(message)
    command = loginResponse["Command"]
    print("Command = "+command)
    
    def switch(command):
        if command == "Login" : 
            if(not loginResponse["Payload"].startswith("Failure:")):
                roverName = loginResponse["Payload"]
                roverToken = loginResponse["token"]
                print("The "+roverName+" connected.")
            else:
                roverName = ""
                roverToken = ""
                print(loginResponse[Payload])
        elif command == "LoginAck":
            if(not loginResponse[Payload].startswith("Failure:")):
                currentUserName = loginResponse[Payload];
                print("The web '"+currentUserName+"' connected and '"+userName+"' disconnected")
                userName = currentUserName;
            else:
                print(loginResponse[Payload])
        else: print("Unknown command: '"+ command +"' while expected 'Login' and 'LoginAck'"); 
            

def on_login_error(ws, error):
    print(error)

def on_login_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_login_open(ws):
    print("Sending the login signal")
    ws.send("{\"Command\":\"login\", \"Payload\":\"cm92ZXI6Ujk1NDRyODIzMg==\"}")

def on_coords_message(ws, message):
    print(message)
    coordsAsJson = json.loads(message)
    tapeRecorder.addRecord(coordsAsJson)
    recordPlayer.play()
    
def on_coords_error(ws, error):
    print(error)

def on_coords_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_coords_open(ws):
    print("Opened coords connection")

def on_heartbeat_message(ws, message):
    ws.send(message)

def on_heartbeat_error(ws, error):
    print(error)

def on_heartbeat_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_heartbeat_open(ws):
    print("Opened heartbeat connection")
    
    
def your_custom_signal_handler(signal_number,frame):
    print("zooo")     
    
signal.signal(signal.SIGINT, your_custom_signal_handler)                                               

   

if __name__ == "__main__":
    websocket.enableTrace(False)
    wsLogin = websocket.WebSocketApp("ws://www.roboticrover.com:80/rover/login",
                                     on_open=on_login_open,
                                     on_message=on_login_message,
                                     on_error=on_login_error,
                                     on_close=on_login_close)

    wsCoords = websocket.WebSocketApp("ws://www.roboticrover.com:80/rover/coords",
                                      on_open=on_coords_open,
                                      on_message=on_coords_message,
                                      on_error=on_coords_error,
                                      on_close=on_coords_close)

    wsHeartBeat = websocket.WebSocketApp("ws://www.roboticrover.com:80/rover/heartbeat",
                                          on_open=on_heartbeat_open,
                                          on_message=on_heartbeat_message,
                                          on_error=on_heartbeat_error,
                                          on_close=on_heartbeat_close)
                                          


    wsLogin.run_forever(dispatcher=rel, reconnect=5)  # Set dispatcher to automatic reconnection, 5 second reconnect delay if connection closed unexpectedly
    wsCoords.run_forever(dispatcher=rel, reconnect=5)  # Set dispatcher to automatic reconnection, 5 second reconnect delay if connection closed unexpectedly
    wsHeartBeat.run_forever(dispatcher=rel, reconnect=5)  # Set dispatcher to automatic reconnection, 5 second reconnect delay if connection closed unexpectedly
    rel.signal(2, rel.abort)  # Keyboard Interrupt
    rel.dispatch()

'''
def signal_handler(sig, frame):
    print('You pressed Ctrl+C!')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
print('Press Ctrl+C')
signal.pause()
'''
                         
            
            
            

            
    
    
    
    

