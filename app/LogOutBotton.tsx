import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function LogOutBotton() {

    const router = useRouter()

    const LogOutAccount = () => router.replace("/")
  return (
    <TouchableOpacity
        onPress={LogOutAccount}
    >
        <Ionicons
            name='person-circle-outline'
            size={40}
        />
    </TouchableOpacity>
  )
}