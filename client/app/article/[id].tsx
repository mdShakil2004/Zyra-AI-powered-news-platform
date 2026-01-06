// app/article/[id].tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Article() {
  const { id } = useLocalSearchParams();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [article, setArticle] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const cached = await AsyncStorage.getItem("NEWS_CACHE");
      if (cached) {
        const allNews = JSON.parse(cached);
        const found = allNews[id];
        setArticle(found);

        const savedItems = JSON.parse(
          (await AsyncStorage.getItem("SAVED_ARTICLES")) || "[]"
        );
        setSaved(savedItems.some((s: any) => s.title === found.title));
      }
    };
    load();
  }, [id]);

  if (!article)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );

  const toggleSave = async () => {
    const savedItems = JSON.parse(
      (await AsyncStorage.getItem("SAVED_ARTICLES")) || "[]"
    );
    const updated = savedItems.some((s: any) => s.title === article.title)
      ? savedItems.filter((s: any) => s.title !== article.title)
      : [...savedItems, article];

    await AsyncStorage.setItem("SAVED_ARTICLES", JSON.stringify(updated));
    setSaved(!saved);
  };

  return (
    <ScrollView className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      {article.image_url ? (
        <Image
          source={{ uri: article.image_url }}
          className="w-full h-80"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-80 bg-slate-300 justify-center items-center">
          <Text className="text-white text-2xl">Zyra News</Text>
        </View>
      )}

      <View className="p-6">
        <Text
          className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"} mb-4`}
        >
          {article.title}
        </Text>

        <Text
          className={`text-lg ${isDark ? "text-slate-300" : "text-slate-600"} leading-7`}
        >
          {article.content || article.summary}
        </Text>

        <View className="flex-row justify-between items-center mt-8">
          <Text className="text-indigo-500">
            {article.source} • {article.category}
          </Text>
          <TouchableOpacity onPress={toggleSave}>
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={28}
              color="#4f46e5"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
