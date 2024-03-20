import { Image, Keyboard, StyleSheet, TouchableWithoutFeedback, View , Text} from 'react-native'
import React, { useEffect, useState } from 'react'
import ActionButton from '../../components/buttons/action-button'
import FormLabel from '../../components/forms/form-label'
import FormInput from '../../components/forms/form-input'
import Separator from '../../components/separator'
import { useRouter } from 'expo-router'
import { useAppStore } from '../../state/store'
import { Frequency, Interval, MedicationInput } from '../../models/medication-input'
import FormPicker from '../../components/forms/form-picker'

const AddMedicationScreen = () => {
  const [dosage, setDosage] = useState<string>('');
  const [freqValue, setFreqValue] = useState<string>('');
  const [interval, setInterval] = useState<string>('');
  const router = useRouter();
  const medicationInput = useAppStore((state) => state.medicationInput);
  const setMedicationInput = useAppStore((state) => state.setMedicationInput);

  useEffect(() => {
    console.log('Retrieving the medication input: ', medicationInput)
  }, [])

  const handleSubmit = () => {
    console.log('should be pushing the next screen')
    const medication: MedicationInput | undefined = medicationInput

    if(!medication){
      console.log('somehow medication is undefined')
      return
    }

    medication.dosage = Number(dosage)
    const frequency : Frequency = { value: Number(freqValue), interval: interval}
    medication.frequency = frequency
    console.log('Finally, we are entering: ', medication)
    setMedicationInput(medication)
    router.push('/(add-medication)/enter-pill')
  }
  return (
    <View style={{ flex: 1, paddingHorizontal: '5%', paddingTop: '10%'}}>
      <TouchableWithoutFeedback
      style={{ flex: 0.8 }}
      onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1}}>
            <View style={{ alignItems: 'center'}}>
              <Image source={require('../../assets/images/pills.png')} />
            </View>
          <FormLabel>
            Dosage
          </FormLabel>
          <FormInput placeholder='Enter the dosage'
          value={dosage}
          setValue={setDosage}/>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ flex: 0.6, marginRight: '5%', flexDirection: 'row'}}>
              <View style={{ marginRight: '8%'}}>
                <FormLabel>
                  Frequency
                </FormLabel>
              </View>
              <FormInput placeholder=''
              value={freqValue}
              setValue={setFreqValue}/>
            </View>
            <View style={{ flex: 0.4}}>
              <FormPicker value={interval} setValue={setInterval} options={[Interval.HOURS.valueOf(), Interval.DAYS.valueOf(), Interval.WEEKS.valueOf()]}/>
            </View>
          </View>
          <Separator separation={'5%'}/>
          </View>
          
        </TouchableWithoutFeedback>
        <View style={{ flex: 0.2}}>
        <ActionButton
        onPress={handleSubmit}>
          Add Medicine
        </ActionButton>
        </View>
    </View>
  )
}

export default AddMedicationScreen

const styles = StyleSheet.create({})