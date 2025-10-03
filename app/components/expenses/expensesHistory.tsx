import { 
    View, 
    Text,
    FlatList,
    Image
} from 'react-native'
import React from 'react'

export default function expensesHistory() {
    
    const selectedExpensesHistroy = 
    [
        {
            "_id": "eh_001",
            "userCredentialsID": "u_123",
            "expensesName": "Electric Bill",
            "expensesCategory": "Bills",
            "amount": 2500.0,
            "datePaid": "2025-09-28",
            "frequency": "Monthly"
        },
        {
            "_id": "eh_002",
            "userCredentialsID": "u_123",
            "expensesName": "Internet Subscription",
            "expensesCategory": "Bills",
            "amount": 1500.0,
            "datePaid": "2025-09-25",
            "frequency": "Monthly"
        },
        {
            "_id": "eh_003",
            "userCredentialsID": "u_123",
            "expensesName": "Groceries at SM",
            "expensesCategory": "Grocery",
            "amount": 4200.0,
            "datePaid": "2025-09-20",
            "frequency": "OneTime"
        },
        {
            "_id": "eh_004",
            "userCredentialsID": "u_123",
            "expensesName": "Mobile Game Top-up",
            "expensesCategory": "Game",
            "amount": 800.0,
            "datePaid": "2025-09-18",
            "frequency": "OneTime"
        },
        {
            "_id": "eh_005",
            "userCredentialsID": "u_123",
            "expensesName": "Health Insurance",
            "expensesCategory": "Insurance",
            "amount": 3500.0,
            "datePaid": "2025-09-10",
            "frequency": "Monthly"
        },
        {
            "_id": "eh_006",
            "userCredentialsID": "u_123",
            "expensesName": "Taxi Rides",
            "expensesCategory": "Other",
            "amount": 600.0,
            "datePaid": "2025-09-05",
            "frequency": "OneTime"
        }
    ]

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat("en-PH", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

  return (
    <View className="w-full flex-1">

        {selectedExpensesHistroy === undefined ? (
            <Text>Loading...</Text>
        ) : (
            <FlatList
            data={selectedExpensesHistroy}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={{ gap: 8}}
            renderItem={({ item: expenses}) => (
                <View
                className="bg-white rounded-3xl h-20 p-4 w-full"
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
                        <Text>{expenses.datePaid}</Text>
                    </View>
                    </View>
                </View>
                </View>
            )}
            ></FlatList>
        )}

        </View>  
    )
}