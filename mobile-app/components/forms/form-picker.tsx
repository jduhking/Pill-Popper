import { StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'
import {Picker} from '@react-native-picker/picker';
import { screenHeight } from '../../utils/dimensions';
import Colors from '../../constants/Colors';

interface FormPickerProps {
    value: string;
    setValue: (value: string) => void;
    options: string[];
}
const FormPicker: React.FC<FormPickerProps> = ({ value, setValue, options}) => {
  return (
    <Picker
    style={{ backgroundColor: Colors.brand.form, width: '100%', 
    borderRadius: 15, fontWeight: 'bold', height: 200}}
    selectedValue={value}
    onValueChange={(itemValue, itemIndex) =>
        setValue(itemValue)
    }>
    {
        options.map((option, index) => <Picker.Item label={option} value={option.toLowerCase()} key={index} />)
    }
    </Picker>
  )
}

export default FormPicker

const styles = StyleSheet.create({})