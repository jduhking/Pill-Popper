import { Image, Keyboard, StyleSheet, TouchableWithoutFeedback, View} from 'react-native'
import React, { useState } from 'react'
import ActionButton from '../../components/buttons/action-button'
import FormLabel from '../../components/forms/form-label'
import FormInput from '../../components/forms/form-input'
import Separator from '../../components/separator'
import { useRouter } from 'expo-router'
import { useAppStore } from '../../state/store'
import { MedicationInput, Interval } from '@/models/medication-input'

const AddMedicationScreen = () => {
  const [pillName, setPillName]= useState<string>('');
  const [dose, setDose] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const router = useRouter();
  const medicationInput = useAppStore((state) => state.medicationInput);
  const setMedicationInput = useAppStore((state) => state.setMedicationInput);
  const handleSubmit = () => {
    console.log('should be pushing the next screen')
    if(!pillName){
      alert('Please Enter a pill name')
      return
    } else if(!dose){
      alert('Please enter dose')
      return
    } else if(!quantity) {
      alert('Please enter quantity')
      return
    }

    const medication : MedicationInput = {
      name: pillName,
      dose: Number(dose),
      quantity: Number(quantity)
    }

    console.log('entered medication: ', medication)
    // set global medicationInput state

    setMedicationInput(medication)

    router.push('/(add-medication)/enter-dosage')
  }
  return (
    <View style={{ flex: 1, paddingHorizontal: '5%', paddingTop: '10%'}}>
      <TouchableWithoutFeedback
      style={{ flexGrow: 1,   }}
      onPress={() => Keyboard.dismiss()}>
          <>
            <View style={{ alignItems: 'center'}}>
              <Image source={require('../../assets/images/pills.png')} />
            </View>
          <FormLabel>
            Pill name
          </FormLabel>
          <FormInput placeholder='Enter the pill name'
          value={pillName}
          setValue={setPillName}/>
          <FormLabel>
            Dose
          </FormLabel>
          <FormInput placeholder='Enter the dose'
          value={dose}
          setValue={setDose} />
          <FormLabel>
            Quantity
          </FormLabel>
          <FormInput placeholder='Enter the amount of pills'
          value={quantity}
          setValue={setQuantity}/>
          <Separator separation={'5%'}/>
          </>
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