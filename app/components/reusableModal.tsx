/**
 * @component ReusableModal
 * @description A reusable and customizable modal component for React Native.
 * It allows developers to display content inside a styled modal with flexible layout,
 * visibility control, and animation options.
 *
 * @param {string} [reusableModalDesign='flex-1 bg-black/50 justify-center items-center'] 
 * Tailwind style for the modal's outer overlay background.
 * The default uses a semi-transparent black background (`bg-black/50`).
 * You can change this color to match your app’s theme — for example:
 * 
 * ```tsx
 * <ReusableModal
 *   visible={emailNotValid}
 *   onRequestClose={() => setEmailNotValid(false)}
 *   reusableModalDesign="flex-1 bg-blue-500/40 justify-center items-center"
 * >
 *   <Text>Email is invalid!</Text>
 * </ReusableModal>
 * ```
 *
 * @param {string} [reuseableModalContainerDesign='flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg'] 
 * Tailwind style for the modal's inner container.
 * The default uses a white background (`bg-white`) with padding and rounded corners.
 * You can customize this too, for example:
 *
 * ```tsx
 * <ReusableModal
 *   visible={emailNotValid}
 *   onRequestClose={() => setEmailNotValid(false)}
 *   reuseableModalContainerDesign="flex justify-center items-center bg-gray-900 p-8 rounded-xl"
 * >
 *   <Text style={{ color: 'white' }}>Email is invalid!</Text>
 * </ReusableModal>
 * ```
 *
 * @param {boolean} [visible=true] - Controls whether the modal is visible.
 * @param {boolean} [transparent=false] - Makes the modal background transparent if true.
 * @param {'fade' | 'slide' | 'none'} [animationType='fade'] - Determines the modal's show/hide animation type.
 * @param {() => void} [onRequestClose=() => {}] - Function triggered when the modal is requested to close (e.g., Android back button).
 * @param {React.ReactNode} children - Content or components to render inside the modal.
 *
 * @returns {JSX.Element} A styled modal component that wraps and displays child elements.
*/

import { View, Modal } from 'react-native'
import React from 'react'
import type { ReusableModalProps } from "../types/reusableModal"

export default function reusableModal({
  reusableModalDesign = 'flex-1 bg-black/50 justify-center items-center',
  reuseableModalContainerDesign = 'flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg',
  visible,
  transparent = true,  
  animationType = 'fade',
  onRequestClose = () => {},
  children
} : ReusableModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onRequestClose}
    >
      <View
        className={reusableModalDesign}
      >
        <View
          className={reuseableModalContainerDesign}
        >
          {children}
        </View>
      </View>
    </Modal>
  )
}