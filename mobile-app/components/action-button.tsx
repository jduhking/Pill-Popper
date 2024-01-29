import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle, TouchableOpacity, 
ActivityIndicator } from 'react-native'
import React, { ReactNode } from 'react'
import Colors from '@/constants/Colors'


interface ActionButtonProps { 
    viewStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children: ReactNode;
    loading?: boolean;
    onPress: () => void;
}
const ActionButton: React.FC<ActionButtonProps> = ({ viewStyle, textStyle, children, loading=false, onPress}) => {
  return (
    <>
    {
        loading ? (
            <View style={[styles.btnContainer, viewStyle, { backgroundColor: '#a8a8a8'}]}>
                <ActivityIndicator color='white' />
            </View>
        ) : (
        <TouchableOpacity style={[styles.btnContainer, viewStyle]}
        onPress={onPress}>
            <Text style={[styles.btnText, textStyle]}>{children}</Text>
        </TouchableOpacity>
        )
    }
   </>
  )
}

export default ActionButton;

const styles = StyleSheet.create({
    btnContainer: {
        backgroundColor: Colors.brand.accent,
        paddingVertical: '5%',
        borderRadius: 20,
    },
    btnText: {
        fontSize: 22, 
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    }
})