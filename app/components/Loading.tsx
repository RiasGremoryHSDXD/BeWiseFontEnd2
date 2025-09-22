import React from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function Loading() {
  return (
    <View className="absolute inset-0 flex  items-center">
        <ActivityIndicator size={100} color="#36978C" />
    </View>
  )
}