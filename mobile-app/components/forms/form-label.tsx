import { Text } from 'react-native'
import React, { ReactNode } from 'react'

const FormLabel = ({ children } : { children : ReactNode}) => {
    return (
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: '5%'}}>
            {children}
        </Text>
    )
}

export default FormLabel;