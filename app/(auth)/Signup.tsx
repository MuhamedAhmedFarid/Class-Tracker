// app/(auth)/Signup.tsx
import InputField from "@/components/InputField";
import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import PrimaryButton from "../../components/Button";
import AuthHeader from "../../components/HeaderAuth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Signup Failed", error.message);
    } else {
      Alert.alert("Success", "Account created! Please login.");
      router.replace("/(auth)/login");
    }
  };

  return (
    <View>
      <AuthHeader />
      <View className="mb-10 px-5 flex flex-col gap-4 ">
        <TextInput className="h-0 w-0"/>
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
        <PrimaryButton 
          title={loading ? "Creating Account..." : "Sign Up"} 
          onPress={handleSignup} 
          disabled={loading}
        />

        <View className="flex justify-center items-center mt-2">
          <Text className="text-sm ">
            Already have an account?{" "}
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