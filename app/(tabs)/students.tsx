import PrimaryButton from "@/components/Button";
import EmptyState from "@/components/EmptyState"; // <--- IMPORT ADDED
import ErrorMsg from "@/components/ErrorMsg";
import Spinner from "@/components/Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import {
  deleteStudent,
  fetchStudentsFromSupabase,
  updateStudent,
} from "@/services/StudentService";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddStudentModal from "../../components/AddStudentModal";
import SearchBar from "../../components/SearchBar";
import StudentItem from "../../components/StudentItem";
import TextInputField from "../../components/TextInputField";
import "../../global.css";

// Define the precise type expected for local data and mutations
type AmountRangeType = { label: string; min: number; max: number };

type StudentDataType = {
  id: string;
  name: string;
  time: string;
  startTime: string;
  endTime: string;
  image: string;
  hourlyRate: number;
  daysOfWeek: string[];
};

const DAYS = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = [
  "Morning (6AM-12PM)",
  "Afternoon (12PM-6PM)",
  "Evening (6PM-12AM)",
];
const AMOUNT_RANGES: AmountRangeType[] = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 49.99 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100.01, max: 200 },
  { label: "Over $200", min: 200.01, max: Infinity },
];

// UTILITY: Safely converts formatted time string to a 24-hour integer for comparison
const getHour24 = (timeString: string): number | null => {
  const match = timeString.match(/(\d{1,2}):\d{2}\s+(AM|PM)/i);
  if (!match) return null;

  let hour = parseInt(match[1]);
  const period = match[2].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour;
};

