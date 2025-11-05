import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const _layout = () => {
  return (
    // Hide labels globally so only icons are shown
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
            backgroundColor: "#fff",
            borderRadius: 12,
            marginHorizontal: 20,
            marginBottom: 36,
            height: 55,
            position: "absolute",
            overflow: "hidden",
            borderWidth: 1,
            elevation: 5,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({focused }) => (
            <View
              style={{
                width: 40,
                height: 36,
                borderRadius: 8,
                marginTop: 15,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#00C897" : "transparent",
              }}
            >
              <MaterialCommunityIcons
                name="home"
                size={20}
                color={focused ? "#fff" : 'black'}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="students"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                marginTop: 15,
                height: 36,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#00C897" : "transparent",
              }}
            >
              <FontAwesome5
                name="book"
                size={18}
                color={focused ? "#fff" : 'black'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                marginTop: 15,
                height: 36,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#00C897" : "transparent",
              }}
            >
              <MaterialCommunityIcons
                name="application-edit"
                size={18}
                color={focused ? "#fff" : 'black'}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
