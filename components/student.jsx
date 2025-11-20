import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from "react-native";

const Student = ({ sDate, eDate, name, current }) => {
  // Generate initials from name
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on name
  const getAvatarColors = (fullName) => {
    const colors = [
      ['#00C897', '#00A67E'], // Emerald
      ['#6366F1', '#4F46E5'], // Indigo
      ['#EC4899', '#DB2777'], // Pink
      ['#F59E0B', '#D97706'], // Amber
      ['#8B5CF6', '#7C3AED'], // Purple
      ['#06B6D4', '#0891B2'], // Cyan
    ];
    const index = fullName.length % colors.length;
    return colors[index];
  };

  const avatarColors = getAvatarColors(name);

  return (
    <View 
      className={`rounded-2xl mx-2 shadow-lg ${
        current ? 'border-l-4 border-emerald-500' : 'border-l-4 border-gray-200'
      }`}
      style={{
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: current ? 0.15 : 0.08,
        shadowRadius: 8,
        elevation: current ? 8 : 4,
      }}
    >
      <View className="flex-row items-center p-5">
        {/* Avatar with Gradient */}
        <View className="mr-4">
          <LinearGradient
            colors={avatarColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{
              shadowColor: avatarColors[0],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text className="text-white font-black text-lg">
              {getInitials(name)}
            </Text>
          </LinearGradient>
        </View>

        {/* Student Info */}
        <View className="flex-1 mr-3">
          <Text 
            className="text-gray-900 font-bold text-lg mb-1"
            numberOfLines={2}
            style={{ lineHeight: 22 }}
          >
            {name}
          </Text>
          
          {/* Time Display with Icon */}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text className="text-gray-600 text-sm font-medium ml-1">
              {sDate} - {eDate}
            </Text>
          </View>
        </View>

        {/* Current Badge or Status Indicator */}
        {current ? (
          <View className="bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
            <View className="flex-row items-center">
              <View 
                className="w-2 h-2 bg-emerald-500 rounded-full mr-2"
                style={{
                  shadowColor: '#00C897',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 4,
                }}
              />
              <Text className="text-emerald-700 text-xs font-black uppercase tracking-wider">
                Now
              </Text>
            </View>
          </View>
        ) : (
          <View className="items-end">
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </View>
        )}
      </View>

      {/* Bottom Progress Bar for Current Session */}
      {current && (
        <View className="h-1 bg-gray-100 rounded-b-2xl overflow-hidden">
          <LinearGradient
            colors={['#00C897', '#00A67E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="h-full"
            style={{ width: '35%' }} // This could be dynamic based on elapsed time
          />
        </View>
      )}
    </View>
  );
};

export default Student;