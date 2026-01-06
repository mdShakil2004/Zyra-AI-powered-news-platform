// app/(tabs)/home.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  RefreshControl,
  Pressable,
  Alert,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// import * as SpeechRecognition from "expo-speech-recognition"; // Commented for Expo Go – uncomment in dev build

const CATEGORIES = ["ALL", "Sports", "Cricket", "Tech", "Business", "Politics"];

export default function Home() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [news, setNews] = useState<any[]>([]);
  const [displayNews, setDisplayNews] = useState<any[]>([]);
  const [category, setCategory] = useState("ALL");
  const [interests, setInterests] = useState<string[]>([]);
  const [showInterestUI, setShowInterestUI] = useState(false);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Voice states (commented for Expo Go – safe to keep, no crash)
  // const [isListening, setIsListening] = useState(false);
  // const waveAnim = useRef(new Animated.Value(0));

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [category, news, interests]);

  const fetchNews = async () => {
    try {
      const res = await axios.get("http://10.147.184.192:8000/news");
      // console.log("res...\n\n", res);
      const data = res.data.data || [];
      setNews(data);
      await AsyncStorage.setItem("NEWS_CACHE", JSON.stringify(data));
      applyFilters(); // This updates displayNews
    } catch (err) {
      Alert.alert("Offline", "Showing cached news");
    } finally {
      setRefreshing(false);
    }
  };

  const init = async () => {
    const savedInterests = await AsyncStorage.getItem("INTERESTS");
    const cachedNews = await AsyncStorage.getItem("NEWS_CACHE");
    const cachedSaved = await AsyncStorage.getItem("SAVED_ARTICLES");
    const cachedChat = await AsyncStorage.getItem("AI_CHAT");

    if (!savedInterests) setShowInterestUI(true);
    else setInterests(JSON.parse(savedInterests));

    if (cachedNews) {
      const parsed = JSON.parse(cachedNews);
      setNews(parsed);
      applyFilters(); // This shows cached news immediately
    }
    if (cachedSaved) setSavedArticles(JSON.parse(cachedSaved));
    if (cachedChat) setChat(JSON.parse(cachedChat));

    // Fetch fresh news on first load
    fetchNews();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const applyFilters = () => {
    let filtered =
      category === "ALL"
        ? [...news]
        : news.filter(
            (n) => n.category?.toLowerCase() === category.toLowerCase()
          );

    if (interests.length > 0) {
      filtered = filtered.sort((a, b) =>
        interests.includes(b.category)
          ? 1
          : interests.includes(a.category)
            ? -1
            : 0
      );
    }

    setDisplayNews(filtered);
  };

  const toggleSave = async (item: any) => {
    const updated = savedArticles.some((s) => s.title === item.title)
      ? savedArticles.filter((s) => s.title !== item.title)
      : [...savedArticles, item];

    setSavedArticles(updated);
    await AsyncStorage.setItem("SAVED_ARTICLES", JSON.stringify(updated));
  };

  const askAI = async (article?: any) => {
    const question = article ? `Summarize: ${article.title}` : input.trim();
    if (!question) return;

    const updatedChat = [...chat, { role: "user", text: question }];
    setChat(updatedChat);
    setInput("");
    setAiLoading(true);

    try {
      const res = await axios.post("http://10.147.184.192:8000/ai", {
        input: question,
        newsList: news,
      });
      const finalChat = [...updatedChat, { role: "ai", text: res.data.output }];
      setChat(finalChat);
      await AsyncStorage.setItem("AI_CHAT", JSON.stringify(finalChat));
    } catch (err) {
      Alert.alert("Error", "AI is unavailable");
    } finally {
      setAiLoading(false);
    }
  };

  // Voice functions commented for Expo Go compatibility
  /*
  const startVoice = async () => { ... }
  const stopVoice = () => { ... }
  */

  const Hero = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/article/${news.indexOf(item)}`)}
    >
      <ImageBackground
        source={{ uri: item.image }}
        className="h-80 mx-4 mt-4 rounded-3xl overflow-hidden"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          className="flex-1 justify-end p-6"
        >
          <Text className="text-white text-2xl font-bold">{item.title}</Text>
          <Text className="text-slate-200 mt-2" numberOfLines={3}>
            {item.summary}
          </Text>
          <View className="flex-row justify-between mt-4">
            <Text className="text-indigo-300 font-semibold">Read more →</Text>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleSave(item);
              }}
            >
              <Ionicons
                name={
                  savedArticles.some((s) => s.title === item.title)
                    ? "bookmark"
                    : "bookmark-outline"
                }
                size={26}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const Card = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/article/${news.indexOf(item)}`)}
      className={`mx-4 mb-5 p-5 rounded-3xl ${isDark ? "bg-slate-800" : "bg-white"} shadow-lg`}
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          className="h-48 w-full rounded-2xl mb-4"
        />
      )}
      <Text
        className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}
      >
        {item.title}
      </Text>
      <Text
        className={`mt-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}
        numberOfLines={4}
      >
        {item.summary}
      </Text>
      <View className="flex-row justify-between mt-4">
        <Text className="text-indigo-500 font-semibold">Read full article</Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            toggleSave(item);
          }}
        >
          <Ionicons
            name={
              savedArticles.some((s) => s.title === item.title)
                ? "bookmark"
                : "bookmark-outline"
            }
            size={24}
            color="#4f46e5"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
          {/* Header */}
          <View
            className={`px-6 pt-12 pb-4 ${isDark ? "bg-slate-900" : "bg-white"}`}
          >
            <Text
              className={`text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Zyra
            </Text>
            <Text className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Your Intelligent News Feed
            </Text>
          </View>
          {/* Categories */}
          {/* Categories – Modern Pill Chips */}
          <View className="px-4 mt-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }} // Extra space at end
            >
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  className={`mr-3 px-5 py-2.5 rounded-full border ${
                    category === c
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-transparent border-slate-600"
                  }`}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      category === c ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* News Feed */}
          <FlatList
            data={displayNews}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(_, i) => i.toString()}
            ListHeaderComponent={
              displayNews.length > 0 && (
                <>
                  <Hero item={displayNews[0]} />
                  {displayNews[1] && <Hero item={displayNews[1]} />}
                </>
              )
            }
            renderItem={({ item, index }) =>
              index > 1 ? <Card item={item} /> : null
            }
            contentContainerStyle={{ paddingBottom: 140 }}
          />

          {/* AI Chat Bubbles */}
          {chat.length > 0 && (
            <ScrollView className="absolute bottom-24 left-4 right-4 max-h-64 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg z-10">
              {chat.map((msg, i) => (
                <View
                  key={i}
                  className={`mb-3 ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <Text
                    className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-black dark:text-white"
                    }`}
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* AI Input Bar – Fixed at bottom, visible above keyboard */}
          <View
            className={`absolute bottom-0 left-0 right-0 flex-row items-center px-4 py-3 border-t ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} z-20`}
          >
            <Pressable>
              <Ionicons name="mic-outline" size={28} color="#4f46e5" />
            </Pressable>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Zyra anything..."
              placeholderTextColor={isDark ? "#94a3b8" : "#64748b"}
              className={`flex-1 mx-3 px-4 py-3 rounded-xl text-base ${isDark ? "bg-slate-700 text-white" : "bg-slate-100 text-black"}`}
              returnKeyType="send"
              onSubmitEditing={() => askAI()}
            />

            <Pressable onPress={() => askAI()}>
              <Text className="text-indigo-600 font-bold text-lg">
                {aiLoading ? "..." : "Ask"}
              </Text>
            </Pressable>
          </View>

          {/* Interest Onboarding */}
          {showInterestUI && (
            <View className="absolute inset-0 bg-black/70 justify-center items-center z-30">
              <View className="bg-white dark:bg-slate-800 rounded-3xl p-8 w-11/12 max-w-md">
                <Text className="text-2xl font-bold text-center mb-6">
                  Choose your interests
                </Text>
                <View className="flex-row flex-wrap justify-center">
                  {CATEGORIES.filter((c) => c !== "ALL").map((i) => (
                    <Pressable
                      key={i}
                      onPress={() =>
                        setInterests((prev) =>
                          prev.includes(i)
                            ? prev.filter((x) => x !== i)
                            : [...prev, i]
                        )
                      }
                      className={`px-4 py-3 rounded-full mr-3 mb-3 ${interests.includes(i) ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
                    >
                      <Text
                        className={
                          interests.includes(i)
                            ? "text-white"
                            : "text-black dark:text-white"
                        }
                      >
                        {i}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable
                  onPress={async () => {
                    await AsyncStorage.setItem(
                      "INTERESTS",
                      JSON.stringify(interests)
                    );
                    setShowInterestUI(false);
                  }}
                  className="bg-indigo-600 mt-6 py-4 rounded-xl"
                >
                  <Text className="text-white text-center font-bold text-lg">
                    Continue
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
