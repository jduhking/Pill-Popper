import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Separator from '../../components/separator'
import ActionButton from '../../components/buttons/action-button'
import { useRouter } from 'expo-router'

const BluetoothPairingScreen = () => {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    const handleFindDevices = () => {
        router.push('/(tabs)')
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

export default BluetoothPairingScreen

const styles = StyleSheet.create({


})