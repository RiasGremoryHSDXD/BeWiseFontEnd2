import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQuery } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Loading from '../Loading'

export default function ExpensesList() {
  const [userCredentialsID, setUserCredentialsID] = useState<Id<"userCredentials"> | null>(null)
  const [isDeleting, setIsDeleing] = useState<boolean>(false)

  const selectExpensesList = useQuery(
    api.functions.expenses.expensesList.expensesList,
    userCredentialsID ? { userCredentialsID } : "skip"
  )

  const deleteExpensesOnList = useMutation(api.functions.expenses.deleteExpenses.deleteExpenses)

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setUserCredentialsID(user.id || "")
        }
      } catch (error) {
        Alert.alert('Error Local Storage [Income List]', 'Error retrieving data in local storage')
      }
    }

    loadUserInfo()
  }, [])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleDeleteButton = (expensesID : Id<"expenses">) => {
    Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this expenses?",
        [
            {
                text: "Cancel",
            },
            {
                text: "Yes",
                onPress: async () => {
                    try {
                        setIsDeleing(true)
                        await deleteExpensesOnList({expensesID: expensesID})
                    } catch (error) {
                        Alert.alert("Error", "Failed to delete income")
                    }finally{
                        setIsDeleing(false)
                    }
                }
            }
        ],
        {cancelable: true}
    )
  }

  return (
    <View className="w-full flex-1">
        {isDeleting && <Loading/>}
      {selectExpensesList === undefined ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView
          className="flex-1 rounded-md"
          contentContainerStyle={{ paddingVertical: 8, gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {selectExpensesList.map((expenses) => (
            <View
              className="bg-white rounded-md h-[60px] p-2"
              key={expenses._id.toString()}
            >
              <View className="flex-row items-center h-full">
                {/* Left Icon - 10% width */}
                <View className="w-[10%] justify-center items-center">
                  <Image
                    source={require('../../../assets/images/add_expenses_icon.png')}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>

                {/* Middle Content - 60% width */}
                <View className="w-[60%] px-3 justify-center">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    {expenses.expensesName}
                  </Text>
                  <Text className="text-sm text-gray-500 capitalize">
                    {expenses.expensesCategory}
                  </Text>
                </View>

                {/* Right Side - 30% width */}
                <View className="w-[30%] items-end justify-center">
                  <Text className="text-lg font-bold text-green-600 mb-1">
                    ₱{formatAmount(expenses.amount)}
                  </Text>
                  <View className="flex-row rounded-full px-2 py-1 shadow-sm">
                    <Image
                      source={require('../../../assets/images/edit_button.png')}
                      style={{ width: 16, height: 16, marginRight: 8 }}
                      resizeMode="contain"
                    />
                
                    <TouchableOpacity
                        onPress={() => handleDeleteButton(expenses._id)}
                    >
                        <Image
                            source={require('../../../assets/images/delete_button.png')}
                            style={{ width: 16, height: 16 }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}
