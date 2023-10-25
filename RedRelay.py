import RPi.GPIO as GPIO
import time

def convertBoolIntoGPIO(input):
	if(input): return GPIO.HIGH
	else: return GPIO.LOW

# Return the current time in millis
def currentMillisTime():
    return round(time.time() * 1000)	

''' There are two red relayes currently engaged into the process
relay contacted  to RPi #4 located in upper position and RPi #5 
located lower
'''
class RedRelay:
	onOff = False
	pinNumber = 0
# Currently pinNumber can be either 4 that controls motors 3 and 4 and 
# valie 5 that controls motors 1 and 2 (left side)	
	def __init__(self, aPinNumber):
		GPIO.setwarnings(False)
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(aPinNumber, GPIO.OUT)
		self.pinNumber = aPinNumber
		
	def on(self):
		if(self.onOff): return
		self.onOff = not(self.onOff)
		GPIO.output(self.pinNumber, self.onOff)
		self.onOff = True

	def off(self):
		if(not(self.onOff)): return
		self.onOff = not(self.onOff)
		print('self.onOff')
		print(self.onOff)
		GPIO.output(self.pinNumber, self.onOff)
		self.onOff = False
		
	def isOn(self):
		return self.onOff
	
	def isOff(self):
		return not(self.OnOff)
		
if __name__ == '__main__':
		

	relay5 = RedRelay(5)
	relay5.on()
	time.sleep(10)
	relay5.off()
