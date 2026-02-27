/**
 * AppNavigator — session-aware router.
 * path: src/presentation/navigation/AppNavigator.tsx
 *
 * Launch flow:
 *   checking → token found? → Dashboard
 *                           → Login
 */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {TokenStorage} from '../../shared/config/TokenStorage';
import {useTheme} from '../theme';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';

type Screen = 'checking' | 'login' | 'dashboard';

export default function AppNavigator() {
  const {theme} = useTheme();
  const [screen, setScreen] = useState<Screen>('checking');
  const [userId, setUserId]  = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [token, id] = await Promise.all([
        TokenStorage.getAccessToken(),
        TokenStorage.getUserId(),
      ]);
      if (token && id) {
        setUserId(id);
        setScreen('dashboard');
      } else {
        setScreen('login');
      }
    })();
  }, []);

  function handleLoginSuccess(id: string) {
    setUserId(id);
    setScreen('dashboard');
  }

  async function handleLogout() {
    await TokenStorage.clearAll();
    setUserId(null);
    setScreen('login');
  }

  if (screen === 'checking') {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',
        backgroundColor: theme.colors.background}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (screen === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <DashboardScreen userId={userId!} onLogout={handleLogout} />;
}