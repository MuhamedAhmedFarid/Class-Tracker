import PrimaryButton from "@/components/Button";
import { MaterialIcons } from "@expo/vector-icons";
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

export default function RecentCalls() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editInputValue, setEditInputValue] = useState("");
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const handleAddStudent = (filters: any) => {
    console.log("Applied Filters:", filters);
    // Here you would typically use these filters to update your data or UI
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
      // Here you would typically delete the student from your data
      handleCloseDeleteModal();
    }
  };
  const calls = [
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

  return (
    <View className="flex-1 mt-24">
      <SearchBar />
      <View className="flex items-center my-10">
        <Text className="text-2xl font-semibold">
          Details of our <Text className="text-primary">Students</Text>
        </Text>
      </View>
      <View className=" bg-gray-100 ">
        <FlatList
          data={calls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/${item.id}`}>
              <StudentItem
                name={item.name}
                time={item.time}
                image={item.image}
                onEdit={() => handleEditStudent(item.name)}
                onDelete={() => handleDeleteStudent(item.name)}
              />
            </Link>
          )}
        />
        <TouchableOpacity
          onPress={() => setModalVisible(true)} // Add your desired action here
          className="absolute top-[28rem] right-6 bg-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
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
            <PrimaryButton title="Edit" onPress={() => {}} />
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
