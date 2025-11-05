import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import PrimaryButton from "../../components/Button";
import AuthHeader from "../../components/HeaderAuth";
import InputField from "../../components/InputField";
import SocialAuthOptions from "../../components/SocialAuthOptions";
const login = () => {
  const [email, setEmail] = useState("");
  return (
    <View>
      <AuthHeader />
      <View className="mb-10 px-5 flex flex-col gap-4 ">
        <TextInput />
        <View className=" justify-center ">
          <InputField
            label="Your Email"
            value={email}
            onChangeText={setEmail}
            placeholder="example@mail.com"
          />

          <InputField label="Password" secureTextEntry placeholder="••••••••" />
        </View>
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
