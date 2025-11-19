import PrimaryButton from "@/components/Button";
import ErrorMsg from "@/components/ErrorMsg";
import Spinner from "@/components/Spinner";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
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

// Mock data fetching function to simulate an API call
const fetchStudents = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: "1",
      name: "Team Align",
      time: "Today, 09:30 AM",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      time: "Yesterday, 05:20 PM",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: "3",
      name: "Ali Hassan",
      time: "Monday, 10:10 AM",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
    },
  ];
};

export default function Students() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editInputValue, setEditInputValue] = useState("");
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  // Integrate useQuery to fetch students list
  const {
    data: students,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const handleAddStudent = (filters: any) => {
    console.log("Applied Filters:", filters);
    // In a real app, you would perform a mutation here:
    // mutation.mutate(filters, { onSuccess: () => refetch() });
    refetch(); // For mock, simply refetch to show how it would work
  };

  const handleEditStudent = (studentName: string) => {
    setEditInputValue(studentName);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditInputValue("");
  };

  const handleDeleteStudent = (studentName: string) => {
    setStudentToDelete(studentName);
    setDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalVisible(false);
    setStudentToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      console.log("Deleted", studentToDelete);
      // In a real app, perform delete mutation:
      // deleteMutation.mutate(studentToDelete, { onSuccess: () => refetch() });
      handleCloseDeleteModal();
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

  // Handle Loading and Error States
  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !students) {
    return <ErrorMsg msg="Unable to load class sessions. Please try again." />;
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header and Search Area */}
      <View className="pt-24 px-4 bg-white z-10 ">
        <SearchBar />
        <View className="flex items-center mt-4 mb-6">
          <Text className="text-2xl font-semibold text-gray-800">
            Details of our <Text className="text-primary">Students</Text>
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
                  // Stop propagation to prevent navigation when clicking the action icons
                  onEdit={(e: any) => {
                    e.stopPropagation();
                    handleEditStudent(item.name);
                  }}
                  onDelete={(e: any) => {
                    e.stopPropagation();
                    handleDeleteStudent(item.name);
                  }}
                />
              </TouchableOpacity>
            </Link>
          )}
          // Adding padding to the list itself
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 100 }}
        />

        {/* Floating Add Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-24 right-6 bg-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-20"
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modals (omitted for brevity, they are placed at the end of the file in the full context) */}
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
          onApplyFilter={handleAddStudent}
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
              label="Edit Name"
              value={editInputValue}
              onChangeText={setEditInputValue}
              placeholder="Enter new name"
              autoFocus={true}
            />
            <PrimaryButton
              title="Edit"
              onPress={() => {
                /* Edit logic */
              }}
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
              Are you sure You wanna delete this
            </Text>

            <View className="flex-row justify-center gap-3 mb-2">
              <TouchableOpacity
                onPress={handleConfirmDelete}
                className="flex-1 border-2 border-red-500 rounded-[30px] py-2.5 items-center"
              >
                <Text className="text-red-500 text-sm font-semibold">YES</Text>
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
