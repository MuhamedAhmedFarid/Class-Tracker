import { Trash2, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import TimePickerField from "./TimePickerField"; // Import the component

// --- TYPES ---
export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// --- MOCK CONTEXT ---
const useAppContext = () => ({
  t: (key) => {
    const dict = {
      fullName: "Full Name",
      fullNamePlaceholder: "Ex: Omar Khaled",
      hourlyRate: "Hourly Rate",
      startTime: "Start Time",
      endTime: "End Time",
      scheduleDays: "Schedule Days",
      deleteConfirm: "Are you sure you want to delete this student?",
      deleteStudent: "Delete Student",
      cancel: "Cancel",
      Mon: "Mon",
      Thu: "Thu", // ... etc
    };
    return dict[key] || key;
  },
});

// --- MAIN COMPONENT ---
const StudentForm = ({
  initialData,
  onSubmit,
  onDelete,
  isSubmitting,
  onCancel,
  title,
  submitLabel,
  visible = true,
}) => {
  const { t } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    hourly_rate: 0,
    days_of_week: [],
    start_time: "",
    end_time: "",
  });

  // Sync initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        hourly_rate: initialData.hourly_rate || 0,
        days_of_week: initialData.days_of_week || [],
        start_time: initialData.start_time || "",
        end_time: initialData.end_time || "",
      });
    }
  }, [initialData]);

  const toggleDaySelection = (day) => {
    setFormData((prev) => {
      const exists = prev.days_of_week.includes(day);
      return {
        ...prev,
        days_of_week: exists
          ? prev.days_of_week.filter((d) => d !== day)
          : [...prev.days_of_week, day],
      };
    });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      Alert.alert("Validation Error", "Please enter a name");
      return;
    }
    onSubmit(formData);
  };

  const handleDelete = () => {
    Alert.alert(t("deleteStudent"), t("deleteConfirm"), [
      { text: t("cancel"), style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-end sm:justify-center bg-black/60">
          {/* Backdrop Tap to Close */}
          <TouchableOpacity
            activeOpacity={1}
            className="absolute inset-0"
            onPress={onCancel}
          />

          {/* Modal Card */}
          <View className="bg-white dark:bg-gray-800 w-full sm:max-w-sm sm:mx-auto rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90%] border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </Text>
              <TouchableOpacity
                onPress={onCancel}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full"
              >
                <X
                  size={24}
                  className="text-gray-400 dark:text-gray-300"
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Name Input */}
              <View className="mb-4">
                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {t("fullName")}
                </Text>
                <TextInput
                  autoFocus
                  className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-base"
                  placeholder={t("fullNamePlaceholder")}
                  placeholderTextColor="#9CA3AF"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
              </View>

              {/* Hourly Rate */}
              <View className="mb-4">
                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {t("hourlyRate")}
                </Text>
                <TextInput
                  keyboardType="numeric"
                  className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-base"
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  value={formData.hourly_rate.toString()}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      hourly_rate: parseFloat(text) || 0,
                    })
                  }
                />
              </View>

              {/* Time Picker Fields */}
              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <TimePickerField
                    label={t("startTime")}
                    value={formData.start_time}
                    onChange={(val) =>
                      setFormData({ ...formData, start_time: val })
                    }
                    placeholder="9:00 AM"
                  />
                </View>
                <View className="flex-1">
                  <TimePickerField
                    label={t("endTime")}
                    value={formData.end_time}
                    onChange={(val) =>
                      setFormData({ ...formData, end_time: val })
                    }
                    placeholder="10:00 AM"
                  />
                </View>
              </View>

              {/* Days Selection */}
              <View className="mb-6">
                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {t("scheduleDays")}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = formData.days_of_week.includes(day);
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDaySelection(day)}
                        activeOpacity={0.7}
                        className={`px-3 py-2 rounded-lg border ${
                          isSelected
                            ? "bg-emerald-500 border-emerald-500"
                            : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            isSelected
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
                className="w-full bg-emerald-600 py-4 rounded-xl flex-row justify-center items-center shadow-lg shadow-emerald-500/20"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    {submitLabel}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Delete Button (Optional) */}
              {onDelete && (
                <TouchableOpacity
                  onPress={handleDelete}
                  activeOpacity={0.7}
                  className="w-full bg-rose-50 dark:bg-rose-900/20 py-3 rounded-xl mt-3 flex-row justify-center items-center gap-2"
                >
                  <Trash2 size={18} color="#EF4444" />
                  <Text className="text-rose-600 dark:text-rose-400 font-bold">
                    {t("deleteStudent")}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default StudentForm;