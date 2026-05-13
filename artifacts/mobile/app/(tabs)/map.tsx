import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PoleCard } from '@/components/PoleCard';
import { MOCK_POLES, Pole, PoleStatus, POLE_STATUS_LABELS, getPoleStatusColor } from '@/constants/mockData';
import { useColors } from '@/hooks/useColors';

const FILTERS: { label: string; value: PoleStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Working', value: 'working' },
  { label: 'Fused', value: 'fused' },
  { label: 'Daytime ON', value: 'daytime_on' },
  { label: 'No Data', value: 'no_data' },
];

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<PoleStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_POLES.filter((p) => {
    const matchFilter = filter === 'all' || p.status === filter;
    const matchSearch = search === '' || p.poleId.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const statusCounts = {
    working: MOCK_POLES.filter(p => p.status === 'working').length,
    fused: MOCK_POLES.filter(p => p.status === 'fused').length,
    daytime_on: MOCK_POLES.filter(p => p.status === 'daytime_on').length,
    no_data: MOCK_POLES.filter(p => p.status === 'no_data').length,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 90) }]}
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8) }}>
            <Text style={[styles.title, { color: colors.foreground }]}>Streetlight Poles</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Kalhalli Village — {MOCK_POLES.length} poles</Text>

            {/* Visual Map Placeholder */}
            <View style={[styles.mapBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.mapGrid}>
                {MOCK_POLES.map((pole) => (
                  <View key={pole.id} style={styles.mapDotWrap}>
                    <View style={[styles.mapDot, { backgroundColor: getPoleStatusColor(pole.status) }]}>
                      <View style={[styles.mapGlow, { backgroundColor: getPoleStatusColor(pole.status) + '40' }]} />
                    </View>
                    <Text style={[styles.mapLabel, { color: colors.mutedForeground }]}>{pole.poleId}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.legend}>
                {Object.entries({ working: '#00E676', fused: '#FF3B6F', daytime_on: '#FFB800', no_data: '#8899BB' }).map(([k, c]) => (
                  <View key={k} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: c }]} />
                    <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>{POLE_STATUS_LABELS[k as PoleStatus]}</Text>
                    <Text style={[styles.legendCount, { color: colors.foreground }]}>{statusCounts[k as keyof typeof statusCounts]}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Search */}
            <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="search" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.searchInput, { color: colors.foreground }]}
                placeholder="Search by pole ID or location..."
                placeholderTextColor={colors.mutedForeground}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')}>
                  <Feather name="x" size={16} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>

            {/* Filters */}
            <View style={styles.filterRow}>
              {FILTERS.map((f) => {
                const active = filter === f.value;
                const color = f.value === 'all' ? colors.primary : getPoleStatusColor(f.value as PoleStatus);
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => setFilter(f.value)}
                    style={[
                      styles.filterBtn,
                      {
                        backgroundColor: active ? color : colors.card,
                        borderColor: active ? color : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.filterText, { color: active ? (f.value === 'all' ? colors.background : '#000') : colors.mutedForeground }]}>
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
              {filtered.length} pole{filtered.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        }
        renderItem={({ item }) => <PoleCard pole={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="radio" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No poles found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 20 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 16 },
  mapBox: { borderRadius: 18, padding: 18, borderWidth: 1, marginBottom: 16 },
  mapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-around', marginBottom: 16 },
  mapDotWrap: { alignItems: 'center', gap: 4 },
  mapDot: { width: 14, height: 14, borderRadius: 7, position: 'relative' },
  mapGlow: { position: 'absolute', width: 24, height: 24, borderRadius: 12, top: -5, left: -5 },
  mapLabel: { fontSize: 9, fontFamily: 'Inter_500Medium' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  legendCount: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, paddingHorizontal: 14, height: 46, borderWidth: 1, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  resultCount: { fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 10 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});
