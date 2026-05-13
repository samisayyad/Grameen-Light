import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated as RNAnimated,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ComplaintCard } from '@/components/ComplaintCard';
import { StatCard } from '@/components/StatCard';
import { useAuth } from '@/context/AuthContext';
import { MOCK_COMPLAINTS, MOCK_POLES } from '@/constants/mockData';
import { useColors } from '@/hooks/useColors';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Dashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(-20)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      RNAnimated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const totalPoles = MOCK_POLES.length;
  const faultyPoles = MOCK_POLES.filter((p) => p.status === 'fused' || p.status === 'daytime_on').length;
  const submitted = MOCK_COMPLAINTS.filter((c) => c.status === 'submitted').length;
  const resolved = MOCK_COMPLAINTS.filter((c) => c.status === 'fixed').length;
  const recentComplaints = MOCK_COMPLAINTS.slice(0, 3);

  const quickActions = [
    { icon: 'alert-circle', label: 'Report', color: colors.destructive, onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/(tabs)/report'); } },
    { icon: 'map', label: 'Poles', color: colors.accent, onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/(tabs)/map'); } },
    { icon: 'message-circle', label: 'AI Chat', color: colors.purple, onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/chat'); } },
    { icon: 'zap', label: 'Energy', color: colors.warning, onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/analytics'); } },
  ];

  const statsData = [
    { label: 'Total Poles', value: totalPoles, color: colors.accent, icon: <Feather name="radio" size={16} color={colors.accent} />, delay: 0 },
    { label: 'Faulty', value: faultyPoles, color: colors.destructive, icon: <Feather name="alert-triangle" size={16} color={colors.destructive} />, delay: 100 },
    { label: 'Complaints', value: MOCK_COMPLAINTS.length, color: colors.warning, icon: <Feather name="alert-circle" size={16} color={colors.warning} />, delay: 200 },
    { label: 'Resolved', value: resolved, color: colors.success, icon: <Feather name="check-circle" size={16} color={colors.success} />, delay: 300 },
  ];

  const topPaddingStyle = {
    paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8),
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 90) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <RNAnimated.View style={[styles.header, topPaddingStyle, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>{getGreeting()}</Text>
            <Text style={[styles.userName, { color: colors.foreground }]}>{user?.name ?? 'User'}</Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
              <Text style={[styles.roleText, { color: colors.primary }]}>
                {user?.role === 'admin' ? 'Panchayat Admin' : user?.role === 'worker' ? 'Maintenance Worker' : 'Villager'}
              </Text>
            </View>
          </View>
          <Pressable onPress={() => router.push('/analytics')} style={[styles.notifBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="bell" size={20} color={colors.foreground} />
            <View style={[styles.notifDot, { backgroundColor: colors.destructive }]} />
          </Pressable>
        </RNAnimated.View>

        {/* Alert Banner */}
        {faultyPoles > 0 && (
          <RNAnimated.View style={[styles.alertBanner, { backgroundColor: colors.destructive + '15', borderColor: colors.destructive + '40', opacity: fadeAnim }]}>
            <Feather name="alert-triangle" size={14} color={colors.destructive} />
            <Text style={[styles.alertText, { color: colors.destructive }]}>
              {faultyPoles} poles need attention in your village
            </Text>
          </RNAnimated.View>
        )}

        {/* Stats */}
        <View style={styles.statsGrid}>
          {statsData.map((s, i) => (
            <View key={s.label} style={styles.statWrap}>
              <StatCard label={s.label} value={s.value} icon={s.icon} color={s.color} delay={s.delay} />
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {quickActions.map((a) => (
              <TouchableOpacity key={a.label} onPress={a.onPress} style={[styles.actionBtn, { backgroundColor: a.color + '18', borderColor: a.color + '40' }]}>
                <Feather name={a.icon as any} size={22} color={a.color} />
                <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Village Status */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Village Status</Text>
          <View style={[styles.villageCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.villageName, { color: colors.foreground }]}>{user?.village ?? 'Kalhalli Village'}</Text>
            <View style={styles.villageStats}>
              <View style={styles.vStat}>
                <View style={[styles.vDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.vNum, { color: colors.foreground }]}>{MOCK_POLES.filter(p => p.status === 'working').length}</Text>
                <Text style={[styles.vLabel, { color: colors.mutedForeground }]}>Working</Text>
              </View>
              <View style={styles.vStat}>
                <View style={[styles.vDot, { backgroundColor: colors.destructive }]} />
                <Text style={[styles.vNum, { color: colors.foreground }]}>{MOCK_POLES.filter(p => p.status === 'fused').length}</Text>
                <Text style={[styles.vLabel, { color: colors.mutedForeground }]}>Fused</Text>
              </View>
              <View style={styles.vStat}>
                <View style={[styles.vDot, { backgroundColor: colors.warning }]} />
                <Text style={[styles.vNum, { color: colors.foreground }]}>{MOCK_POLES.filter(p => p.status === 'daytime_on').length}</Text>
                <Text style={[styles.vLabel, { color: colors.mutedForeground }]}>Daytime ON</Text>
              </View>
              <View style={styles.vStat}>
                <View style={[styles.vDot, { backgroundColor: colors.mutedForeground }]} />
                <Text style={[styles.vNum, { color: colors.foreground }]}>{MOCK_POLES.filter(p => p.status === 'no_data').length}</Text>
                <Text style={[styles.vLabel, { color: colors.mutedForeground }]}>No Data</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Complaints */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Complaints</Text>
            <Pressable onPress={() => router.push('/(tabs)/activity')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </Pressable>
          </View>
          {recentComplaints.map((c, i) => (
            <ComplaintCard key={c.id} complaint={c} index={i} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20 },
  greeting: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  userName: { fontSize: 22, fontFamily: 'Inter_700Bold', marginTop: 2 },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, borderWidth: 1, marginTop: 6 },
  roleText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  notifBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, position: 'relative' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
  alertBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  alertText: { fontSize: 13, fontFamily: 'Inter_500Medium', flex: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statWrap: { width: '48%' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  seeAll: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, borderWidth: 1, gap: 8 },
  actionLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  villageCard: { borderRadius: 16, padding: 18, borderWidth: 1 },
  villageName: { fontSize: 16, fontFamily: 'Inter_600SemiBold', marginBottom: 14 },
  villageStats: { flexDirection: 'row', gap: 0 },
  vStat: { flex: 1, alignItems: 'center', gap: 4 },
  vDot: { width: 10, height: 10, borderRadius: 5 },
  vNum: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  vLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
