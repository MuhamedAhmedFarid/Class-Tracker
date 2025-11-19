import ErrorMsg from '@/components/ErrorMsg';
import Spinner from '@/components/Spinner';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from "@tanstack/react-query";
import { FlatList, RefreshControl, Text, View } from "react-native";
import Student from "../../components/student";
import "../../global.css";

// Mock data fetching function to simulate an API call
const fetchClassSessions = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [];
};

export default function Index() {
  const {
    data: classSessions,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["classSessions"],
    queryFn: fetchClassSessions,
  });

  // Format today's date more nicely
  const formatDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <ErrorMsg msg="Unable to load class sessions. Please try again."/>
  }

  if (!classSessions || classSessions.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-gray-50">
        <Ionicons name="calendar-outline" size={80} color="#60A5FA" />
        <Text className="text-2xl font-bold text-gray-800 mt-6">
          No Sessions Yet
        </Text>
        <Text className="text-base text-gray-600 text-center mt-3 leading-6">
          Get started by adding your first class session.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="bg-white px-6 pt-16 pb-6 shadow-sm">
        <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Today
        </Text>
        <Text className="text-3xl font-bold text-gray-900 mt-1">
          {formatDate()}
        </Text>
      </View>

      {/* Class Sessions List */}
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={classSessions}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#00C897"
            />
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="mb-3">
              <Student
                current={item.current}
                sDate={item.startDate.toLocaleString()}
                eDate={item.endDate.toLocaleString()}
                name={item.name}
              />
            </View>
          )}
          ListHeaderComponent={
            <Text className="text-lg font-semibold text-gray-800 mb-4 px-2">
              Class Sessions
            </Text>
          }
        />
      </View>
    </View>
  );
}