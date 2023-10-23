#!/usr/bin/env python3
import serial
import time
# The maximum time the class waits Arduino response after command is
# issued. Every command has its own time for execution but this number is
# supposes to be greater than any other
ARDUNO_COMMAND_TIMEOUT = 25 # seconds

''' Class connects to Arduino and it can send the commands to it '''
class ArduinoConnection:
	
	def __init__(self, aUsbPortPath="/dev/ttyACM0", aUsbPortSpeed=9600):
		self.usbPortPath  = aUsbPortPath
		self.usbPortSpeed = aUsbPortSpeed
		self.connection = serial.Serial(aUsbPortPath, aUsbPortSpeed, timeout=5)
		self.connection.reset_input_buffer()
		time.sleep(3);	

		


	''' Sending command to arduino through the wire 
		There are five commands that are being used for now
		'F' for Forward
		'B' for Backward
		'L' for Left
		'R' for Fight
		'N' for none command

		Command duration in seconds like everywhere in Python

		The second param 'commandDuration' is an expected time for command
		execution. The exception is raised if no respond from arduino
		received within ARDUNO_COMMAND_TIMEOUT '''
	def send(self, commandName, commandDuration):
		commandAsBytes = bytes(commandName+","+str(commandDuration*1000)+"\n", 'utf-8') # Converting 
		self.connection.write(commandAsBytes)
		time.sleep(commandDuration+0.01) # Allowing one hundred's of a second to deliver results back
		line = self.connection.readline().decode('utf-8').rstrip()
		if(not(line.startswith("Ok"))): raise Exception(line)
		

'''The testing part below'''
if __name__ == '__main__':
		
	ac = ArduinoConnection()
	ac.send('F', 10)
		
		
			
