import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { screenHeight } from '../../utils/dimensions'
import Colors from '../../constants/Colors'

interface FormInputProps {
    placeholder?: string;
    value: string;
    setValue: (value: string) => void;
}
const FormInput: React.FC<FormInputProps> = ({ placeholder, value, setValue}) => {

  return (
    <TextInput 
    style={{ maxHeight: screenHeight * 0.06, backgroundColor: Colors.brand.form, flex: 1,
    borderRadius: 15, paddingLeft: '5%', fontWeight: 'bold', fontSize: 18, marginBottom: '5%' }}
    placeholder={placeholder}
    placeholderTextColor={Colors.brand.placeholder}
    value={value}
    onChangeText={setValue}
    />
  )
}

export default FormInput;