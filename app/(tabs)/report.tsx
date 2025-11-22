// app/(tabs)/report.tsx
import Spinner from "@/components/Spinner";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { fetchStudentsFromSupabase, recordPayment } from "../../services/StudentService";

// Helper interfaces for type safety
interface Student {
  id: string;
  name: string;
  totalCollected?: number;
  paidAmount: number;
  outstandingBalance: number;
}

const Report = () => {
  const queryClient = useQueryClient();
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // 1. Fetch Real Data
  const { data: students, isLoading } = useQuery({
    queryKey: ["students_report"],
    queryFn: fetchStudentsFromSupabase,
  });

  // 2. Mutation for Payments
  const paymentMutation = useMutation({
    mutationFn: ({ id, amount } : any) => recordPayment(id, parseFloat(amount)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students_report"] });
      handleClosePaymentModal();
    },
    onError: (e) => alert("Payment failed: " + e.message),
  });

  // 3. Calculate Totals from DB Data
  const totalRevenue = useMemo(() => {
    if (!students) return 0;
    // Assuming total revenue expected is collected + outstanding
    return students.reduce((sum, s) => sum + (s.totalCollected || 0) + (s.outstandingBalance || 0), 0);
  }, [students]);

  const totalPaid = useMemo(() => {
    if (!students) return 0;
    return students.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
  }, [students]);

  const totalRemaining = useMemo(() => {
    if (!students) return 0;
    return students.reduce((sum, s) => sum + (s.outstandingBalance || 0), 0);
  }, [students]);

  const handleOpenPaymentModal = (student : any) => {
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
        paymentMutation.mutate({ id: selectedStudent.id, amount: paymentAmount });
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

  if (isLoading) return <SafeAreaView className="flex-1 justify-center"><Spinner /></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Total Amount Card */}
        <View className="items-center justify-center mt-8 mb-6 px-4">
          <View className="w-full max-w-sm relative">
            <View className="bg-[#00C897] rounded-3xl p-8 shadow-2xl">
              <View className="items-center">
                <View className="bg-white/20 rounded-full p-4 mb-4">
                  <MaterialIcons name="account-balance-wallet" size={40} color="white" />
                </View>

                <Text className="text-white/90 text-sm font-medium mb-2 uppercase tracking-wider">
                  Total Expected
                </Text>

                <View className="flex-row items-baseline justify-center">
                  <Text className="text-white text-5xl font-bold">
                    {totalRevenue.toFixed(0)}
                  </Text>
                  <Text className="text-white/70 text-lg font-medium ml-2">EGP</Text>
                </View>

                <Text className="text-white/80 text-xs mt-3">
                  From {students?.length || 0} Students
                </Text>

                <View className="w-full mt-6 pt-4 border-t border-white/20">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-white/80 text-sm">Collected:</Text>
                    <Text className="text-white font-semibold text-sm">{totalPaid.toFixed(2)} EGP</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-white/80 text-sm">Outstanding:</Text>
                    <Text className="text-white font-semibold text-sm">{totalRemaining.toFixed(2)} EGP</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Students List */}
        <View className="px-4 mb-8">
          <Text className="text-gray-700 text-lg font-semibold mb-4">Student Breakdown</Text>
          <View className="gap-3">
            {students?.map((student) => {
              // Calculate percentage based on your logic (e.g. paid vs total expected for that student)
              // If total expected is 0, prevent NaN
              const studentTotalExpected = (student.paidAmount || 0) + (student.outstandingBalance || 0);
              const paymentPercentage = studentTotalExpected > 0 
                ? ((student.paidAmount || 0) / studentTotalExpected) * 100 
                : 0;
                
              return (
                <View key={student.id} className="bg-white rounded-xl p-4 shadow-md">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-gray-800 font-semibold text-base">{student.name}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-[#00C897] font-bold text-lg">
                        {studentTotalExpected.toFixed(2)} EGP
                      </Text>
                    </View>
                  </View>

                  <View className="mb-3">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-gray-500 text-xs">Paid: {student.paidAmount.toFixed(2)}</Text>
                      <Text className="text-xs font-semibold text-orange-600">
                        Due: {student.outstandingBalance.toFixed(2)}
                      </Text>
                    </View>
                    <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-[#00C897] rounded-full"
                        style={{ width: `${paymentPercentage}%` }}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleOpenPaymentModal(student)}
                    className="bg-[#00C897] py-2.5 px-4 rounded-full flex-row items-center justify-center"
                  >
                    <MaterialIcons name="payment" size={18} color="white" />
                    <Text className="text-white font-semibold ml-2">Record Payment</Text>
                  </TouchableOpacity>
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
          <View className="bg-white rounded-xl p-6 w-11/12 max-w-sm" onStartShouldSetResponder={() => true}>
            <Text className="text-xl font-semibold text-center mb-4">Record Payment</Text>
            {selectedStudent && (
              <>
                <Text className="text-gray-700 mb-4 text-center">
                  Record a payment for <Text className="font-bold">{selectedStudent.name}</Text>
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
                  <TouchableOpacity onPress={handleClosePaymentModal} className="flex-1 border-2 border-gray-300 rounded-full py-3 items-center">
                    <Text className="text-gray-600 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirmPayment} className="flex-1 bg-[#00C897] rounded-full py-3 items-center">
                    <Text className="text-white font-semibold">
                        {paymentMutation.isPending ? "Saving..." : "Confirm"}
                    </Text>
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