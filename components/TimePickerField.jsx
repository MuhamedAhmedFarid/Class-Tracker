import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const TimePickerField = ({ label, value, onChange, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const formatTime = (date) => {
    if (!date) return "";
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${displayHours} : ${displayMinutes} ${period}`;
  };

  const parseTime = (timeString) => {
    if (!timeString) return new Date();
    
    const match = timeString.match(/(\d+)\s*:\s*(\d+)\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3].toUpperCase();
      
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    return new Date();
  };

  const handleConfirm = () => {
    const timeString = formatTime(selectedTime);
    onChange(timeString);
    setIsVisible(false);
  };

  const handleOpen = () => {
    const parsed = parseTime(value);
    setSelectedTime(parsed);
    setIsVisible(true);
  };

  const handleTimeChange = (event, date) => {
    if (Platform.OS === "android") {
      setIsVisible(false);
      if (event.type === "set" && date) {
        setSelectedTime(date);
        const timeString = formatTime(date);
        onChange(timeString);
      }
    } else {
      if (date) {
        setSelectedTime(date);
      }
    }
  };

  return (
    <View>
      {label && <Text className="text-gray-600 text-sm mb-1">{label}</Text>}
      <TouchableOpacity
        onPress={handleOpen}
        className="flex-row items-center border border-gray-300 rounded-lg p-3"
      >
        <Text
          className={`flex-1 text-base ${
            value ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {value || placeholder}
        </Text>
        <MaterialIcons name="access-time" size={20} color="#999" />
      </TouchableOpacity>

      {Platform.OS === "ios" && isVisible && (
        <Modal
          visible={isVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsVisible(false)}
            className="flex-1 justify-center items-center bg-black/50"
          >
            <View
              className="bg-white rounded-2xl p-6 w-11/12 max-w-sm"
              onStartShouldSetResponder={() => true}
            >
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleTimeChange}
                style={{ backgroundColor: "white" }}
              />
              <View className="flex-row justify-end gap-3 mt-4">
                <TouchableOpacity
                  onPress={() => setIsVisible(false)}
                  className="px-6 py-2 rounded-lg"
                >
                  <Text className="text-gray-600 text-base">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  className="px-6 py-2 rounded-lg bg-[#00C897]"
                >
                  <Text className="text-white text-base font-semibold">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      {Platform.OS === "android" && isVisible && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

export default TimePickerField;

