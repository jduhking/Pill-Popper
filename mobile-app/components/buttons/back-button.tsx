import { TouchableOpacity } from 'react-native'
import React from 'react'
import { BackIcon } from '@/icons/back'
import { useRouter } from 'expo-router'

const BackButton = () => {
    const router = useRouter();
  return (
    <TouchableOpacity
    onPress={() => router.back()}>
        <BackIcon size={32} color={'white'}/>
    </TouchableOpacity>
  )
}

export default BackButton