
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
  Image,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
import { DispenseObject } from '../../models/dispense-service'
import { useAppStore } from '../../state/store'
import { screenHeight, screenWidth } from '../../utils/dimensions'
import useBleManager from '../../utils/useBleManager';
import { FlatList } from 'react-native-gesture-handler'

const BluetoothPairingScreen = () => {
    const { top } = useSafeAreaInsets();
    const isScanning = useAppStore((state) => state.isScanning);
    const setIsScanning = useAppStore((state) => state.setIsScanning);
    const setPeripherals = useAppStore((state) => state.setPeripherals);
    const peripherals = useAppStore((state) => state.peripherals);
    const connectedDispenser = useAppStore((state) => state.connectedDispenser);
    const setConnectedDispenser = useAppStore((state) => state.setConnectedDispenser);
    const router = useRouter();
    const [p, setP] = useState<Peripheral>()  
    const { startScan } = useBleManager();

    const handleStopScan = async () => {
      try { 
        console.log('attempting to stop the scan')
        BleManager.stopScan()
      } catch(err) {
        console.error(err);
        console.log('Couldnt disconnect');
      }
    }

    useEffect(() => {
      if(connectedDispenser){
        router.push('/(tabs)')
      }
    }, [])

    useEffect(() => {
      console.log('peripherals changed')
      if(!p){
        const pVal =  Array.from(peripherals.values()).filter((peripheral) => {
          return peripheral.name === 'mpy-pill-popper' 
        })     
        if(pVal.length > 0){
          setP(pVal[0])
          handleScanComplete()
        }
      }
    }, [peripherals])

    const handleScan = () => {
      if(!isScanning){
        console.log('attempting scan')
        startScan()
      }
    }

    const handleScanComplete= async () => {
      console.log('Disconnecting...')
      await handleStopScan()
      //@ts-ignore
      router.push('/peripheral')
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
        <ActionButton onPress={() => handleScan()} viewStyle={[{ borderRadius: 60, width: screenWidth * 0.6,
        justifyContent: 'center', alignItems: 'center',
        height: screenHeight * 0.08}, connectedDispenser && { backgroundColor: 'red'}]}>
            <View style={{ width: '100%', height: '100%'}}>
            { !isScanning && !connectedDispenser ? <Text
            style={{ fontSize: 22, color: 'white',
          fontWeight: 'bold'}}>Find Dispenser</Text> : 
              (
                  <View><Text
                  style={{ fontSize: 22, color: 'white',
                  fontWeight: 'bold'}}>Searching...</Text></View>

              )
             }
             </View>
        </ActionButton>
        <View>
        </View>
    </View>
  )
}

export default BluetoothPairingScreen;

const styles = StyleSheet.create({


})