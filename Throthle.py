import time
from RedRelay import RedRelay

class Throthle:
	redRelay: None
	numberOfHalts = 1
	haltDuration =20
	totalDuration = 10 
	
	def __init__(self, aRedRelay, aNumberOfHalts, aHaltDuration):
		self.redRelay = aRedRelay
		self.numberOfHalts = aNumberOfHalts
		self.haltDuration = aHaltDuration
		
	def setTotalDuration(self, aTotalDuration):
		self.totalDuration = aTotalDuration
		

	''' Plays with the relay's on/off position to regulate motors speed 
		This should usually be used as a small corrective actions on
		the route to the goal'''	
	def rattle(self):	
		totalHaltDuration = self.numberOfHalts*self.haltDuration 
		totalEngageDuration = self.totalDuration-totalHaltDuration
		stepOnDuration = totalEngageDuration/self.numberOfHalts
		stepOffDuration = totalHaltDuration/self.numberOfHalts
		while(self.totalDuration > 0):
			self.redRelay.on()
			time.sleep(stepOnDuration) # Sleep time for usually a long motor engagement
			self.redRelay.off()
			self.totalDuration -= stepOnDuration
			time.sleep(stepOffDuration) # Sleep time for usually a short motor halts
			self.totalDuration -= stepOffDuration
	
	
	
if __name__ == '__main__':
	relay4 = RedRelay(4)
	throthle = Throthle(relay4, 1, 0)
	throthle.setTotalDuration(40)
	throthle.rattle()
