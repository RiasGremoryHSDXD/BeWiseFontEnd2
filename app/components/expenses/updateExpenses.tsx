import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import { useMutation } from "convex/react";
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

type UpdateExpensesProps = {
    expensesID?: Id<'expenses'>
    expensesName?: string
    expensesCategory?: string
    expensesAmount?: number
    expensesDatePaid?: string
    expensesFrequency?: string
    onSuccessUpdate?: () => void
}

type ExpensesCategory = "Insurance" | "Bills" | "Game" | "Grocery" | "Other"
type Frequency = 'OneTime' | 'Monthly'

export default function UpdateExpenses({expensesID, expensesName, expensesCategory, expensesAmount, expensesDatePaid, expensesFrequency, onSuccessUpdate} : UpdateExpensesProps) {

    const [newExpensesName, setNewExpensesName] = useState<string>(expensesName ??  "")
    const [newExpensesCategoryValue, setNewExpensesCategoryValue] = useState<ExpensesCategory>(expensesCategory as ExpensesCategory)
    const [newAmount, setNewAmount] = useState<number>(expensesAmount ?? 0)
    const [newDatePaid, setNewDatePaid] = useState<Date>(expensesDatePaid ? new Date(expensesDatePaid) : new Date())
    const [newFrequency, setNewFrequency] = useState<Frequency>(expensesFrequency as Frequency)
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState(false)

    const expensesUpdateInfo = useMutation(api.functions.expenses.updateExpensesInfo.updateExpenseInfo)

    useEffect(() => {
        setNewExpensesName(expensesName ?? "")
        setNewExpensesCategoryValue(expensesCategory as ExpensesCategory)
        setNewAmount(expensesAmount ?? 0)
        setNewDatePaid(expensesDatePaid ? new Date(expensesDatePaid) : new Date())
        setNewFrequency(expensesFrequency as Frequency)
    }, [expensesName, expensesCategory, expensesAmount, expensesDatePaid, expensesFrequency])


   const handleUpdateButton = async () => {
    if (loading || isProcessing) return;

    setIsProcessing(true);

    try {
        if (!expensesID || !newExpensesName || !newExpensesCategoryValue || !newAmount || !newDatePaid || !newFrequency) {
        Alert.alert('Missing Data', "Please fill out all fields");
        return;
        }

        setLoading(true);

        await expensesUpdateInfo({
        expensesID,
        newExpensesName,
        newExpensesCategory: newExpensesCategoryValue,
        newAmount,
        newDatePaid: newDatePaid.toString(),
        newFrequency
        });

        // ✅ Close the modal immediately after success
        onSuccessUpdate?.();

        // Then show alert (non-blocking for modal)
        Alert.alert("Success", "Expenses updated successfully.");

    } catch (error) {
        Alert.alert("Update failed", "Could not update expenses.");
    } finally {
        setLoading(false);
        setIsProcessing(false);
    }
    };

  return (
    <View
        className="w-full gap-y-3"
    >

        <Text className="font-semibold">Expense Name</Text>
        <TextInput
            className="border rounded-lg"
            value={newExpensesName}
            onChangeText={(text) => setNewExpensesName(text)}
        >
        </TextInput>

        <Text className="font-semibold">Category</Text>
        <View
            className="border border-black rounded-lg overflow-hidden"
        >
            <Picker
                selectedValue={newExpensesCategoryValue}
                onValueChange={(itemValue) => setNewExpensesCategoryValue(itemValue)}
            >
                <Picker.Item label='Insurance' value='Insurance'/>
                <Picker.Item label='Bills' value='Bills'/>
                <Picker.Item label='Game' value='Game'/>
                <Picker.Item label='Grocery' value='Grocery'/>
                <Picker.Item label='Other' value='Other'/>
            </Picker>
        </View>

        <Text className="font-semibold">Amount</Text>
        <TextInput
            className="border rounded-lg"
            value={newAmount === 0 ? "" : newAmount.toString()}
            onChangeText={(text) => {
                if(text === ""){
                    setNewAmount(0)
                }
                else{
                    const num = parseFloat(text)
                    setNewAmount(isNaN(num) ? 0 : num)
                }
            }}
            keyboardType="numeric"
        >
        </TextInput>

        <Text className="font-semibold">Frequency</Text>
        <View
            className="border border-black rounded-lg overflow-hidden"
        >
            <Picker
                selectedValue={newFrequency}
                onValueChange={(itemValue) => setNewFrequency(itemValue)}
            >
                <Picker.Item label="OneTime" value='OneTime'/>
                <Picker.Item label='Monthly' value='Monthly' />
            </Picker>
        </View>

        <View
            className="flex flex-row justify-between"
        >
            <Text className="font-semibold">Date Paid : </Text>

            <TouchableOpacity
                className="border border-gray-300 rounded-md px-3 bg-gray-50"
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
            >
                <Text
                    className='font-semibold'    
                >
                    {newDatePaid ? newDatePaid.toDateString() : "Select date"}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker 
                    value={newDatePaid || new Date()}
                    mode='date'
                    display='default'
                    onChange={(event, selectedDate) =>{ 
                        setShowDatePicker(false)
                        if(selectedDate) setNewDatePaid(selectedDate)
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
