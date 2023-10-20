import time
from RedRelay import RedRelay

class Throthle:
	redRelay: None
	
	def __init__(self, aRedRelay):
		self.redRelay = aRedRelay

	''' Plays with the relay's on/off position to regulate motors speed 
		This should usually be used as a small corrective actions on
		the route to the goal'''	
	def rattle(self, aTotalDuration, aNumberOfHalts, aHaltDuration):
		totalHaltDuration = aNumberOfHalts*aHaltDuration 
		totalEngageDuration = aTotalDuration-totalHaltDuration
		stepOnDuration = totalEngageDuration/aNumberOfHalts
		stepOffDuration = totalHaltDuration/aNumberOfHalts
		while(aTotalDuration > 0):
			self.redRelay.on()
			time.sleep(stepOnDuration) # Sleep time for usually a long motor engagement
			self.redRelay.off()
			aTotalDuration -= stepOnDuration
			time.sleep(stepOffDuration) # Sleep time for usually a short motor halts
			aTotalDuration -= stepOffDuration
	
	
	
if __name__ == '__main__':
		
	relay4 = RedRelay(4)
	throthle = Throthle(relay4)
	throthle.rattle(10, 10, 0.02)
