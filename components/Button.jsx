import { Text, TouchableOpacity } from 'react-native';

const PrimaryButton = ({ title, onPress, className = "" }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      // Using a custom color directly in NativeWind square brackets
      // 'py-4' for vertical padding, 'rounded-xl' for rounded corners
      // 'flex items-center justify-center' to center the text
      className={`bg-primary py-4 rounded-xl flex items-center justify-center ${className}`}
      activeOpacity={0.7} // Add a slight opacity change on press
    >
      <Text className="text-white text-lg ">
        {title || "Creat account"} {/* Default to "Creat account" if no title is provided */}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;