import DateTimePicker from "@react-native-community/datetimepicker";
import { Clock } from "lucide-react-native"; // Switched to Lucide to match your project
import { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

const TimePickerField = ({ label, value, onChange, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  // Format Date object to "HH:MM AM/PM" string
  const formatTime = (date) => {
    if (!date) return "";
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${displayHours} : ${displayMinutes} ${period}`;
  };

  // Parse "HH:MM AM/PM" string to Date object
  const parseTime = (timeString) => {
    if (!timeString) return new Date();
    
    // Match time format: 9:00 AM or 09:00 AM or 9 : 00 AM
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
      // iOS logic: just update state, wait for confirm button
      if (date) {
        setSelectedTime(date);
      }
    }
  };

  return (
    <View>
      {label && <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</Text>}
      
      <TouchableOpacity
        onPress={handleOpen}
        className="flex-row items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
      >
        <Text
          className={`flex-1 text-base ${
            value ? "text-gray-900 dark:text-white" : "text-gray-400"
          }`}
        >
          {value || placeholder}
        </Text>
        <Clock size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* iOS Modal Overlay */}
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-11/12 max-w-sm"
              onStartShouldSetResponder={() => true}
            >
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Select Time</Text>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleTimeChange}
                textColor={Platform.OS === 'ios' ? undefined : 'black'}
                style={{ height: 120 }}
              />
              <View className="flex-row justify-end gap-3 mt-6">
                <TouchableOpacity
                  onPress={() => setIsVisible(false)}
                  className="px-6 py-2 rounded-lg"
                >
                  <Text className="text-gray-600 dark:text-gray-400 text-base">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  className="px-6 py-2 rounded-lg bg-emerald-600"
                >
                  <Text className="text-white text-base font-semibold">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Android Native Picker */}
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