import { MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

// Note: I've updated 'onCall' to 'onEdit' in the destructured props
const CallItem = ({ name, time, image, onEdit, onDelete }) => {
  return (
    <View className="flex-row items-center justify-between px-8 py-3  mb-2 ">
      <View className="flex-row items-center flex-1">
        <Image
          source={{ uri: image }}
          className="w-14 h-14 rounded-full mr-3"
        />

        <View>
          <Text className="text-black font-bold text-lg">{name}</Text>
          <View className="flex-row items-center">
            <MaterialIcons name="call-made" size={14} color="#00C897" />
            <Text className="text-gray-500 text-sm ml-1">{time}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-4 space-x-4">
        <TouchableOpacity onPress={onEdit}>
          <MaterialIcons name="edit" size={22} color="#989E9C" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete-outline" size={22} color="#989E9C" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CallItem;
