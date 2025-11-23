import { useRouter } from 'expo-router';
import { AlertCircle, CheckCircle2, ChevronRight, DollarSign, Search, User, Wallet } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- MOCK DATA & TYPES ---

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ATTENDANCE_KEY_MAP = {
  'Sunday': 'attended_sunday',
  'Monday': 'attended_monday',
  'Tuesday': 'attended_tuesday',
  'Wednesday': 'attended_wednesday',
  'Thursday': 'attended_thursday',
  'Friday': 'attended_friday',
  'Saturday': 'attended_saturday',
};

const MOCK_STUDENTS = [
  {
    id: '1',
    name: 'Omar Khaled',
    image_url: 'https://randomuser.me/api/portraits/men/11.jpg',
    hourly_rate: 100,
    paid_amount: 200,
    outstanding_balance: 50,
    total_collected: 1500,
    attended_sunday: true,
    attended_monday: true,
    attended_tuesday: true,
    attended_wednesday: false,
  },
  {
    id: '2',
    name: 'Nour El-Din',
    image_url: 'https://randomuser.me/api/portraits/women/22.jpg',
    hourly_rate: 150,
    paid_amount: 450,
    outstanding_balance: 0,
    total_collected: 3200,
    attended_sunday: true,
    attended_wednesday: true,
    attended_thursday: true,
  },
  {
    id: '3',
    name: 'Youssef Ahmed',
    image_url: null,
    hourly_rate: 120,
    paid_amount: 0,
    outstanding_balance: 120,
    total_collected: 800,
    attended_monday: true,
  },
];

// --- MOCK CONTEXT ---
const useAppContext = () => {
  return {
    t: (key) => {
      const dict = {
        financials: "Financial Reports",
        lifetimeCollected: "Lifetime Collected",
        totalDue: "Total Due",
        tapDetails: "Tap for details",
        searchPlaceholder: "Search students...",
        classesWeek: "classes this week",
        due: "Due",
        settled: "Settled",
        egp: "EGP",
        noStudentsFound: "No students found",
      };
      return dict[key] || key;
    },
    language: 'en' // Change to 'ar' to test RTL
  };
};

// --- MAIN COMPONENT ---

const report = () => {
  const router = useRouter();
  const { t, language } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const isRTL = language === 'ar';

  // --- CALCULATION LOGIC ---
  const { filteredStudents, totalOutstanding, totalLifetimeCollected } = useMemo(() => {
    let totalDueSum = 0;
    let totalCollectedSum = 0;

    const filtered = MOCK_STUDENTS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(student => {
      let attendedCount = 0;
      DAYS_OF_WEEK.forEach(day => {
        const key = ATTENDANCE_KEY_MAP[day];
        // @ts-ignore 
        if (student[key] === true) {
          attendedCount++;
        }
      });
      
      const currentCycleCost = attendedCount * student.hourly_rate;
      const paid = student.paid_amount || 0;
      const outstanding = student.outstanding_balance || 0;
      
      const due = Math.max(0, (currentCycleCost - paid) + outstanding);
      
      totalDueSum += due;
      totalCollectedSum += (student.total_collected || 0);
      
      return { ...student, due, paid, currentCycleCost, attendedCount };
    }).sort((a, b) => b.due - a.due);

    return { filteredStudents: filtered, totalOutstanding: totalDueSum, totalLifetimeCollected: totalCollectedSum };
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. GREEN HEADER 
           Note: 'pb-24' gives extra space at the bottom for the overlap 
        */}
        <View className="bg-emerald-600 dark:bg-emerald-700 pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-lg">
          
          {/* Title */}
          <View className={`flex-row items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DollarSign size={28} color="#A7F3D0" className={isRTL ? 'ml-2' : 'mr-2'} />
            <Text className="text-2xl font-bold text-white">
              {t('financials')}
            </Text>
          </View>
          
          {/* Stats Grid */}
          <View className={`flex-row gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Lifetime Collected Card */}
            <TouchableOpacity 
              onPress={() => router.push('/reports/financials?tab=collected')}
              activeOpacity={0.8}
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl p-4 justify-between"
            >
              <View className={isRTL ? 'items-end' : 'items-start'}>
                <View className={`flex-row items-center mb-1 opacity-80 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Wallet size={14} color="#6EE7B7" className={isRTL ? 'ml-1.5' : 'mr-1.5'} />
                  <Text className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                    {t('lifetimeCollected')}
                  </Text>
                </View>
                <Text className="text-3xl font-bold text-white mt-1">
                  {totalLifetimeCollected.toLocaleString('en-US')}
                </Text>
              </View>
              <View className={`flex-row items-center justify-between mt-4 opacity-60 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Text className="text-[10px] text-white">{t('tapDetails')}</Text>
                <ChevronRight size={12} color="white" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
              </View>
            </TouchableOpacity>

            {/* Total Due Card */}
            <TouchableOpacity 
              onPress={() => router.push('/reports/financials?tab=due')}
              activeOpacity={0.8}
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl p-4 justify-between"
            >
                <View className={isRTL ? 'items-end' : 'items-start'}>
                <View className={`flex-row items-center mb-1 opacity-80 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle size={14} color="#FDA4AF" className={isRTL ? 'ml-1.5' : 'mr-1.5'} />
                  <Text className="text-rose-100 text-[10px] font-bold uppercase tracking-wider">
                    {t('totalDue')}
                  </Text>
                </View>
                <Text className="text-3xl font-bold text-white mt-1">
                  {totalOutstanding.toLocaleString('en-US')}
                </Text>
                </View>
                <View className={`flex-row items-center justify-between mt-4 opacity-60 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Text className="text-[10px] text-white">{t('tapDetails')}</Text>
                <ChevronRight size={12} color="white" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. SEARCH BAR (Floating/Overlapping)
            Note: '-mt-8' pulls this View UP into the green header.
            Note: 'mx-6' matches the header padding so it aligns with the cards.
        */}
        <View className={`mx-4 -mt-8 bg-slate-800 rounded-2xl shadow-lg flex-row items-center px-4 py-2 border border-slate-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Search size={20} color="#94a3b8" className={isRTL ? 'ml-3' : 'mr-3'} />
            <TextInput 
              placeholder={t('searchPlaceholder')}
              placeholderTextColor="#94a3b8" 
              value={searchQuery}
              onChangeText={setSearchQuery}
              className={`flex-1 text-white text-base font-medium ${isRTL ? 'text-right' : 'text-left'}`}
              selectionColor="#10b981"
            />
        </View>

        {/* 3. STUDENT LIST */}
        <View className="px-4 mt-6">
          <View className="gap-3">
            {filteredStudents.map((student) => (
              <TouchableOpacity 
                key={student.id}
                onPress={() => router.push(`/reports/student/${student.id}`)}
                activeOpacity={0.7}
                className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ elevation: 2 }}
              >
                {/* Left: Avatar & Name */}
                <View className={`flex-row items-center flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <View className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center border border-gray-200 dark:border-gray-600 overflow-hidden ${isRTL ? 'ml-3' : 'mr-3'}`}>
                    {student.image_url ? (
                      <Image source={{ uri: student.image_url }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <User size={20} color="#9CA3AF" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className={`font-bold text-base text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                      {student.name}
                    </Text>
                    <View className={`flex-row items-center mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        <Text className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                          {student.attendedCount.toLocaleString('en-US')} {t('classesWeek')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Right: Financials */}
                <View className={`flex-row items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <View className={isRTL ? 'items-start' : 'items-end'}>
                    {/* Due Amount Logic */}
                    {student.due > 0 ? (
                      <View className="mb-0.5">
                        <Text className={`font-bold text-base text-gray-900 dark:text-white ${isRTL ? 'text-left' : 'text-right'}`}>
                          {student.due.toLocaleString('en-US')} <Text className="text-[10px] font-normal text-gray-400">{t('egp')}</Text>
                        </Text>
                        <Text className={`text-[10px] text-rose-500 font-bold uppercase tracking-wide ${isRTL ? 'text-left' : 'text-right'}`}>
                          {t('due')}
                        </Text>
                      </View>
                    ) : (
                      <View className={`mb-0.5 flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Text className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {t('settled')}
                        </Text>
                        <CheckCircle2 size={14} color="#059669" className={isRTL ? 'mr-1' : 'ml-1'} />
                      </View>
                    )}

                    <Text className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                      Life: {student.total_collected?.toLocaleString('en-US') || 0}
                    </Text>
                  </View>

                  <ChevronRight 
                    size={18} 
                    color="#D1D5DB" 
                    style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }}
                    className={isRTL ? 'mr-2' : 'ml-2'}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default report;