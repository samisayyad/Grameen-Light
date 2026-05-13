import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Smart Village Lighting',
    subtitle: 'Empowering villages with AI-powered streetlight monitoring and energy audit system.',
    image: require('@/assets/images/onboard1.png'),
    accent: '#00E676',
  },
  {
    id: '2',
    title: 'Report & Track Instantly',
    subtitle: 'Spot a faulty streetlight? Report it in seconds and track its repair in real time.',
    image: require('@/assets/images/onboard2.png'),
    accent: '#00B4D8',
  },
  {
    id: '3',
    title: 'AI-Powered Insights',
    subtitle: 'Get AI analysis, energy saving stats, and smart maintenance predictions for your village.',
    image: require('@/assets/images/onboard3.png'),
    accent: '#9B59B6',
  },
];

export default function Onboarding() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setActiveIndex(viewableItems[0].index ?? 0);
  });

  const handleNext = async () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      await AsyncStorage.setItem('grameen_onboarded', 'true');
      router.replace('/auth/login');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('grameen_onboarded', 'true');
    router.replace('/auth/login');
  };

  const currentAccent = SLIDES[activeIndex]?.accent ?? colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.imageWrap, { backgroundColor: item.accent + '15' }]}>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
              <View style={[styles.imageGlow, { backgroundColor: item.accent + '20' }]} />
            </View>
            <View style={styles.textWrap}>
              <Text style={[styles.title, { color: item.accent }]}>{item.title}</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      <View style={[styles.bottom, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 20) }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const active = i === activeIndex;
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: active ? currentAccent : colors.border,
                    width: active ? 24 : 8,
                  },
                ]}
              />
            );
          })}
        </View>

        <Pressable
          onPress={handleNext}
          style={[styles.nextBtn, { backgroundColor: currentAccent }]}
        >
          <Text style={[styles.nextText, { color: colors.background }]}>
            {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>

        {activeIndex < SLIDES.length - 1 && (
          <Pressable onPress={handleSkip} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 32,
  },
  imageWrap: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  imageGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  textWrap: {
    paddingHorizontal: 32,
    gap: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottom: {
    paddingHorizontal: 24,
    gap: 16,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  skipBtn: {
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
});
