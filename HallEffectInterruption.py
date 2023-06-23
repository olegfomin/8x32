import RPi.GPIO as GPIO
import threading
import time

class HallEffectInterruption:
	PRINT_INTERVAL = 5.5
	
	gpioNumber = 0
	pressedCounter=0
	releasedCounter=0
	wasCalled = False
	amIPressed = False
	
	def __init__(self, gpioNumber, doIPrintValues=False, onChange=None):
		self.gpioNumber = gpioNumber
		self.printerThreading = threading.Thread(target=self.printValues, daemon=True)
		self.doIPrintValues = doIPrintValues;
		self.onChange = onChange;
		

	def signal_handler(self, sig, frame):
		GPIO.cleanup(self.gpioNumber)
		sys.exit(0)
	def hallSensorCallback(self, channel):
		if(not self.wasCalled and self.doIPrintValues):
			self.printerThreading.start();
			self.wasCalled = True
		if(not GPIO.input(self.gpioNumber)):
			self.amIPressed = True
			self.pressedCounter+=1
		else:
			self.amIPressed = False
			self.releasedCounter+=1
		if(not self.onChange == None):
			 self.onChange(self.amIPressed, self.pressedCounter, self.releasedCounter)
				
	def printValues(self):
		while True:
			print("Engine number="+str(self.gpioNumber))
			print(self.pressedCounter)
			print(self.releasedCounter)
			print(self.amIPressed)
			time.sleep(self.PRINT_INTERVAL)


