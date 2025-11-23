import StudentForm from "@/components/StudentForm";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    AlertCircle,
    CalendarCheck,
    ChevronLeft,
    Coins,
    Pencil,
    Save,
    User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
// --- TYPES & MOCK DATA ---

// type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

const ATTENDANCE_KEY_MAP = {
  Sunday: "attended_sunday",
  Monday: "attended_monday",
  Tuesday: "attended_tuesday",
  Wednesday: "attended_wednesday",
  Thursday: "attended_thursday",
  Friday: "attended_friday",
  Saturday: "attended_saturday",
};

// Mock Data to simulate API response
const MOCK_STUDENT_DATA = {
  id: "1",
  name: "Omar Khaled",
  image_url: "https://randomuser.me/api/portraits/men/11.jpg",
  hourly_rate: 100,
  paid_amount: 200,
  outstanding_balance: 50,
  days_of_week: ["Monday", "Thursday"],
  // Current attendance state
  attended_monday: true,
  attended_thursday: false,
};

// --- MOCK CONTEXT ---
const useAppContext = () => ({
  t: (key) => {
    const dict = {
      studentDetails: "Student Profile",
      totalDue: "Total Due",
      egp: "EGP",
      includesPastDue: "Includes past due",
      attendance: "Attendance",
      currentWeek: "Current Week",
      present: "Present",
      absent: "Absent",
      saveChanges: "Save Changes",
      editStudent: "Edit Student",
      updateStudent: "Update Student",
      deleteStudent: "Delete Student",
      deleteConfirm: "Are you sure you want to delete this student?",
      cancel: "Cancel",
      nameLabel: "Full Name",
      rateLabel: "Hourly Rate",
      errorLoading: "Error loading student",
      Mon: "Mon",
      Thu: "Thu", // ... add others
    };
    return dict[key] || key;
  },
  language: "en",
});

// --- EDIT MODAL COMPONENT ---
// const EditStudentModal = ({ visible, onClose, initialData, onSubmit, onDelete }) => {
//   const { t } = useAppContext();
//   const [name, setName] = useState(initialData.name);
//   const [rate, setRate] = useState(initialData.hourly_rate.toString());

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1 justify-end"
//       >
//         <View className="flex-1 bg-black/50">
//           <TouchableOpacity className="flex-1" onPress={onClose} />
//           <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 h-3/4 shadow-2xl">

//             {/* Header */}
//             <View className="flex-row justify-between items-center mb-6">
//               <Text className="text-xl font-bold text-gray-900 dark:text-white">{t('editStudent')}</Text>
//               <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
//                 <X size={20} className="text-gray-500" color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             {/* Form */}
//             <View className="space-y-4">
//               <View>
//                 <Text className="text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('nameLabel')}</Text>
//                 <TextInput
//                   value={name}
//                   onChangeText={setName}
//                   className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
//                 />
//               </View>
//               <View>
//                 <Text className="text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('rateLabel')}</Text>
//                 <TextInput
//                   value={rate}
//                   onChangeText={setRate}
//                   keyboardType="numeric"
//                   className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
//                 />
//               </View>

//               {/* Actions */}
//               <View className="mt-6 gap-3">
//                 <TouchableOpacity
//                   onPress={() => onSubmit({ name, rate })}
//                   className="bg-emerald-600 p-4 rounded-xl items-center"
//                 >
//                   <Text className="text-white font-bold text-lg">{t('updateStudent')}</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={onDelete}
//                   className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl items-center border border-rose-100 dark:border-rose-800"
//                 >
//                   <View className="flex-row items-center gap-2">
//                     <Trash2 size={18} color="#EF4444" />
//                     <Text className="text-rose-600 dark:text-rose-400 font-bold text-lg">{t('deleteStudent')}</Text>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// };

// --- MAIN COMPONENT ---

