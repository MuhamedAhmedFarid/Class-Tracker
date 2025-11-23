import { useRouter } from 'expo-router'; // Replacement for useNavigate
import { Calendar, ChevronRight, Clock, Settings, User } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

// --- MOCK DATA & TYPES ---

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to ensure we always have data for "Today" for testing purposes
const getDynamicDays = (baseDays) => {
  const todayIndex = new Date().getDay();
  const todayName = DAYS_OF_WEEK[todayIndex];
  // If the random check passes, add today to the student's schedule
  return baseDays.includes(todayName) ? baseDays : [...baseDays, todayName];
};

const MOCK_STUDENTS = [
  {
    id: '1',
    name: 'Ahmed Ali',
    image_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    days_of_week: DAYS_OF_WEEK, // Everyday
    start_time: '14:30',
    end_time: '15:30',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    image_url: 'https://randomuser.me/api/portraits/women/44.jpg',
    days_of_week: getDynamicDays(['Monday', 'Wednesday']),
    start_time: '09:00',
    end_time: '10:30',
  },
  {
    id: '3',
    name: 'Karim Mahmoud',
    image_url: null, // Test placeholder logic
    days_of_week: getDynamicDays(['Tuesday', 'Thursday']),
    start_time: '16:00',
    end_time: '17:00',
  },
  {
    id: '4',
    name: 'Laila Hassan',
    image_url: 'https://randomuser.me/api/portraits/women/65.jpg',
    days_of_week: getDynamicDays(['Sunday']),
    start_time: null, // Test no time logic
    end_time: null,
  }
];

// --- MOCK CONTEXT (Replace with your actual Context) ---
const useAppContext = () => {
  return {
    t: (key) => {
      const dict = {
        todaysClasses: "Today's Classes",
        totalStudents: "Total Students",
        pending: "Pending",
        noClasses: "No classes today",
        enjoyDayOff: "Enjoy your day off!",
        noTimeSet: "No time set",
        errorLoading: "Error loading data"
      };
      return dict[key] || key;
    },
    language: 'en' // Change to 'ar' to test RTL logic
  };
};

// --- UTILS ---
const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

// --- MAIN COMPONENT ---

const index = () => {
  const router = useRouter();
  const { t, language } = useAppContext();

  // Logic to determine today
  const todayIndex = new Date().getDay();
  const todayName = DAYS_OF_WEEK[todayIndex];

  // --- DATA FILTERING LOGIC ---
  // In real app, this comes from useQuery
  const sortedStudents = useMemo(() => {
    const todayClasses = MOCK_STUDENTS.filter(student => 
      student.days_of_week.includes(todayName)
    );

    return todayClasses.sort((a, b) => {
      if (a.start_time && b.start_time) {
        return a.start_time.localeCompare(b.start_time);
      }
      return a.name.localeCompare(b.name);
    });
  }, [todayName]);

  // Localization formatting
  const locale = language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
  const currentDateStr = new Date().toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const isRTL = language === 'ar';

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="bg-white dark:bg-gray-800 pt-12 pb-6 px-6 rounded-b-3xl shadow-sm border-b border-gray-100 dark:border-gray-700">
          <View className={`flex-row justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('todaysClasses')}
            </Text>
            
            <TouchableOpacity 
              onPress={() => router.push('(settings)')}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center"
            >
              <Settings size={20} className="text-gray-600 dark:text-gray-300" color={Platform.OS === 'ios' ? undefined : '#4B5563'} />
            </TouchableOpacity>
          </View>

          <Text className={`text-emerald-600 dark:text-emerald-400 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
            {currentDateStr}
          </Text>

          {/* Stats Cards */}
          <View className={`mt-6 flex-row gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <View className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex-1">
              <Text className={`text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('totalStudents')}
              </Text>
              <Text className={`text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {sortedStudents.length}
              </Text>
            </View>

            <View className="bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex-1">
              <Text className={`text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('pending')}
              </Text>
              <Text className={`text-2xl font-bold text-gray-400 dark:text-gray-500 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                -
              </Text>
            </View>
          </View>
        </View>

        {/* List Section */}
        <View className="px-4 mt-6">
          {sortedStudents.length === 0 ? (
            <View className="items-center justify-center py-20">
              <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                <Calendar size={32} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {t('noClasses')}
              </Text>
              <Text className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {t('enjoyDayOff')}
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {sortedStudents.map((student) => (
                <TouchableOpacity
                  key={student.id}
                  onPress={() => router.push(`(attendance)/${student.id}`)}
                  activeOpacity={0.7}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}
                  // Elevation for Android Shadows
                  style={{ elevation: 2 }} 
                >
                  {/* Avatar */}
                  <View className={`w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    {student.image_url ? (
                      <Image 
                        source={{ uri: student.image_url }} 
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full items-center justify-center">
                        <User size={20} color="#9CA3AF" />
                      </View>
                    )}
                  </View>

                  {/* Info */}
                  <View className="flex-1">
                    <Text className={`text-base font-bold text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                      {student.name}
                    </Text>
                    
                    <View className={`flex-row items-center mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {student.start_time ? (
                        <View className={`flex-row items-center bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Clock size={12} color="#059669" className={isRTL ? "ml-1" : "mr-1"} />
                          <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                            {formatTime(student.start_time)}
                            {student.end_time ? ` - ${formatTime(student.end_time)}` : ''}
                          </Text>
                        </View>
                      ) : (
                        <Text className="text-xs text-gray-400 italic">
                          {t('noTimeSet')}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Chevron */}
                  <ChevronRight 
                    size={20} 
                    color="#D1D5DB" 
                    style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default index;