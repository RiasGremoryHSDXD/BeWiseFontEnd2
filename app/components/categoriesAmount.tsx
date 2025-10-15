// components/CategoriesAmount.js
import { View, Text } from 'react-native';
import React from 'react';

interface Category {
    label: string
    amount: number | string
}

interface Props {
    title: string
    categories: Category[]
    color: string
}
export default function CategoriesAmount({ title, categories, color } : Props) {
  return (
    <View className="flex flex-row flex-wrap justify-between bg-[#FAF7F0] py-6 px-4 rounded-2xl">
      {/* Title */}
      <View className="w-full mb-3">
        <Text className="text-base font-semibold">{title}</Text>
      </View>

      {/* Dynamic Categories */}
      {categories.map((item, index) => (
        <View
          key={index}
          className="w-[46%] border py-1 px-2 border-black/10 justify-center items-center bg-[#F2ECEC] rounded-lg mb-3"
        >
          <Text className="text-sm font-medium">{item.label}</Text>
          <Text
            className={`text-sm font-medium ${
              color === 'red' ? 'text-red-600' : 'text-green-600'
            }`}
          >
            ₱ {item.amount}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * List of file that this code is being reuse
 * 
 * > expenses.tsx
 * > income.tsx
 * 
 */