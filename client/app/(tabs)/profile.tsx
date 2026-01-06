// app/(tabs)/profile.tsx
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const isDark = useColorScheme() === "dark";

  const clearAllData = async () => {
    await AsyncStorage.multiRemove([
      "INTERESTS",
      "SAVED_ARTICLES",
      "AI_CHAT",
      "NEWS_CACHE",
    ]);
    alert("All data cleared");
  };

  return (
    <View className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-50"} p-6`}>
      <Text
        className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"} mb-8`}
      >
        Profile & Settings
      </Text>

      <View
        className={`rounded-2xl p-6 mb-6 ${isDark ? "bg-slate-800" : "bg-white"}`}
      >
        <Text
          className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-black"}`}
        >
          Zyra Premium
        </Text>
        <Text
          className={`${isDark ? "text-slate-300" : "text-slate-600"} mb-4`}
        >
          Unlock multi-language summaries, advanced AI, and ad-free experience.
        </Text>
        <TouchableOpacity className="bg-indigo-600 py-4 rounded-xl">
          <Text className="text-white text-center font-bold">
            Upgrade to Premium
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`flex-row items-center py-4 ${isDark ? "text-white" : "text-black"}`}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={isDark ? "white" : "black"}
        />
        <Text className="ml-4 text-lg">Push Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-row items-center py-4 ${isDark ? "text-white" : "text-black"}`}
      >
        <Ionicons
          name="moon-outline"
          size={24}
          color={isDark ? "white" : "black"}
        />
        <Text className="ml-4 text-lg">Dark Mode (System)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={clearAllData}
        className="flex-row items-center py-4 text-red-500"
      >
        <Ionicons name="trash-outline" size={24} color="red" />
        <Text className="ml-4 text-lg">Clear Cache & Data</Text>
      </TouchableOpacity>

      <Text
        className={`text-center mt-auto ${isDark ? "text-slate-500" : "text-slate-400"}`}
      >
        Zyra v1.0 • Built with ❤️
      </Text>
    </View>
  );
}
