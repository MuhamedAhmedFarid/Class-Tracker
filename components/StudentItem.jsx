import { MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

const StudentItem = ({ name, startTime, endTime, image, onEdit, onDelete }) => {
 
  
  return (
    <View className="flex-row items-center justify-between p-4 mb-3 bg-white rounded-2xl shadow-sm mx-4 border border-gray-100">
      
      {/* Left Side: Image + Info */}
      <View className="flex-row items-center flex-1 mr-2">
        <Image
          source={{ uri: image }}
          className="w-12 h-12 rounded-full mr-4 bg-gray-200"
        />

        <View className="flex-1">
          <Text 
            className="text-gray-900 font-bold text-lg leading-tight mb-1" 
            numberOfLines={1}
          >
            {name}
          </Text>
          
          {/* Time Row with Icon */}
          <View className="flex-row items-center">
            <MaterialIcons name="access-time" size={14} color="#00C897" />
            <Text className="text-gray-500 text-xs font-medium ml-1">
              {startTime} <Text className="text-gray-300">-</Text> {endTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Right Side: Actions */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity 
          onPress={onEdit}
          className="w-9 h-9 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100"
        >
          <MaterialIcons name="edit" size={18} color="#64748B" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onDelete}
          className="w-9 h-9 items-center justify-center rounded-full bg-red-50 active:bg-red-100"
        >
          <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default StudentItem;