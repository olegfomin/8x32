import time

class Motor:
	number = 0
	amIPressed = False
	pressedCounter = 0
	releasedCounter = 0
	lastUpdateMillis = 0
	
	def __init__(self, number):
		self.number = number
		timeAsObj = time.gmtime(0)
		epoch = time.asctime(timeAsObj)
		self.lastUpdateMillis = round(time.time()*1000)
		
	def __init__(self, number, amIPressed, pressedCounter, releasedCounter):
		__init__(self, number)
		self.amIPressed = amIPressed
		self.pressedCounter = pressedCounter
		self.releasedCounter = releasedCounter
		
	def setAmIPressed(self, aPressed):
		self.amIPresed = aPressed

	def incPressedCounter(self):
		self.pressedCounter += 1

	def incReleasedCounter(self):
		self.releasedCounter = +1


	def __eq__(self, other):
		if not isinstance(other, MyClass):
			return False
		return	self.number==other.number and \
				self.amIPressed==other.amIPressed and \
				self.pressedCounter==other.pressedCounter and \
				self.releasedCounter==other.releasedCounter
	def __str__(self):
		return 'Motor {number="'+str(self.number)+'", amIPressed="'+ \
				str(self.amIPressed)+'", pressedCounter="' + \
				str(self.pressedCounter)+'", releasedCounter="'+ \
				str(self.releasedCounter)+'",lastUpdatedMillis="'+ \
				str(self.lastUpdateMillis)+'"previousUpdateMillis="'+ \
				str(self.previousUpdateMillis)+'"}'
