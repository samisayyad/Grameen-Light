import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';

const ROLES: { id: UserRole; label: string; desc: string; color: string; icon: string }[] = [
  { id: 'villager', label: 'Villager', desc: 'Report faulty streetlights', color: '#00E676', icon: 'user' },
  { id: 'admin', label: 'Panchayat Admin', desc: 'Monitor & manage all issues', color: '#00B4D8', icon: 'shield' },
  { id: 'worker', label: 'Maintenance Worker', desc: 'View & complete assigned tasks', color: '#9B59B6', icon: 'tool' },
];

export default function Register() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [village, setVillage] = useState('');
  const [role, setRole] = useState<UserRole>('villager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !village) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError('');
    const result = await register({ name, email, phone, password, village, role });
    setLoading(false);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } else {
      setError(result.error ?? 'Registration failed');
    }
  };

  const fields: { label: string; value: string; setter: (v: string) => void; type?: string; icon: string }[] = [
    { label: 'Full Name', value: name, setter: setName, icon: 'user' },
    { label: 'Email', value: email, setter: setEmail, type: 'email', icon: 'mail' },
    { label: 'Phone Number', value: phone, setter: setPhone, type: 'phone', icon: 'phone' },
    { label: 'Village / Area', value: village, setter: setVillage, icon: 'map-pin' },
    { label: 'Password', value: password, setter: setPassword, type: 'password', icon: 'lock' },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 24), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Join as a Grameen-Light member</Text>
        </Animated.View>

        <View style={styles.roleSection}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>SELECT YOUR ROLE</Text>
          <View style={styles.roleGrid}>
            {ROLES.map((r) => {
              const active = role === r.id;
              return (
                <Pressable
                  key={r.id}
                  onPress={() => setRole(r.id)}
                  style={[
                    styles.roleCard,
                    {
                      backgroundColor: active ? r.color + '20' : colors.card,
                      borderColor: active ? r.color : colors.border,
                    },
                  ]}
                >
                  <Feather name={r.icon as any} size={18} color={active ? r.color : colors.mutedForeground} />
                  <Text style={[styles.roleLabel, { color: active ? r.color : colors.foreground }]}>{r.label}</Text>
                  <Text style={[styles.roleDesc, { color: colors.mutedForeground }]} numberOfLines={2}>{r.desc}</Text>
                  {active && <View style={[styles.roleCheck, { backgroundColor: r.color }]}><Feather name="check" size={10} color="#000" /></View>}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fields}>
          {fields.map((f) => (
            <View key={f.label} style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name={f.icon as any} size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder={f.label}
                placeholderTextColor={colors.mutedForeground}
                value={f.value}
                onChangeText={f.setter}
                keyboardType={f.type === 'email' ? 'email-address' : f.type === 'phone' ? 'phone-pad' : 'default'}
                autoCapitalize={f.type === 'email' || f.type === 'password' ? 'none' : 'words'}
                secureTextEntry={f.type === 'password'}
              />
            </View>
          ))}
        </View>

        {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}

        <Pressable
          onPress={handleRegister}
          style={({ pressed }) => [styles.btn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={colors.background} /> : <Text style={[styles.btnText, { color: colors.background }]}>Create Account</Text>}
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.loginLink}>
          <Text style={[styles.loginText, { color: colors.mutedForeground }]}>
            Already have an account? <Text style={{ color: colors.primary }}>Sign In</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 24, gap: 24 },
  back: { marginBottom: 12 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 4 },
  sectionLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 1, marginBottom: 10 },
  roleSection: { gap: 0 },
  roleGrid: { gap: 10 },
  roleCard: { borderRadius: 14, padding: 14, borderWidth: 1.5, gap: 4, position: 'relative' },
  roleLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  roleDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  roleCheck: { position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  fields: { gap: 12 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, paddingHorizontal: 14, height: 52, borderWidth: 1 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  error: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  btn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  loginLink: { alignItems: 'center', paddingVertical: 4 },
  loginText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
