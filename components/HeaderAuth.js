import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

const AuthHeader = () => {
  return (
    <View className="relative w-full h-60 rounded-b-3xl overflow-hidden shadow-lg">
      <LinearGradient
        colors={["#00C897", "#B8B8D2"]} // Starting with #00C897 and transitioning to a lighter green
        start={{ x: 0, y: 0 }} // Top-left
        end={{ x: 1, y: 1 }} // Bottom-right
        className="absolute inset-0 flex items-start justify-end p-6"
      >
        <Text className="text-white text-4xl font-bold mb-4">Sign Up</Text>
        <Text className="text-[#FAFAFA] text-sm opacity-80">
          Enter your details below & free sign up
        </Text>
      </LinearGradient>
    </View>
  );
};

export default AuthHeader;
