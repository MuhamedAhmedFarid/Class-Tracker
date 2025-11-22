import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "../../components/Spinner.jsx";
import { fetchStudentById, toggleStudentAttendance } from "../../services/StudentService.js";

const DAY_MAP = {
  'Sat': { label: 'Saturday', key: 'saturday_attended' },
  'Sun': { label: 'Sunday', key: 'sunday_attended' },
  'Mon': { label: 'Monday', key: 'monday_attended' },
  'Tue': { label: 'Tuesday', key: 'tuesday_attended' },
  'Wed': { label: 'Wednesday', key: 'wednesday_attended' },
  'Thu': { label: 'Thursday', key: 'thursday_attended' },
  'Fri': { label: 'Friday', key: 'friday_attended' },
};

// Fix Date Logic: Calculate dates based on a Saturday-start week
// If today is Sat 22, then Sat=22, Sun=23, Mon=24...
const getDateForDay = (dayCode) => {
  const order = { 'Sat': 0, 'Sun': 1, 'Mon': 2, 'Tue': 3, 'Wed': 4, 'Thu': 5, 'Fri': 6 };
  
  const today = new Date();
  const currentDayJS = today.getDay(); // Sun=0, Sat=6
  
  // Convert standard JS index to our "Saturday = 0" index
  const currentDayIndex = (currentDayJS + 1) % 7; // Sat(6)->0, Sun(0)->1
  
  const targetIndex = order[dayCode];
  
  // Calculate difference: target - current
  // Example: Today Sat(0), Target Sun(1). Diff = 1. Date = Today + 1
  // Example: Today Sun(1), Target Sat(0). Diff = -1. Date = Today - 1 (Shows date within current week cycle starting previous Sat)
  const diff = targetIndex - currentDayIndex;
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  
  // Format as DD/MM
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
    mutationFn: ({ dayKey, status }) => toggleStudentAttendance(id, dayKey, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      queryClient.invalidateQueries({ queryKey: ["students"] }); // Sync with main list
    },
  });

  // Dynamically calculate financial stats on the client
  const stats = useMemo(() => {
    if (!student) return { outstanding: 0, collected: 0 };
    
    // Count how many days are marked 'true' (Attended)
    let attendedCount = 0;
    const weekDays = ['saturday_attended', 'sunday_attended', 'monday_attended', 'tuesday_attended', 'wednesday_attended', 'thursday_attended', 'friday_attended'];
    
    weekDays.forEach(key => {
        if (student[key]) attendedCount++;
    });
    
    const hourlyRate = student.hourly_rate || 0;
    const totalCost = attendedCount * hourlyRate;
    const paidAmount = student.paid_amount || 0;
    
    // Outstanding = Cost of classes attended - Amount Paid
    const outstanding = Math.max(0, totalCost - paidAmount);
    
    return {
      outstanding: outstanding.toFixed(2),
      collected: paidAmount.toFixed(2)
    };
  }, [student]);

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

  // Filter sessions based on student's days_of_week settings
  const sessions = (student.days_of_week || []).map(dayCode => {
    const dayInfo = DAY_MAP[dayCode];
    if (!dayInfo) return null;

    const isAttended = student[dayInfo.key]; // boolean
    const dateString = getDateForDay(dayCode);

    return {
      dayCode,
      fullDay: dayInfo.label,
      dbKey: dayInfo.key,
      date: dateString,
      isAttended
    };
  }).filter(Boolean);

  // Sort sessions by the custom week order (Sat -> Fri)
  const weekOrder = { 'Sat': 0, 'Sun': 1, 'Mon': 2, 'Tue': 3, 'Wed': 4, 'Thu': 5, 'Fri': 6 };
  sessions.sort((a, b) => weekOrder[a.dayCode] - weekOrder[b.dayCode]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="mt-6 px-5 mb-8">
        <Text className="text-gray-500 text-lg font-medium mb-1">Student Profile</Text>
        <Text className="text-3xl font-bold text-gray-900">{student.name}</Text>
      </View>

      {/* Stats Card */}
      <View className="px-5 mb-10">
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
              Outstanding
            </Text>
            <Text className="text-red-500 text-3xl font-black">
              ${stats.outstanding}
            </Text>
          </View>
          <View className="h-12 w-[1px] bg-gray-100" />
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
              Collected
            </Text>
            <Text className="text-[#00C897] text-3xl font-black">
              ${stats.collected}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-gray-800 mb-4">Weekly Attendance</Text>
        
        {sessions.length === 0 ? (
            <Text className="text-gray-400 text-center mt-4">No class days scheduled.</Text>
        ) : (
            sessions.map((session, index) => (
            <View
                key={index}
                className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 overflow-hidden p-4"
            >
                {/* Top Row: Date & Status */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                        <View className="bg-gray-50 px-3 py-1 rounded-lg mr-3 border border-gray-100">
                             <Text className="text-gray-700 font-bold">{session.date}</Text>
                        </View>
                        <Text className="text-lg font-bold text-gray-800">{session.fullDay}</Text>
                    </View>
                    
                    <View className={`px-3 py-1 rounded-full ${session.isAttended ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Text className={`text-xs font-bold ${session.isAttended ? 'text-green-700' : 'text-red-700'}`}>
                            {session.isAttended ? 'Present' : 'Absent'}
                        </Text>
                    </View>
                </View>

                {/* Bottom Row: Action Buttons (Two Buttons as requested) */}
                <View className="flex-row gap-3">
                    {/* Absent Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleMutation.mutate({ dayKey: session.dbKey, status: false })}
                        className={`flex-1 py-3.5 rounded-xl flex-row justify-center items-center border ${
                            !session.isAttended 
                              ? 'bg-red-500 border-red-500 shadow-sm' 
                              : 'bg-white border-gray-200'
                        }`}
                    >
                         <Ionicons 
                            name="close-circle" 
                            size={20} 
                            color={!session.isAttended ? "white" : "#9CA3AF"} 
                         />
                         <Text className={`ml-2 font-bold ${!session.isAttended ? 'text-white' : 'text-gray-500'}`}>
                             Absent
                         </Text>
                    </TouchableOpacity>

                    {/* Present Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleMutation.mutate({ dayKey: session.dbKey, status: true })}
                        className={`flex-1 py-3.5 rounded-xl flex-row justify-center items-center border ${
                            session.isAttended 
                              ? 'bg-[#00C897] border-[#00C897] shadow-sm' 
                              : 'bg-white border-gray-200'
                        }`}
                    >
                         <Ionicons 
                            name="checkmark-circle" 
                            size={20} 
                            color={session.isAttended ? "white" : "#9CA3AF"} 
                         />
                         <Text className={`ml-2 font-bold ${session.isAttended ? 'text-white' : 'text-gray-500'}`}>
                             Attend
                         </Text>
                    </TouchableOpacity>
                </View>
            </View>
            ))
        )}
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentAttendance;