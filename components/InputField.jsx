import { Text, TextInput, View } from "react-native";

const InputField = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  return (
    <View className="mb-4">
      {/* Label */}
      <Text className="text-black text-sm mb-2">{label}</Text>

      {/* Input box */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#B3B3B3"
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        className="w-full px-4 py-4 rounded-xl border border-primary text-black"
      />
    </View>
  );
};

export default InputField;
