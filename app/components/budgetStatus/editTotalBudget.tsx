import { 
  View, 
  Text,
  TextInput,
  TouchableOpacity,

} from 'react-native'
import { useState } from 'react'

type Prop = {
  closeModal: () => void;
}

export default function editTotalBudget({closeModal} : Prop) {
    const [amount, setAmount] = useState<number>(0);
  
  return (
    <View
      className='w-full gap-y-3'
    >
      <Text className='font-semibold'>Change total budget</Text>
      <TextInput
        className="border rounded-md py-5 px-3"
        placeholder="Amount"
        value={amount === 0 ? "" : amount.toString()}
        onChangeText={(text) => {
          if (text === "") {
            setAmount(0);
          } else {
            const num = parseFloat(text);
            setAmount(isNaN(num) ? 0 : num);
          }
        }}
        keyboardType="numeric"
      />

      <View className="flex flex-row justify-between mt-5 w-full">
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 p-3 bg-green-400 rounded-lg items-center mr-2"
          onPress={() => console.log("successfully Change Total Budget")}
        >
          <Text className="text-xl font-semibold text-white">Add</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 p-3 bg-gray-400 rounded-lg items-center ml-2"
          onPress={closeModal}
        >
          <Text className="text-xl font-semibold text-white">Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}