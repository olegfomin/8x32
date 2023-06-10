import time                                  #import the time module
import piplates.MOTORplate as MOTOR          #import the MOTORplate module
import queue
import json
import math

# Implementing the command pattern that encapsulates all the name
# and single value for a command. Then all the commands are
# gathered together inside a Record queue and then this record is
# being played by RecordPlayer that executes the command by sending the signals
# to the motor controller. All the motor controller commands are 
# pure functions as the OOP behaved very strangely overlaping commands
# with each other
  
CLOCK_WISE = 1
COUNTER_CLOCK_WISE = -1
TURN_COEFFICIENT_PIVOT = 0.005 # This value needs to be resolved empirically or it may be even a function
TURN_COEFFICIENT_SIMPLE = 0.004
ANGLE2TIME=0.0028
CALLIBRATION_LEFT  = 1.0
CALLIBRATION_RIGHT = 1.0
DISTANCE2TIME=0.0018

def m1Start(direction, power) :
	callibratedPower = CALLIBRATION_LEFT*power 
	MOTOR.dcCONFIG(0,1,direction,callibratedPower,0.1)           #configure dc motor 1 on the MOTORplate at address 0 being configured for clockwise 
	MOTOR.dcSTART(0,1)                                #Start DC motor

def m1Stop():
	MOTOR.dcSTOP(0,1)                            #stop the motor
	
def m2Start(direction, power) : 
	callibratedPower = CALLIBRATION_LEFT*power 
	MOTOR.dcCONFIG(0,2,direction,callibratedPower,0.1)           #configure dc motor 2 on the MOTORplate at address 0 being configured for clockwise 
	MOTOR.dcSTART(0,2)                                #Start DC motor

def m2Stop():
	MOTOR.dcSTOP(0,2)                            #stop the motor
	

def m3Start(direction, power) : 
	callibratedPower = CALLIBRATION_RIGHT*power
	MOTOR.dcCONFIG(0,3,direction,power,0.1)           #configure dc motor 3 on the MOTORplate at address 0 being configured for clockwise 
	MOTOR.dcSTART(0,3)                                #Start DC motor

def m3Stop():
	MOTOR.dcSTOP(0,3)                            #stop the motor 3

def m4Start(direction, power) : 
	callibratedPower = CALLIBRATION_RIGHT*power
	MOTOR.dcCONFIG(0,4,direction,power,0.1)           #configure dc motor 4 on the MOTORplate at address 0 being configured for clockwise 
	MOTOR.dcSTART(0,4)                                #Start DC motor

def m4Stop():
	MOTOR.dcSTOP(0,4)                            #stop the motor 4
	
def turnRightPivot(angle): 
  m1Start('ccw', 100)
  m2Start('ccw', 100)
  m3Start('cw', 100)
  m4Start('cw', 100)
  time.sleep(angle*ANGLE2TIME)
  m1Stop()
  m2Stop()
  m3Stop()
  m4Stop()
  
def turnLeftPivot(angle): 
  m1Start('cw', 100)
  m2Start('cw', 100)
  m3Start('ccw', 100)
  m4Start('ccw', 100)
  time.sleep(angle*ANGLE2TIME)
  m1Stop()
  m2Stop()
  m3Stop()
  m4Stop()
  
def turnRightSimple(angle): 
  m1Start('ccw', 18)
  m2Start('ccw', 18)
  m3Start('ccw', 100)
  m4Start('ccw', 100)
  time.sleep(angle*ANGLE2TIME)
  m1Stop()
  m2Stop()
  m3Stop()
  m4Stop()
  
def turnLeftSimple(angle): 
  m1Start('cw', 18)
  m2Start('cw', 18)
  m3Start('cw', 100)
  m4Start('cw', 100)
  time.sleep(angle*ANGLE2TIME)
  m1Stop()
  m2Stop()
  m3Stop()
  m4Stop()

def goForward(distance):
  m1Start('ccw', 100)
  m2Start('ccw', 100)
  m3Start('ccw', 100)
  m4Start('ccw', 100)
  time.sleep(distance*DISTANCE2TIME)
  m1Stop()
  m2Stop()
  m3Stop()
  m4Stop()

def goBackward(distance):
  m1Start('cw', 100)
  m2Start('cw', 100)
  m3Start('cw', 100)
  m4Start('cw', 100)
  time.sleep(distance*DISTANCE2TIME)
  m1Stop()
  m2Stop()
  m3Stop()
  m4Stop()



'''goBackward(5000)
time.sleep(0.1)
turnLeftPivot(600)
time.sleep(0.1)
goForward(5000)'''

class Command:
	name = 'none'
	value = 0
	def __init__(self, name, value):
		self.name = name
		self.value = value
	def __init__(self, name):
		self.name = name
		
	def __str__(self):
		return 'Command {name="'+self.name+'", value="'+str(self.value)+'"}'

		


class Record:
	commandsQueue = queue.Queue()

	def addCommand(self, aCommand):
		self.commandsQueue.put(aCommand)
		
	def	getCommand(self):
		return self.commandsQueue.get()
		
	def isEmpty(self):
		return 	self.commandsQueue.empty()
		
