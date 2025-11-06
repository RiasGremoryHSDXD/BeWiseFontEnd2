/**
 * @component ReusableButton
 * @description A reusable and customizable button component for React Native.
 * It allows developers to easily apply custom styles, display button text, 
 * and handle button press actions consistently across the app.
 *
 * @param {string} [reuseableButtonDesign] - Tailwind style for the button container. 
 * The default can be customized to change button color, size, or layout.
 * Example:
 * ```tsx
 * <ReusableButton
 *   reuseableButtonDesign="bg-blue-500 p-3 rounded-lg"
 *   textButtonDesign="text-white text-center font-semibold"
 *   textButton="Submit"
 *   onPress={() => console.log('Button pressed!')}
 * />
 * ```
 *
 * @param {string} textButtonDesign - Tailwind style for the button text. 
 * This controls text color, font size, and alignment.
 * @param {string} textButton - The text displayed on the button.
 * @param {() => void} onPress - Function called when the button is pressed.
 * @returns {JSX.Element} A customizable button component with text and press functionality.
*/

import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import type { ReusableButtonProps } from '../types/reusableButton'

export default function reuseableButton({
    reuseableButtonDesign = 'bg-[#36978C] py-3 px-6 rounded-2xl mt-6',
    textButtonDesign,
    textButton,
    onPress,
} : ReusableButtonProps) {
  return (
    <TouchableOpacity
        className={reuseableButtonDesign}
        onPress={onPress}
    >
        <Text className={textButtonDesign}>{textButton}</Text>
    </TouchableOpacity>
  )
}