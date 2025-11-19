import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const ErrorMsg = ({ msg }) => {
  return (
    <View className="flex-1 justify-center items-center px-6 bg-gray-50">
      <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
      <Text className="text-2xl font-bold text-gray-800 mt-4">Oops!</Text>
      <Text className="text-base text-gray-600 text-center mt-2">{msg}</Text>
    </View>
  );
};

export default ErrorMsg;
