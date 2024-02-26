
import React, { useState, useEffect } from 'react'
import Colors from '../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Separator from '../../components/separator'
import ActionButton from '../../components/buttons/action-button'
import { useRouter } from 'expo-router'
import { Buffer } from 'buffer'
import {
  StyleSheet,
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  TouchableHighlight,
} from 'react-native';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
import { screenHeight } from '../../utils/dimensions';
import { DispenseObject } from '../../models/dispense-service'

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const BluetoothPairingScreen = () => {
    const { top } = useSafeAreaInsets();
    const router = useRouter();

    const handleFindDevices = () => {
        router.push('/(tabs)')
    }
    const BleManagerModule = NativeModules.BleManager;
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  
      const [isScanning, setIsScanning] = useState(false);
      const [peripherals, setPeripherals] = useState(
        new Map<Peripheral['id'], Peripheral>(),
      );
    
      const [connectedDispenser, setConnectedDispenser] = useState<string>();
        //console.debug('peripherals map updated', [...peripherals.entries()]);
    
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
    
      const handleStopScan = () => {
        setIsScanning(false);
        console.debug('[handleStopScan] scan is stopped.');
      };
    
      const handleDisconnectedPeripheral = (
        event: BleDisconnectPeripheralEvent,
      ) => {
        console.debug(
          `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
        );
        setPeripherals(map => {
          let p = map.get(event.peripheral);
          if (p) {
            p.connected = false;
            return new Map(map.set(event.peripheral, p));
          }
          return map;
        });
      };
    
      const handleConnectPeripheral = (event: any) => {
        // console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
      };
    
      const handleUpdateValueForCharacteristic = (
        data: BleManagerDidUpdateValueForCharacteristicEvent,
      ) => {
        console.debug(
          `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
        );
      };
    
      const handleDiscoverPeripheral = (peripheral: Peripheral) => {
        // console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
        if (!peripheral.name) {
          peripheral.name = 'NO NAME';
        }
        setPeripherals(map => {
          return new Map(map.set(peripheral.id, peripheral));
        });
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
          await connectPeripheral(peripheral);
          setConnectedDispenser(peripheral.id)
        }
      };
    
      const retrieveConnected = async () => {
        try {
          const connectedPeripherals = await BleManager.getConnectedPeripherals();
          if (connectedPeripherals.length === 0) {
            console.warn('[retrieveConnected] No connected peripherals found.');
            return;
          }
    
          console.debug(
            '[retrieveConnected] connectedPeripherals',
            connectedPeripherals,
          );
    
          for (var i = 0; i < connectedPeripherals.length; i++) {
            var peripheral = connectedPeripherals[i];
            setPeripherals(map => {
              let p = map.get(peripheral.id);
              if (p) {
                p.connected = true;
                return new Map(map.set(p.id, p));
              }
              return map;
            });
          }
        } catch (error) {
          console.error(
            '[retrieveConnected] unable to retrieve connected peripherals.',
            error,
          );
        }
      };
    
      const connectPeripheral = async (peripheral: Peripheral) => {
        try {
          if (peripheral) {
            setPeripherals(map => {
              let p = map.get(peripheral.id);
              if (p) {
                p.connecting = true;
                return new Map(map.set(p.id, p));
              }
              return map;
            });
    
            await BleManager.connect(peripheral.id);
            console.debug(`[connectPeripheral][${peripheral.id}] connected.`);
    
            setPeripherals(map => {
              let p = map.get(peripheral.id);
              if (p) {
                p.connecting = false;
                p.connected = true;
                return new Map(map.set(p.id, p));
              }
              return map;
            });
    
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
    
            setPeripherals(map => {
              let p = map.get(peripheral.id);
              if (p) {
                p.rssi = rssi;
                return new Map(map.set(p.id, p));
              }
              return map;
            });
          }
        } catch (error) {
          console.error(
            `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
            error,
          );
        }
      };
    
      function sleep(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
      }
    
      useEffect(() => {
        try {
          BleManager.start({showAlert: false})
            .then(() => console.debug('BleManager started.'))
            .catch((error: any) =>
              console.error('BeManager could not be started.', error),
            );
        } catch (error) {
          console.error('unexpected error starting BleManager.', error);
          return;
        }
    
        const listeners = [
          bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            handleDiscoverPeripheral,
          ),
          bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
          bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            handleDisconnectedPeripheral,
          ),
          bleManagerEmitter.addListener(
            'BleManagerDidUpdateValueForCharacteristic',
            handleUpdateValueForCharacteristic,
          ),
          bleManagerEmitter.addListener(
            'BleManagerConnectPeripheral',
            handleConnectPeripheral,
          ),
        ];
    
        handleAndroidPermissions();
    
        return () => {
          console.debug('[app] main component unmounting. Removing listeners...');
          for (const listener of listeners) {
            listener.remove();
          }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      const handleAndroidPermissions = () => {
        if (Platform.OS === 'android' && Platform.Version >= 31) {
          PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]).then(result => {
            if (result) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permissions android 12+',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permissions android 12+',
              );
            }
          });
        } else if (Platform.OS === 'android' && Platform.Version >= 23) {
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(checkResult => {
            if (checkResult) {
              console.debug(
                '[handleAndroidPermissions] runtime permission Android <12 already OK',
              );
            } else {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              ).then(requestResult => {
                if (requestResult) {
                  console.debug(
                    '[handleAndroidPermissions] User accepts runtime permission android <12',
                  );
                } else {
                  console.error(
                    '[handleAndroidPermissions] User refuses runtime permission android <12',
                  );
                }
              });
            }
          });
        }
      };



      const handleDispense = async (dispenseObject: DispenseObject) => {

        if(!connectedDispenser){
          console.log('No dispenser connected to')
          
          return
        }
    
        const DISPENSE_SERVICE_UUID: string = '6fc3d9ab-3aef-4012-9456-15b0861e1139'
        const DISPENSE_CHARACTERISTIC_UUID: string = '10e6cc59-b033-48e8-bcf4-70390d05be0e'
    
    
        console.log('Dispense!')
        // Send data
        const data = 'Dispense that jawn!'
        
          // Serialize the dispenseObject into a byte array
        const buffer = Buffer.alloc(8); // Assuming slotNumber and dispenseAmount are both 4-byte integers
        buffer.writeInt32LE(dispenseObject.slotNumber, 0);
        buffer.writeInt32LE(dispenseObject.dispenseAmount, 4);
    
        const regArray: number[] = Array.from(buffer);
        
         BleManager.write(
           connectedDispenser,
           DISPENSE_SERVICE_UUID,
           DISPENSE_CHARACTERISTIC_UUID,
           regArray
         )
           .then(() => {
             // Data sent successfully
             console.log('Data sent successfully')
           })
           .catch((error) => {
             // Handle write error
             console.log('error sending data')
             console.error(error)
           });
           
      }
    

  return (
    <View style={{ flex: 1, paddingTop: top, alignItems:  'center' }}>
        <Separator separation={'20%'} />
        <Text
        style={{ fontSize: 36, color: Colors.brand.accent, textAlign: 'center', width: '70%',
        fontWeight: '600'}}>Connect to a Pill Dispenser</Text>
        <Separator separation={'10%'} />
        {/* @ts-ignore */}
        <Image source={require('../../assets/images/ble.png')} width={64} height={64}/>
        <Separator separation={'10%'} />
        <ActionButton onPress={handleFindDevices} viewStyle={{ paddingHorizontal: '5%', borderRadius: 60}}>
            Find Devices
        </ActionButton>
    </View>
  )
}

export default BluetoothPairingScreen;

const styles = StyleSheet.create({


})