/**
 * LoginScreen — accepts username / email / phone with live validation.
 * path: src/presentation/screens/LoginScreen.tsx
 */
import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../theme';
import {useAuth} from '../hooks/useAuth';
import {
  detectIdentifierType,
  validateIdentifier,
  validatePassword,
  IdentifierType,
} from '../../shared/utils/validators';

interface Props {
  onLoginSuccess: (userId: string) => void;
}

// ── Type pill shown next to the label ────────────────────────
function TypePill({type}: {type: IdentifierType | null}) {
  const {theme} = useTheme();
  const {colors, typography, radii} = theme;
  if (!type) return null;

  const map: Record<IdentifierType, {icon: string; label: string; color: string; bg: string}> = {
    email:    {icon: '📧', label: 'Email',    color: colors.status.info,    bg: colors.status.infoBg},
    phone:    {icon: '📱', label: 'Phone',    color: colors.status.success, bg: colors.status.successBg},
    username: {icon: '👤', label: 'Username', color: colors.primary,        bg: colors.primaryLight},
  };
  const c = map[type];
  return (
    <View style={[styles.typePill, {backgroundColor: c.bg, borderRadius: radii.full}]}>
      <Text style={{fontSize: 11}}>{c.icon}</Text>
      <Text style={[typography.labelSm, {color: c.color, marginLeft: 4}]}>{c.label}</Text>
    </View>
  );
}

// ── Inline field error ────────────────────────────────────────
function FieldError({msg}: {msg: string | null}) {
  const {theme} = useTheme();
  if (!msg) return null;
  return (
    <Text style={[theme.typography.caption, styles.fieldError,
      {color: theme.colors.status.error}]}>
      ⚠ {msg}
    </Text>
  );
}

