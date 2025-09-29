import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQuery } from 'convex/react'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import Loading from '../Loading'
import UpdateExpenses from './updateExpenses'

export default function ExpensesList() {
  const [userCredentialsID, setUserCredentialsID] =
    useState<Id<'userCredentials'> | null>(null)
  const [expensesID, setExpensesID] = useState<Id<'expenses'> | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  const selectExpensesList = useQuery(
    api.functions.expenses.expensesList.expensesList,
    userCredentialsID ? { userCredentialsID } : 'skip'
  )

  const expenseInfoData = useQuery(
    api.functions.expenses.expensesInfo.expenseInfo,
    expensesID ? { expensesID } : 'skip'
  )

  const deleteExpensesOnList = useMutation(
    api.functions.expenses.deleteExpenses.deleteExpenses
  )

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setUserCredentialsID(user.id || '')
        }
      } catch (error) {
        Alert.alert(
          'Error Local Storage [Expenses List]',
          'Error retrieving data in local storage'
        )
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

  const handleDeleteButton = (expensesID: Id<'expenses'>) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this expense?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            setIsDeleting(true)
            await deleteExpensesOnList({ expensesID })
          } catch (error) {
            Alert.alert('Error', 'Failed to delete expense')
          } finally {
            setIsDeleting(false)
          }
        },
      },
    ])
  }

  const handleUpdateButton = async (expensesID: Id<'expenses'>) => {
    setExpensesID(expensesID)
    setIsUpdating(true)
  }

  return (
    <View className="w-full flex-1">
      {isDeleting && <Loading />}

      {selectExpensesList === undefined ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 8, gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {selectExpensesList.map((expenses) => (
            <View
              className="bg-white rounded-3xl h-20 p-4 w-full"
              key={expenses._id.toString()}
            >
              <View className="flex-row items-center justify-between h-full">
                {/* Left Icon */}
                <View className="justify-center items-center">
                  <Image
                    source={require('../../../assets/images/add_expenses_icon.png')}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>

                {/* Middle Content */}
                <View className="px-3 justify-center items-center">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {expenses.expensesName}
                  </Text>
                  <Text className="text-sm text-gray-500 capitalize">
                    {expenses.expensesCategory}
                  </Text>
                </View>

                {/* Right Side */}
                <View className="items-end justify-between">
                  <Text className="text-lg font-bold text-red-600 mb-1">
                    ₱{formatAmount(expenses.amount)}
                  </Text>
                  <View className="flex-row rounded-full px-2 gap-4 py-1 shadow-sm">
                    {/* Update Button */}
                    <TouchableOpacity onPress={() => handleUpdateButton(expenses._id)}>
                      <Feather name="edit" size={18} color="black" />
                    </TouchableOpacity>

                    {/* Delete Button */}
                    <TouchableOpacity onPress={() => handleDeleteButton(expenses._id)}>
                      <FontAwesome5 name="trash-alt" size={17} color="#D90000" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Update Modal */}
      <Modal
        visible={isUpdating}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUpdating(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl w-[94%] p-5 flex justify-center items-center">
            {!expenseInfoData ? (
              <View>
                <Loading />
                <Text>Loading...</Text>
              </View>
            ) : (
              <UpdateExpenses
                expensesID={expenseInfoData._id}
                expensesName={expenseInfoData.expensesName}
                expensesCategory={expenseInfoData.expensesCategory}
                expensesAmount={expenseInfoData.amount}
                expensesDatePaid={expenseInfoData.datePaid}
                expensesFrequency={expenseInfoData.frequency}
                onSuccessUpdate={() => {
                  setIsUpdating(false)
                  setExpensesID(null)
                }}
              />
            )}

            <TouchableOpacity
              className="bg-red-400 w-full items-center p-2 mt-2 rounded-lg"
              onPress={() => setIsUpdating(false)}
            >
              <Text className="font-semibold text-lg text-white">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
