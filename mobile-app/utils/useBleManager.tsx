import { useAppStore } from "../state/store";
import BleManager, {
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral,
  } from 'react-native-ble-manager';
const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;
  
const useBleManager = () => {
    const setIsScanning = useAppStore((state) => state.setIsScanning);
    const isScanning = useAppStore((state) => state.isScanning);
    const setPeripherals = useAppStore((state) => state.setPeripherals);
    const peripherals = useAppStore((state) => state.peripherals);
    const setConnectedDispenser = useAppStore((state) => state.setConnectedDispenser)
    const connectedDispenser = useAppStore((state) => state.connectedDispenser);

    const sleep = (ms: number) => {
      return new Promise<void>(resolve => setTimeout(resolve, ms));
    }

    const startScan = () => {
        if (!isScanning) {
          // reset found peripherals before scan
          setPeripherals(new Map<Peripheral['id'], Peripheral>());
      
          try {
            console.debug('[startScan] starting scan...');
            setIsScanning(true);
            BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
              matchMode: BleScanMatchMode.Sticky,
              scanMode: BleScanMode.LowLatency,
              callbackType: BleScanCallbackType.AllMatches,
            })
              .then(() => {
                console.debug('[startScan] scan promise returned successfully.');
              })
              .catch((err: any) => {
                console.error('[startScan] ble scan returned in error', err);
              });
          } catch (error) {
            console.error('[startScan] ble scan error thrown', error);
          }
        }
      };

    const stopScan = () => {
      setIsScanning(false);
      console.debug('[handleStopScan] scan is stopped.');
    };

    

    const connectPeripheral = async (peripheral: Peripheral) => {
      try {
        if (peripheral) {
          let temp = peripherals
          let p = temp.get(peripheral.id);
          if (p) {
            p.connecting = true;
            temp = new Map(temp.set(p.id, p));
          }
          setPeripherals(temp);
    
          await BleManager.connect(peripheral.id);
          console.debug(`[connectPeripheral][${peripheral.id}] connected.`);
    
          temp = peripherals
          let q = temp.get(peripheral.id)
    
          if (q) {
            q.connecting = false;
            q.connected = true;
            temp = new Map(temp.set(q.id, q));
          }
          setPeripherals(temp);
    
          // before retrieving services, it is often a good idea to let bonding & connection finish properly
          await sleep(900);
    
          /* Test read current RSSI value, retrieve services first */
          const peripheralData = await BleManager.retrieveServices(peripheral.id);
          console.debug(
            `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
            peripheralData,
          );
    
          const rssi = await BleManager.readRSSI(peripheral.id);
          console.debug(
            `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
          );
    
          if (peripheralData.characteristics) {
            for (let characteristic of peripheralData.characteristics) {
              if (characteristic.descriptors) {
                for (let descriptor of characteristic.descriptors) {
                  try {
                    let data = await BleManager.readDescriptor(
                      peripheral.id,
                      characteristic.service,
                      characteristic.characteristic,
                      descriptor.uuid,
                    );
                    console.debug(
                      `[connectPeripheral][${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                      data,
                    );
                  } catch (error) {
                    console.error(
                      `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                      error,
                    );
                  }
                }
              }
            }
          }
          temp = peripherals
          let z = temp.get(peripheral.id)
          if (z) {
            z.rssi = rssi
            temp = new Map(temp.set(z.id, z))
          }
          setPeripherals(temp);
        }
      } catch (error) {
        console.error(
          `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
          error,
        );
      }
    };
    const togglePeripheralConnection = async (peripheral: Peripheral) => {
      if (peripheral && peripheral.connected) {
        try {
          await BleManager.disconnect(peripheral.id);
          setConnectedDispenser(undefined)
        } catch (error) {
          console.error(
            `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
            error,
          );
        }
      } else {
        console.log('attempting to connect to peripheral')
        setConnectedDispenser(peripheral)
        await connectPeripheral(peripheral);
      }
    };


    return {
        togglePeripheralConnection,
        startScan, 
        stopScan,

    }
}

export default useBleManager;