export default function Students() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter states
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedAmountRange, setSelectedAmountRange] =
    useState<AmountRangeType>(AMOUNT_RANGES[0]);

  const [editingStudent, setEditingStudent] = useState<StudentDataType | null>(
    null
  );
  const [deletingStudent, setDeletingStudent] =
    useState<StudentDataType | null>(null);
  const [editInputValue, setEditInputValue] = useState("");

  const queryClient = useQueryClient();

  // Filter animation setup
  const filterBadgeAnim = React.useRef(new Animated.Value(1)).current;

  const activeFilterCount =
    selectedDays.length +
    (selectedTimeSlot ? 1 : 0) +
    (selectedAmountRange.label !== "All" ? 1 : 0);

  React.useEffect(() => {
    if (activeFilterCount > 0) {
      Animated.sequence([
        Animated.timing(filterBadgeAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(filterBadgeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedDays, selectedTimeSlot, selectedAmountRange]);

  // --- READ QUERY ---
  const {
    data: allStudents,
    isLoading,
    isError,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudentsFromSupabase,
  });

  // --- FILTERING LOGIC ---
  const students = useMemo(() => {
    if (!allStudents) return [];

    let filtered = allStudents as StudentDataType[];

    // 1. Search filter
    if (debouncedSearchQuery) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((student) =>
        student.name.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // 2. Day filter
    if (selectedDays.length > 0) {
      filtered = filtered.filter((student) =>
        student.daysOfWeek?.some((day: string) => selectedDays.includes(day))
      );
    }

    // 3. Time slot filter
    if (selectedTimeSlot) {
      filtered = filtered.filter((student) => {
        const hour24 = getHour24(student.time);
        if (hour24 === null) return false;

        if (selectedTimeSlot.includes("Morning")) {
          return hour24 >= 6 && hour24 <= 12;
        } else if (selectedTimeSlot.includes("Afternoon")) {
          return hour24 > 12 && hour24 < 18;
        } else if (selectedTimeSlot.includes("Evening")) {
          return hour24 >= 18 || hour24 === 0;
        }
        return false;
      });
    }

    // 4. Amount filter
    if (selectedAmountRange.label !== "All") {
      filtered = filtered.filter((student) => {
        const rate = student.hourlyRate || 0;
        return (
          rate >= selectedAmountRange.min && rate <= selectedAmountRange.max
        );
      });
    }

    return filtered;
  }, [
    allStudents,
    debouncedSearchQuery,
    selectedDays,
    selectedTimeSlot,
    selectedAmountRange,
  ]);

  // --- MUTATIONS ---
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      handleCloseDeleteModal();
    },
    onError: (e) => alert("Failed to delete student: " + e.message),
  });

  const editMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      handleCloseEditModal();
    },
    onError: (e) => alert("Failed to update student: " + e.message),
  });

  // --- HANDLERS ---
  const handleEditStudent = (student: StudentDataType) => {
    setEditingStudent(student);
    setEditInputValue(student.name);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditingStudent(null);
    setEditInputValue("");
  };

  const handleConfirmEdit = () => {
    if (editingStudent && editInputValue.trim() !== "") {
      editMutation.mutate({
        id: editingStudent.id,
        newName: editInputValue.trim(),
      });
    }
  };

  const handleDeleteStudent = (student: StudentDataType) => {
    setDeletingStudent(student);
    setDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalVisible(false);
    setDeletingStudent(null);
  };

  const handleConfirmDelete = () => {
    if (deletingStudent) deleteMutation.mutate(deletingStudent.id);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const clearFilters = () => {
    setSelectedDays([]);
    setSelectedTimeSlot("");
    setSelectedAmountRange(AMOUNT_RANGES[0]);
    setSearchQuery("");
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  });

  const studentListHeight = students ? students.length * 80 : 0;
  const isSearchActive = searchQuery.length > 0;

  // --- RENDER HELPER ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center pt-20">
          <Spinner />
        </View>
      );
    }

    if (isError || !allStudents) {
      return (
        <View className="flex-1 justify-center items-center pt-20 px-4">
          <ErrorMsg msg={error ? error.message : "Unable to load students."} />
          <View className="mt-6 w-full max-w-xs">
            <PrimaryButton title="Retry Fetch" onPress={() => refetch()} />
          </View>
        </View>
      );
    }

    // --- PREPARE EMPTY STATE PROPS ---
    let emptyTitle = "No Students Added Yet";
    let emptyDescription =
      "Tap below to add your first student to start tracking attendance.";
    let emptyIcon = "people-outline";
    let emptyButtonAction = () => setModalVisible(true);
    let emptyButtonText = "Add New Student";

    if (isSearchActive || activeFilterCount > 0) {
      emptyTitle = "No Matches Found";
      emptyDescription = isSearchActive
        ? `We couldn't find any student matching "${searchQuery}".`
        : "Try clearing your filters.";
      emptyIcon = "search-outline";
      emptyButtonAction = clearFilters;
      emptyButtonText = "Clear All Filters";
    }

    return (
      <FlatList
      className="mt-4"
        data={students}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#00C897"
            colors={["#00C897"]}
          />
        }
        renderItem={({ item }) => (
          <Link href={`/(attendance)/${item.id}`} asChild>
            <TouchableOpacity>
              <StudentItem
                name={item.name}
                startTime={item.startTime}
                endTime={item.endTime}
                image={item.image}
                onEdit={(e: any) => {
                  e.stopPropagation();
                  handleEditStudent(item);
                }}
                onDelete={(e: any) => {
                  e.stopPropagation();
                  handleDeleteStudent(item);
                }}
              />
            </TouchableOpacity>
          </Link>
        )}
        // FIX: Dynamically center content when list is empty
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: studentListHeight > 400 ? 100 : 250,
          ...(students.length === 0
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : {}),
        }}
        ListEmptyComponent={
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            iconName={emptyIcon as any}
            buttonText={emptyButtonText}
            onPress={emptyButtonAction}
          />
        }
      />
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 px-4 bg-white pb-6 shadow-sm z-10">
        <View className="flex-row items-center gap-3 mt-8">
          <View className="flex-1">
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.7}
            className="h-14 w-14 bg-indigo-500 rounded-2xl justify-center items-center shadow-sm mb-3 relative"
          >
            <Ionicons name="filter" size={24} color="white" />
            {activeFilterCount > 0 && (
              <Animated.View
                style={{ transform: [{ scale: filterBadgeAnim }] }}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full w-6 h-6 justify-center items-center"
              >
                <Text className="text-white text-xs font-bold">
                  {activeFilterCount}
                </Text>
              </Animated.View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            className="h-14 w-14 bg-[#00C897] rounded-2xl justify-center items-center shadow-sm mb-3"
          >
            <MaterialIcons name="add" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex items-center mt-4">
          <Text className="text-2xl font-semibold text-gray-800">
            {isSearchActive || activeFilterCount > 0
              ? "Filtered Results"
              : "Details of our "}
            <Text className="text-primary">
              {isSearchActive || activeFilterCount > 0
                ? `(${students.length})`
                : "Students"}
            </Text>
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">{renderContent()}</View>

      {/* --- FILTER MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="bg-white rounded-t-3xl pb-8"
            style={{ maxHeight: "85%" }}
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-200">
              <View className="flex-row items-center">
                <Ionicons name="filter" size={24} color="#00C897" />
                <Text className="text-2xl font-bold text-gray-900 ml-2">
                  Filters
                </Text>
              </View>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="px-6 py-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Days of Week */}
              <View className="mb-8">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Days of Week
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDay(day)}
                        className={`px-4 py-2.5 rounded-full border-2 ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <Text
                          className={`font-semibold ${
                            isSelected ? "text-emerald-700" : "text-gray-600"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Time Slots */}
              <View className="mb-8">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Time of Day
                </Text>
                <View className="gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <TouchableOpacity
                        key={slot}
                        onPress={() =>
                          setSelectedTimeSlot(isSelected ? "" : slot)
                        }
                        className={`p-4 rounded-2xl border-2 flex-row items-center ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <Ionicons
                          name="time-outline"
                          size={20}
                          color={isSelected ? "#6366F1" : "#64748B"}
                        />
                        <Text
                          className={`ml-3 font-semibold ${
                            isSelected ? "text-indigo-700" : "text-gray-700"
                          }`}
                        >
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Amount Range */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Class Amount (EGP)
                </Text>
                <View className="gap-3">
                  {AMOUNT_RANGES.map((range) => {
                    const isSelected =
                      selectedAmountRange.label === range.label;
                    return (
                      <TouchableOpacity
                        key={range.label}
                        onPress={() => setSelectedAmountRange(range)}
                        className={`p-4 rounded-2xl border-2 flex-row items-center ${
                          isSelected
                            ? "bg-purple-50 border-purple-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <Ionicons
                          name="cash-outline"
                          size={20}
                          color={isSelected ? "#A855F7" : "#64748B"}
                        />
                        <Text
                          className={`ml-3 font-semibold ${
                            isSelected ? "text-purple-700" : "text-gray-700"
                          }`}
                        >
                          {range.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View className="px-6 flex-row gap-3 border-t border-gray-200 pt-4">
              <TouchableOpacity
                onPress={clearFilters}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-300 items-center"
              >
                <Text className="text-gray-700 font-bold text-base">
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                className="flex-1 py-4 rounded-2xl items-center"
              >
                <LinearGradient
                  colors={["#00C897", "#00A67E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="absolute inset-0 rounded-2xl"
                />
                <Text className="text-white font-bold text-base">
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- OTHER MODALS --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddStudentModal onClose={() => setModalVisible(false)} />
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={handleCloseEditModal}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPress={handleCloseEditModal}
        >
          <View
            className="bg-white rounded-xl p-6 w-11/12"
            onStartShouldSetResponder={() => true}
          >
            <TextInputField
              label={`Editing: ${editingStudent?.name || ""}`}
              value={editInputValue}
              onChangeText={setEditInputValue}
              placeholder="Enter new name"
              autoFocus={true}
            />
            <PrimaryButton
              title={editMutation.isPending ? "Saving..." : "Save Edit"}
              onPress={handleConfirmEdit}
              disabled={editMutation.isPending}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={handleCloseDeleteModal}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPress={handleCloseDeleteModal}
        >
          <View
            className="bg-white rounded-[30px] p-6 w-11/12 max-w-xs"
            onStartShouldSetResponder={() => true}
          >
            <Text className="text-[#5F5F5F] text-base font-medium text-center mb-6 mt-2">
              Are you sure You wanna delete{" "}
              <Text className="font-bold text-black">
                {deletingStudent?.name}
              </Text>
              ?
            </Text>
            <View className="flex-row justify-center gap-3 mb-2">
              <TouchableOpacity
                onPress={handleConfirmDelete}
                className="flex-1 border-2 border-red-500 rounded-[30px] py-2.5 items-center"
                disabled={deleteMutation.isPending}
              >
                <Text className="text-red-500 text-sm font-semibold">
                  {deleteMutation.isPending ? "..." : "YES"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCloseDeleteModal}
                className="flex-1 bg-darkGreen rounded-[30px] py-2.5 items-center"
              >
                <Text className="text-white text-sm font-semibold">NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}