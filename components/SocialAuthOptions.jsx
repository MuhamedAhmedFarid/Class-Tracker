import { Image, Text, TouchableOpacity, View } from "react-native";

const GOOGLE_ICON = require("../assets/icons/google.png");
const FACEBOOK_ICON = require("../assets/icons/facebook.png");

const SocialAuthOptions = ({ onGooglePress, onFacebookPress }) => {
  return (
    <View className="w-full px-8 mt-10">
      <View className="flex-row items-center justify-center mb-6">
        <View className="flex-1 h-[1px] bg-gray-300 mr-4 ml-4" />
        <Text className="text-gray-500 text-sm font-medium">Or login with</Text>
        <View className="flex-1 h-[1px] bg-gray-300 ml-2" />
      </View>

      <View className="flex-row justify-center items-center space-x-12 gap-12">
        <TouchableOpacity onPress={onGooglePress} activeOpacity={0.7}>
          <Image
            source={{
              uri: "https://img.icons8.com/color/48/000000/google-logo.png",
            }} 
            className="w-12 h-12"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onFacebookPress} activeOpacity={0.7}>
          <Image
            source={{
              uri: "https://img.icons8.com/fluency/48/000000/facebook-new.png",
            }} 
            className="w-12 h-12"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SocialAuthOptions;
