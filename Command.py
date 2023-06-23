import time                                  #import the time module
import piplates.MOTORplate as MOTOR          #import the MOTORplate module
import queue
import json
import math
from HallEffectInterruption import HallEffectInterruption
import RPi.GPIO as GPIO
M1_GPIO = 23
M2_GPIO = 24
M3_GPIO = 27
M4_GPIO = 3



# Implementing the command pattern that encapsulates all the name
# and single value for a command. Then all the commands are
# gathered together inside a Record queue and then this record is
# being played by RecordPlayer that executes the command by sending the signals
# to the motor controller. All the motor controller commands are 
# pure functions as the OOP behaved very strangely overlaping commands
# with each other
  
CLOCK_WISE = 1
COUNTER_CLOCK_WISE = -1
ANGLE2TIME=0.0085
CALLIBRATION_LEFT  = 1.0
CALLIBRATION_RIGHT = 0.95
DISTANCE2TIME_FORWARD=0.005
DISTANCE2TIME_BACKWARD=0.0043
DISTANCE2TIME_LEFT=0.0043
DISTANCE2TIME_RIGHT=0.0043
MILLISPERSEC = 3.25

numberOfM1Revs = 0
prevNumberOfM1Revs = 0
numberOfM2Revs = 0
prevNumberOfM2Revs = 0
numberOfM3Revs = 0
prevNumberOfM3Revs = 0
numberOfM4Revs = 0
prevNumberOfM4Revs = 0


def onChange1(amIPressed, pressedCounter, releasedCounter):
		numberOfM1Revs = releasedCounter

def onChange2(amIPressed, pressedCounter, releasedCounter):
		numberOfM2Revs = releasedCounter

def onChange3(amIPressed, pressedCounter, releasedCounter):
		numberOfM3Revs = releasedCounter

def onChange4(amIPressed, pressedCounter, releasedCounter):
		numberOfM4Revs = releasedCounter
		
