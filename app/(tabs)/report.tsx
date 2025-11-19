import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputField from "../../components/TextInputField";
import "../../global.css";

interface Student {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  attendedClasses: number;
  totalClasses: number;
}

const Report = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Team Align",
      totalAmount: 500.0,
      paidAmount: 200.0,
      attendedClasses: 8,
      totalClasses: 10,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      totalAmount: 750.0,
      paidAmount: 750.0,
      attendedClasses: 10,
      totalClasses: 10,
    },
    {
      id: "3",
      name: "Ali Hassan",
      totalAmount: 600.0,
      paidAmount: 0,
      attendedClasses: 7,
      totalClasses: 10,
    },
    {
      id: "4",
      name: "Mohamed Ali",
      totalAmount: 450.0,
      paidAmount: 150.0,
      attendedClasses: 6,
      totalClasses: 10,
    },
    {
      id: "5",
      name: "Sara Ahmed",
      totalAmount: 800.0,
      paidAmount: 800.0,
      attendedClasses: 9,
      totalClasses: 10,
    },
  ]);

  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const totalRevenue = useMemo(() => {
    return students.reduce((sum, student) => sum + student.totalAmount, 0);
  }, [students]);

  const totalPaid = useMemo(() => {
    return students.reduce((sum, student) => sum + student.paidAmount, 0);
  }, [students]);

  const totalRemaining = useMemo(() => {
    return totalRevenue - totalPaid;
  }, [totalRevenue, totalPaid]);

  const handleOpenPaymentModal = (student: Student) => {
    setSelectedStudent(student);
    setPaymentAmount("");
    setPaymentModalVisible(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModalVisible(false);
    setSelectedStudent(null);
    setPaymentAmount("");
  };

  const handleConfirmPayment = () => {
    if (selectedStudent && paymentAmount) {
      const amount = parseFloat(paymentAmount);
      const remaining = selectedStudent.totalAmount - selectedStudent.paidAmount;

      if (amount > 0 && amount <= remaining) {
        setStudents(
          students.map((s) =>
            s.id === selectedStudent.id
              ? { ...s, paidAmount: s.paidAmount + amount }
              : s
          )
        );
        handleClosePaymentModal();
      } else {
        alert(`Please enter a valid amount (max: ${remaining.toFixed(2)})`);
      }
    }
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        {/* Total Amount Card - Enhanced with Payment Tracking */}
        <View className="items-center justify-center mt-8 mb-6 px-4">
          <View className="w-full max-w-sm relative">
            {/* Main Total Card */}
            <View className="bg-[#00C897] rounded-3xl p-8 shadow-2xl">
              <View className="items-center">
                <View className="bg-white/20 rounded-full p-4 mb-4">
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={40}
                    color="white"
                  />
                </View>

                <Text className="text-white/90 text-sm font-medium mb-2 uppercase tracking-wider">
                  Total Revenue
                </Text>

                <View className="flex-row items-baseline justify-center">
                  <Text className="text-white text-5xl font-bold">
                    {totalRevenue.toFixed(2).split(".")[0]}
                  </Text>
                  <Text className="text-white/80 text-2xl font-semibold ml-1">
                    .{totalRevenue.toFixed(2).split(".")[1]}
                  </Text>
                  <Text className="text-white/70 text-lg font-medium ml-2">
                    EGP
                  </Text>
                </View>

                <Text className="text-white/80 text-xs mt-3">
                  From {students.length}{" "}
                  {students.length === 1 ? "Student" : "Students"}
                </Text>

                {/* Payment Status */}
                <View className="w-full mt-6 pt-4 border-t border-white/20">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-white/80 text-sm">Collected:</Text>
                    <Text className="text-white font-semibold text-sm">
                      {totalPaid.toFixed(2)} EGP
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-white/80 text-sm">Remaining:</Text>
                    <Text className="text-white font-semibold text-sm">
                      {totalRemaining.toFixed(2)} EGP
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="absolute -top-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <View className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          </View>
        </View>

        {/* Additional Stats Cards */}
        <View className="px-4 mb-6">
          <View className="flex-row gap-4">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg">
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="trending-up" size={20} color="#00C897" />
                <Text className="text-gray-500 text-xs ml-2 font-medium">
                  Average
                </Text>
              </View>
              <Text className="text-gray-800 text-xl font-bold">
                {(totalRevenue / students.length).toFixed(2)}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                EGP per student
              </Text>
            </View>

            <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg">
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="people" size={20} color="#00C897" />
                <Text className="text-gray-500 text-xs ml-2 font-medium">
                  Students
                </Text>
              </View>
              <Text className="text-gray-800 text-xl font-bold">
                {students.length}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">Total enrolled</Text>
            </View>
          </View>
        </View>

        {/* Students List with Payment Buttons */}
        <View className="px-4 mb-8">
          <Text className="text-gray-700 text-lg font-semibold mb-4">
            Student Breakdown
          </Text>
          <View className="gap-3">
            {students.map((student) => {
              const remaining = student.totalAmount - student.paidAmount;
              const isPaid = remaining === 0;
              const paymentPercentage =
                (student.paidAmount / student.totalAmount) * 100;

              return (
                <View
                  key={student.id}
                  className="bg-white rounded-xl p-4 shadow-md"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-gray-800 font-semibold text-base">
                        {student.name}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1">
                        {student.attendedClasses || 0} من{" "}
                        {student.totalClasses || 0} حصة
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-[#00C897] font-bold text-lg">
                        {student.totalAmount.toFixed(2)} EGP
                      </Text>
                    </View>
                  </View>

                  {/* Payment Progress */}
                  <View className="mb-3">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-gray-500 text-xs">
                        Paid: {student.paidAmount.toFixed(2)} EGP
                      </Text>
                      <Text
                        className={`text-xs font-semibold ${
                          isPaid ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        Remaining: {remaining.toFixed(2)} EGP
                      </Text>
                    </View>
                    {/* Progress Bar */}
                    <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-[#00C897] rounded-full"
                        style={{ width: `${paymentPercentage}%` }}
                      />
                    </View>
                  </View>

                  {/* Payment Button */}
                  {!isPaid ? (
                    <TouchableOpacity
                      onPress={() => handleOpenPaymentModal(student)}
                      className="bg-[#00C897] py-2.5 px-4 rounded-full flex-row items-center justify-center"
                    >
                      <MaterialIcons name="payment" size={18} color="white" />
                      <Text className="text-white font-semibold ml-2">
                        Mark Payment
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="bg-green-100 py-2.5 px-4 rounded-full flex-row items-center justify-center">
                      <MaterialIcons
                        name="check-circle"
                        size={18}
                        color="#16a34a"
                      />
                      <Text className="text-green-600 font-semibold ml-2">
                        Fully Paid
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPaymentModalVisible}
        onRequestClose={handleClosePaymentModal}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPress={handleClosePaymentModal}
        >
          <View
            className="bg-white rounded-xl p-6 w-11/12 max-w-sm"
            onStartShouldSetResponder={() => true}
          >
            <Text className="text-xl font-semibold text-center mb-4">
              Record Payment
            </Text>

            {selectedStudent && (
              <>
                <Text className="text-gray-700 mb-2">
                  Student:{" "}
                  <Text className="font-semibold">{selectedStudent.name}</Text>
                </Text>
                <Text className="text-gray-700 mb-2">
                  Total Amount:{" "}
                  <Text className="font-semibold">
                    {selectedStudent.totalAmount.toFixed(2)} EGP
                  </Text>
                </Text>
                <Text className="text-gray-700 mb-4">
                  Remaining:{" "}
                  <Text className="font-semibold text-orange-600">
                    {(
                      selectedStudent.totalAmount - selectedStudent.paidAmount
                    ).toFixed(2)}{" "}
                    EGP
                  </Text>
                </Text>

                <TextInputField
                  label="Payment Amount"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  autoFocus={true}
                />

                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    onPress={handleClosePaymentModal}
                    className="flex-1 border-2 border-gray-300 rounded-full py-3 items-center"
                  >
                    <Text className="text-gray-600 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirmPayment}
                    className="flex-1 bg-[#00C897] rounded-full py-3 items-center"
                  >
                    <Text className="text-white font-semibold">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Report;