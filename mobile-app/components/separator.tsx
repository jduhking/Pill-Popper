import { DimensionValue, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Separator = ({ separation } : { separation?: DimensionValue }) => {
  return (
    <View style={[styles.separator, { marginVertical: separation}]}></View>
  )
}

export default Separator

const styles = StyleSheet.create({
    separator: {
        marginVertical: 10,
        height: 1,
        width: '80%',
      },
})