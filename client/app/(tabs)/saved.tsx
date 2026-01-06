// app/(tabs)/saved.tsx
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export default function Saved() {
  const isDark = useColorScheme() === "dark";
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    const data = await AsyncStorage.getItem("SAVED_ARTICLES");
    if (data) setSaved(JSON.parse(data));
  };

  const Card = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/article/${item._index || 0}`)}
      className={`mx-4 mb-5 p-5 rounded-3xl ${isDark ? "bg-slate-800" : "bg-white"} shadow-lg`}
    >
      {item.image && (
        <Image source={{ uri: item.image }} className="h-48 rounded-2xl mb-4" />
      )}
      <Text
        className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}
      >
        {item.title}
      </Text>
      <Text
        className={`mt-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}
        numberOfLines={3}
      >
        {item.summary}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <Text
        className={`text-3xl font-bold px-6 pt-12 ${isDark ? "text-white" : "text-black"}`}
      >
        Saved Articles
      </Text>
      {saved.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text
            className={`${isDark ? "text-slate-400" : "text-slate-500"} text-lg`}
          >
            No saved articles yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          renderItem={({ item }) => <Card item={item} />}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}
