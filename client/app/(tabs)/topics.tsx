// app/(tabs)/topics.tsx
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";

const TOPICS = [
  "Politics",
  "Technology",
  "Sports",
  "Business",
  "Entertainment",
  "Science",
  "Health",
  "World",
  "Cricket",
];

export default function Topics() {
  const isDark = useColorScheme() === "dark";

  return (
    <View className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-50"} p-6`}>
      <Text
        className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"} mb-6`}
      >
        Explore Topics
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap">
          {TOPICS.map((topic) => (
            <Pressable
              key={topic}
              className={`px-6 py-4 m-2 rounded-2xl ${isDark ? "bg-slate-800" : "bg-white"} shadow`}
            >
              <Text
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}
              >
                {topic}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
