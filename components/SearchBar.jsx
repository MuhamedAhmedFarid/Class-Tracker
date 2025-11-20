import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { TextInput, View } from "react-native";

// Updated to receive value and onChangeText props
const SearchBar = ({ value, onChangeText }) => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="p-4 pt-0">
      <View 
        className="flex-row items-center border border-[#F4F3FD] rounded-xl bg-purple-100/50 h-14 px-4"
      >
        <Feather name="search" size={20} color="#B8B8D2" className="mr-2" />

        <TextInput
          className="flex-1 text-base text-gray-700"
          placeholder="Search for a student..."
          placeholderTextColor="#B8B8D2"
          keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
          // Bind the input value and handler
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default SearchBar;