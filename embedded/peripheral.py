import aioble
import asyncio
import bluetooth
from aioble import DeviceDisconnectedError
import struct

_ADV_INTERVAL_US = const(250000)

DISPENSE_UUID = bluetooth.UUID("6fc3d9ab-3aef-4012-9456-15b0861e1139")
DISPENSE_CHAR = bluetooth.UUID("10e6cc59-b033-48e8-bcf4-70390d05be0e")

dispense_service = aioble.Service(DISPENSE_UUID)
dispense_char = aioble.Characteristic(dispense_service, DISPENSE_CHAR, write=True,read=True, notify=True, capture=True)

aioble.register_services(dispense_service)


async def handle_data(data):
    try:
        # Parse JSON data
        print("data is of type: ", type(data))
        print("struct: ", struct.unpack('<li', data))
        slot_number, dispense_amount = struct.unpack('<ii', data)
        # Perform the dispense task here using dispense_data
        print("Dispensing from slot:", slot_number, "Amount:", dispense_amount)
        # call dispense function
        # Example: call a function to dispense the pill based on dispense_data
    except Exception as e:
        print("Error receiving data: ", e)
    
async def peripheral():
    while True:
        print("Starting advertising")
        async with await aioble.advertise(
            _ADV_INTERVAL_US,
            name="mpy-pill-popper",
            services=[DISPENSE_UUID],
        ) as connection:
            print("Connection from", connection.device)
            while True:
                try:
                    #print("waiting for data")
                    (c, data) = await dispense_char.written()
                    if data:
                        print("received data", data)
                        await handle_data(data)
                except DeviceDisconnectedError:
                    print("Disconnected")
                    
                

async def main():
    dispense_task = asyncio.create_task(peripheral())
    await asyncio.gather(dispense_task)

asyncio.run(main())