const StudentDetails = () => {
  const { id } = useLocalSearchParams(); // Get ID from route
  const router = useRouter();
  const { t, language } = useAppContext();
  const isRTL = language === "ar";

  // Local State
  const [student, setStudent] = useState(null);
  const [attendanceState, setAttendanceState] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Simulate Fetching Data
  useEffect(() => {
    // In real app: fetchStudentById(id)
    // We use mock data here
    setTimeout(() => {
      setStudent(MOCK_STUDENT_DATA);

      // Initialize attendance state
      const initialState = {};
      MOCK_STUDENT_DATA.days_of_week.forEach((day) => {
        const key = ATTENDANCE_KEY_MAP[day];
        // @ts-ignore
        initialState[key] = MOCK_STUDENT_DATA[key];
      });
      setAttendanceState(initialState);
    }, 500);
  }, [id]);

  // Handle Logic
  const handleToggle = (key, value) => {
    setAttendanceState((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      Alert.alert("Success", "Attendance updated!");
    }, 1000);
  };

  const handleDelete = () => {
    Alert.alert(t("deleteStudent"), t("deleteConfirm"), [
      { text: t("cancel"), style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => router.back() },
    ]);
  };

  if (!student) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  // Calculation Logic
  let attendedCount = 0;
  Object.values(attendanceState).forEach((value) => {
    if (value === true) attendedCount++;
  });
  const currentCycleCost = attendedCount * student.hourly_rate;
  const totalDue = Math.max(
    0,
    currentCycleCost -
      (student.paid_amount || 0) +
      (student.outstanding_balance || 0)
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#059669" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header & Profile Section */}
        <View className="bg-emerald-600 dark:bg-emerald-700 pt-12 pb-16 px-4 rounded-b-[2.5rem] shadow-lg z-0">
          {/* Top Nav */}
          <View
            className={`flex-row justify-between items-center mb-6 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 p-2 rounded-full active:bg-white/30"
            >
              <ChevronLeft
                size={24}
                color="white"
                style={{ transform: [{ rotate: isRTL ? "180deg" : "0deg" }] }}
              />
            </TouchableOpacity>

            <Text className="text-lg font-semibold text-white">
              {t("studentDetails")}
            </Text>

            <TouchableOpacity
              onPress={() => setIsEditModalOpen(true)}
              className="bg-white/20 p-2 rounded-full active:bg-white/30"
            >
              <Pencil size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Center Profile */}
          <View className="items-center">
            <View className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full p-1 mb-3 shadow-md items-center justify-center">
              <View className="w-full h-full rounded-full bg-emerald-100 dark:bg-emerald-900 items-center justify-center overflow-hidden">
                {student.image_url ? (
                  <Image
                    source={{ uri: student.image_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <User size={40} color="#059669" />
                )}
              </View>
            </View>

            <Text className="text-2xl font-bold text-white">
              {student.name}
            </Text>

            <View
              className={`flex-row gap-2 mt-2 opacity-90 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {student.days_of_week.map((day) => (
                <View
                  key={day}
                  className="bg-emerald-800/50 px-2 py-1 rounded border border-emerald-500/30"
                >
                  <Text className="text-xs text-white">{day.slice(0, 3)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 2. Stats Card (Overlapping) */}
        <View className="px-4 -mt-8 z-10">
          <View
            className={`bg-white dark:bg-gray-800 rounded-3xl p-6 flex-row justify-between items-center border border-gray-100 dark:border-gray-700 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
          >
            <View className={isRTL ? "items-end" : "items-start"}>
              <Text className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                {t("totalDue")}
              </Text>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {totalDue.toLocaleString("en-US")}{" "}
                <Text className="text-sm text-gray-400 dark:text-gray-500 font-normal">
                  {t("egp")}
                </Text>
              </Text>

              {(student.outstanding_balance || 0) > 0 && (
                <View
                  className={`flex-row items-center gap-1 mt-1 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <AlertCircle size={12} color="#F43F5E" />
                  <Text className="text-rose-500 dark:text-rose-400 text-xs font-medium">
                    {t("includesPastDue")}
                  </Text>
                </View>
              )}
            </View>

            <View className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full items-center justify-center">
              <Coins size={24} color="#D97706" />
            </View>
          </View>
        </View>

        {/* 3. Attendance List */}
        <View className="px-6 mt-8">
          <View
            className={`flex-row items-center justify-between mb-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <View
              className={`flex-row items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <CalendarCheck size={20} color="#059669" />
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                {t("attendance")}
              </Text>
            </View>
            <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              <Text className="text-xs text-gray-500 dark:text-gray-300">
                {t("currentWeek")}
              </Text>
            </View>
          </View>

          <View className="gap-4">
            {student.days_of_week.map((day) => {
              const dayKey = ATTENDANCE_KEY_MAP[day];
              const isAttended = attendanceState[dayKey] === true;

              return (
                <View
                  key={day}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex-row justify-between items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Text className="font-medium text-gray-700 dark:text-gray-200 text-base">
                    {day}
                  </Text>

                  {/* Toggle Switch */}
                  <View
                    className={`flex-row bg-gray-100 dark:bg-gray-700 rounded-xl p-1 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Present Button */}
                    <TouchableOpacity
                      onPress={() => handleToggle(dayKey, true)}
                      className={`px-4 py-2 rounded-lg ${
                        isAttended
                          ? "bg-emerald-500 shadow-sm"
                          : "bg-transparent"
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          isAttended
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {t("present")}
                      </Text>
                    </TouchableOpacity>

                    {/* Absent Button */}
                    <TouchableOpacity
                      onPress={() => handleToggle(dayKey, false)}
                      className={`px-4 py-2 rounded-lg ${
                        !isAttended ? "bg-rose-500 shadow-sm" : "bg-transparent"
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          !isAttended
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {t("absent")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* 4. Floating Save Button */}
      {hasChanges && (
        <View
          className="absolute bottom-6 left-4 right-4"
          style={{ elevation: 5 }} // Make sure it sits on top
        >
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
            className="w-full bg-gray-900 dark:bg-white py-4 rounded-2xl shadow-xl flex-row justify-center items-center gap-3"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Save
                  size={20}
                  color={Platform.OS === "ios" ? "white" : "#E5E7EB"}
                />
                <Text className="text-white dark:text-gray-900 font-bold text-lg">
                  {t("saveChanges")}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* 5. Edit Modal */}
      {isEditModalOpen && (
        <StudentForm
          title={t("editStudent")}
          submitLabel={t("updateStudent")}
          initialData={student}
        //   onSubmit={(data) => updateDetailsMutation.mutate(data)}
          onDelete={() => deleteMutation.mutate()}
          onCancel={() => setIsEditModalOpen(false)}
        //   isSubmitting={
        //     updateDetailsMutation.isPending || deleteMutation.isPending
        //   }
        />
      )}
    </View>
  );
};

export default StudentDetails;
