import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ComplaintCard } from '@/components/ComplaintCard';
import { MOCK_COMPLAINTS, ComplaintStatus } from '@/constants/mockData';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';

type FilterTab = 'all' | ComplaintStatus;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Rejected', value: 'rejected' },
];

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  submitted: '#00B4D8',
  assigned: '#9B59B6',
  in_progress: '#FFB800',
  fixed: '#00E676',
  rejected: '#FF3B6F',
};

export default function ActivityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filtered = MOCK_COMPLAINTS.filter((c) => activeTab === 'all' || c.status === activeTab);

  const summary = {
    total: MOCK_COMPLAINTS.length,
    inProgress: MOCK_COMPLAINTS.filter(c => c.status === 'in_progress').length,
    fixed: MOCK_COMPLAINTS.filter(c => c.status === 'fixed').length,
    submitted: MOCK_COMPLAINTS.filter(c => c.status === 'submitted').length,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 90) },
        ]}
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8) }}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {user?.role === 'worker' ? 'My Tasks' : 'Complaint Activity'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Track and manage all complaints
            </Text>

            {/* Summary cards */}
            <View style={styles.summaryRow}>
              {[
                { label: 'Total', value: summary.total, color: colors.accent },
                { label: 'Open', value: summary.submitted, color: colors.warning },
                { label: 'Active', value: summary.inProgress, color: colors.warning },
                { label: 'Fixed', value: summary.fixed, color: colors.success },
              ].map((s) => (
                <View key={s.label} style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: s.color + '40' }]}>
                  <Text style={[styles.summaryNum, { color: s.color }]}>{s.value}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Filter tabs */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={FILTER_TABS}
              keyExtractor={(t) => t.value}
              style={{ marginBottom: 14 }}
              renderItem={({ item: tab }) => {
                const active = activeTab === tab.value;
                const color = tab.value === 'all' ? colors.primary : STATUS_COLORS[tab.value as ComplaintStatus] ?? colors.primary;
                return (
                  <Pressable
                    onPress={() => setActiveTab(tab.value)}
                    style={[
                      styles.tabBtn,
                      { backgroundColor: active ? color : colors.card, borderColor: active ? color : colors.border, marginRight: 8 },
                    ]}
                  >
                    <Text style={[styles.tabText, { color: active ? (tab.value === 'all' ? colors.background : '#000') : colors.mutedForeground }]}>
                      {tab.label}
                    </Text>
                    <View style={[styles.tabCount, { backgroundColor: active ? 'rgba(0,0,0,0.2)' : colors.muted }]}>
                      <Text style={[styles.tabCountText, { color: active ? '#fff' : colors.mutedForeground }]}>
                        {tab.value === 'all' ? MOCK_COMPLAINTS.length : MOCK_COMPLAINTS.filter(c => c.status === tab.value).length}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        }
        renderItem={({ item, index }) => <ComplaintCard complaint={item} index={index} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No complaints</Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>Nothing to show for this filter</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 20 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2, marginBottom: 18 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  summaryCard: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingVertical: 14, borderWidth: 1, gap: 4 },
  summaryNum: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  summaryLabel: { fontSize: 10, fontFamily: 'Inter_500Medium', textTransform: 'uppercase' },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  tabText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  tabCount: { minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  tabCountText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  emptySubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
