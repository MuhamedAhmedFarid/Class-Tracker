import PrimaryButton from "@/components/Button";
import ErrorMsg from "@/components/ErrorMsg";
import Spinner from "@/components/Spinner";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
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
import { fetchStudentsFromSupabase, updateStudent, deleteStudent } from "@/services/StudentService"; 

type StudentDataType = { id: string, name: string, time: string, image: string };

export default function Students() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // NEW STATE: Search input
  const [searchQuery, setSearchQuery] = useState(''); 
  
  const [editingStudent, setEditingStudent] = useState<StudentDataType | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentDataType | null>(null);

  const [editInputValue, setEditInputValue] = useState("");
  
  const queryClient = useQueryClient();

  // --- READ QUERY (Updated to depend on searchQuery) ---
  const {
    data: students,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    // QueryKey includes searchQuery: This automatically refetches data when the query changes.
    queryKey: ["students", searchQuery], 
    queryFn: fetchStudentsFromSupabase,
  });

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
  
  const handleAddStudent = () => {}; 
  
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


  // Styles for modals (unchanged)
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 8,
      padding: 24,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      minWidth: 300,
    },
  });

  // Handle Loading and Error States with new components
  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !students) {
    return (
      <View className="flex-1 bg-white">
        <ErrorMsg msg={error ? error.message : "Unable to load students. Please try again."} />
        <View className="absolute bottom-40 w-full px-6">
            <PrimaryButton title="Retry Fetch" onPress={() => refetch()} />
        </View>
      </View>
    );
  }
  
  const studentListHeight = students.length * 80; 
  const isSearchActive = searchQuery.length > 0;
  
  return (
    <View className="flex-1 bg-white">
      {/* Header and Search Area */}
      <View className="pt-24 px-4 bg-white z-10 ">
        {/* Bind SearchBar to local state */}
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
        />
        <View className="flex items-center mt-4 mb-6">
          <Text className="text-2xl font-semibold text-gray-800">
            {isSearchActive ? "Search Results" : "Details of our "} 
            <Text className="text-primary">
                {isSearchActive ? `(${students.length})` : "Students"}
            </Text>
          </Text>
        </View>
      </View>

      {/* Student List */}
      <View className="flex-1">
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
              <Text className="text-lg text-gray-500">
                {isSearchActive ? "No students match your search." : "No students added yet."}
              </Text>
              {isSearchActive && (
                <PrimaryButton title="Clear Search" onPress={() => setSearchQuery('')} className="mt-4"/>
              )}
            </View>
          }
        />

        {/* Floating Add Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-24 right-6 bg-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-20"
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modals (unchanged logic) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <AddStudentModal
          onClose={() => setModalVisible(false)}
        />
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
          <View
            className="bg-white rounded-[30px] p-6 w-11/12 max-w-xs"
            onStartShouldSetResponder={() => true}
          >
            <Text className="text-[#5F5F5F] text-base font-medium text-center mb-6 mt-2">
              Are you sure You wanna delete {" "}
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
                  {deleteMutation.isPending ? "DELETING..." : "YES"}
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