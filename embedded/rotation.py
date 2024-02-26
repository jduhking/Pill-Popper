import time
from machine import Pin
from servo import Servo

# Define constants
DELAY_MS = 25
STEP_DELAY = 0.002
MAX_STEPS = [1000, 2000, 3000, 4000, 5000, 6000, 7000]

# Initialize components
door_servo = Servo(pin_id=16)
vac_servo = Servo(pin_id=18)
stepper_pins = [Pin(pin_id, Pin.OUT) for pin_id in [12, 13, 14, 15]]
relay = Pin(17, Pin.OUT)
step_sequence = [
    [1, 0, 0, 1],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
]

def step(direction, steps):
    global step_index
    for _ in range(steps):
        step_index = (step_index + direction) % len(step_sequence)
        for pin_index, pin in enumerate(stepper_pins):
            pin.value(step_sequence[step_index][pin_index])
        time.sleep(STEP_DELAY)

def dispense(slot, quantity):
    print('dispensing pill at slot: ', slot, ' with quantity: ', quantity)
    #for _ in range(quantity):
        
#         step(1, slot)
        
       # for position in range(0, 180, 1):
            #door_servo.write(position)
            #vac_servo.write(position)
            #time.sleep_ms(DELAY_MS)
        #relay.value(0)
       # for position in reversed(range(0, 180, 1)):
           #vac_servo.write(position)
           # time.sleep_ms(DELAY_MS)
        #for position in reversed(range(0, 180, 1)):
            #door_servo.write(position)
            #time.sleep_ms(DELAY_MS)
       # step(-1, slot)  # Corrected from steps to slot
       # for position in range(0, 180, 1):
            #door_servo.write(position)
            #vac_servo.write(position)
            #time.sleep_ms(DELAY_MS)
        #relay.value(1)
       # for position in reversed(range(0, 180, 1)):
           # vac_servo.write(position)
           # time.sleep_ms(DELAY_MS)

step_index = 0
#number = int(input("Enter a number: "))

#if 1 <= number <= 7:
    #time.sleep(10)
  #  dispense(MAX_STEPS[number-1], 1)
#else:
   # print("Invalid number entered. Please enter a number between 1 and 7.")

