from RedRelay.py import RedRelay

''' There are five commands that are being used for now
'F' for Forward
'B' for Backward
'L' for Left
'R' for Fight
'U' for undo command
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
	commandId     = "N"
	serial        = None
	duration      = 0
	redRelayLeft  = None
	redRelayRight = None
	
	def __init__(self, 
	             aCommandId, 
	             aSerialPath,
	             aSerialSpeed, 
	             
	             aRedRelayLeftPin,
	             aRedRelayLeftDuration,
	             aRedRelayLeftNumberOfHalts,
	             aRedRelayLeftHaltDuration,
	             
	             aRedRelayRightPin, 
	             aRedRelayRightDuration,
	             aRedRelayRightNumberOfHalts,
	             aRedRelayRightHaltDuration 
	             ):
		self.commandId     = aCommandId
		self.serial        = aSerial
		self.redRelayLeft  = RedRelay(aRedRelayPinLeft)
		self.redRelayRight = RedRelay(aRedRelayPinRight)
		
		self.duration = aDuration
		
	def
