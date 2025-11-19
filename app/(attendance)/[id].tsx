import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StudentAttendance = () => {
  const sessions = [
    { date: "29/10", day: "السبـــت", status: "completed" },
    { date: "19/10", day: "الأحد", status: "completed" },
    { date: "23/10", day: "الأربعاء", status: "cancelled" },
    { date: "20/10", day: "السبت", status: "completed" },
    { date: "19/10", day: "الأحد", status: "completed" },
    { date: "23/10", day: "الأربعاء", status: "cancelled" },
  ];

  return (
    <SafeAreaView className="flex-1 items-center">
      <View className="mt-10">
        <Text className="text-xl font-semibold">
          Welcome
          <Text className="text-primary">Teacher Name</Text>
        </Text>
      </View>
      <View className="mt-5 flex justify-between w-11/12 flex-row">
        <View className="flex flex-row items-center ml-5">
          <Text className="text-[#5F5F5F] text-lg mr-2 font-bold">Total</Text>
          <Text className="text-primary font-bold">$30</Text>
        </View>
        <Text className="text-lg font-bold mr-5">Name</Text>
      </View>
      <View className="flex-row mb-3 gap-2 mt-10 ">
        <Text className="text-yellow-400 text-3xl">★</Text>
        <Text className="text-yellow-400 text-3xl">★</Text>
        <Text className="text-yellow-400 text-3xl">★</Text>
        <Text className="text-gray-300 text-3xl">★</Text>
      </View>
      // NOTE: Assuming 'secondaryGreen' maps to a bright green color like
      'emerald-500'. // The status check logic is simplified to show the visual
      state based on 'session.status'.
      <ScrollView className="w-full px-5">
        {sessions.map((session, index) => {
          const isAttended = session.status === "completed";
          const primaryColorClass = isAttended
            ? "bg-emerald-500"
            : "bg-red-500";

          return (
            <View
              key={index}
              className={`
            flex-row items-center justify-between overflow-hidden 
                bg-secondaryGreen
            rounded-2xl mb-3 shadow-md
          `}
              style={{ height: 60 }}
            >
      
              <View className="flex-1 flex-row items-center justify-center ">
               
                <Text className="text-lg font-bold text-white">
                  {session.date}
                </Text>
                 <Text className="text-lg font-bold text-white ml-8">
                  {session.day}
                </Text>
              </View>

              <View
                className={`
              w-[40%] h-full bg-[#EEEEEE] flex-row items-center justify-around 
              rounded-2xl 
            `}
              >
                <View className="flex-row items-center">
                  <View
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    ${isAttended ? "bg-white" : "bg-gray-200"}
                `}
                  >
                    {isAttended && (
                      <Text className="text-secondaryGreen font-extrabold text-lg leading-6">
                        ✓
                      </Text>
                    )}
                  </View>
                </View>

                <View className="flex-row items-center">
                  <View
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    ${!isAttended ? "bg-red-500" : "bg-gray-200"}
                `}
                  >
                    {!isAttended && (
                      <Text className="text-white font-bold text-lg leading-6">
                        X
                      </Text>
                     
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentAttendance;
