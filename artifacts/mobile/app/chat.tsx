import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

interface Message {
  id: string;
  text: string;
  from: 'user' | 'ai';
  timestamp: string;
}

const QUICK_QUESTIONS = [
  'How to report a faulty light?',
  'Status of my complaints',
  'Which poles are faulty?',
  'Energy savings report',
  'Night safety tips',
];

const AI_RESPONSES: Record<string, string> = {
  'how to report': 'To report a faulty streetlight:\n1. Go to the Report tab\n2. Select the nearest pole\n3. Choose the issue type\n4. Add an optional photo\n5. Submit! You will get a complaint ID to track the status.',
  'status': 'Your recent complaints:\n• GL-002 Main Road Junction — In Progress\n• GL-003 Near Primary School — Submitted\n\nYou can tap on any complaint in the Activity tab to see the full timeline.',
  'faulty': 'Currently in Kalhalli Village:\n• GL-002 Main Road Junction — Fused\n• GL-003 Near Primary School — Daytime ON\n• GL-004 Market Area — Broken Pole\n• GL-007 Bus Stop — Daytime ON\n\nTotal: 4 poles need attention.',
  'energy': 'This month\'s energy stats:\n• Estimated waste: 190 kWh\n• Energy saved: 480 kWh\n• Carbon saved: ~384 kg CO₂\n• Cost saved: ₹2,880\n\nWe\'re improving! Waste is down 25% vs last month.',
  'night safety': 'Safety tips for dark areas:\n• Avoid the Market Area (GL-004) at night\n• Use the Bus Stop route (GL-007 repair pending)\n• Report any new dark spots immediately\n• Emergency: call 100 or village helpline',
  'hello': 'Namaste! I am GrameenAI, your smart village assistant.\n\nI can help you:\n• Report faulty streetlights\n• Track your complaint status\n• Get energy saving insights\n• Find nearby faulty poles\n• Learn about night safety\n\nHow can I help you today?',
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (q.includes(key)) return response;
  }
  return `I understand you\'re asking about "${query}".\n\nI can help with:\n• Reporting faulty streetlights\n• Tracking complaint status\n• Energy analytics\n• Village safety information\n\nPlease try one of the quick questions below or rephrase your query!`;
}

function getTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! I am GrameenAI, your smart village assistant.\n\nI can help you report faulty streetlights, track complaints, check energy savings, and more!\n\nHow can I assist you today?',
      from: 'ai',
      timestamp: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      from: 'user',
      timestamp: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    setIsTyping(false);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(text),
      from: 'ai',
      timestamp: getTime(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.from === 'user';
    return (
      <Animated.View entering={FadeInDown.duration(300).delay(index === messages.length - 1 ? 0 : 0)}>
        <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
          {!isUser && (
            <View style={[styles.aiAvatar, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
              <Feather name="zap" size={12} color={colors.primary} />
            </View>
          )}
          <View style={[
            styles.bubble,
            isUser
              ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
              : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 },
          ]}>
            <Text style={[styles.bubbleText, { color: isUser ? colors.background : colors.foreground }]}>{item.text}</Text>
            <Text style={[styles.timeText, { color: isUser ? colors.background + 'CC' : colors.mutedForeground }]}>{item.timestamp}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12), borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={[styles.aiIcon, { backgroundColor: colors.primary + '20' }]}>
          <Feather name="zap" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.aiName, { color: colors.foreground }]}>GrameenAI</Text>
          <View style={styles.statusRow}>
            <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.success }]}>AI Assistant • Online</Text>
          </View>
        </View>
        <View style={[styles.langBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.langText, { color: colors.mutedForeground }]}>EN | KN | HI</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.msgRow}>
                <View style={[styles.aiAvatar, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
                  <Feather name="zap" size={12} color={colors.primary} />
                </View>
                <View style={[styles.bubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 }]}>
                  <View style={styles.typingDots}>
                    {[0, 1, 2].map((i) => (
                      <View key={i} style={[styles.dot, { backgroundColor: colors.mutedForeground }]} />
                    ))}
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick questions */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={QUICK_QUESTIONS}
          keyExtractor={(q) => q}
          contentContainerStyle={styles.quickList}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => sendMessage(item)}
              style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.primary + '40' }]}
            >
              <Text style={[styles.quickText, { color: colors.primary }]}>{item}</Text>
            </Pressable>
          )}
        />

        {/* Input */}
        <View style={[styles.inputRow, { borderTopColor: colors.border, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 8) }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Ask GrameenAI anything..."
            placeholderTextColor={colors.mutedForeground}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            multiline
            maxLength={300}
          />
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.primary : colors.card, borderColor: colors.border }]}
          >
            <Feather name="send" size={18} color={input.trim() ? colors.background : colors.mutedForeground} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  aiIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  aiName: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  langBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  langText: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  msgList: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  msgRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  msgRowUser: { flexDirection: 'row-reverse' },
  aiAvatar: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  bubble: { maxWidth: '78%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  bubbleText: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  timeText: { fontSize: 10, fontFamily: 'Inter_400Regular', alignSelf: 'flex-end' },
  typingDots: { flexDirection: 'row', gap: 4, padding: 4 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  quickList: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  quickBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  quickText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  inputRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, fontFamily: 'Inter_400Regular', borderWidth: 1, maxHeight: 100 },
  sendBtn: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
