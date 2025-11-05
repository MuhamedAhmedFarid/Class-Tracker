import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import SearchBar from "../../components/SearchBar";
import StudentItem from "../../components/StudentItem";
import "../../global.css";

export default function RecentCalls() {
  const calls = [
    {
      id: "1",
      name: "Team Align",
      time: "Today, 09:30 AM",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      time: "Yesterday, 05:20 PM",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: "3",
      name: "Ali Hassan",
      time: "Monday, 10:10 AM",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
    },
  ];

  return (
    <View className="flex-1 mt-24">
      <SearchBar />
      <View className="flex items-center my-10">
        <Text className="text-2xl font-semibold">
          Details of our <Text className="text-primary">Students</Text>
        </Text>
      </View>
      <View className="flex-1 bg-gray-100 ">
        <FlatList
          data={calls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
           <Link href={`/${item.id}`}>
            <StudentItem
              name={item.name}
              time={item.time}
              image={item.image}
              onEdit={() => console.log("Calling", item.name)}
              onDelete={() => console.log("Deleted", item.name)}
            />
           </Link>
          )}
        />
        <TouchableOpacity
          onPress={() => console.log("Add new student")} // Add your desired action here
          className="absolute bottom-28 right-6 bg-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
