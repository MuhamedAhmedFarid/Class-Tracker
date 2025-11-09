import React from "react";
import { Text, TextInput, View } from "react-native";

const TextInputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  autoFocus = false,
  keyboardType = "default",
  className = "",
}) => {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-black text-sm mb-2">{label}</Text>
      )}
      <TextInput
        className="w-full px-4 py-4 rounded-xl border border-primary text-black"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        autoFocus={autoFocus}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default TextInputField;

