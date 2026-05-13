import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';

const DEMO_LOGINS = [
  { label: 'Villager', email: 'villager@demo.com', color: '#00E676' },
  { label: 'Admin', email: 'admin@demo.com', color: '#00B4D8' },
  { label: 'Worker', email: 'worker@demo.com', color: '#9B59B6' },
];

export default function Login() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: string, p?: string) => {
    const em = e ?? email.trim();
    const pw = p ?? password.trim();
    if (!em || !pw) { setError('Enter email and password'); return; }
    setLoading(true);
    setError('');
    const result = await login(em, pw);
    setLoading(false);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } else {
      setError(result.error ?? 'Login failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    handleLogin(demoEmail, 'demo123');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 40), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]} keyboardShouldPersistTaps="handled">

        <Animated.View entering={FadeInDown.duration(500)} style={styles.logoWrap}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
          <Text style={[styles.appName, { color: colors.primary }]}>Grameen-Light</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>AI-Powered Village Streetlight Monitoring</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.form}>
          <Text style={[styles.title, { color: colors.foreground }]}>Welcome Back</Text>

          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="mail" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Email"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="lock" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Password"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <Pressable onPress={() => setShowPass(!showPass)}>
              <Feather name={showPass ? 'eye-off' : 'eye'} size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}

          <Pressable
            onPress={() => handleLogin()}
            style={({ pressed }) => [styles.loginBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={colors.background} /> : <Text style={[styles.loginText, { color: colors.background }]}>Sign In</Text>}
          </Pressable>

          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>Quick Demo Login</Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.demoRow}>
            {DEMO_LOGINS.map((d) => (
              <Pressable
                key={d.label}
                onPress={() => quickLogin(d.email)}
                style={[styles.demoBtn, { borderColor: d.color + '60', backgroundColor: d.color + '15' }]}
              >
                <View style={[styles.demoDot, { backgroundColor: d.color }]} />
                <Text style={[styles.demoLabel, { color: d.color }]}>{d.label}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={() => router.push('/auth/register')} style={styles.registerLink}>
            <Text style={[styles.registerText, { color: colors.mutedForeground }]}>
              New to Grameen-Light? <Text style={{ color: colors.primary }}>Register</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 24, gap: 40 },
  logoWrap: { alignItems: 'center', gap: 10 },
  logo: { width: 72, height: 72, borderRadius: 20 },
  appName: { fontSize: 26, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  tagline: { fontSize: 13, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  form: { gap: 14 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, paddingHorizontal: 14, height: 52, borderWidth: 1 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  error: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  loginBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  loginText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  line: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  demoRow: { flexDirection: 'row', gap: 10 },
  demoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 12, borderWidth: 1 },
  demoDot: { width: 8, height: 8, borderRadius: 4 },
  demoLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  registerLink: { alignItems: 'center', paddingVertical: 4 },
  registerText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
