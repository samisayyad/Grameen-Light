import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';

export default function Index() {
  const { user, loading } = useAuth();
  const colors = useColors();
  const [checkedOnboard, setCheckedOnboard] = useState(false);
  const [hasSeenOnboard, setHasSeenOnboard] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('grameen_onboarded').then((val) => {
      setHasSeenOnboard(val === 'true');
      setCheckedOnboard(true);
    });
  }, []);

  if (loading || !checkedOnboard) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (user) return <Redirect href="/(tabs)" />;
  if (!hasSeenOnboard) return <Redirect href="/onboarding" />;
  return <Redirect href="/auth/login" />;
}
