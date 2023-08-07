import signal                   
import sys
import RPi.GPIO as GPIO
BUTTON_GPIO = 23

number_of_singnals = 0;

def hallSensorCallback(channel):
	number_of_singnals += 1

def signal_handler(sig, frame):
	GPIO.cleanup(23)
	sys.exit(0)


if __name__ == '__main__':

	GPIO.setmode(GPIO.BCM)
	GPIO.setup(BUTTON_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    
	GPIO.add_event_detect(BUTTON_GPIO, GPIO.BOTH, callback=hallSensorCallback, bouncetime=5)
    
	signal.signal(signal.SIGINT, signal_handler)
	signal.pause()