// ── Strength bar (shows while typing, disappears when valid) ──
function StrengthBar({length}: {length: number}) {
  const {theme} = useTheme();
  const {colors} = theme;
  if (length === 0 || length >= 6) return null;
  const filled = Math.ceil((length / 6) * 4);
  const color =
    filled <= 1 ? colors.status.error :
    filled <= 2 ? colors.status.warning :
    colors.status.success;
  return (
    <View style={styles.strengthRow}>
      {[1,2,3,4].map(i => (
        <View key={i} style={[styles.strengthSeg,
          {backgroundColor: i <= filled ? color : colors.border, borderRadius: 2}]} />
      ))}
      <Text style={[theme.typography.caption, {color, marginLeft: 8}]}>
        {filled <= 1 ? 'Too weak' : filled <= 2 ? 'Weak' : 'Almost there'}
      </Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────
export default function LoginScreen({onLoginSuccess}: Props) {
  const {theme} = useTheme();
  const {colors, typography, spacing, radii, shadows} = theme;
  const {login, isLoading, error, clearError} = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [showPwd, setShowPwd]       = useState(false);
  const [touched, setTouched]       = useState({id: false, pwd: false});
  const pwdRef = useRef<TextInput>(null);

  const idType   = identifier.trim() ? detectIdentifierType(identifier) : null;
  const idVal    = validateIdentifier(identifier);
  const pwdVal   = validatePassword(password);
  const canSubmit = idVal.valid && pwdVal.valid && !isLoading;

  async function handleSubmit() {
    setTouched({id: true, pwd: true});
    if (!canSubmit) return;
    const uid = await login(identifier.trim(), password);
    if (uid) onLoginSuccess(uid);
  }

  const inputStyle = (hasError: boolean) => [
    styles.input,
    {
      backgroundColor: colors.surfaceAlt,
      borderColor:     hasError ? colors.status.error : colors.border,
      borderRadius:    radii.md,
      color:           colors.text.primary,
      borderWidth:     hasError ? 1.5 : 1,
    },
    typography.body,
  ];

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <KeyboardAvoidingView style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.scroll, {paddingHorizontal: spacing.lg}]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Logo ── */}
          <View style={styles.brand}>
            <View style={[styles.logoBox, {backgroundColor: colors.primaryLight, borderRadius: radii.xl}]}>
              <Text style={styles.logoEmoji}>🔐</Text>
            </View>
            <Text style={[typography.h1, {color: colors.text.primary, marginTop: spacing.lg}]}>
              Welcome back
            </Text>
            <Text style={[typography.body, {color: colors.text.secondary, marginTop: spacing.xs,
              textAlign: 'center'}]}>
              Sign in with your username, email or phone
            </Text>
          </View>

          {/* ── Server error ── */}
          {error ? (
            <TouchableOpacity
              onPress={clearError}
              style={[styles.errBanner, {backgroundColor: colors.status.errorBg,
                borderColor: colors.status.error, borderRadius: radii.md,
                marginBottom: spacing.md}]}>
              <Text style={[typography.bodySm, {color: colors.status.error, fontWeight: '600'}]}>
                {error}
              </Text>
              <Text style={[typography.caption, {color: colors.status.error, marginTop: 2}]}>
                Tap to dismiss
              </Text>
            </TouchableOpacity>
          ) : null}

          {/* ── Form card ── */}
          <View style={[styles.card, {backgroundColor: colors.surface,
            borderRadius: radii.xl, padding: spacing.lg,
            borderColor: colors.border, marginBottom: spacing.md}, shadows.md]}>

            {/* Identifier */}
            <View style={styles.labelRow}>
              <Text style={[typography.label, {color: colors.text.secondary}]}>
                Username / Email / Phone
              </Text>
              <TypePill type={idType} />
            </View>
            <TextInput
              style={inputStyle(touched.id && !idVal.valid)}
              placeholder="e.g. mitali  ·  email@example.com  ·  +91..."
              placeholderTextColor={colors.text.disabled}
              value={identifier}
              onChangeText={v => { setIdentifier(v); if (error) clearError(); }}
              onBlur={() => setTouched(t => ({...t, id: true}))}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => pwdRef.current?.focus()}
              editable={!isLoading}
            />
            {touched.id && <FieldError msg={idVal.error} />}

            {/* Password */}
            <Text style={[typography.label, {color: colors.text.secondary,
              marginTop: spacing.md, marginBottom: spacing.xs}]}>
              Password
            </Text>
            <View style={styles.pwdRow}>
              <TextInput
                ref={pwdRef}
                style={[inputStyle(touched.pwd && !pwdVal.valid), styles.pwdInput]}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.disabled}
                secureTextEntry={!showPwd}
                value={password}
                onChangeText={setPassword}
                onBlur={() => setTouched(t => ({...t, pwd: true}))}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[styles.eyeBtn, {backgroundColor: colors.surfaceAlt, borderRadius: radii.md}]}
                onPress={() => setShowPwd(v => !v)}
                activeOpacity={0.7}>
                <Text style={{fontSize: 20}}>{showPwd ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {touched.pwd && <FieldError msg={pwdVal.error} />}
            <StrengthBar length={password.length} />
          </View>

          {/* ── Hint ── */}
          <View style={[styles.hint, {backgroundColor: colors.surfaceAlt,
            borderRadius: radii.md, marginBottom: spacing.lg, padding: spacing.sm}]}>
            <Text style={[typography.caption, {color: colors.text.secondary}]}>
              💡 You can sign in with your username, email address, or phone number
            </Text>
          </View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[styles.submitBtn,
              {backgroundColor: canSubmit ? colors.primary : colors.border,
               borderRadius: radii.full},
              canSubmit ? shadows.md : {}]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}>
            {isLoading ? (
              <ActivityIndicator color={colors.text.inverse} />
            ) : (
              <Text style={[typography.button,
                {color: canSubmit ? colors.text.inverse : colors.text.disabled}]}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <Text style={[typography.caption, {color: colors.text.disabled,
            textAlign: 'center', marginTop: spacing.xl}]}>
            By signing in you agree to our Terms & Privacy Policy
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        {flex: 1},
  flex:        {flex: 1},
  scroll:      {flexGrow: 1, justifyContent: 'center', paddingVertical: 48},
  brand:       {alignItems: 'center', marginBottom: 32},
  logoBox:     {width: 72, height: 72, alignItems: 'center', justifyContent: 'center'},
  logoEmoji:   {fontSize: 34},
  errBanner:   {padding: 12, borderWidth: 1},
  card:        {borderWidth: 1},
  labelRow:    {flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 8},
  typePill:    {flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 10, paddingVertical: 4},
  input:       {paddingHorizontal: 14, paddingVertical: 12, marginBottom: 2},
  fieldError:  {marginTop: 4, marginLeft: 2, marginBottom: 4},
  pwdRow:      {flexDirection: 'row', alignItems: 'center', gap: 8},
  pwdInput:    {flex: 1},
  eyeBtn:      {width: 50, height: 50, alignItems: 'center', justifyContent: 'center'},
  strengthRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8},
  strengthSeg: {height: 4, flex: 1},
  hint:        {},
  submitBtn:   {paddingVertical: 16, alignItems: 'center'},
});