import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../theme/ThemeContext';

export default function HomeScreen() {
  const {theme, toggleTheme, mode} = useTheme();
  const {colors, typography, spacing, radii, shadows} = theme;

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />

      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {backgroundColor: colors.surface, borderBottomColor: colors.border},
          shadows.sm,
        ]}>
        <Text style={[typography.h3, {color: colors.text.primary}]}>
          ArkFsmApp
        </Text>
        <TouchableOpacity
          style={[
            styles.themeBtn,
            {backgroundColor: colors.surfaceAlt, borderRadius: radii.full},
          ]}
          onPress={toggleTheme}
          activeOpacity={0.75}>
          <Text style={{fontSize: 20}}>{theme.isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, {paddingHorizontal: spacing.lg}]}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <Text
          style={[
            typography.displayMd,
            {color: colors.text.primary, marginBottom: spacing.sm},
          ]}>
          Welcome 👋
        </Text>
        <Text
          style={[
            typography.body,
            {color: colors.text.secondary, marginBottom: spacing.xl},
          ]}>
          Edit{' '}
          <Text style={[typography.code, {color: colors.primary}]}>
            App.tsx
          </Text>{' '}
          to get started building your app.
        </Text>

        {/* ── Architecture card ── */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radii.xl,
              borderColor: colors.border,
              marginBottom: spacing.md,
            },
            shadows.md,
          ]}>
          <Text
            style={[
              typography.overline,
              {color: colors.text.disabled, marginBottom: spacing.xs},
            ]}>
            architecture
          </Text>
          <Text style={[typography.h2, {color: colors.primary}]}>
            Clean Architecture
          </Text>
          <Text
            style={[
              typography.bodySm,
              {color: colors.text.secondary, marginTop: spacing.xs},
            ]}>
            Theme-aware from day one. Edit{' '}
            <Text style={[typography.code, {color: colors.primary, fontSize: 12}]}>
              theme/colors.ts
            </Text>{' '}
            to restyle everything instantly.
          </Text>
        </View>

        {/* ── Theme tokens demo ── */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.primaryLight,
              borderRadius: radii.xl,
              borderColor: colors.borderFocus,
              marginBottom: spacing.xl,
            },
          ]}>
          <Text style={[typography.label, {color: colors.primary, marginBottom: spacing.sm}]}>
            Current theme tokens
          </Text>
          {[
            ['primary',    colors.primary],
            ['background', colors.background],
            ['surface',    colors.surface],
            ['text',       colors.text.primary],
            ['border',     colors.border],
          ].map(([token, value]) => (
            <View key={token} style={styles.tokenRow}>
              <View style={[styles.swatch, {backgroundColor: value as string, borderRadius: radii.xs}]} />
              <Text style={[typography.code, {color: colors.text.secondary, fontSize: 12}]}>
                {token}: {value as string}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Toggle button ── */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              borderRadius: radii.full,
              marginBottom: spacing['3xl'],
            },
            shadows.md,
          ]}
          onPress={toggleTheme}
          activeOpacity={0.85}>
          <Text style={[typography.button, {color: colors.text.inverse}]}>
            Switch to {theme.isDark ? 'Light' : 'Dark'} Mode
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  themeBtn: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center'},
  scroll:   {paddingTop: 32},
  card:     {padding: 24, borderWidth: 1, marginBottom: 8},
  tokenRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  swatch:   {width: 16, height: 16, marginRight: 8, borderWidth: 0.5, borderColor: '#00000020'},
  button:   {paddingVertical: 16, alignItems: 'center'},
});
