import { 
    View, 
    Text,
    FlatList,
    Image
} from 'react-native'
import React from 'react'

export default function incomeHistory() {

    const selecteIncomeHistory = [
        {          
            "_id": "ih_001",
            "userCredentialsID": "u_123",
            "incomeName": "Monthly Salary",
            "incomeCategory": "Work",
            "amount": 30000.0,
            "expectedPayOut": "2025-10-01",
            "frequency": "Monthly"
        },
        {
            "_id": "ih_002",
            "userCredentialsID": "u_123",
            "incomeName": "Freelance Project",
            "incomeCategory": "Side Hustle",
            "amount": 5000.0,
            "expectedPayOut": "2025-09-25",
            "frequency": "OneTime"
        },
        {
            "_id": "ih_003",
            "userCredentialsID": "u_123",
            "incomeName": "Stock Dividend",
            "incomeCategory": "Investment",
            "amount": 1200.0,
            "expectedPayOut": "2025-09-15",
            "frequency": "Monthly"
        },
        {
            "_id": "ih_004",
            "userCredentialsID": "u_123",
            "incomeName": "Savings Interest",
            "incomeCategory": "Savings",
            "amount": 800.0,
            "expectedPayOut": "2025-09-30",
            "frequency": "Monthly"
        },
        {
            "_id": "ih_005",
            "userCredentialsID": "u_123",
            "incomeName": "Gift Money",
            "incomeCategory": "Other",
            "amount": 2000.0,
            "expectedPayOut": "2025-08-10",
            "frequency": "OneTime"
        }]

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat("en-PH", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

  return (
    <View className="w-full flex-1">
      
      
      {selecteIncomeHistory === undefined ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={selecteIncomeHistory}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{gap: 8}}
          renderItem={({item: income}) => (
            <View
              className="bg-white rounded-3xl h-20 p-4"
            >
              <View className="flex-row justify-between items-center h-full">
                {/* Left Icon */}
                <View className="justify-center items-center">
                  <Image
                    source={require('../../../assets/images/add_income_icon.png')}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>

                {/* Middle Content */}
                <View className="px-3 justify-center items-center">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {income.incomeName}
                  </Text>
                  <Text className="text-sm text-gray-500 capitalize">
                    {income.incomeCategory}
                  </Text>
                </View>

                {/* Right Side */}
                <View className="items-end justify-between">
                  <Text className="text-lg font-bold text-green-600 mb-1">
                    ₱{formatAmount(income.amount)}
                  </Text>
                  <View className="flex-row gap-2 rounded-full px-2 py-1 shadow-sm">
                    <Text>
                        {income.expectedPayOut}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        >
        </FlatList>
      )}

    </View>
  )
}