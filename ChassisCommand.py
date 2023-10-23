from ArduinoConnection import ArduinoConnection
from Throthle import Throthle
from RedRelay import RedRelay
import threading

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
	redThrothleLeft   = None
	redThrothleRight  = None
	
	def __init__(self,
				anArduinoConnection,
				aLeftThrothle,
				aRightThrothle):
		self.arduinoConnection = anArduinoConnection
		self.redThrothleLeft   = aLeftThrothle
		self.redThrothleRight  = aRightThrothle
		
	def execute(self, aDuration):
		self.redThrothleLeft.setTotalDuration(aDuration)
		self.redThrothleRight.setTotalDuration(aDuration)
		leftThread = threading.Thread(target=self.redThrothleLeft.rattle)
		leftThread.start()
		rightThread = threading.Thread(target=self.redThrothleRight.rattle)
		rightThread.start()
		arduinoConnection.send(self.command, aDuration)
		
		
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
	duration = 20
	command = "F"
	arduinoConnection = ArduinoConnection()
	
	relay4 = RedRelay(4)
	throthleRight = Throthle(relay4, 10, 1) 

	relay5 = RedRelay(5)
	throthleLeft = Throthle(relay5, 1, 0) 
	
	
	cf = ChassisBackward(arduinoConnection, throthleRight, throthleLeft)
	cf.execute(duration) 
#	arduinoConnection = ArduinoConnection()
#	arduinoConnection.send(command, duration)
	


