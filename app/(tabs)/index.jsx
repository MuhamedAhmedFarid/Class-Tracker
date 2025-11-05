import { FlatList, Text, View } from "react-native";
import Student from "../../components/student";
import "../../global.css";
export default function Index() {
  const classSessions = [
    { name: "Mohamed", startDate: "10:00 AM", endDate: "11:30 AM" },
    { name: "Alaam", startDate: "9:00 AM", endDate: "10:30 AM" },
    { name: "Korolos", startDate: "1:00 PM", endDate: "3:00 PM", current: true },
    { name: "Haythem", startDate: "8:30 AM", endDate: "10:00 AM" },
    { name: "Ali", startDate: "11:00 AM", endDate: "12:30 PM" },
    { name: "Sara", startDate: "2:00 PM", endDate: "4:00 PM" },
    { name: "Sara", startDate: "2:00 PM", endDate: "4:00 PM" },
    { name: "Sara", startDate: "2:00 PM", endDate: "4:00 PM" },
    { name: "Sara", startDate: "2:00 PM", endDate: "4:00 PM" },
  ];

  return (
    <View className="flex-1">
      <View className="my-24 rounded-lg items-center">
        <Text className=" text-2xl font-bold text-black">
          Today is{" "}
          <Text className="text-primary">{new Date().toDateString()}</Text>
        </Text>
      </View>
      <View className="flex-1 items-center">
       
        <FlatList
          data={classSessions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Student
            current={item.current}
              sDate={item.startDate.toLocaleString()}
              eDate={item.endDate.toLocaleString()}
              name={item.name}
            />
          )}
        />
      </View>
    </View>
  );
}
