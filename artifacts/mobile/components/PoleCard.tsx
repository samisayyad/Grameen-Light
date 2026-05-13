import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pole, POLE_STATUS_LABELS, getPoleStatusColor } from '@/constants/mockData';
import { useColors } from '@/hooks/useColors';

interface PoleCardProps {
  pole: Pole;
  onPress?: () => void;
  compact?: boolean;
}

export function PoleCard({ pole, onPress, compact = false }: PoleCardProps) {
  const colors = useColors();
  const statusColor = getPoleStatusColor(pole.status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compact,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
          <View style={[styles.statusGlow, { backgroundColor: statusColor + '40' }]} />
        </View>
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={[styles.poleId, { color: colors.foreground }]}>{pole.poleId}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20', borderColor: statusColor + '50' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {POLE_STATUS_LABELS[pole.status]}
              </Text>
            </View>
          </View>
          <Text style={[styles.location, { color: colors.mutedForeground }]} numberOfLines={1}>
            {pole.location}
          </Text>
          {!compact && (
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Feather name="alert-circle" size={10} color={colors.mutedForeground} />
                <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                  {pole.complaintCount} complaint{pole.complaintCount !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="zap" size={10} color={colors.mutedForeground} />
                <Text style={[styles.meta, { color: colors.mutedForeground }]}>{pole.wattage}W</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="tool" size={10} color={colors.mutedForeground} />
                <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                  {pole.lastMaintenance}
                </Text>
              </View>
            </View>
          )}
        </View>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  compact: {
    padding: 10,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'relative',
  },
  statusGlow: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    top: -4,
    left: -4,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  poleId: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  location: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  meta: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
});
