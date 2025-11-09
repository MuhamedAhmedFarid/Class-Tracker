import InputField from "@/components/InputField";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import PrimaryButton from "../../components/Button";
import AuthHeader from "../../components/HeaderAuth";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            secureTextEntry={false}
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="••••••••"
          />
        </View>
        <PrimaryButton title="Login" onPress={() => {}} />

        <View className="flex justify-center items-center mt-2">
          <Text className="text-sm ">
            Don't have an account?{" "}
            <Link href="/(auth)/login" className="text-primary font-bold underline">
              Login
            </Link>
          </Text>

        </View>
      </View>
    </View>
  );
};

export default Signup;