class RecordPlayer:
	DELAY_BETWEEN_COMMANDS = 1.0
	def __init__(self, aRecord):
		self.record=aRecord
		
	def play(self):
		while(not self.record.isEmpty()):
			command = self.record.getCommand()
			print(command)
			if(command.name == 'goBackward'):
				goBackward(command.value)
				time.sleep(self.DELAY_BETWEEN_COMMANDS) # This sleep is very important as it allows to switch motor controller context I guess
			elif(command.name == 'goForward'):
				goForward(command.value)
				time.sleep(self.DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'turnLeftPivot'):
				turnLeftPivot(command.value)
				time.sleep(self.DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'turnRightPivot'):
				turnRightPivot(command.value)
				time.sleep(self.DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'turnRightSimple'):
				turnRightSimple(command.value)
				time.sleep(self.DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'turnLeftSimple'):
				turnLeftSimple(command.value)
				time.sleep(self.DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'fire'):
				#empty command for now
				time.sleep(self.DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'none'): # in case the turn is not neccessary it is still good to keep a command in the Record
				time.sleep(self.DELAY_BETWEEN_COMMANDS)	
			else:
				raise('Unknown command: '+ command.value)
				

				
class TapeRecorder:
	def __init__(self, aRecord):
		self.record=aRecord

	#Json Sample: {"Command":"coords","Payload":[{"x":330,"y":946},{"x":397.40714285714284,"y":644.7902719550473}],"token":"dd7bac0f-b441-47a7-8aa0-91e656527849"}
	def addRecord(self, jsonAsObj):
		startFinishArr = jsonAsObj["Payload"];
		startXY = startFinishArr[0]
		xs = startXY["x"]
		ys = startXY["y"]
		finishXY = startFinishArr[1]
		xf = finishXY["x"]
		yf = finishXY["y"]
		
		width = xf-xs;
		length = yf - ys;
		
		moveCommandName = 'none' 
		if(length < -30):
			moveCommandName = 'goForward'
		elif(length > 30):
			moveCommandName = 'goBackward'
			
		moveCommand = Command(moveCommandName)	
		 
		turnCommandName = 'none' # the target is straight ahead, there no need to turn
		if(width > 23):
			if(moveCommandName == 'goBackward'): # Swapping right and letf turns if going backward
				turnCommandName = 'turnLeftPivot'
			else:		
				turnCommandName = 'turnRightPivot'
		elif(width < -23):
			if(moveCommandName == 'goBackward'): # Swapping right and letf turns if going backward
				turnCommandName = 'turnRightPivot'
			else:
				turnCommandName = 'turnLeftPivot'
			
		turnCommand = Command(turnCommandName)
		
		diagonal = abs(length) # in case we go straight	ahead
		if(turnCommandName != 'none'):	
		    diagonal = math.sqrt(width**2+length**2) # calculating how long shall we go if there is an angle
		    absWidth = abs(width)
		    sine = absWidth/diagonal 
		    angleInRadians = math.asin(sine)	
		    angleInDegrees = math.degrees(angleInRadians)
		    turnCommand.value = angleInDegrees
		    
		if(moveCommandName != 'none'):
			 moveCommand.value = diagonal*3.25; # Turning pixels in millimeters
		
		turnBackCommandName = 'none'	 
		if(turnCommandName == 'turnLeftPivot'):
			turnBackCommandName = 'turnRightPivot'
		elif(turnCommandName == 'turnRightPivot'):
			turnBackCommandName = 'turnLeftPivot'
		
		turnBackCommand = Command(turnBackCommandName)
		turnBackCommand.value = turnCommand.value
		
		self.record.addCommand(turnCommand)
		self.record.addCommand(moveCommand)
		self.record.addCommand(turnBackCommand)
		# fire command should be here maybe but not too sure
		
		
'''		
	
jsonAsString = '{"Command":"coords","Payload":[{"x":330,"y":946},{"x":397.40714285714284,"y":644.7902719550473}],"token":"dd7bac0f-b441-47a7-8aa0-91e656527849"}'
jsonAsStr1= '{"Command":"coords","Payload":[{"x":330,"y":946},{"x":380.55,"y":670.0761649728922}],"token":"74331cb9-6a7f-4187-aeb1-55cfa6c3b158"}'
jsonAsObj = json.loads(jsonAsStr1)

record = Record();
tapeRecorder = TapeRecorder(record)
tapeRecorder.addRecord(jsonAsObj)
recordPlayer = RecordPlayer(record)
recordPlayer.play();

'''

'''				
record = Record()				
record.addCommand(Command('goBackward', 10000))
record.addCommand(Command('turnLeftPivot', 60))
record.addCommand(Command('goForward', 7000))
record.addCommand(Command('turnRightPivot', 80))
record.addCommand(Command('goBackward', 9000))
record.addCommand(Command('turnRightSimple', 80))
record.addCommand(Command('turnLeftSimple', 35))

recordPlayer = RecordPlayer()

'''



				








