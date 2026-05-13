import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COMPLAINT_TYPE_LABELS, ComplaintType, MOCK_POLES } from '@/constants/mockData';
import { useColors } from '@/hooks/useColors';

const ISSUE_TYPES: ComplaintType[] = ['not_working', 'daytime_on', 'flickering', 'broken_pole', 'wiring', 'physical_damage'];

const ISSUE_ICONS: Record<ComplaintType, string> = {
  not_working: 'moon',
  daytime_on: 'sun',
  flickering: 'zap',
  broken_pole: 'alert-triangle',
  wiring: 'activity',
  physical_damage: 'tool',
};

const ISSUE_COLORS: Record<ComplaintType, string> = {
  not_working: '#00B4D8',
  daytime_on: '#FFB800',
  flickering: '#9B59B6',
  broken_pole: '#FF3B6F',
  wiring: '#FF8C42',
  physical_damage: '#E74C3C',
};

export default function ReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [selectedPoleId, setSelectedPoleId] = useState('');
  const [selectedType, setSelectedType] = useState<ComplaintType | ''>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedPoleId('');
    setSelectedType('');
    setDescription('');
    setSubmitted(false);
  };

  const selectedPole = MOCK_POLES.find((p) => p.id === selectedPoleId);

  if (submitted) {
    const complaintId = 'GL-' + Date.now().toString().slice(-6);
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.successWrap, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 60) }]}>
          <Animated.View entering={FadeInDown.duration(500)} style={[styles.successIcon, { backgroundColor: colors.success + '20', borderColor: colors.success + '40' }]}>
            <Feather name="check" size={48} color={colors.success} />
          </Animated.View>
          <Text style={[styles.successTitle, { color: colors.success }]}>Complaint Submitted!</Text>
          <Text style={[styles.successId, { color: colors.mutedForeground }]}>ID: {complaintId}</Text>
          <Text style={[styles.successMsg, { color: colors.mutedForeground }]}>
            Your complaint has been registered. You will receive updates as the status changes.
          </Text>
          <View style={[styles.trackBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.trackLabel, { color: colors.mutedForeground }]}>Pole</Text>
            <Text style={[styles.trackValue, { color: colors.foreground }]}>{selectedPole?.poleId} — {selectedPole?.location}</Text>
            <Text style={[styles.trackLabel, { color: colors.mutedForeground }]}>Issue</Text>
            <Text style={[styles.trackValue, { color: colors.foreground }]}>{COMPLAINT_TYPE_LABELS[selectedType as ComplaintType]}</Text>
          </View>
          <Pressable onPress={handleReset} style={[styles.newBtn, { backgroundColor: colors.primary }]}>
            <Text style={[styles.newBtnText, { color: colors.background }]}>Submit Another</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8), paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 90) }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Report Complaint</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Help improve your village lighting</Text>

        {/* Step indicators */}
        <View style={styles.steps}>
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <View style={[styles.stepCircle, { backgroundColor: step >= s ? colors.primary : colors.card, borderColor: step >= s ? colors.primary : colors.border }]}>
                {step > s ? <Feather name="check" size={12} color={colors.background} /> : <Text style={[styles.stepNum, { color: step === s ? colors.background : colors.mutedForeground }]}>{s}</Text>}
              </View>
              {s < 3 && <View style={[styles.stepLine, { backgroundColor: step > s ? colors.primary : colors.border }]} />}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.stepLabels}>
          {['Select Pole', 'Issue Type', 'Details'].map((l, i) => (
            <Text key={l} style={[styles.stepLabel, { color: step === i + 1 ? colors.primary : colors.mutedForeground }]}>{l}</Text>
          ))}
        </View>

        {/* Step 1: Select Pole */}
        {step === 1 && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Select a Streetlight Pole</Text>
            {MOCK_POLES.map((pole) => (
              <Pressable
                key={pole.id}
                onPress={() => setSelectedPoleId(pole.id)}
                style={[
                  styles.poleOption,
                  {
                    backgroundColor: selectedPoleId === pole.id ? colors.primary + '15' : colors.card,
                    borderColor: selectedPoleId === pole.id ? colors.primary : colors.border,
                  },
                ]}
              >
                <View style={[styles.poleDot, { backgroundColor: pole.status === 'working' ? colors.success : pole.status === 'fused' ? colors.destructive : colors.warning }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.poleId, { color: colors.foreground }]}>{pole.poleId}</Text>
                  <Text style={[styles.poleLoc, { color: colors.mutedForeground }]}>{pole.location}</Text>
                </View>
                {selectedPoleId === pole.id && <Feather name="check-circle" size={18} color={colors.primary} />}
              </Pressable>
            ))}
            <Pressable
              onPress={() => { if (selectedPoleId) { setStep(2); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } }}
              style={[styles.nextBtn, { backgroundColor: selectedPoleId ? colors.primary : colors.card, borderColor: selectedPoleId ? colors.primary : colors.border }]}
            >
              <Text style={[styles.nextBtnText, { color: selectedPoleId ? colors.background : colors.mutedForeground }]}>Next — Issue Type</Text>
              <Feather name="arrow-right" size={16} color={selectedPoleId ? colors.background : colors.mutedForeground} />
            </Pressable>
          </Animated.View>
        )}

        {/* Step 2: Issue Type */}
        {step === 2 && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Select Issue Type</Text>
            <View style={styles.issueGrid}>
              {ISSUE_TYPES.map((type) => {
                const active = selectedType === type;
                const color = ISSUE_COLORS[type];
                return (
                  <Pressable
                    key={type}
                    onPress={() => { setSelectedType(type); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    style={[styles.issueCard, { backgroundColor: active ? color + '20' : colors.card, borderColor: active ? color : colors.border }]}
                  >
                    <Feather name={ISSUE_ICONS[type] as any} size={22} color={active ? color : colors.mutedForeground} />
                    <Text style={[styles.issueLabel, { color: active ? color : colors.foreground }]}>{COMPLAINT_TYPE_LABELS[type]}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.rowBtns}>
              <Pressable onPress={() => setStep(1)} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="arrow-left" size={16} color={colors.foreground} />
                <Text style={[styles.backBtnText, { color: colors.foreground }]}>Back</Text>
              </Pressable>
              <Pressable
                onPress={() => { if (selectedType) { setStep(3); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } }}
                style={[styles.nextBtn2, { backgroundColor: selectedType ? colors.primary : colors.card, borderColor: selectedType ? colors.primary : colors.border, flex: 1 }]}
              >
                <Text style={[styles.nextBtnText, { color: selectedType ? colors.background : colors.mutedForeground }]}>Next</Text>
                <Feather name="arrow-right" size={16} color={selectedType ? colors.background : colors.mutedForeground} />
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.detailsWrap}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Add Details</Text>

            <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Pole</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>{selectedPole?.poleId} — {selectedPole?.location}</Text>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Issue</Text>
              <Text style={[styles.summaryValue, { color: ISSUE_COLORS[selectedType as ComplaintType] }]}>{COMPLAINT_TYPE_LABELS[selectedType as ComplaintType]}</Text>
            </View>

            <TextInput
              style={[styles.descInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              placeholder="Describe the issue (optional)..."
              placeholderTextColor={colors.mutedForeground}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Pressable onPress={() => {}} style={[styles.photoBtn, { backgroundColor: colors.card, borderColor: colors.primary + '50', borderStyle: 'dashed' }]}>
              <Feather name="camera" size={22} color={colors.primary} />
              <Text style={[styles.photoBtnText, { color: colors.primary }]}>Add Photo (Optional)</Text>
            </Pressable>

            <Pressable onPress={() => {}} style={[styles.locationRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="map-pin" size={16} color={colors.accent} />
              <Text style={[styles.locationText, { color: colors.foreground }]}>Use current GPS location</Text>
              <Feather name="check-circle" size={16} color={colors.success} />
            </Pressable>

            <View style={styles.rowBtns}>
              <Pressable onPress={() => setStep(2)} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="arrow-left" size={16} color={colors.foreground} />
                <Text style={[styles.backBtnText, { color: colors.foreground }]}>Back</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                style={[styles.submitBtn, { backgroundColor: colors.primary, flex: 1, opacity: submitting ? 0.7 : 1 }]}
              >
                {submitting ? (
                  <Text style={[styles.submitBtnText, { color: colors.background }]}>Submitting...</Text>
                ) : (
                  <>
                    <Feather name="send" size={16} color={colors.background} />
                    <Text style={[styles.submitBtnText, { color: colors.background }]}>Submit Complaint</Text>
                  </>
                )}
              </Pressable>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2, marginBottom: 20 },
  steps: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  stepNum: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  stepLine: { flex: 1, height: 2 },
  stepLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  stepLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', width: '33%', textAlign: 'center' },
  stepTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold', marginBottom: 14 },
  poleOption: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1.5, marginBottom: 8 },
  poleDot: { width: 10, height: 10, borderRadius: 5 },
  poleId: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  poleLoc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 14, borderWidth: 1.5, marginTop: 16 },
  nextBtn2: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 14, borderWidth: 1.5 },
  nextBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  issueGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  issueCard: { width: '48%', borderRadius: 14, padding: 16, borderWidth: 1.5, gap: 8, alignItems: 'flex-start' },
  issueLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  rowBtns: { flexDirection: 'row', gap: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 48, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1 },
  backBtnText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  detailsWrap: { gap: 12 },
  summaryCard: { borderRadius: 14, padding: 14, borderWidth: 1, gap: 4 },
  summaryLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  descInput: { borderRadius: 14, padding: 14, borderWidth: 1, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 100 },
  photoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 52, borderRadius: 14, borderWidth: 1.5 },
  photoBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  locationText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 14 },
  submitBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  successWrap: { flex: 1, alignItems: 'center', paddingHorizontal: 32, gap: 16 },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginBottom: 8 },
  successTitle: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  successId: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  successMsg: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22 },
  trackBox: { width: '100%', borderRadius: 16, padding: 16, borderWidth: 1, gap: 4 },
  trackLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', textTransform: 'uppercase' },
  trackValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 8 },
  newBtn: { width: '100%', height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  newBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold' },
});
