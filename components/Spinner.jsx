import { View, Text, Image } from 'react-native'
import React from 'react'

const Spinner = () => {
  return (
    <View className="flex-1 justify-center items-center">
        <Image source={require("@/assets/icons/spinner.svg")} />
      </View>
  )
}

export default Spinner