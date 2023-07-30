import signal                   
import sys
import RPi.GPIO as GPIO
BUTTON_GPIO = 24

from HallEffectInterruption import HallEffectInterruption

if __name__ == '__main__':

	hallEffectInterruption = HallEffectInterruption(BUTTON_GPIO)
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(BUTTON_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    
	GPIO.add_event_detect(BUTTON_GPIO, GPIO.BOTH, callback=hallEffectInterruption.hallSensorCallback, bouncetime=5)
    
	signal.signal(signal.SIGINT, hallEffectInterruption.signal_handler)
	signal.pause()
