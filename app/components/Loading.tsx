import { ActivityIndicator, Modal, View } from 'react-native'

export default function Loading() {
  return (
    <Modal transparent={true} animationType="none">
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
      }}>
        <ActivityIndicator size={100} color="#36978C" />
      </View>
    </Modal>
  )
}
