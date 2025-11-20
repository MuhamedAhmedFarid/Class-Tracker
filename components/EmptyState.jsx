import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function EmptyState({
  title = "No Data",
  description = "There is nothing here yet.",
  buttonText = "Refresh",
//   onPress,
  iconName = "albums-outline", // Default icon
}) {
  return (
    <View className="flex-1 justify-center items-center px-8 py-12">
      {/* Icon with Background Glow */}
      <View className="relative mb-8">
        <View className="bg-white p-8 rounded-full shadow-xl z-10">
          <Ionicons name={iconName} size={72} color="#CBD5E1" />
        </View>
        <View
          className="absolute inset-0 bg-emerald-100 rounded-full opacity-40"
          style={{ transform: [{ scale: 1.3 }] }}
        />
      </View>

      {/* Text Content */}
      <Text className="text-2xl font-black text-gray-900 mb-3 text-center">
        {title}
      </Text>
      <Text className="text-base text-gray-500 text-center leading-6 mb-10 max-w-xs">
        {description}
      </Text>

      {/* Button - Only renders if onPress is provided */}
      {/* {onPress && (
        <TouchableOpacity
          onPress={onPress}
          className="flex-row items-center bg-white border-2 border-gray-200 px-6 py-4 rounded-full shadow-md active:bg-gray-50"
        >
          <Ionicons
            name={buttonText.toLowerCase().includes("search") ? "close-circle" : "refresh"}
            size={18}
            color="#64748B"
          />
          <Text className="text-gray-700 font-bold ml-2">{buttonText}</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
}