GPIO.setmode(GPIO.BCM)
GPIO.setup(M1_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(M2_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(M3_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(M4_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)

hei1 = HallEffectInterruption(M1_GPIO, True, onChange1)
hei2 = HallEffectInterruption(M2_GPIO, True, onChange2)
hei3 = HallEffectInterruption(M3_GPIO, True, onChange3)
hei4 = HallEffectInterruption(M4_GPIO, True, onChange4)

GPIO.add_event_detect(M1_GPIO, GPIO.BOTH, callback=hei1.hallSensorCallback, bouncetime=5)
GPIO.add_event_detect(M2_GPIO, GPIO.BOTH, callback=hei2.hallSensorCallback, bouncetime=5)
GPIO.add_event_detect(M3_GPIO, GPIO.BOTH, callback=hei3.hallSensorCallback, bouncetime=5)
GPIO.add_event_detect(M4_GPIO, GPIO.BOTH, callback=hei4.hallSensorCallback, bouncetime=5)

def andle2TimePivotRight(angle) :
	coefficient=0; 
	if(angle >= 0 and angle < 2):
		coefficient = 0.03
	elif(angle >=2 and angle < 4):
		coefficient = 0.027	
	elif(angle >= 5 and angle < 8):
		coefficient = 0.025
	elif(angle >= 8 and angle < 10):
		coefficient = 0.021
	elif(angle >= 10 and angle < 15):
		coefficient = 0.017
	elif(angle >= 15 and angle < 20):
		coefficient = 0.015
	elif(angle >= 20 and angle < 25):
		coefficient = 0.013
	elif(angle >= 25 and angle < 30):
		coefficient = 0.012
	elif(angle >= 30 and angle < 40):
		coefficient = 0.011
	elif(angle >= 40 and angle < 50):
		coefficient = 0.01
	elif(angle >= 50 and angle < 60):
		coefficient = 0.0095
	elif(angle >= 60 and angle < 70):
		coefficient = 0.0082
	elif(angle >= 70 and angle < 80):
		coefficient = 0.0079
	elif(angle >= 80 and angle < 90):
		coefficient = 0.0076
	elif(angle >= 90 and angle < 100):
		coefficient = 0.00738 
	elif(angle >= 100 and angle < 110):
		coefficient = 0.0126	 
	elif(angle >= 110 and angle < 120):
		coefficient = 0.01	 
	elif(angle >= 120 and angle < 130):
		coefficient = 0.0095	 
	elif(angle >= 130 and angle < 140):
		coefficient = 0.0090	 
	elif(angle >= 140 and angle < 150):
		coefficient = 0.0088	 
	elif(angle >= 150 and angle < 160):
		coefficient = 0.0087	 
	elif(angle >= 160 and angle < 170):
		coefficient = 0.0086	 
	elif(angle >= 170 and angle < 180):
		coefficient = 0.0085
	else:
		 coefficient = 0.0085
	print(coefficient)
	return coefficient
	
def andle2TimePivotLeft(angle) :
	coefficient=0; 
	if(angle >= 0 and angle < 2):
		coefficient = 0.032
	elif(angle >=2 and angle < 4):
		coefficient = 0.029	
	elif(angle >= 5 and angle < 8):
		coefficient = 0.027
	elif(angle >= 8 and angle < 10):
		coefficient = 0.023
	elif(angle >= 10 and angle < 15):
		coefficient = 0.018
	elif(angle >= 15 and angle < 20):
		coefficient = 0.015
	elif(angle >= 20 and angle < 25):
		coefficient = 0.013
	elif(angle >= 25 and angle < 30):
		coefficient = 0.012
	elif(angle >= 30 and angle < 40):
		coefficient = 0.01
	elif(angle >= 40 and angle < 50):
		coefficient = 0.009
	elif(angle >= 50 and angle < 60):
		coefficient = 0.0087
	elif(angle >= 60 and angle < 70):
		coefficient = 0.0085
	elif(angle >= 70 and angle < 80):
		coefficient = 0.008
	elif(angle >= 80 and angle < 90):
		coefficient = 0.0078
	elif(angle >= 90 and angle < 100):
		coefficient = 0.0074 
	elif(angle >= 100 and angle < 110):
		coefficient = 0.0126	 
	elif(angle >= 110 and angle < 120):
		coefficient = 0.01	 
	elif(angle >= 120 and angle < 130):
		coefficient = 0.0095	 
	elif(angle >= 130 and angle < 140):
		coefficient = 0.0090	 
	elif(angle >= 140 and angle < 150):
		coefficient = 0.0088	 
	elif(angle >= 150 and angle < 160):
		coefficient = 0.0087	 
	elif(angle >= 160 and angle < 170):
		coefficient = 0.0086	 
	elif(angle >= 170 and angle < 180):
		coefficient = 0.0085
	else:
		 coefficient = 0.0085
	print(coefficient)
	return coefficient	
		
	
def m1Start(direction, power) :
	callibratedPower = CALLIBRATION_LEFT*power 
	MOTOR.dcCONFIG(0,1,direction,callibratedPower,2.5)           #configure dc motor 1 on the MOTORplate at address 0 
	MOTOR.dcSTART(0,1)
	
	
def m1StartFast(direction, power) :
	callibratedPower = CALLIBRATION_LEFT*power 
	MOTOR.dcCONFIG(0,1,direction,callibratedPower,0)           #configure dc motor 1 on the MOTORplate at address 0 
	MOTOR.dcSTART(0,1)                                #Start DC motor
	

def m1Stop():
	MOTOR.dcSTOP(0,1)                            #stop the motor

#Finds the number of 60 degree revolutions since the last check	
#def m1Revolutions():
	
	
def m2Start(direction, power) : 
	callibratedPower = CALLIBRATION_LEFT*power 
	MOTOR.dcCONFIG(0,2,direction,callibratedPower,2.5)           #configure dc motor 2 on the MOTORplate at address 0  
	MOTOR.dcSTART(0,2)                                #Start DC motor

def m2StartFast(direction, power) : 
	callibratedPower = CALLIBRATION_LEFT*power 
	MOTOR.dcCONFIG(0,2,direction,callibratedPower,0.0)           #configure dc motor 2 on the MOTORplate at address 0  
	MOTOR.dcSTART(0,2)                                #Start DC motor
	

def m2Stop():
	MOTOR.dcSTOP(0,2)                            #stop the motor
	

def m3Start(direction, power) : 
	callibratedPower = CALLIBRATION_RIGHT*power
	MOTOR.dcCONFIG(0,3,direction,callibratedPower,2.5)           #configure dc motor 3 on the MOTORplate at address 0  
	MOTOR.dcSTART(0,3)                                #Start DC motor

def m3StartFast(direction, power) : 
	callibratedPower = CALLIBRATION_RIGHT*power
	MOTOR.dcCONFIG(0,3,direction,callibratedPower,0.0)           #configure dc motor 3 on the MOTORplate at address 0  
	MOTOR.dcSTART(0,3)                                #Start DC motor

def m3Stop():
	MOTOR.dcSTOP(0,3)                            #stop the motor 3

def m4Start(direction, power) : 
	callibratedPower = CALLIBRATION_RIGHT*power
	MOTOR.dcCONFIG(0,4,direction,callibratedPower,2.5)           #configure dc motor 4 on the MOTORplate at address 0 
	MOTOR.dcSTART(0,4)                                #Start DC motor

def m4StartFast(direction, power) : 
	callibratedPower = CALLIBRATION_RIGHT*power
	MOTOR.dcCONFIG(0,4,direction,callibratedPower,0.0)           #configure dc motor 4 on the MOTORplate at address 0 
	MOTOR.dcSTART(0,4)                                #Start DC motor


def m4Stop():
	MOTOR.dcSTOP(0,4)                            #stop the motor 4
	
def turnRightPivot(angle): 
  m1StartFast('ccw', 100)
  m2StartFast('ccw', 100)
  m3StartFast('cw', 100)
  m4StartFast('cw', 100)
  time.sleep(angle*andle2TimePivotRight(angle))
  m1Stop()
  m2Stop()
  m3Stop()
  m4Stop()
  
def turnLeftPivot(angle): 
  m1StartFast('cw', 100)
  m2StartFast('cw', 100)
  m3StartFast('ccw', 100)
  m4StartFast('ccw', 100)
  time.sleep(angle*andle2TimePivotLeft(angle))
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
  time.sleep(distance*DISTANCE2TIME_FORWARD)
  m1Stop()
  m2Stop()
  m3Stop()
  m4Stop()

def goBackward(distance):
  m1Start('cw', 100)
  m2Start('cw', 100)
  m3Start('cw', 100)
  m4Start('cw', 100)
  time.sleep(distance*DISTANCE2TIME_BACKWARD)
  m1Stop()
  m2Stop()
  m3Stop()
  m4Stop()
  
def goSidewayRight(distance):
	m1Start("ccw", 100)
	m2Start("cw", 100)
	m3Start("cw", 100)  
	m4Start("ccw", 100) 
	time.sleep(distance*DISTANCE2TIME_RIGHT)
	m1Stop()
	m2Stop()
	m3Stop()
	m4Stop()
	

def goSidewayLeft(distance):
	m1Start("cw", 100)
	m2Start("ccw", 100)
	m3Start("ccw", 100)  
	m4Start("cw", 100) 
	time.sleep(distance*DISTANCE2TIME_LEFT)
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
	DEFAULT_DELAY_BETWEEN_COMMANDS = 0.1
	PROLONG_DELAY_BETWEEN_COMMANDS = 5.0;
	
	def __init__(self, aRecord):
		self.record=aRecord
		
	def play(self):
		previousCommand = Command('none')
		command = Command('none')
		while(not self.record.isEmpty()):
			if(command.name != 'none'):
				 previousCommand = command 
			command = self.record.getCommand()
			print(previousCommand)
			if((command.name == 'goForward' and previousCommand.name == 'goBackward') or 
			  (command.name == 'goBackward' and previousCommand.name == 'goForward') or
			  (previousCommand.name == 'turnLeftPivot' or previousCommand.name == 'turnRightPivot')): 
				  print('prolong delay betweeen commands');
				  time.sleep(self.PROLONG_DELAY_BETWEEN_COMMANDS)
				  
				  
			if(command.name == 'goBackward'):
				goBackward(command.value)
				time.sleep(self.DEFAULT_DELAY_BETWEEN_COMMANDS) # This sleep is very important as it allows to switch motor controller context I guess
			elif(command.name == 'goForward'):
				goForward(command.value)
				time.sleep(self.DEFAULT_DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'turnLeftPivot'):
				turnLeftPivot(command.value)
				time.sleep(self.DEFAULT_DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'turnRightPivot'):
				turnRightPivot(command.value)
				time.sleep(self.DEFAULT_DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'turnRightSimple'):
				turnRightSimple(command.value)
				time.sleep(self.DEFAULT_DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'turnLeftSimple'):
				turnLeftSimple(command.value)
				time.sleep(self.DEFAULT_DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'goSidewayLeft'):
				goSidewayLeft(command.value)
				time.sleep(self.DEFAULT_DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'goSidewayRight'):
				goSidewayRight(command.value)
				time.sleep(self.DEFAULT_DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'fire'):
				#empty command for now
				time.sleep(self.DELAY_BETWEEN_COMMANDS)
			elif(command.name == 'none'): # in case the turn is not neccessary it is still good to keep a command in the Record
				time.sleep(self.DEFAULT_DELAY_BETWEEN_COMMANDS)	
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
		
		turnCommand = Command('none')
		moveCommand = Command('none')
		turnBackCommand = Command('none')
		distance = 0
		if(abs(width) < 25 and abs(length) > 25):
			moveCommand.name = 'goBackward'
			if(length < 0):
				 moveCommand.name = 'goForward'
			moveCommand.value = abs(length)*MILLISPERSEC
		elif(abs(width) > 25 and abs(length) < 25):
			moveCommand.name = 'goSidewayRight'
			if(width < 0):
				 moveCommand.name = 'goSidewayLeft'
			moveCommand.value = abs(width)*MILLISPERSEC
		else:
			distance = math.sqrt(width**2+length**2) # calculating how long shall we go if there is an angle
			absWidth = abs(width)
			sine = absWidth/distance 
			angleInRadians = math.asin(sine)	
			angleInDegrees = math.degrees(angleInRadians)
			moveCommand.value = distance*MILLISPERSEC; # Turnrng pixels in millimeters
			turnCommand.value = angleInDegrees
			
			moveCommand.name = 'goBackward'
			if(length < 0):
				moveCommand.name = 'goForward'
			if(width > 0):
				if(moveCommand.name == 'goBackward'): # Swapping right and letf turns if going backward
					turnCommand.name = 'turnLeftPivot'
				else:		
					turnCommand.name = 'turnRightPivot'
			elif(width < -23):
				if(moveCommand.name == 'goBackward'): # Swapping right and letf turns if going backward
					turnCommand.name = 'turnRightPivot'
				else:
					turnCommand.name = 'turnLeftPivot'

			turnBackCommand.value = 'turnRightPivot'
			if(turnCommand.name == 'turnRightPivot'):
				 turnBackCommand.value = 'turnLeftPivot' 
			turnBackCommand.value = turnCommand.value
		
		self.record.addCommand(turnCommand)
		self.record.addCommand(moveCommand)
		self.record.addCommand(turnBackCommand)
		# fire command should be here maybe but not too sure
		
		
		
	
'''jsonAsString = '{"Command":"coords","Payload":[{"x":330,"y":946},{"x":397.40714285714284,"y":644.7902719550473}],"token":"dd7bac0f-b441-47a7-8aa0-91e656527849"}'
jsonAsStr1= '{"Command":"coords","Payload":[{"x":330,"y":946},{"x":330,"y":300}],"token":"74331cb9-6a7f-4187-aeb1-55cfa6c3b158"}'
jsonAsObj = json.loads(jsonAsStr1)

record = Record();
tapeRecorder = TapeRecorder(record)
tapeRecorder.addRecord(jsonAsObj)
recordPlayer = RecordPlayer(record)
recordPlayer.play();



				
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



				








