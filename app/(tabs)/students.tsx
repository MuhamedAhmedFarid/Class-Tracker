import PrimaryButton from "@/components/Button";
import ErrorMsg from "@/components/ErrorMsg";
import Spinner from "@/components/Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { deleteStudent, fetchStudentsFromSupabase, updateStudent } from "@/services/StudentService";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
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

type StudentDataType = { id: string, name: string, time: string, image: string };

export default function Students() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  // IMMEDIATE STATE: Used to control the TextInput value
  const [searchQuery, setSearchQuery] = useState('');

  // DEBOUNCED STATE: Used for filtering logic
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [editingStudent, setEditingStudent] = useState<StudentDataType | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentDataType | null>(null);
  const [editInputValue, setEditInputValue] = useState("");

  const queryClient = useQueryClient();

  // --- READ QUERY ---
  const {
    data: allStudents,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["students"], 
    queryFn: fetchStudentsFromSupabase,
  });

  // --- CLIENT-SIDE FILTERING ---
  const students = useMemo(() => {
    if (!allStudents) return [];
    if (!debouncedSearchQuery) return allStudents;

    const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
    return allStudents.filter(student =>
      student.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [allStudents, debouncedSearchQuery]);

  // --- MUTATIONS ---
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      handleCloseDeleteModal();
    },
    onError: (e) => {
      alert("Failed to delete student: " + e.message);
    }
  });

  const editMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      handleCloseEditModal();
    },
    onError: (e) => {
      alert("Failed to update student: " + e.message);
    }
  });

  // --- HANDLERS ---
  const handleAddStudent = () => {};

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
        newName: editInputValue.trim()
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
    if (deletingStudent) {
      deleteMutation.mutate(deletingStudent.id);
    }
  };

  // Styles for modals
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  });

  const studentListHeight = students ? students.length * 80 : 0;
  const isSearchActive = searchQuery.length > 0;

  // --- RENDER CONTENT HELPER ---
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

    return (
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/(attendance)/${item.id}`} asChild>
            <TouchableOpacity>
              <StudentItem
                name={item.name}
                time={item.time}
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
        contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: studentListHeight > 400 ? 100 : 250 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center h-48">
            <Ionicons 
              name={isSearchActive ? "search-outline" : "people-outline"} 
              size={64} 
              color="#9CA3AF" 
            />
            <Text className="text-lg text-gray-500 mt-4">
              {isSearchActive ? "No students match your search." : "No students added yet."}
            </Text>
            {isSearchActive && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                className="mt-4 bg-primary px-6 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header and Search Area with Add Button */}
      <View className="pt-24 px-4 bg-white z-10">
        {/* Search Bar and Add Button Row */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg mb-3"
            style={{
              shadowColor: "#00C897",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <MaterialIcons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View className="flex items-center mt-4 mb-6">
          <Text className="text-2xl font-semibold text-gray-800">
            {isSearchActive ? "Search Results" : "Details of our "}
            <Text className="text-primary">
              {isSearchActive && students ? `(${students.length})` : "Students"}
            </Text>
          </Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1">
        {renderContent()}
      </View>

      {/* --- MODALS --- */}
      <Modal
        animationType="slide"
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
            className="bg-white rounded-2xl p-6 w-11/12 max-w-md" 
            onStartShouldSetResponder={() => true}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Edit Student
              </Text>
              <TouchableOpacity onPress={handleCloseEditModal}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInputField
              label="Student Name"
              value={editInputValue}
              onChangeText={setEditInputValue}
              placeholder="Enter new name"
              autoFocus={true}
            />
            <View className="mt-4">
              <PrimaryButton
                title={editMutation.isPending ? "Saving..." : "Save Changes"}
                onPress={handleConfirmEdit}
                disabled={editMutation.isPending || !editInputValue.trim()}
              />
            </View>
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
            className="bg-white rounded-3xl p-6 w-11/12 max-w-sm" 
            onStartShouldSetResponder={() => true}
          >
            <View className="items-center mb-4">
              <View className="bg-red-100 rounded-full p-4 mb-4">
                <Ionicons name="trash-outline" size={32} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Delete Student?
              </Text>
              <Text className="text-gray-600 text-center">
                Are you sure you want to delete{" "}
                <Text className="font-semibold">{deletingStudent?.name}</Text>?
                This action cannot be undone.
              </Text>
            </View>

            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                onPress={handleCloseDeleteModal}
                className="flex-1 border-2 border-gray-300 rounded-2xl py-3 items-center"
                disabled={deleteMutation.isPending}
              >
                <Text className="text-gray-700 text-base font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmDelete}
                className="flex-1 bg-red-500 rounded-2xl py-3 items-center"
                disabled={deleteMutation.isPending}
              >
                <Text className="text-white text-base font-semibold">
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}