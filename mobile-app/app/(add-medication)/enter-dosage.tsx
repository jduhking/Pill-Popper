import { Image, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import ActionButton from '@/components/buttons/action-button'
import FormLabel from '@/components/forms/form-label'
import FormInput from '@/components/forms/form-input'
import Separator from '@/components/separator'
import { useRouter } from 'expo-router'

const AddMedicationScreen = () => {
  const router = useRouter();
  const handleSubmit = () => {
    console.log('should be pushing the next screen')
    router.push('/(add-medication)/enter-pill')
  }
  return (
    <View style={{ flex: 1, paddingHorizontal: '5%', paddingTop: '10%'}}>
      <TouchableWithoutFeedback
      style={{ flexGrow: 1,  }}
      onPress={() => Keyboard.dismiss()}>
          <View >
            <View style={{ alignItems: 'center'}}>
              <Image source={require('../../assets/images/pills.png')} />
            </View>
          <FormLabel>
            Dosage
          </FormLabel>
          <FormInput placeholder='Enter the dosage'/>
          <FormLabel>
            Frequency
          </FormLabel>
          <FormInput />
          <Separator separation={'5%'}/>
          </View>
          
        </TouchableWithoutFeedback>
        <ActionButton
        onPress={handleSubmit}>
          Add Medicine
        </ActionButton>
    </View>
  )
}

export default AddMedicationScreen

const styles = StyleSheet.create({})