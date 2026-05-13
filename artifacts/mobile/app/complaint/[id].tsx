import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  COMPLAINT_TYPE_LABELS,
  MOCK_COMPLAINTS,
  STATUS_LABELS,
  formatTimeAgo,
  getComplaintStatusColor,
} from '@/constants/mockData';
import { useColors } from '@/hooks/useColors';

const TIMELINE: { status: string; label: string; icon: string }[] = [
  { status: 'submitted', label: 'Submitted', icon: 'upload' },
  { status: 'assigned', label: 'Assigned to Worker', icon: 'user-check' },
  { status: 'in_progress', label: 'Work in Progress', icon: 'tool' },
  { status: 'fixed', label: 'Issue Fixed', icon: 'check-circle' },
];

const STATUS_ORDER = ['submitted', 'assigned', 'in_progress', 'fixed'];

export default function ComplaintDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const complaint = MOCK_COMPLAINTS.find((c) => c.id === id);

  if (!complaint) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Complaint not found</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.primary }]}>
          <Text style={[styles.backBtnText, { color: colors.background }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const statusColor = getComplaintStatusColor(complaint.status);
  const currentStatusIndex = STATUS_ORDER.indexOf(complaint.status);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12), borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.headerBack}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Complaint Details</Text>
        <View style={[styles.statusPill, { backgroundColor: statusColor + '20', borderColor: statusColor + '40' }]}>
          <Text style={[styles.statusPillText, { color: statusColor }]}>{STATUS_LABELS[complaint.status]}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main info card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrap, { backgroundColor: colors.accent + '20' }]}>
              <Feather name="radio" size={16} color={colors.accent} />
            </View>
            <View>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Pole ID</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{complaint.poleId}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrap, { backgroundColor: colors.warning + '20' }]}>
              <Feather name="map-pin" size={16} color={colors.warning} />
            </View>
            <View>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Location</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{complaint.poleLocation}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrap, { backgroundColor: colors.destructive + '20' }]}>
              <Feather name="alert-circle" size={16} color={colors.destructive} />
            </View>
            <View>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Issue Type</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{COMPLAINT_TYPE_LABELS[complaint.type]}</Text>
            </View>
          </View>
          {complaint.description && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Description</Text>
                <Text style={[styles.infoValue, { color: colors.foreground, marginTop: 4 }]}>{complaint.description}</Text>
              </View>
            </>
          )}
        </View>

        {/* Metadata */}
        <View style={[styles.metaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.mutedForeground }]}>Submitted by</Text>
            <Text style={[styles.metaVal, { color: colors.foreground }]}>{complaint.submittedBy}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.mutedForeground }]}>Filed</Text>
            <Text style={[styles.metaVal, { color: colors.foreground }]}>{formatTimeAgo(complaint.submittedAt)}</Text>
          </View>
          {complaint.assignedTo && (
            <View style={styles.metaRow}>
              <Text style={[styles.metaKey, { color: colors.mutedForeground }]}>Assigned to</Text>
              <Text style={[styles.metaVal, { color: colors.success }]}>{complaint.assignedTo}</Text>
            </View>
          )}
          {complaint.estimatedTime && (
            <View style={styles.metaRow}>
              <Text style={[styles.metaKey, { color: colors.mutedForeground }]}>Est. Resolution</Text>
              <Text style={[styles.metaVal, { color: colors.warning }]}>{complaint.estimatedTime}</Text>
            </View>
          )}
          {complaint.resolvedAt && (
            <View style={styles.metaRow}>
              <Text style={[styles.metaKey, { color: colors.mutedForeground }]}>Resolved</Text>
              <Text style={[styles.metaVal, { color: colors.success }]}>{formatTimeAgo(complaint.resolvedAt)}</Text>
            </View>
          )}
        </View>

        {/* Timeline */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Status Timeline</Text>
        <View style={[styles.timeline, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {TIMELINE.map((step, index) => {
            const isDone = STATUS_ORDER.indexOf(step.status) <= currentStatusIndex;
            const isCurrent = step.status === complaint.status;
            const isLast = index === TIMELINE.length - 1;
            const stepColor = isDone ? (isCurrent ? statusColor : colors.success) : colors.muted;

            return (
              <View key={step.status}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: stepColor, borderColor: isCurrent ? statusColor : 'transparent' }]}>
                      <Feather name={step.icon as any} size={10} color={isDone ? '#000' : colors.mutedForeground} />
                    </View>
                    {!isLast && <View style={[styles.timelineLine, { backgroundColor: isDone ? colors.success : colors.border }]} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[styles.timelineLabel, { color: isDone ? colors.foreground : colors.mutedForeground, fontFamily: isCurrent ? 'Inter_600SemiBold' : 'Inter_400Regular' }]}>
                      {step.label}
                    </Text>
                    {isCurrent && (
                      <View style={[styles.currentBadge, { backgroundColor: statusColor + '20', borderColor: statusColor + '40' }]}>
                        <Text style={[styles.currentBadgeText, { color: statusColor }]}>Current Status</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {complaint.status === 'rejected' && (
          <View style={[styles.rejectedCard, { backgroundColor: colors.destructive + '15', borderColor: colors.destructive + '30' }]}>
            <Feather name="x-circle" size={18} color={colors.destructive} />
            <Text style={[styles.rejectedText, { color: colors.destructive }]}>
              This complaint was rejected. It may have been a duplicate or outside the scope of village maintenance.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  headerBack: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusPillText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },
  infoCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontFamily: 'Inter_500Medium', marginTop: 2 },
  divider: { height: 1 },
  metaCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaKey: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  metaVal: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textAlign: 'right', flex: 1, marginLeft: 10 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginTop: 4 },
  timeline: { borderRadius: 16, padding: 16, borderWidth: 1 },
  timelineItem: { flexDirection: 'row', gap: 14, minHeight: 56 },
  timelineLeft: { alignItems: 'center', width: 24 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  timelineLine: { flex: 1, width: 2, marginTop: 4, marginBottom: 4 },
  timelineContent: { flex: 1, paddingTop: 2, gap: 4, paddingBottom: 12 },
  timelineLabel: { fontSize: 14 },
  currentBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  currentBadgeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  rejectedCard: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: 'flex-start' },
  rejectedText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  errorText: { fontSize: 16, fontFamily: 'Inter_500Medium', marginTop: 12 },
  backBtn: { marginTop: 20, paddingHorizontal: 24, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
