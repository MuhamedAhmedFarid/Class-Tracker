import InputField from "@/components/InputField";
import React, { useState } from "react";
import { Text, View } from "react-native";
import AushHeader from "../../components/HeaderAuth";
const Signup = () => {
  const [email, setEmail] = useState("");
  return (
    <View>
      <AushHeader />
      <View className="mb-10">
        <Text>Signup</Text>
        <View className=" justify-center ">
          <InputField
            label="Your Email"
            value={email}
            onChangeText={setEmail}
            placeholder="example@mail.com"
          />

          <InputField label="Password" secureTextEntry placeholder="••••••••" />
        </View>
      </View>
    </View>
  );
};

export default Signup;
