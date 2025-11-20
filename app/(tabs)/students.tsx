import PrimaryButton from "@/components/Button";
import EmptyState from "@/components/EmptyState"; // <--- IMPORTED HERE
import ErrorMsg from "@/components/ErrorMsg";
import Spinner from "@/components/Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { deleteStudent, fetchStudentsFromSupabase, updateStudent } from "@/services/StudentService";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
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

  const [searchQuery, setSearchQuery] = useState('');
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
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["students"], 
    queryFn: fetchStudentsFromSupabase,
  });

  // --- FILTERING ---
  const students = useMemo(() => {
    if (!allStudents) return [];
    if (!debouncedSearchQuery) return allStudents;

    const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
    return allStudents.filter(student =>
      student.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [allStudents, debouncedSearchQuery]);

  // --- MUTATIONS (Delete/Edit) ---
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      handleCloseDeleteModal();
    },
    onError: (e) => alert("Failed to delete student: " + e.message)
  });

  const editMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      handleCloseEditModal();
    },
    onError: (e) => alert("Failed to update student: " + e.message)
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
      editMutation.mutate({ id: editingStudent.id, newName: editInputValue.trim() });
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

  // Styles
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

    return (
      <FlatList
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
                time={item.time}
                image={item.image}
                onEdit={(e: any) => { e.stopPropagation(); handleEditStudent(item); }}
                onDelete={(e: any) => { e.stopPropagation(); handleDeleteStudent(item); }}
              />
            </TouchableOpacity>
          </Link>
        )}
        contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: studentListHeight > 400 ? 100 : 250 }}
        
        
        ListEmptyComponent={
          <EmptyState 
            title={isSearchActive ? "No Matches Found" : "No Students Yet"}
            description={
              isSearchActive 
              ? `We couldn't find any student matching "${searchQuery}".`
              : "Add your first student to get started tracking attendance."
            }
            iconName={isSearchActive ? "search-outline" : "people-outline"}
            buttonText={isSearchActive ? "Clear Search" : "Refresh List"}
            // onPress={isSearchActive ? () => setSearchQuery('') : refetch}
          />
        }
      />
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-24 px-4 bg-white z-10">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            className="h-14 w-14 bg-[#00C897] rounded-2xl justify-center items-center shadow-sm mb-3"
          >
             <MaterialIcons name="add" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex items-center mt-4 mb-6">
          <Text className="text-2xl font-semibold text-gray-800">
            {isSearchActive ? "Search Results" : "Details of our "}
            <Text className="text-primary">
              {isSearchActive && students ? `(${students.length})` : "Students"}
            </Text>
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {renderContent()}
      </View>

      {/* --- MODALS --- */}
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
          <View className="bg-white rounded-xl p-6 w-11/12" onStartShouldSetResponder={() => true}>
            <TextInputField
              label={`Editing: ${editingStudent?.name || ''}`}
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
          <View className="bg-white rounded-[30px] p-6 w-11/12 max-w-xs" onStartShouldSetResponder={() => true}>
            <Text className="text-[#5F5F5F] text-base font-medium text-center mb-6 mt-2">
              Are you sure You wanna delete <Text className="font-bold text-black">{deletingStudent?.name}</Text>?
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