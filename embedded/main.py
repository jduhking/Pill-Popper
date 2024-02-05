"""
A simple example that sweeps a Servo back-and-forth
Requires the micropython-servo library - https://pypi.org/project/micropython-servo/
"""

import time
from machine import Pin
from servo import Servo

# Create our Servo object, assigning the
# GPIO pin connected the PWM wire of the servo
my_servo = Servo(pin_id=16)
relay = Pin(17, Pin.OUT)

delay_ms = 25  # Amount of milliseconds to wait between servo movements

while True:
    relay.value(0)
    for position in range(0, 90):  # Step the position forward from 0deg to 180deg
        print(position)  # Show the current position in the Shell/Plotter
        my_servo.write(position)  # Set the Servo to the current position
        time.sleep_ms(delay_ms)  # Wait for the servo to make the movement
    relay.value(1)
    for position in reversed(range(0, 90)):  # Step the position reverse from 180deg to 0deg
        print(position)  # Show the current position in the Shell/Plotter
        my_servo.write(position)  # Set the Servo to the current position
        time.sleep_ms(delay_ms)  # Wait for the servo to make the movement    