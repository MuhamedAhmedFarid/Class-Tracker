import { Link } from "expo-router";
import React from "react";
import { Text, TextInput, View } from "react-native";
import PrimaryButton from "../../components/Button";
import AuthHeader from "../../components/HeaderAuth";
import SocialAuthOptions from "../../components/SocialAuthOptions";
const login = () => {
  return (
    <View>
      <AuthHeader />
      <View className="mb-10 px-5 flex flex-col gap-4 ">
        <TextInput />
        <PrimaryButton />
        <View className="flex justify-center items-center mt-10">
          <Text className="text-sm ">
            Don't have an account?{" "}
            <Link href="/(auth)/Signup" className="text-primary font-bold ">
              Sign Up
            </Link>
          </Text>
          <SocialAuthOptions />
        </View>
      </View>
    </View>
  );
};

export default login;
