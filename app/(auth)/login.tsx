// app/(auth)/login.tsx
import InputField from "@/components/InputField";
import { supabase } from "@/lib/supabase"; // Import configured supabase client
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import PrimaryButton from "../../components/Button";
import AuthHeader from "../../components/HeaderAuth";
import SocialAuthOptions from "../../components/SocialAuthOptions";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
    } else {
      // Successful login
      router.replace("/(tabs)");
    }
  };

  return (
    <View>
      <AuthHeader />
      <View className="mb-10 px-5 flex flex-col gap-4 ">
        {/* Hidden TextInput to capture focus if needed by native behavior, keeping layout same as your code */}
        <TextInput className="h-0 w-0" /> 
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
          title={loading ? "Logging in..." : "Login"} 
          onPress={handleLogin} 
          disabled={loading}
        />

        <View className="flex justify-center items-center mt-10">
          <Text className="text-sm ">
            Don't have an account?{" "}
            <Link href="/(auth)/Signup" className="text-primary font-bold ">
              Sign Up
            </Link>
          </Text>
          <SocialAuthOptions onGooglePress={() => {}} onFacebookPress={() => {}} />
        </View>
      </View>
    </View>
  );
};

export default Login;