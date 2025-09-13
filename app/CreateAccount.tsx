import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native'

export default function CreateAccount() {
  const [user_name, setUserName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorFields, setErrorFields] = useState<{
    user_name: boolean,
    email: boolean,
    password: boolean
  }>({
    user_name: false,
    email: false,
    password: false
  })
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [emailAlreadyExist, setEmailAlreadyExist] = useState<boolean>(false)

  const createAccount = useMutation(api.authentication.createAcc)
  const emailValidation = useQuery(api.authentication.validatedEmailExist, {
    email})

  const handleSignUp = async () => {
    // Reset error states
    const newErrorFields = {
      user_name: !user_name,
      email: !email,
      password: !password
    }
    
    setErrorFields(newErrorFields)

    if(!user_name || !email || !password) {
      return;
    }

    if(emailValidation === undefined) return

    if(emailValidation) {
      setEmailAlreadyExist(true)
      return
    }

    await createAccount({ user_name, email, password });

    setUserName("");
    setEmail("");
    setPassword("");
    setErrorFields({ user_name: false, email: false, password: false });
    setShowSuccessModal(true);
  }

  const clearFieldError = (field: string) => {
    if (errorFields[field as keyof typeof errorFields]) {
      setErrorFields(prev => ({
        ...prev,
        [field]: false
      }))
    }
  }

  return (
    <>
      <View className="flex gap-10">
        <View>
          <TextInput
            className={`text-xl bg-white px-[15px] py-[15px] rounded-2xl ${
              errorFields.user_name 
                ? 'border-2 border-red-500 shadow-md shadow-red-200' 
                : 'border border-gray-200'
            }`}
            placeholder='Name'
            placeholderTextColor={errorFields.user_name ? '#ef4444' : '#9ca3af'}
            value={user_name}
            onChangeText={(text) => {
              setUserName(text)
              clearFieldError('user_name')
            }}
          />
          {errorFields.user_name && (
            <Text className="text-red-500 text-sm mt-1 ml-2">Name is required</Text>
          )}
        </View>

        <View>
          <TextInput
            className={`text-xl bg-white px-[15px] py-[15px] rounded-2xl ${
              errorFields.email 
                ? 'border-2 border-red-500 shadow-md shadow-red-200' 
                : 'border border-gray-200'
            }`}
            placeholder="Email"
            placeholderTextColor={errorFields.email ? '#ef4444' : '#9ca3af'}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              clearFieldError('email')
            }}
          />
          {errorFields.email && (
            <Text className="text-red-500 text-sm mt-1 ml-2">Email is required</Text>
          )}
        </View>

        <View>
          <TextInput
            className={`text-xl bg-white px-[15px] py-[15px] rounded-2xl ${
              errorFields.password 
                ? 'border-2 border-red-500 shadow-md shadow-red-200' 
                : 'border border-gray-200'
            }`}
            placeholder="Password"
            placeholderTextColor={errorFields.password ? '#ef4444' : '#9ca3af'}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              clearFieldError('password')
            }}
          />
          {errorFields.password && (
            <Text className="text-red-500 text-sm mt-1 ml-2">Password is required</Text>
          )}
        </View>

        <TouchableOpacity
          className="bg-[#36978C] flex items-center w-1/2 py-4 self-center rounded-[100px]"
          onPress={handleSignUp}>
          <Text className='text-2xl text-black font-medium'>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-8 mx-6 w-80 shadow-2xl">
            {/* Success Icon */}
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                <Text className="text-green-600 text-4xl">✓</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-2">Success!</Text>
              <Text className="text-gray-600 text-center text-base leading-6">
                Your account has been created successfully. Welcome aboard!
              </Text>
            </View>
            
            {/* Action Button */}
            <TouchableOpacity
              className="bg-[#36978C] py-3 px-6 rounded-2xl mt-6"
              onPress={() => setShowSuccessModal(false)}
            >
              <Text className="text-white text-lg font-semibold text-center">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={emailAlreadyExist}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEmailAlreadyExist(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-8 mx-6 w-80 shadow-2xl">
            {/* Wrong Icon */}
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                <Text className="text-red-600 text-4xl">X</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-2">Email already used!</Text>
              <Text className="text-gray-600 text-center text-base leading-6">
                The email is already exist, Try difference email
              </Text>
            </View>
            
            {/* Action Button */}
            <TouchableOpacity
              className="bg-[#36978C] py-3 px-6 rounded-2xl mt-6"
              onPress={() => setEmailAlreadyExist(false)}
            >
              <Text className="text-white text-lg font-semibold text-center">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}