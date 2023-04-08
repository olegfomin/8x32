from websocket import create_connection

ws = create_connection("ws://www.roboticrover.com:5000/ws")
ws.send("{\"command\":\"targetCoordinates\", \"Payload\":[{\"x\":320,\"y\":380}], \"token\":\"123455667\"}")
print("Sent")
print("Receiving...")
result =  ws.recv()
print("Received '%s'" % result)
ws.close()
