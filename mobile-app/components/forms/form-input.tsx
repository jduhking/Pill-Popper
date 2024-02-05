import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { screenHeight } from '@/utils/dimensions'
import Colors from '@/constants/Colors'

interface FormInputProps {
    placeholder?: string;
}
const FormInput: React.FC<FormInputProps> = ({ placeholder }) => {
  return (
    <TextInput 
    style={{ height: screenHeight * 0.06, backgroundColor: Colors.brand.form,
    borderRadius: 15, paddingLeft: '5%', fontWeight: 'bold', fontSize: 18, marginBottom: '5%' }}
    placeholder={placeholder}
    placeholderTextColor={Colors.brand.placeholder}/>
  )
}

export default FormInput;