import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
  <>
  <StatusBar style="dark" />
  <Stack 
  initialRouteName='test'
  screenOptions={{ headerShown: false }}>
    <Stack.Screen name="test" />
    <Stack.Screen name="bluetooth-pairing"
    />
  </Stack>
  </>
    
  )
}

export default AuthLayout

const styles = StyleSheet.create({})