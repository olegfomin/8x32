import time                                  #import the time module
import piplates.MOTORplate as MOTOR          #import the MOTORplate module
import queue


# Implementing the command pattern that encapsulates all the dencapsulate
# in an object all the data required for performing a given action (command), 
# including what method to call, the method's arguments, and the object to which the method belongs

CLOCK_WISE = 1
COUNTER_CLOCK_WISE = -1
TURN_COEFFICIENT_PIVOT = 0.005 # This value needs to be resolved empirically or it may be even a function
TURN_COEFFICIENT_SIMPLE = 0.004
ANGLE2TIME=0.002
CALLIBRATION_LEFT  = 1.0
CALLIBRATION_RIGHT = 1.0
DISTANCE2TIME=0.001


class Motor():
	exPower=0 # previous power
	exDirection=0 # previous direction
	wasUsedOnce = False
	# Takes a motor number from 1 to 4 and acceleration in seconds
	def __init__(self, number, acceleration):
		if(number <=0 or number > 4): raise Exception("The motor number should be between 1 and 4")
		self.number=number # The engine number from 1 to 4
		self.acceleration = acceleration
		
	def resolveDirection(self, direction):
		if(direction > 0): # Here it is supposed to be the othe way around but I am too lazy to move wiring
			 return 'cww'
		else:
			 return 'cw'
			 
	def delay(self, power, direction):
		print(power)
		if(self.wasUsedOnce and (power != self.exPower or direction != self.exDirection)):
			time.sleep(0.1) # Allows some time for MOTOR.dcCONFIG(...) to do its business otherwise it behaves funky  

			
	# power is from 0 to 100, direction clockwise - positive number; counter clock wise - negative number
	def move(self, power, direction):
		if(direction == 0): raise Exception("The motor direction must be either negative or positive")
		channel = 0
		motorNumber = self.number
		directionAsStr = self.resolveDirection(direction)
		motorPower = power
		motorAcceleration = self.acceleration
		self.delay(power, direction)
		MOTOR.dcCONFIG(channel, self.number, directionAsStr, power, self.acceleration)
		MOTOR.dcSTART(channel, self.number)
        
	def changeSpeed(self, newPower):    
		MOTOR.dcSPEED(0,self.number,newPower) #change the power
        
	def brake(self):
		MOTOR.dcSTOP(0,self.number) #stop the motor
                
	
#The wheels 1,2 going one way and wheels 3,4 the oposite way
#With the big battery on the top it does not work
#It needs to be removed to show this behaviour with
#the lighter machine  
class PivotSteerCommand:
	motor = [Motor(1, 2.1), Motor(2, 2.1), Motor(3, 2.1), Motor(4, 2.1)]  

	def __init__(self, angle, direction): # angle value that can be from 0 to 180
		self.duration = TURN_COEFFICIENT_PIVOT*angle
		self.direction = direction
		
	def execute(self):
		self.motor[0].move(100,self.direction)
		self.motor[1].move(100,self.direction)
		self.motor[2].move(100,-self.direction)
		self.motor[3].move(100,-self.direction)
		time.sleep(self.duration)
		self.motor[3].brake()
		self.motor[2].brake()
		self.motor[1].brake()
		self.motor[0].brake()
		
#moveStraightCommand = MoveStraightCommand(5000)
#moveStraightCommand.execute()
		
		
#pivotSteerCommand = PivotSteerCommand(20000, CLOCK_WISE)		
#pivotSteerCommand.execute()

# the wheels 1,2 goes full steam ahead and 3, 4 very slowly going ahead in order not to stall
# the turn completely 		  		
class SimpleTurnCommand:		  		
	motor = [Motor(1, 2.1), Motor(2, 2.1), Motor(3, 2.1), Motor(4, 2.1)]
	
	def __init__(self, angle, direction): # angle value that can be from 0 to 180
		self.duration = TURN_COEFFICIENT_SIMPLE*angle
		self.direction = direction
		self.multiplier12=0
		self.multiplier34=0
		if(direction > 0): # clock wise
			self.multiplier12=1
			self.multiplier34=0.08
		if(direction < 0): # counter clock wise
			self.multiplier12=0.08
			self.multiplier34=1
		
	def execute(self):
		self.motor[0].move(100*self.multiplier12,self.direction)
		self.motor[1].move(100*self.multiplier12,self.direction)
		time.sleep(10)
		self.motor[2].move(100*self.multiplier34,self.direction)
		self.motor[3].move(100*self.multiplier34,self.direction)
		time.sleep(self.duration)
		self.motor[3].brake()
		self.motor[2].brake()
		self.motor[1].brake()
		self.motor[0].brake()
		
		
simpleTurnCommand = SimpleTurnCommand(15000, CLOCK_WISE)
#simpleTurnCommand.execute()

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
  

#turnRightPivot(36)

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
	def __init__(self, name, value):
		self.name = name
		self.value = value


class Record:
	commandsQueue = queue.Queue()

	def addCommand(self, aCommand):
		self.commandsQueue.put(aCommand)
		
	def	getCommand(self):
		return self.commandsQueue.get()
		
	def isEmpty(self):
		return 	self.commandsQueue.empty()
		
class RecordPlayer:
		
	def play(self, record):
		while not record.isEmpty():
			command = record.getCommand()
			if(command.name == 'goBackward'):
				goBackward(command.value)
				time.sleep(0.1)
			elif(command.name == 'goForward'):
				goForward(command.value)
				time.sleep(0.1)
			elif(command.name == 'turnLeftPivot'):
				turnLeftPivot(command.value)
				time.sleep(0.1)
			elif(command.name == 'turnRightPivot'):
				turnRightPivot(command.value)
				time.sleep(0.1)
			elif(command.name == 'turnRightSimple'):
				turnRightSimple(command.value)
				time.sleep(0.1)
			elif(command.name == 'turnLeftSimple'):
				turnLeftSimple(command.value)
				time.sleep(0.1)
			else:
				raise('Unknown command: '+ command.value)
				
record = Record()				
record.addCommand(Command('goBackward', 10000))
record.addCommand(Command('turnLeftPivot', 60))
record.addCommand(Command('goForward', 7000))
record.addCommand(Command('turnRightPivot', 80))
record.addCommand(Command('goBackward', 9000))
record.addCommand(Command('turnRightSimple', 80))
record.addCommand(Command('turnLeftSimple', 35))

recordPlayer = RecordPlayer()
recordPlayer.play(record)



				








