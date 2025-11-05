import { Text, View } from "react-native";

const Student = ({ sDate, eDate, name, current }) => {
  return (
    <View
      className={`flex-row items-center justify-between  p-4 m-2 rounded-lg w-96 border-gray-300 ${current || false ? 'bg-green-100' : 'bg-white'}`}
    >
      {/* Left side: Class name */}
      <View style={{ flex: 1, marginRight: 16 }}>
        <Text
          className="text-black font-bold text-md text-left italic"
          style={{ flexWrap: "wrap",  }}
        >
          {name}
        </Text>
      </View>

      {/* Right side: Start & End times */}
      <View className="flex-col items-end">
        <Text className="text-black font-bold text-sm">{sDate}</Text>
        <Text className="text-gray-700 text-sm">{eDate}</Text>
      </View>
    </View>
  );
};

export default Student;
