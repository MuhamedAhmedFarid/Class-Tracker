import EmptyState from '@/components/EmptyState';
import ErrorMsg from "@/components/ErrorMsg";
import Spinner from "@/components/Spinner";
import { fetchTodayStudentsScheduled } from "@/services/StudentService";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Student from "../../components/student";
import "../../global.css";

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const {
    data: classSessions,
    isLoading,
    isError,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["todayStudentsScheduled"],
    queryFn: fetchTodayStudentsScheduled,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const date = new Date();
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const fullDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const sessionCount = classSessions ? classSessions.length : 0;

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Spinner />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-gray-50 justify-center px-4">
        <ErrorMsg
          msg={error ? error.message : "Unable to load today's sessions."}
        />
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-6 bg-[#00C897] py-3 px-6 rounded-full self-center shadow-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <View className="absolute inset-0 overflow-hidden pointer-events-none">
        <View
          className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-200 rounded-full opacity-20"
          style={{ transform: [{ scale: 1.5 }] }}
        />
        <View
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-200 rounded-full opacity-20"
          style={{ transform: [{ scale: 1.5 }] }}
        />
      </View>

      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        className="bg-white pt-16 pb-8 px-6 rounded-b-[32px] shadow-lg z-10 border-b border-gray-100"
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Ionicons name="sparkles" size={16} color="#00C897" />
              <Text className="text-xs font-bold text-[#00C897] uppercase tracking-widest ml-2">
                {dayName}
              </Text>
            </View>
            <Text className="text-4xl font-black text-gray-900 mb-1">
              {fullDate}
            </Text>
            <Text className="text-sm text-gray-500 font-medium">
              Your schedule for today
            </Text>
          </View>

          <View className="relative">
            <LinearGradient
              colors={["#00C897", "#00A67E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-5 py-4 rounded-2xl items-center justify-center shadow-lg"
            >
              <Text className="text-white font-black text-3xl leading-tight">
                {sessionCount}
              </Text>
              <Text className="text-white text-[9px] font-bold uppercase tracking-wider opacity-90">
                Classes
              </Text>
            </LinearGradient>
            <View
              className="absolute inset-0 bg-[#00C897] rounded-2xl opacity-30 blur-xl"
              style={{ transform: [{ scale: 1.1 }], zIndex: -1 }}
            />
          </View>
        </View>
      </Animated.View>

      {!classSessions || classSessions.length === 0 ? (
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          <FlatList 
            data={[]}
            renderItem={null}
            // FIX: Added justifyContent and alignItems to center the content vertically
            contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor="transparent" 
                colors={['transparent']} 
              />
            }
            ListHeaderComponent={
               isRefetching ? (
                  <View className="py-10 items-center justify-center">
                    <Spinner />
                  </View>
               ) : (
                 <EmptyState onPress={refetch} buttonText="Refresh Schedule" />
               )
            }
          />
        </Animated.View>
      ) : (
        <FlatList
          data={classSessions}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 28,
            paddingBottom: 120,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="transparent" 
              colors={['transparent']} 
              style={{ backgroundColor: 'transparent' }}
            />
          }
          keyExtractor={(item, index) => `${item.id}-${index}`}
          
          ListHeaderComponent={
            <View>
              {isRefetching && (
                <View className="py-6 items-center justify-center w-full mb-2">
                  <Spinner />
                </View>
              )}
              <Animated.View
                style={{ opacity: fadeAnim }}
                className="mb-6 flex-row items-center"
              >
                <LinearGradient
                  colors={["#00C897", "#6366F1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="w-1 h-8 rounded-full mr-3"
                />
                <Text className="text-2xl font-black text-gray-900">
                  Today's Timeline
                </Text>
                <View className="h-[1px] flex-1 bg-gray-300 ml-4" />
              </Animated.View>
            </View>
          }

          renderItem={({ item }) => (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <View className="mb-4">
                <Student
                  current={item.current}
                  sDate={item.startDate}
                  eDate={item.endDate}
                  name={item.name}
                />
              </View>
            </Animated.View>
          )}
          
          ListFooterComponent={
            sessionCount > 0 ? (
              <Animated.View
                style={{ opacity: fadeAnim }}
                className="mt-6 bg-emerald-50 rounded-2xl p-6 border border-emerald-100"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-xs text-gray-600 mb-1 font-medium">
                      Total Teaching Time
                    </Text>
                    <Text className="text-2xl font-black text-gray-900">
                      {sessionCount} {sessionCount === 1 ? "hour" : "hours"}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-gray-600 mb-1 font-medium">
                      Students
                    </Text>
                    <Text className="text-2xl font-black text-gray-900">
                      {sessionCount}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ) : null
          }
        />
      )}
    </View>
  );
}