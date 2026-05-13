import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { Complaint, COMPLAINT_TYPE_LABELS, STATUS_LABELS, formatTimeAgo, getComplaintStatusColor } from '@/constants/mockData';
import { useColors } from '@/hooks/useColors';

interface ComplaintCardProps {
  complaint: Complaint;
  index?: number;
}

export function ComplaintCard({ complaint, index = 0 }: ComplaintCardProps) {
  const colors = useColors();
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const statusColor = getComplaintStatusColor(complaint.status);

  useEffect(() => {
    translateY.value = withDelay(index * 80, withSpring(0, { damping: 18 }));
    opacity.value = withDelay(index * 80, withSpring(1));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={() => router.push({ pathname: '/complaint/[id]', params: { id: complaint.id } })}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={styles.header}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.poleId, { color: colors.accent }]}>{complaint.poleId}</Text>
          <View style={[styles.badge, { backgroundColor: statusColor + '25', borderColor: statusColor + '60' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{STATUS_LABELS[complaint.status]}</Text>
          </View>
        </View>

        <Text style={[styles.type, { color: colors.foreground }]}>{COMPLAINT_TYPE_LABELS[complaint.type]}</Text>
        <Text style={[styles.location, { color: colors.mutedForeground }]} numberOfLines={1}>
          {complaint.poleLocation}
        </Text>

        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <Feather name="clock" size={11} color={colors.mutedForeground} />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>{formatTimeAgo(complaint.submittedAt)}</Text>
          </View>
          {complaint.assignedTo && (
            <View style={styles.metaRow}>
              <Feather name="user" size={11} color={colors.mutedForeground} />
              <Text style={[styles.meta, { color: colors.mutedForeground }]}>{complaint.assignedTo}</Text>
            </View>
          )}
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  poleId: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  type: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  location: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  meta: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});
