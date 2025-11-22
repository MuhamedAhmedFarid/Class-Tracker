import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "../../components/Spinner";
import { fetchStudentById, toggleStudentAttendance } from "../../services/StudentService";

// Map short day codes to full DB column names
const DAY_MAP = {
  'Sat': { label: 'Saturday', key: 'saturday_attended' },
  'Sun': { label: 'Sunday', key: 'sunday_attended' },
  'Mon': { label: 'Monday', key: 'monday_attended' },
  'Tue': { label: 'Tuesday', key: 'tuesday_attended' },
  'Wed': { label: 'Wednesday', key: 'wednesday_attended' },
  'Thu': { label: 'Thursday', key: 'thursday_attended' },
  'Fri': { label: 'Friday', key: 'friday_attended' },
};

// Helper to calculate the actual date for the current week's days
const getDateForDay = (dayName) => {
  const targetDayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dayName);
  const today = new Date();
  const currentDayIndex = today.getDay();
  
  const diff = targetDayIndex - currentDayIndex;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  
  return `${targetDate.getDate()}/${targetDate.getMonth() + 1}`;
};

const StudentAttendance = () => {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { data: student, isLoading, error } = useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudentById(id),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ dayKey, currentVal }) => toggleStudentAttendance(id, dayKey, currentVal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", id] });
    },
  });

  if (isLoading) {
    return <SafeAreaView className="flex-1 items-center justify-center"><Spinner /></SafeAreaView>;
  }

  if (error || !student) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load student data.</Text>
      </SafeAreaView>
    );
  }

  // Filter and map sessions based on student's days_of_week
  const sessions = (student.days_of_week || []).map(dayCode => {
    const dayInfo = DAY_MAP[dayCode];
    if (!dayInfo) return null;

    const isAttended = student[dayInfo.key];
    const dateString = getDateForDay(dayCode);

    return {
      dayCode,
      fullDay: dayInfo.label,
      dbKey: dayInfo.key,
      date: dateString,
      isAttended
    };
  }).filter(Boolean);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="mt-6 px-5 mb-8">
        <Text className="text-gray-500 text-lg font-medium mb-1">Student Profile</Text>
        <Text className="text-3xl font-bold text-gray-900">{student.name}</Text>
      </View>

      {/* Stats Card */}
      <View className="px-5 mb-10">
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
              Outstanding
            </Text>
            <Text className="text-red-500 text-2xl font-black">
              ${student.outstanding_balance || 0}
            </Text>
          </View>
          <View className="h-10 w-[1px] bg-gray-200" />
          <View>
            <Text className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
              Collected
            </Text>
            <Text className="text-[#00C897] text-2xl font-black">
              ${student.total_collected || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Rating / Status (Visual Only as per request) */}
      <View className="px-5 flex-row mb-8 gap-1">
        {[1, 2, 3].map((_, i) => (
          <Ionicons key={i} name="star" size={24} color="#FBBF24" />
        ))}
        <Ionicons name="star" size={24} color="#E5E7EB" />
        <Ionicons name="star" size={24} color="#E5E7EB" />
      </View>

      {/* Weekly Attendance List */}
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-gray-800 mb-4">Weekly Attendance</Text>
        
        {sessions.length === 0 ? (
            <Text className="text-gray-400 text-center mt-4">No class days scheduled.</Text>
        ) : (
            sessions.map((session, index) => (
            <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => toggleMutation.mutate({ dayKey: session.dbKey, currentVal: session.isAttended })}
                className="flex-row items-center justify-between bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 overflow-hidden h-20"
            >
                {/* Left Date Section */}
                <View className="h-full w-24 bg-[#00C897] items-center justify-center">
                <Text className="text-white font-bold text-lg">{session.date}</Text>
                <Text className="text-white/80 text-xs font-medium uppercase">{session.dayCode}</Text>
                </View>

                {/* Center Day Name */}
                <View className="flex-1 pl-4">
                <Text className="text-gray-800 text-lg font-bold">{session.fullDay}</Text>
                <Text className={`text-xs font-medium ${session.isAttended ? 'text-green-600' : 'text-red-500'}`}>
                    {session.isAttended ? 'Present' : 'Absent'}
                </Text>
                </View>

                {/* Right Status Indicator */}
                <View className="pr-5">
                <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                    session.isAttended ? "bg-green-100" : "bg-red-100"
                    }`}
                >
                    <Ionicons 
                    name={session.isAttended ? "checkmark" : "close"} 
                    size={20} 
                    color={session.isAttended ? "#16A34A" : "#EF4444"} 
                    />
                </View>
                </View>
            </TouchableOpacity>
            ))
        )}
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentAttendance;