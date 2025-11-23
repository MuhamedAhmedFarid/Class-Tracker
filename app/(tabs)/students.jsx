import StudentForm from "@/components/StudentForm";
import { useRouter } from "expo-router";
import { Filter, Plus, Search, User } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import the robust form we created

// --- MOCK DATA & TYPES ---

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MOCK_STUDENTS = [
  {
    id: "1",
    name: "Ahmed Ali",
    image_url: "https://randomuser.me/api/portraits/men/32.jpg",
    days_of_week: ["Monday", "Thursday"],
    hourly_rate: 150,
    start_time: "14:30",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    image_url: "https://randomuser.me/api/portraits/women/44.jpg",
    days_of_week: ["Sunday", "Tuesday"],
    hourly_rate: 200,
    start_time: "09:00",
  },
  {
    id: "3",
    name: "Karim Mahmoud",
    image_url: null,
    days_of_week: ["Wednesday", "Saturday"],
    hourly_rate: 100,
    start_time: "16:00",
  },
  {
    id: "4",
    name: "Laila Hassan",
    image_url: "https://randomuser.me/api/portraits/women/65.jpg",
    days_of_week: ["Sunday"],
    hourly_rate: 250,
    start_time: "11:00",
  },
];

// --- UTILS ---
const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const useAppContext = () => ({
  t: (key) => {
    const dict = {
      students: "Students",
      searchPlaceholder: "Search by name...",
      rateFilter50: "> 50 EGP",
      rateFilter100: "> 100 EGP",
      noStudentsFound: "No students found",
      egp: "EGP",
      addNewStudent: "Add New Student",
      createStudent: "Create Student",
    };
    if (key.includes("Mon")) return "Mon";
    if (key.includes("Tue")) return "Tue";
    if (key.includes("Wed")) return "Wed";
    if (key.includes("Thu")) return "Thu";
    if (key.includes("Fri")) return "Fri";
    if (key.includes("Sat")) return "Sat";
    if (key.includes("Sun")) return "Sun";

    return dict[key] || key;
  },
  language: "en",
});

// --- INTERNAL COMPONENTS ---

// Filter Chip Component
const FilterChip = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full border mr-2 mb-1 ${
      isActive
        ? "bg-emerald-500 border-emerald-500"
        : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
    }`}
  >
    <Text
      className={`text-xs font-bold ${
        isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// --- MAIN COMPONENT ---

const students = () => {
  const router = useRouter();
  const { t, language } = useAppContext();
  const isRTL = language === "ar";

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDayFilter, setActiveDayFilter] = useState(null);
  const [minRateFilter, setMinRateFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtering Logic
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((student) => {
      const matchesName = student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDay = activeDayFilter
        ? student.days_of_week.includes(activeDayFilter)
        : true;
      const matchesRate = minRateFilter
        ? student.hourly_rate > minRateFilter
        : true;
      return matchesName && matchesDay && matchesRate;
    });
  }, [searchQuery, activeDayFilter, minRateFilter]);

  // Handle Creation
  const handleCreateStudent = (data) => {
    setIsSubmitting(true);

    // Simulate API call
    console.log("Creating new student:", data);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      // In a real app, you would invalidate queries here
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        stickyHeaderIndices={[0]} // Makes the first child (Header Container) sticky
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Sticky Header Container (Title + Search + Filters) */}
        <View className="bg-gray-50 dark:bg-gray-900 pb-2 pt-4">
          {/* Top Bar */}
          <View
            className={`px-4 mb-4 flex-row justify-between items-center ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("students")}
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalOpen(true)}
              className="bg-emerald-500 w-10 h-10 rounded-full items-center justify-center shadow-md"
              style={{ elevation: 4 }}
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="px-4 mb-4">
            <View
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm flex-row items-center px-4 py-3 border border-gray-100 dark:border-gray-700 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Search
                size={18}
                color="#9CA3AF"
                className={isRTL ? "ml-3" : "mr-3"}
              />
              <TextInput
                placeholder={t("searchPlaceholder")}
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className={`flex-1 text-gray-800 dark:text-white text-base ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </View>
          </View>

          {/* Horizontal Filters */}
          <View className="pl-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
              contentContainerStyle={{ paddingRight: 20, paddingBottom: 10 }}
            >
              <View className="flex-row items-center mr-2">
                <Filter size={16} color="#9CA3AF" />
              </View>

              <FilterChip
                label={t("rateFilter50")}
                isActive={minRateFilter === 50}
                onPress={() =>
                  setMinRateFilter(minRateFilter === 50 ? null : 50)
                }
              />
              <FilterChip
                label={t("rateFilter100")}
                isActive={minRateFilter === 100}
                onPress={() =>
                  setMinRateFilter(minRateFilter === 100 ? null : 100)
                }
              />
      
              <View className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2 self-center" />

              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, idx) => {
                  const fullDay = DAYS_OF_WEEK[idx === 6 ? 0 : idx + 1];
                  return (
                    <FilterChip
                      key={day}
                      label={t(day)}
                      isActive={activeDayFilter === fullDay}
                      onPress={() =>
                        setActiveDayFilter(
                          activeDayFilter === fullDay ? null : fullDay
                        )
                      }
                    />
                  );
                }
              )}
            </ScrollView>
          </View>
        </View>

        {/* 2. Student List */}
        <View className="px-4 space-y-3 mt-2">
          {filteredStudents.map((student) => (
            <TouchableOpacity
              key={student.id}
              onPress={() => router.push(`(attendance)/${student.id}`)}
              activeOpacity={0.7}
              className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border my-2 border-gray-100 dark:border-gray-700 flex-row justify-between items-start ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {/* Left Side: Image & Name */}
              <View
                className={`flex-row items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <View
                  className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 ${
                    isRTL ? "ml-3" : "mr-3"
                  }`}
                >
                  {student.image_url ? (
                    <Image
                      source={{ uri: student.image_url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <User size={20} color="#9CA3AF" />
                  )}
                </View>

                <View>
                  <Text
                    className={`font-bold text-gray-900 dark:text-white text-base ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {student.name}
                  </Text>
                  <View
                    className={`flex-row flex-wrap gap-1 mt-1 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {student.days_of_week.map((d) => (
                      <View
                        key={d}
                        className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded"
                      >
                        <Text className="text-[10px] text-gray-600 dark:text-gray-300">
                          {d.slice(0, 3)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Right Side: Stats */}
              <View className={isRTL ? "items-start" : "items-end"}>
                <Text className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {student.hourly_rate} {t("egp")}
                </Text>
                {student.start_time && (
                  <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatTime(student.start_time)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {filteredStudents.length === 0 && (
            <Text className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm">
              {t("noStudentsFound")}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Integrated Student Form Modal */}
      <StudentForm
        visible={isModalOpen}
        title={t("addNewStudent")}
        submitLabel={t("createStudent")}
        isSubmitting={isSubmitting}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateStudent}
        // No initialData passed, so it acts as a Create form
        // No onDelete passed, so the delete button is hidden
      />
    </SafeAreaView>
  );
};

export default students;
