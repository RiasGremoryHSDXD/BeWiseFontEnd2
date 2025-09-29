import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from '@react-native-picker/picker'
import { useMutation } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'

type UpdateIncomeProps = {
    incomeID?: Id<"income">
    incomeName?: string
    incomeCategory?: string
    incomeAmount?: number
    incomeExpectedPayOut?: Date
    incomeFrequency?: string
    onSuccessUpdate?: () => void
}

type incomeCategory = "Work" | "Investment" | "Savings" | "Side Hustle" | "Other"
type Frequency = 'OneTime' | 'Monthly'

export default function UpdateIncome({incomeID, incomeName, incomeCategory, incomeAmount, incomeExpectedPayOut, incomeFrequency, onSuccessUpdate}: UpdateIncomeProps) {

    const [newIncomeName, setNewIncomeName] = useState<string>(incomeName ?? "")
    const [newIncomeCategory, setNewIncomeCategory] = useState<incomeCategory>(incomeCategory as incomeCategory)
    const [newAmount, setNewAmount] = useState<number>(incomeAmount ?? 0)
    const [newDateExpectedPayOut, setNewDateExpectedPayout] = useState<Date>(incomeExpectedPayOut ? new Date(incomeExpectedPayOut) : new Date())
    const [newFrequency, setNewFrequency] = useState<Frequency>(incomeFrequency as Frequency)
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState(false)

    const incomeUpdateInfo = useMutation(api.functions.income.updateIncomeInfo.updateExpenseInfo)

    useEffect(() => {
        setNewIncomeName(incomeName ?? "")
        setNewIncomeCategory(incomeCategory as incomeCategory)
        setNewAmount(incomeAmount ?? 0)
        setNewDateExpectedPayout(incomeExpectedPayOut ? new Date(incomeExpectedPayOut) : new Date ())
        setNewFrequency(incomeFrequency as Frequency)
    }, [incomeName, incomeCategory, incomeAmount, incomeExpectedPayOut, incomeFrequency])


    const handleUpdateButton = async () => {
        if (loading || isProcessing) return;

        setIsProcessing(true)

        try {

            if(newFrequency){
                Alert.alert("Frequency Data : ", `${newFrequency}`)
            }
            if(!incomeID || !newIncomeName || !newIncomeCategory || !newAmount || !newDateExpectedPayOut || !newFrequency ){
                Alert.alert('Missing Data', 'Please fill out all fields')
                return
            }

            setLoading(true)

            await incomeUpdateInfo({
                incomeID,
                newIncomeName,
                newIncomeCategory,
                newAmount,
                newExpectedPayOut: newDateExpectedPayOut.toString(),
                newFrequency         
            })

            onSuccessUpdate?.()

            Alert.alert("Success", "Income updated successfully.");
            
            
        } catch (error) {
            Alert.alert("Update failed", "Cound not update income")            
        }finally{
            setLoading(false)
            setIsProcessing(false)
        }
    }
  return (
    <View
        className='w-full gap-y-3'
    >
        <Text className="font-semibold">Income Name:</Text>
        <TextInput 
            className="border rounded-lg"
            value={newIncomeName}
            onChangeText={(text) => setNewIncomeName(text)}
        >
        </TextInput>

        <Text className="font-semibold">Category</Text>
        <View 
            className="border border-black rounded-lg overflow-hidden"
        >
            <Picker
                selectedValue={newIncomeCategory}
                onValueChange={(itemValue) => setNewIncomeCategory(itemValue)}
            >
                <Picker.Item label='Work' value='Work'/>
                <Picker.Item label='Investment' value='Investment' />
                <Picker.Item label='Savings' value='Savings' />
                <Picker.Item label='Side Hustle' value='Side Hustle'/>
                <Picker.Item label='Other' value='Other' />
            </Picker>
        </View>

        <Text className="font-semibold">Amount</Text>
        <TextInput 
            className="border rounded-lg"
            value={newAmount === 0 ? "" : newAmount.toString()}
            onChangeText={(text) => {
                if(text === ""){
                    setNewAmount(0)
                }else{
                    const num = parseFloat(text)
                    setNewAmount(isNaN(num) ? 0 : num)
                }
            }}
            keyboardType="numeric"
        >      
        </TextInput>


        <Text className="font-semibold">Frequency</Text>
        <View
            className='border border-black rounded-lg overflow-hidden'
        >
            <Picker
                selectedValue={newFrequency}
                onValueChange={(itemValue) => setNewFrequency(itemValue)}
            >
                <Picker.Item label='OneTime' value='OneTime'/>
                <Picker.Item label='Monthly' value='Monthly'/>
            </Picker>
        </View>

        <View
            className='flex flex-row'
        >
            <Text className="font-semibold">Expected PayOut : </Text>

            <TouchableOpacity
                className='border border-gray-300 rounded-md px-3 bg-gray-50'
                onPress={() => setShowDatePicker(true)}
            >
                <Text className="font-semibol">
                    {newDateExpectedPayOut ? newDateExpectedPayOut.toDateString() : "Selected date"}
                </Text>
            </TouchableOpacity>


            {showDatePicker && (
                <DateTimePicker
                    value={newDateExpectedPayOut}
                    mode='date'
                    display='default'
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false)
                        if(selectedDate) setNewDateExpectedPayout(selectedDate)
                    }}
                />
            )}
        </View>

        <TouchableOpacity
            onPress={handleUpdateButton}
            className="bg-blue-400 items-center p-2 rounded-lg"
        >
            <Text className="font-semibold text-lg text-white">Update</Text>
        </TouchableOpacity>
    </View>
  )
}