import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { MOCK_COMPLAINTS } from '@/constants/mockData';
import { useColors } from '@/hooks/useColors';

const ROLE_COLORS: Record<string, string> = {
  villager: '#00E676',
  admin: '#00B4D8',
  worker: '#9B59B6',
};

const ROLE_LABELS: Record<string, string> = {
  villager: 'Villager',
  admin: 'Panchayat Admin',
  worker: 'Maintenance Worker',
};

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const roleColor = ROLE_COLORS[user?.role ?? 'villager'];

  const userComplaints = MOCK_COMPLAINTS.filter((c) => c.submittedBy.includes(user?.name?.split(' ')[0] ?? ''));
  const resolved = userComplaints.filter((c) => c.status === 'fixed').length;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const menuItems: { icon: string; label: string; color?: string; onPress: () => void; value?: string }[] = [
    { icon: 'activity', label: 'Energy Analytics', onPress: () => router.push('/analytics'), color: colors.warning },
    { icon: 'message-circle', label: 'AI Assistant', onPress: () => router.push('/chat'), color: colors.purple },
    { icon: 'map-pin', label: 'Village', onPress: () => {}, value: user?.village },
    { icon: 'phone', label: 'Phone', onPress: () => {}, value: user?.phone },
    { icon: 'mail', label: 'Email', onPress: () => {}, value: user?.email },
  ];

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'GL';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 90) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: roleColor + '30' }]}>
          <View style={[styles.avatar, { backgroundColor: roleColor + '20', borderColor: roleColor + '50' }]}>
            <Text style={[styles.avatarText, { color: roleColor }]}>{initials}</Text>
            <View style={[styles.roleIndicator, { backgroundColor: roleColor }]} />
          </View>
          <Text style={[styles.name, { color: colors.foreground }]}>{user?.name ?? 'User'}</Text>
          <View style={[styles.rolePill, { backgroundColor: roleColor + '20', borderColor: roleColor + '40' }]}>
            <Text style={[styles.roleText, { color: roleColor }]}>{ROLE_LABELS[user?.role ?? 'villager']}</Text>
          </View>
          <Text style={[styles.village, { color: colors.mutedForeground }]}>{user?.village}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Complaints', value: MOCK_COMPLAINTS.length.toString(), icon: 'alert-circle', color: colors.warning },
            { label: 'Resolved', value: resolved.toString(), icon: 'check-circle', color: colors.success },
            { label: 'Poles Reported', value: '5', icon: 'radio', color: colors.accent },
            { label: 'Points', value: '340', icon: 'star', color: colors.purple },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name={s.icon as any} size={16} color={s.color} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Contribution Badge */}
        <View style={[styles.badgeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.badgeIcon, { backgroundColor: colors.warning + '20' }]}>
            <Feather name="award" size={20} color={colors.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.badgeTitle, { color: colors.foreground }]}>Village Champion</Text>
            <Text style={[styles.badgeDesc, { color: colors.mutedForeground }]}>Top contributor in lighting awareness</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.warning + '20', borderColor: colors.warning + '40' }]}>
            <Text style={[styles.badgePoints, { color: colors.warning }]}>+340 pts</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {menuItems.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuItem,
                i < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: (item.color ?? colors.mutedForeground) + '15' }]}>
                <Feather name={item.icon as any} size={16} color={item.color ?? colors.mutedForeground} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              {item.value ? (
                <Text style={[styles.menuValue, { color: colors.mutedForeground }]} numberOfLines={1}>{item.value}</Text>
              ) : (
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              )}
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutBtn, { borderColor: colors.destructive + '40', backgroundColor: colors.destructive + '10', opacity: pressed ? 0.8 : 1 }]}
        >
          <Feather name="log-out" size={16} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </Pressable>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>Grameen-Light v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 16 },
  profileCard: { alignItems: 'center', borderRadius: 20, padding: 24, borderWidth: 1, gap: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2, position: 'relative' },
  avatarText: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  roleIndicator: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7 },
  name: { fontSize: 20, fontFamily: 'Inter_700Bold', marginTop: 4 },
  rolePill: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  roleText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  village: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingVertical: 14, borderWidth: 1, gap: 4 },
  statValue: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 9, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', textAlign: 'center' },
  badgeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 16, borderWidth: 1 },
  badgeIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badgeTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  badgeDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  badgePoints: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  menu: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  menuIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  menuValue: { fontSize: 12, fontFamily: 'Inter_400Regular', maxWidth: 120 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 52, borderRadius: 14, borderWidth: 1 },
  logoutText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  version: { textAlign: 'center', fontSize: 12, fontFamily: 'Inter_400Regular', paddingBottom: 8 },
});
