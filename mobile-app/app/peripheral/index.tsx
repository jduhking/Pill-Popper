import { StyleSheet, Text, View, Image, FlatList,
    ListRenderItem,
    ListRenderItemInfo,} from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BackButton from '../../components/buttons/back-button'
import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral,
  } from 'react-native-ble-manager';
import ActionButton from '../../components/buttons/action-button';
import { useAppStore } from '../../state/store';
import useBleManager from '../../utils/useBleManager';
import { useRouter } from 'expo-router';
import Separator from '../../components/separator';
const PeripheralScreen = () => {
    const { top } = useSafeAreaInsets()
    const peripherals = useAppStore((state) => state.peripherals);
    const p =  Array.from(peripherals.values()).filter((peripheral) => {
        // return peripheral.name === 'mpy-pill-popper'
        return peripheral.name === 'LE-Jduhkings headphones'
      })
    const { togglePeripheralConnection } = useBleManager();
    const router = useRouter();
    const setConnectedDispenser = useAppStore((state) => state.setConnectedDispenser)
    const [connecting, setConnecting] = useState<boolean>();
    const renderItem = ( {item, index} : { item : Peripheral, index: number}) => {
        return (
            <View style={{ alignItems: 'center', width: '100%',height: '100%'}}>
                     <Image source={require('../../assets/images/pilldispenser.png')} alt="pilldispenser"
                style={{ width: 306, height:408}} />
                <Separator separation={10} />
                <Text 
                style={{ fontSize: 36, color: 'black'}}>Pill Popper</Text>
                <Separator separation={10} />
                <ActionButton
                viewStyle={{ paddingHorizontal: '5%', borderRadius: 200, }}
                loading={connecting}
                onPress={async () => {
                    try {
                        // setConnecting(true)
                        // await togglePeripheralConnection(item)
                        // setConnecting(false)
                        setConnectedDispenser(item)
                    } catch(err){
                        setConnecting(false)
                        console.error(err);
                        alert('Couldnt connect to dispenser')
                    }
                }
                }>
                   Connect
                </ActionButton>
                <Separator separation={10} />
                {
                    // Array.from(peripherals.values()).filter((peripheral) => {
                    //     return peripheral.name === 'mpy-pill-popper'
                    // }).map((peripheral) => {
                    //     return (
                    //         <View style={{ borderWidth: 1, borderRadius: 200, width: 15, height: 15}}>

                    //         </View>
                    //     )
                    // })
                    
                        Array.from(peripherals.values()).slice(0, 1).map((peripheral) => {
                        return (
                            <View style={{ borderWidth: 1, borderRadius: 200, width: 15, height: 15}}
                            key={peripheral.id} >

                            </View>
                        )
                    })
                }
            </View>
        )
    }
  return (
    <View style={[styles.mainContainer,]}>
        <View style={{ flex: 1}}>
            <FlatList 
            data={p}
            contentContainerStyle={{
                flex: 1
            }}
            renderItem={renderItem}
            keyExtractor={(peripheral) => peripheral.id + Math.random()}
            horizontal
            />
        </View>
    </View>
  )
}

export default PeripheralScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
})