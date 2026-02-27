/**
 * AppNavigator — session-aware router.
 * path: src/presentation/navigation/AppNavigator.tsx
 *
 * No userId in state — DashboardScreen calls getCurrentUser()
 * which uses the Bearer token to fetch the profile.
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

  useEffect(() => {
    (async () => {
      const token = await TokenStorage.getAccessToken();
      setScreen(token ? 'dashboard' : 'login');
    })();
  }, []);

  function handleLoginSuccess() {
    setScreen('dashboard');
  }

  async function handleLogout() {
    await TokenStorage.clearAll();
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

  return <DashboardScreen onLogout={handleLogout} />;
}