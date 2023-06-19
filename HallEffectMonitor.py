import time
from HallEffectInterruption import HallEffectInterruption
import threading
import signal    
import RPi.GPIO as GPIO
M1_GPIO = 23
M2_GPIO = 24
M3_GPIO = 27
M4_GPIO = 3

class HallEffectMonitor:
	
	motorLastRequest = []
	motorCurrent = []
	
	def __init__(self, onStateChange):
		self.onAnyChange = onAnyChange
		self.signalThreading = threading.Thread(target=self.signalHolder, daemon=True)
		self.signalThreading.start()
		timeAsObj = time.gmtime(0)
		epoch = time.asctime(timeAsObj)
		curr_time = round(time.time()*1000)
		
		self.motor1 = Motor(1)  
		self.motor2 = Motor(2)  
		self.motor3 = Motor(3)
		self.motor4 = Motor(4)

		self.hallEffectInterruptionM1 = HallEffectInterruption(M1_GPIO, False, self.onM1Change)
		self.hallEffectInterruptionM2 = HallEffectInterruption(M2_GPIO, False, self.onM2Change)
		self.hallEffectInterruptionM3 = HallEffectInterruption(M3_GPIO, False, self.onM3Change)
		self.hallEffectInterruptionM4 = HallEffectInterruption(M3_GPIO, False, self.onM4Change)
	
	def onM1Change(self,amIPressed, pressedCounter, releasedCounter):
		newMotor = Motor(1)
		newMotor = self.amIPressed
		newMotor = self.pressedCounter
		newMotor = self.releasedCounter
		if(not self.onStateChange == None and not newMotor == self.motor1):
			 self.motor1 = newMotor
			 onStateChange(State([self.motor1, self.motor2, self.motor3, self.motor4], 0))
		
	def onM2Change(self,amIPressed, pressedCounter, releasedCounter):
		newMotor = Motor(2)
		newMotor = self.amIPressed
		newMotor = self.pressedCounter
		newMotor = self.releasedCounter
		if(not self.onStateChange == None and not newMotor == self.motor2):
			self.motor2 = newMotor
			onStateChange(State([self.motor1, self.motor2, self.motor3, self.motor4], 1))
																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												
	def onM3Change(self,amIPressed, pressedCounter, releasedCounter):
		newMotor = Motor(3)
		newMotor = self.amIPressed
		newMotor = self.pressedCounter
		newMotor = self.releasedCounter
		if(not self.onStateChange == None and not newMotor == self.motor3):
			self.motor3 = newMotor 
			onStateChange(State([self.motor1, self.motor2, self.motor3, self.motor4],2))

	def onM4Change(self, amIPressed, pressedCounter, releasedCounter):
		newMotor = Motor(4)
		newMotor = self.amIPressed
		newMotor = self.pressedCounter
		newMotor = self.releasedCounter
		if(not self.onStateChange == None and not newMotor == self.motor4):
			self.motor4 = newMotor 
			onStateChange(State([self.motor1, self.motor2, self.motor3, self.motor4],3))
			
class Motor:
	number = 0
	amIPressed = False
	pressedCounter = 0
	releasedCounter = 0
	
	def __init__(self, number):
		self.number = number

	def __eq__(self, other):
		if not isinstance(other, MyClass):
			return False
		return	self.number==other.number and \
				self.amIPressed==other.amIPressed and \
				self.pressedCounter==other.pressedCounter and \
				self.releasedCounter==other.releasedCounter
	def __str__(self):
		return 'Motor {number="'+str(self.number)+', amIPressed="'+ \
				str(self.amIPressed)+'", pressedCounter="' + \
				str(self.pressedCounter)+'", releasedCounter="'+ \
				str(self.releasedCounter)+'"}'

#Contains an array of motors where an index is the motor number minus 1
#plus contains index number for the motor that has just changed 
#changed the last
class State:
	motorArray = []
	lastChangedMotorIndex = -1
	
	def __init__(motorArray, lastIndex):
		self.motorArray = motorArray
		self.lastChangedMotorIndex
	def __str__(self):
		arrayContent='[';
		for motor in self.motorArray:
			arrayContent += motor+',"'
		arrayContent += "]"
		arrayContent=arrayContent.replace(",]", "]");
		allTogether = 'State {motorArray='+arrayContent+ \
		              ',lastChangedIndex="'+lastChangedMotorIndex+'"}' 
		return 	
	
	
				
				
		
hallEffectMonitor = HallEffectMonitor(None) 	

GPIO.setmode(GPIO.BCM)
GPIO.setup(M1_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(M2_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(M3_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(M4_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)

GPIO.add_event_detect(M1_GPIO, GPIO.BOTH, callback=hallEffectMonitor.hallEffectInterruptionM1.hallSensorCallback, bouncetime=5)
GPIO.add_event_detect(M2_GPIO, GPIO.BOTH, callback=hallEffectMonitor.hallEffectInterruptionM2.hallSensorCallback, bouncetime=5)
GPIO.add_event_detect(M3_GPIO, GPIO.BOTH, callback=hallEffectMonitor.hallEffectInterruptionM3.hallSensorCallback, bouncetime=5)
GPIO.add_event_detect(M4_GPIO, GPIO.BOTH, callback=hallEffectMonitor.hallEffectInterruptionM4.hallSensorCallback, bouncetime=5)

signal.signal(signal.SIGINT, hallEffectMonitor.hallEffectInterruptionM1.signal_handler)

if __name__ == '__main__':
	signal.pause()
	



	 
