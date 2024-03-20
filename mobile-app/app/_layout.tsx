import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Colors from '../constants/Colors';
import BackButton from '../components/buttons/back-button';
import { NativeModules,
  NativeEventEmitter, Platform,
  PermissionsAndroid, } from 'react-native'
  import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    Peripheral,
  } from 'react-native-ble-manager';
  import { useRouter } from 'expo-router';
import { useAppStore } from '../state/store';
import useBleManager from '../utils/useBleManager';
import useRecord from '../utils/useRecord';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

function RootLayoutNav() {
  const isScanning = useAppStore((state) => state.isScanning);
  const setIsScanning = useAppStore((state) => state.setIsScanning);
  const setRecord = useAppStore((state) => state.setRecord)
  const { startScan, stopScan } = useBleManager();
  const peripherals = useAppStore((state) => state.peripherals);
  const setPeripherals = useAppStore((state) => state.setPeripherals);
  const connectedDispenser = useAppStore((state) => state.connectedDispenser)
  const setConnectedDispenser = useAppStore((state) => state.setConnectedDispenser)
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const router = useRouter()

  const { getRecord, initRecord} = useRecord()

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

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
    let temp = peripherals
    let p = temp.get(event.peripheral);

    if (p) {
      p.connected = false;
      temp = new Map(temp.set(event.peripheral, p));
    }
    setConnectedDispenser(undefined)
    setPeripherals(temp)
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
    
    console.log('handling discover peripheral', peripheral.name)
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    let temp = peripherals
    temp = new Map(temp.set(peripheral.id, peripheral))
  
    setPeripherals(temp)

  };

  //console.debug('peripherals map updated', [...peripherals.entries()]);


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
      let temp = peripherals
      let p = temp.get(peripheral.id);
      if (p) {
        p.connected = true;
        temp = new Map(temp.set(p.id, p));
      }
      setPeripherals(temp);
    }
  } catch (error) {
    console.error(
      '[retrieveConnected] unable to retrieve connected peripherals.',
      error,
    );
  }
};

const getUserData = async (dispenserId: string) => {
  // try to get the record
  console.log('attempting to get the record for the dispenser: ', dispenserId)
  getRecord(dispenserId).then((record) => {
    // set the state
    console.log('record retrieved: ', record)
    setRecord(record)
  }).catch((e) => {
    //if record doesn't exist, then initialize it
    console.log('problem getting record: ', e)
    initRecord(dispenserId).then((record) => {
      // set the state
      setRecord(record)
    }).catch((e) => {
      console.log('problem initializing the record: ', e)
    })
  }).finally(() => {
    // finally go to the home page
    router.replace('/(tabs)')
  })
}

useEffect(() => {
  if(connectedDispenser){
    // get the user details
    getUserData(connectedDispenser.id)
  } else{
    router.replace('/')
  }
}, [connectedDispenser])


  useEffect(() => {
    try {
      BleManager.start({showAlert: false})
        .then(() => console.debug('BleManager started.'))
        .catch((error: any) =>
          console.error('BleManager could not be started.', error),
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
      bleManagerEmitter.addListener('BleManagerStopScan', stopScan),
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
      router.replace('/')
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
      <Stack initialRouteName='(auth)'
      screenOptions={{ gestureEnabled: false}}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="peripheral/index" options={{ title: ''}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(add-medication)/add-medication" options={{
        title: 'Add Medication', headerStyle: { backgroundColor: Colors.brand.accent }, headerTintColor: 'white', headerLeft: () => { return <BackButton /> }}}/>
                <Stack.Screen name="(add-medication)/enter-dosage" options={{
        title: 'Enter dosage', headerStyle: { backgroundColor: Colors.brand.accent }, headerTintColor: 'white', headerLeft: () => { return <BackButton /> }}}
        />
      </Stack>
  );
}
