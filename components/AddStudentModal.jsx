import { useMutation, useQueryClient } from "@tanstack/react-query"; // New import
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { createNewStudent } from "../services/StudentService"; // New import
import PrimaryButton from "./Button";
import TextInputField from "./TextInputField";
import TimePickerField from "./TimePickerField";

// Mock data for days and times (you'd likely fetch this or manage it in state)
const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export const AddStudentModal = ({ onClose }) => { // Removed onApplyFilter prop
  const [studentName, setStudentName] = useState("");
  const [selectedDays, setSelectedDays] = useState([]); // Array for multiple days
  const [fromTime, setFromTime] = useState("6 : 10 PM"); 
  const [toTime, setToTime] = useState("6 : 10 PM"); 
  const [amount, setAmount] = useState("0.00");
  
  const queryClient = useQueryClient();
  
  // Setup Mutation to Add a new student
  const addStudentMutation = useMutation({
    mutationFn: createNewStudent,
    onSuccess: () => {
      // Invalidate the 'students' query to refresh the list on the Students tab
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onClose(); // Close modal only on success
    },
    onError: (error) => {
      console.error("Failed to add student:", error);
      // Optionally show an alert to the user
      alert("Failed to add student. " + error.message);
    }
  });


  const toggleDay = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleApply = () => {
    addStudentMutation.mutate({ 
      studentName,
      selectedDays, 
      fromTime, 
      toTime, 
      amount 
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onClose}
      className="flex-1 justify-center items-center bg-black/30"
    >
      <View
        className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-xl"
        onStartShouldSetResponder={() => true}
      >

        {/* Name Input */}
        <View className="mb-1">
          <TextInputField
            label=""
            value={studentName}
            onChangeText={setStudentName}
            placeholder="Enter student name"
            autoFocus={true}
          />
        </View>

        {/* Day Selection */}
        <View className="mb-4">
          <View className="flex-row flex-wrap gap-2">
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day)}
                className={`px-4 py-2 rounded-lg ${
                  selectedDays.includes(day)
                    ? "bg-[#00C897]"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                <Text
                  className={`${
                    selectedDays.includes(day) ? "text-white" : "text-gray-700"
                  }`}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* From-To Time Inputs */}
        <View className="flex-row justify-between mb-6 gap-4">
          <View className="flex-1">
            <TimePickerField
              label="Start"
              value={fromTime}
              onChange={setFromTime}
              placeholder="e.g., 9:00 AM"
            />
          </View>

          <View className="flex-1">
            <TimePickerField
              label="End"
              value={toTime}
              onChange={setToTime}
              placeholder="e.g., 10:00 AM"
            />
          </View>
        </View>

        {/* Select Amount Input */}
        <View className="mb-8">
          <Text className="text-gray-600 text-sm mb-1">Select amount</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3">
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              className="flex-1 text-base text-gray-800"
              placeholder="0.00"
            />
            <Text className="text-gray-500 text-base ml-2">EGP</Text>
          </View>
        </View>
        <PrimaryButton 
          title={addStudentMutation.isPending ? "Adding..." : "Add Student"} 
          onPress={handleApply}
          disabled={addStudentMutation.isPending} 
        />
      </View>
    </TouchableOpacity>
  );
};

export default AddStudentModal;