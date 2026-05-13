import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_ANALYTICS } from '@/constants/mockData';
import { useColors } from '@/hooks/useColors';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80;
const CHART_HEIGHT = 140;

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeMetric, setActiveMetric] = useState<'waste' | 'saved'>('saved');

  const maxValue = Math.max(...MOCK_ANALYTICS.map((m) => Math.max(m.wastekWh, m.savedkWh)));
  const totalSaved = MOCK_ANALYTICS.reduce((s, m) => s + m.savedkWh, 0);
  const totalWaste = MOCK_ANALYTICS.reduce((s, m) => s + m.wastekWh, 0);
  const co2Saved = Math.round((totalSaved * 0.82) / 1000 * 100) / 100;
  const costSaved = Math.round(totalSaved * 6);
  const totalComplaints = MOCK_ANALYTICS.reduce((s, m) => s + m.complaints, 0);
  const totalResolved = MOCK_ANALYTICS.reduce((s, m) => s + m.resolved, 0);
  const resolutionRate = Math.round((totalResolved / totalComplaints) * 100);

  const kpiCards = [
    { label: 'Energy Saved', value: `${(totalSaved / 1000).toFixed(1)}`, unit: 'MWh', icon: 'zap', color: colors.success },
    { label: 'Cost Saved', value: `₹${(costSaved / 1000).toFixed(1)}k`, unit: '', icon: 'trending-up', color: colors.warning },
    { label: 'CO₂ Reduced', value: `${co2Saved}`, unit: 'tonnes', icon: 'wind', color: colors.accent },
    { label: 'Resolution', value: `${resolutionRate}`, unit: '%', icon: 'check-circle', color: '#9B59B6' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12), borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Energy Analytics</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Kalhalli Village — Last 6 months</Text>
        </View>
        <View style={[styles.aiTag, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '30' }]}>
          <Feather name="cpu" size={12} color={colors.primary} />
          <Text style={[styles.aiTagText, { color: colors.primary }]}>AI</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 24) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          {kpiCards.map((k) => (
            <View key={k.label} style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: k.color + '30' }]}>
              <View style={[styles.kpiIcon, { backgroundColor: k.color + '20' }]}>
                <Feather name={k.icon as any} size={16} color={k.color} />
              </View>
              <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}<Text style={styles.kpiUnit}>{k.unit}</Text></Text>
              <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>{k.label}</Text>
              <View style={[styles.kpiAccent, { backgroundColor: k.color }]} />
            </View>
          ))}
        </View>

        {/* Energy Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.foreground }]}>Monthly Energy Trend</Text>
            <View style={styles.chartToggle}>
              <Pressable
                onPress={() => setActiveMetric('saved')}
                style={[styles.toggleBtn, { backgroundColor: activeMetric === 'saved' ? colors.success : 'transparent', borderColor: colors.success + '50' }]}
              >
                <Text style={[styles.toggleText, { color: activeMetric === 'saved' ? '#000' : colors.mutedForeground }]}>Saved</Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveMetric('waste')}
                style={[styles.toggleBtn, { backgroundColor: activeMetric === 'waste' ? colors.destructive : 'transparent', borderColor: colors.destructive + '50' }]}
              >
                <Text style={[styles.toggleText, { color: activeMetric === 'waste' ? '#fff' : colors.mutedForeground }]}>Waste</Text>
              </Pressable>
            </View>
          </View>

          {/* Bar Chart */}
          <View style={[styles.chart, { width: CHART_WIDTH }]}>
            {MOCK_ANALYTICS.map((m) => {
              const value = activeMetric === 'saved' ? m.savedkWh : m.wastekWh;
              const barHeight = (value / maxValue) * CHART_HEIGHT;
              const barColor = activeMetric === 'saved' ? colors.success : colors.destructive;
              return (
                <View key={m.month} style={styles.barGroup}>
                  <Text style={[styles.barValue, { color: colors.foreground }]}>{value}</Text>
                  <View style={[styles.bar, { height: barHeight, backgroundColor: barColor + 'CC', borderTopLeftRadius: 6, borderTopRightRadius: 6 }]}>
                    <View style={[styles.barGlow, { backgroundColor: barColor + '30' }]} />
                  </View>
                  <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>{m.month}</Text>
                </View>
              );
            })}
          </View>

          <Text style={[styles.chartNote, { color: colors.mutedForeground }]}>kWh — kilowatt hours</Text>
        </View>

        {/* Complaint Trend */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.foreground }]}>Complaint Resolution Trend</Text>
          <View style={styles.trendList}>
            {MOCK_ANALYTICS.map((m) => {
              const rate = Math.round((m.resolved / m.complaints) * 100);
              return (
                <View key={m.month} style={styles.trendRow}>
                  <Text style={[styles.trendMonth, { color: colors.foreground }]}>{m.month}</Text>
                  <View style={[styles.trendBar, { backgroundColor: colors.muted }]}>
                    <View style={[styles.trendFill, { width: `${rate}%` as any, backgroundColor: rate >= 80 ? colors.success : rate >= 50 ? colors.warning : colors.destructive }]} />
                  </View>
                  <View style={styles.trendNums}>
                    <Text style={[styles.trendNum, { color: colors.foreground }]}>{m.resolved}/{m.complaints}</Text>
                    <Text style={[styles.trendRate, { color: rate >= 80 ? colors.success : rate >= 50 ? colors.warning : colors.destructive }]}>{rate}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* AI Insight */}
        <View style={[styles.insightCard, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
          <View style={styles.insightHeader}>
            <Feather name="cpu" size={16} color={colors.primary} />
            <Text style={[styles.insightTitle, { color: colors.primary }]}>AI Prediction</Text>
          </View>
          <Text style={[styles.insightText, { color: colors.foreground }]}>
            Based on historical data, poles GL-002 and GL-007 are high-risk zones. Proactive maintenance in December could save an estimated 220 kWh and ₹1,320 in energy costs.
          </Text>
          <Text style={[styles.insightSub, { color: colors.mutedForeground }]}>Predictive Maintenance Score: 87% confidence</Text>
        </View>

        {/* Energy Formula */}
        <View style={[styles.formulaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formulaTitle, { color: colors.foreground }]}>Energy Waste Formula</Text>
          <View style={[styles.formula, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.formulaText, { color: colors.accent }]}>
              Waste = Faulty Poles × Wattage × Extra Hours
            </Text>
          </View>
          <View style={styles.formulaExample}>
            <Text style={[styles.formulaExLabel, { color: colors.mutedForeground }]}>Current Daytime Waste</Text>
            <Text style={[styles.formulaExValue, { color: colors.warning }]}>
              2 poles × 100W × 8 hrs = 1.6 kWh/day
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  headerSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  aiTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  aiTagText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: { width: '48%', borderRadius: 16, padding: 14, borderWidth: 1, gap: 6, overflow: 'hidden', position: 'relative' },
  kpiIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { fontSize: 22, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  kpiUnit: { fontSize: 12, fontFamily: 'Inter_400Regular', letterSpacing: 0 },
  kpiLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.3 },
  kpiAccent: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },
  chartCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  chartTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  chartToggle: { flexDirection: 'row', gap: 6 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  toggleText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: CHART_HEIGHT + 40, gap: 8, overflow: 'hidden' },
  barGroup: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: CHART_HEIGHT + 40 },
  bar: { width: '100%', position: 'relative', overflow: 'hidden' },
  barGlow: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 30 },
  barValue: { fontSize: 9, fontFamily: 'Inter_500Medium' },
  barLabel: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  chartNote: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 8, textAlign: 'right' },
  trendList: { gap: 12 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trendMonth: { width: 28, fontSize: 12, fontFamily: 'Inter_500Medium' },
  trendBar: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  trendFill: { height: '100%', borderRadius: 3 },
  trendNums: { flexDirection: 'row', gap: 6, width: 70, justifyContent: 'flex-end' },
  trendNum: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  trendRate: { fontSize: 11, fontFamily: 'Inter_600SemiBold', width: 34, textAlign: 'right' },
  insightCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  insightText: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  insightSub: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  formulaCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 12 },
  formulaTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  formula: { borderRadius: 10, padding: 12, borderWidth: 1 },
  formulaText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  formulaExample: { gap: 4 },
  formulaExLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  formulaExValue: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});
