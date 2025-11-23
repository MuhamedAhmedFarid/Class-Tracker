import { useRouter } from 'expo-router';
import { Check, ChevronLeft, Globe, Moon, Smartphone, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

// --- MOCK CONTEXT (Replace with your actual Context) ---
const useAppContext = () => {
  // Local state to simulate context behavior for this demo
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  return {
    theme,
    setTheme,
    language,
    setLanguage,
    t: (key) => {
      const dict = {
        settings: "Settings",
        language: "Language",
        appearance: "Appearance",
        light: "Light",
        dark: "Dark",
        system: "System"
      };
      return dict[key] || key;
    }
  };
};

// --- MAIN COMPONENT ---

const Settings = () => {
  const router = useRouter();
  
  // In a real app, these come from the Context hook
  // I'm destructuring them here to make the UI interactive in this snippet
  const { theme, setTheme, language, setLanguage, t } = useAppContext();
  
  const isRTL = language === 'ar';

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 px-4 pt-12 pb-4 flex-row items-center justify-between shadow-sm border-b border-gray-100 dark:border-gray-700 z-10">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-2 -ml-2 rounded-full bg-transparent active:bg-gray-100 dark:active:bg-gray-700"
        >
          <ChevronLeft 
            size={24} 
            className="text-gray-600 dark:text-gray-300" 
            color={theme === 'dark' ? '#D1D5DB' : '#4B5563'}
            style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>
        
        <Text className="font-bold text-lg text-gray-900 dark:text-white">
          {t('settings')}
        </Text>
        
        {/* Empty View for balance */}
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 p-4 space-y-6">
        
        {/* Language Section */}
        <View 
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 mb-6"
          style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 }}
        >
          <View className={`flex-row items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <View className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center">
              <Globe size={18} color="#059669" />
            </View>
            <Text className="font-bold text-gray-900 dark:text-white text-base">
              {t('language')}
            </Text>
          </View>
          
          <View className="gap-3">
            {/* English Option */}
            <TouchableOpacity 
              onPress={() => setLanguage('en')}
              activeOpacity={0.7}
              className={`w-full flex-row items-center justify-between p-4 rounded-2xl border ${
                language === 'en' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' 
                  : 'bg-gray-50 dark:bg-gray-700/30 border-transparent'
              }`}
            >
              <Text className={`font-medium ${language === 'en' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                English
              </Text>
              {language === 'en' && <Check size={18} color="#059669" />}
            </TouchableOpacity>
            
            {/* Arabic Option */}
            <TouchableOpacity 
              onPress={() => setLanguage('ar')}
              activeOpacity={0.7}
              className={`w-full flex-row items-center justify-between p-4 rounded-2xl border ${
                language === 'ar' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' 
                  : 'bg-gray-50 dark:bg-gray-700/30 border-transparent'
              }`}
            >
              <Text className={`font-medium ${language === 'ar' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                العربية
              </Text>
              {language === 'ar' && <Check size={18} color="#059669" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Appearance Section */}
        <View 
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700"
          style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 }}
        >
          <View className={`flex-row items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <View className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
              <Moon size={18} color="#2563EB" />
            </View>
            <Text className="font-bold text-gray-900 dark:text-white text-base">
              {t('appearance')}
            </Text>
          </View>
          
          <View className={`flex-row gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Light Btn */}
            <TouchableOpacity 
              onPress={() => setTheme('light')}
              activeOpacity={0.7}
              className={`flex-1 flex-col items-center gap-2 p-3 rounded-2xl border ${
                theme === 'light' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50' 
                  : 'bg-gray-50 dark:bg-gray-700/30 border-transparent'
              }`}
            >
              <Sun size={24} color={theme === 'light' ? '#1D4ED8' : '#4B5563'} />
              <Text className={`text-xs font-bold ${theme === 'light' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {t('light')}
              </Text>
            </TouchableOpacity>

            {/* Dark Btn */}
            <TouchableOpacity 
              onPress={() => setTheme('dark')}
              activeOpacity={0.7}
              className={`flex-1 flex-col items-center gap-2 p-3 rounded-2xl border ${
                theme === 'dark' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50' 
                  : 'bg-gray-50 dark:bg-gray-700/30 border-transparent'
              }`}
            >
              <Moon size={24} color={theme === 'dark' ? '#1D4ED8' : '#4B5563'} />
              <Text className={`text-xs font-bold ${theme === 'dark' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {t('dark')}
              </Text>
            </TouchableOpacity>

            {/* System Btn */}
            <TouchableOpacity 
              onPress={() => setTheme('system')}
              activeOpacity={0.7}
              className={`flex-1 flex-col items-center gap-2 p-3 rounded-2xl border ${
                theme === 'system' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50' 
                  : 'bg-gray-50 dark:bg-gray-700/30 border-transparent'
              }`}
            >
              <Smartphone size={24} color={theme === 'system' ? '#1D4ED8' : '#4B5563'} />
              <Text className={`text-xs font-bold ${theme === 'system' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {t('system')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default Settings;