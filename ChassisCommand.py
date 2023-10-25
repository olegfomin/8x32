from ArduinoConnection import ArduinoConnection
from Throthle import Throthle
from RedRelay import RedRelay
import threading
import time

''' There are six commands that are being used for now
'F' for Forward
'B' for Backward
'L' for Left
'R' for Fight
'N' for none command

All the commands are supplied with number of the millis
that a command is being executed, The command name and associated number
are separated by comma like this: F,1500
The commands 'U" and 'N' should be supplied with zero as duration, like:
U,0 
aDuration - command duration in millis

aSkipNumber - number of skips (RedRelay off) during command execution if 
              it is negative then that it is applied to the left part
              otherwise it is the right side. If it is zero then no 
              skips are applied to neither side
              
aSkipDuration - black out duration while the command is executing 

'''
DEFAULT_SKIP_DURATION = 0.050
DEFAULT_SKIP_NUMBER = 13
RED_RELAY_LEFT  = 4
RED_RELAY_RIGHT = 5

class ChassisCommand:
	command = "N" # Originaly it is 'None'
	arduinoConnection = None
	redRelay4         = None
	redRelay5         = None
	duration          = 0
	
	def __init__(self,
				anArduinoConnection,
				aRedRelay4, # Controls the right positioned motors
				aRedRelay5): # Controls the left positioned motors
		self.arduinoConnection = anArduinoConnection
		self.redRelay4         = aRedRelay4
		self.redRelay5         = aRedRelay5
		
	def enableRelays(self):
		self.redRelay4.on()
		self.redRelay5.on()
		
	def execute(self, aDuration):
		self.duration = aDuration
		arduinoConnection.send(self.command, aDuration)

	def disableRelays(self):
		self.redRelay4.off()
		self.redRelay5.off()
		
	def undo(self):
		raise Exception("'undo' is not implemented in base class please use any decendent class")
		

class ChassisForward(ChassisCommand):
	command = "F" # Going forward
	def undo(self):
		return ChassisBackward(self.arduinoConnection, self.redThrothleLeft, self.redThrothleRight)
	
	
class ChassisBackward(ChassisCommand):
	command = "B" # Going forward
	def undo():
		return ChassisForward(self.arduinoConnection, self.redThrothleLeft, self.redThrothleRight)
		
class ChassisTurnRight(ChassisCommand):
	command = "R" # Going right
	def undo():
		return ChassisTurnLeft(self.arduinoConnection, self.redThrothleLeft, self.redThrothleRight)
		
class ChassisTurnLeft(ChassisCommand):
	command = "L" # Going left
	def undo():
		return ChassisTurnRight(self.arduinoConnection, self.redThrothleLeft, self.redThrothleRight)

		
if __name__ == '__main__':
	duration = 2
	command = "F"
	relay4 = RedRelay(4)
	relay5 = RedRelay(5)
	arduinoConnection = ArduinoConnection()

	cf = ChassisTurnLeft(arduinoConnection,relay4, relay5)
	cf.enableRelays() 
	cf.execute(duration)
	cf.disableRelays()
	
	
	
#	arduinoConnection = ArduinoConnection()
#	arduinoConnection.send(command, duration)
	


