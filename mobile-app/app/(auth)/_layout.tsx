import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
  <>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false}} />
  </>
    
  )
}

export default AuthLayout

const styles = StyleSheet.create({})