/**
 * DashboardScreen — post-login landing page with theme switcher.
 * path: src/presentation/screens/DashboardScreen.tsx
 */
import React from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../theme';
import {useUserProfile} from '../hooks/useUserProfile';
import {User} from '../../domain/entities/User';
import {BusinessFeature, Follower, Post, Skill} from '../../domain/entities/User';

interface Props {
  userId: string;
  onLogout: () => void;
}

// ─────────────────────────────────────────────────────────────
// Reusable atoms
// ─────────────────────────────────────────────────────────────

function Avatar({uri, name, size = 80}: {uri?: string | null; name: string; size?: number}) {
  const {theme} = useTheme();
  const {colors} = theme;
  const initials = (name || '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  if (uri) {
    return (
      <Image
        source={{uri}}
        style={{width: size, height: size, borderRadius: size / 2,
          borderWidth: 3, borderColor: colors.primary}}
      />
    );
  }
  return (
    <View style={{width: size, height: size, borderRadius: size / 2,
      backgroundColor: colors.primaryLight,
      borderWidth: 3, borderColor: colors.primary,
      alignItems: 'center', justifyContent: 'center'}}>
      <Text style={[theme.typography.h2, {color: colors.primary}]}>{initials}</Text>
    </View>
  );
}

function StatPill({label, value}: {label: string; value: number}) {
  const {theme} = useTheme();
  return (
    <View style={styles.statPill}>
      <Text style={[theme.typography.h3, {color: theme.colors.primary}]}>{value}</Text>
      <Text style={[theme.typography.caption, {color: theme.colors.text.secondary}]}>{label}</Text>
    </View>
  );
}

function SectionCard({title, children}: {title: string; children: React.ReactNode}) {
  const {theme} = useTheme();
  const {colors, typography, spacing, radii, shadows} = theme;
  return (
    <View style={[styles.sectionCard,
      {backgroundColor: colors.surface, borderRadius: radii.xl,
       borderColor: colors.border, padding: spacing.md,
       marginBottom: spacing.md}, shadows.sm]}>
      <Text style={[typography.overline,
        {color: colors.text.disabled, marginBottom: spacing.sm}]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function FollowerChip({item}: {item: Follower}) {
  const {theme} = useTheme();
  const {colors, typography, spacing, radii} = theme;
  const initial = (item.full_name || item.username)[0]?.toUpperCase() ?? '?';
  return (
    <View style={[styles.followerChip, {marginRight: spacing.sm, alignItems: 'center'}]}>
      {item.profile_pic_url ? (
        <Image source={{uri: item.profile_pic_url}}
          style={{width: 44, height: 44, borderRadius: 22,
            borderWidth: 2, borderColor: colors.border}} />
      ) : (
        <View style={{width: 44, height: 44, borderRadius: 22,
          backgroundColor: colors.primaryLight,
          borderWidth: 2, borderColor: colors.border,
          alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: colors.primary, fontWeight: '700', fontSize: 15}}>
            {initial}
          </Text>
        </View>
      )}
      <Text style={[typography.caption, {color: colors.text.secondary,
        marginTop: 4, maxWidth: 52}]} numberOfLines={1}>
        @{item.username}
      </Text>
    </View>
  );
}

function PostRow({post, last}: {post: Post; last: boolean}) {
  const {theme} = useTheme();
  const {colors, typography, spacing} = theme;
  return (
    <View style={[styles.postRow,
      {borderBottomColor: colors.divider,
       borderBottomWidth: last ? 0 : 1,
       paddingVertical: spacing.sm}]}>
      <View style={{flex: 1}}>
        <Text style={[typography.label, {color: colors.text.primary}]} numberOfLines={1}>
          {post.post_name || 'Post'}
        </Text>
        {post.post_description ? (
          <Text style={[typography.caption, {color: colors.text.secondary, marginTop: 2}]}
            numberOfLines={1}>
            {post.post_description}
          </Text>
        ) : null}
      </View>
      <Text style={[typography.caption, {color: colors.text.disabled}]}>
        {new Date(post.created_date).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short',
        })}
      </Text>
    </View>
  );
}

function FeatureCard({feature}: {feature: BusinessFeature}) {
  const {theme} = useTheme();
  const {colors, typography, spacing, radii, shadows} = theme;
  const emoji: Record<string, string> = {
    purchase_request: '🛒', collaboration: '🤝',
    book_time: '📅', business_inquery: '💼',
  };
  return (
    <View style={[styles.featureCard,
      {backgroundColor: colors.primaryLight, borderRadius: radii.md,
       borderColor: colors.borderFocus, padding: spacing.sm,
       marginRight: spacing.sm, marginBottom: spacing.sm}, shadows.sm]}>
      <Text style={{fontSize: 24, textAlign: 'center'}}>
        {emoji[feature.feature_name] ?? '⭐'}
      </Text>
      <Text style={[typography.caption, {color: colors.primary,
        textAlign: 'center', marginTop: 4}]}>
        {feature.feature_description}
      </Text>
    </View>
  );
}

function SkillTag({skill}: {skill: Skill}) {
  const {theme} = useTheme();
  const {colors, typography, spacing, radii} = theme;
  return (
    <View style={[{backgroundColor: colors.status.infoBg, borderRadius: radii.full,
      paddingHorizontal: spacing.sm, paddingVertical: 3,
      marginRight: 6, marginBottom: 6}]}>
      <Text style={[typography.labelSm, {color: colors.status.info}]}>{skill.name}</Text>
    </View>
  );
}

// ── Theme switcher — 3-way Light / System / Dark ──────────────
function ThemeSwitcher() {
  const {theme, mode, setMode} = useTheme();
  const {colors, typography, radii} = theme;

  const opts = [
    {key: 'light'  as const, icon: '☀️',  label: 'Light'},
    {key: 'system' as const, icon: '📱',  label: 'System'},
    {key: 'dark'   as const, icon: '🌙',  label: 'Dark'},
  ];

  return (
    <View style={[styles.switcher, {backgroundColor: colors.surfaceAlt, borderRadius: radii.full, padding: 3}]}>
      {opts.map(o => {
        const active = mode === o.key;
        return (
          <TouchableOpacity
            key={o.key}
            onPress={() => setMode(o.key)}
            style={[styles.switcherOpt, {borderRadius: radii.full},
              active ? {backgroundColor: colors.surface} : {}]}
            activeOpacity={0.7}>
            <Text style={{fontSize: 13}}>{o.icon}</Text>
            <Text style={[typography.labelSm,
              {color: active ? colors.primary : colors.text.disabled, marginLeft: 4}]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────
export default function DashboardScreen({userId, onLogout}: Props) {
  const {theme} = useTheme();
  const {colors, typography, spacing, radii, shadows} = theme;
  const {user, isLoading, error, refetch} = useUserProfile(userId);

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.center, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.bodySm,
          {color: colors.text.secondary, marginTop: spacing.md}]}>
          Loading dashboard…
        </Text>
      </SafeAreaView>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error || !user) {
    return (
      <SafeAreaView style={[styles.center, {backgroundColor: colors.background}]}>
        <Text style={{fontSize: 40, marginBottom: spacing.md}}>😕</Text>
        <Text style={[typography.h3, {color: colors.text.primary}]}>
          Couldn't load profile
        </Text>
        <Text style={[typography.bodySm, {color: colors.text.secondary,
          textAlign: 'center', paddingHorizontal: spacing.xl,
          marginTop: spacing.xs, marginBottom: spacing.lg}]}>
          {error ?? 'Something went wrong'}
        </Text>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: colors.primary, borderRadius: radii.full}]}
          onPress={refetch}>
          <Text style={[typography.button, {color: colors.text.inverse}]}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop: spacing.md}} onPress={onLogout}>
          <Text style={[typography.bodySm, {color: colors.status.error}]}>Sign out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const p = user.props;
  const displayName = user.displayName;

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>

      {/* ── Top bar ── */}
      <View style={[styles.topBar, {backgroundColor: colors.surface,
        borderBottomColor: colors.border}, shadows.sm]}>
        <Text style={[typography.h3, {color: colors.text.primary}]}>Dashboard</Text>
        <TouchableOpacity
          onPress={onLogout}
          style={[styles.logoutBtn,
            {backgroundColor: colors.status.errorBg, borderRadius: radii.full}]}>
          <Text style={{fontSize: 14}}>🚪</Text>
          <Text style={[typography.labelSm,
            {color: colors.status.error, marginLeft: 4}]}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {/* ── Theme switcher bar ── */}
      <View style={[styles.themeBar, {backgroundColor: colors.surface,
        borderBottomColor: colors.border,
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm}]}>
        <Text style={[typography.caption, {color: colors.text.secondary, marginRight: spacing.sm}]}>
          Theme
        </Text>
        <ThemeSwitcher />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={[styles.hero, {backgroundColor: colors.surface,
          paddingHorizontal: spacing.lg, paddingVertical: spacing.xl,
          marginBottom: spacing.sm, borderBottomColor: colors.border}, shadows.sm]}>

          <View style={styles.heroTop}>
            <Avatar uri={p.profile_pic_url} name={displayName} size={80} />
            <View style={styles.statsRow}>
              <StatPill label="Posts"     value={p.post_count} />
              <View style={[styles.statDiv, {backgroundColor: colors.border}]} />
              <StatPill label="Followers" value={p.follower_count} />
              <View style={[styles.statDiv, {backgroundColor: colors.border}]} />
              <StatPill label="Following" value={p.following_count} />
            </View>
          </View>

          {/* Name + badges */}
          <View style={{marginTop: spacing.md}}>
            <View style={styles.nameRow}>
              <Text style={[typography.h2, {color: colors.text.primary}]}>
                {displayName}
              </Text>
              {p.is_verified && (
                <View style={[styles.badge,
                  {backgroundColor: colors.status.infoBg, borderRadius: radii.full}]}>
                  <Text style={[typography.labelSm, {color: colors.status.info}]}>
                    ✓ Verified
                  </Text>
                </View>
              )}
              {p.is_private && (
                <View style={[styles.badge,
                  {backgroundColor: colors.surfaceAlt, borderRadius: radii.full}]}>
                  <Text style={[typography.labelSm, {color: colors.text.secondary}]}>
                    🔒 Private
                  </Text>
                </View>
              )}
            </View>

            <Text style={[typography.bodySm, {color: colors.text.secondary}]}>
              @{p.username}
            </Text>

            {p.bio ? (
              <Text style={[typography.body,
                {color: colors.text.primary, marginTop: spacing.sm}]}>
                {p.bio}
              </Text>
            ) : null}

            <Text style={[typography.caption,
              {color: colors.text.disabled, marginTop: 4}]}>
              📧 {p.email_address}
            </Text>

            {p.phone_number ? (
              <Text style={[typography.caption, {color: colors.text.disabled, marginTop: 2}]}>
                📱 {p.phone_number}
              </Text>
            ) : null}
          </View>

          {/* Skills */}
          {p.skill?.length > 0 && (
            <View style={[styles.chipWrap, {marginTop: spacing.md}]}>
              {p.skill.map(s => <SkillTag key={s.id} skill={s} />)}
            </View>
          )}

          {/* Subscription */}
          {p.subscription_plan_name && (
            <View style={[{backgroundColor: colors.status.successBg,
              borderRadius: radii.md, paddingHorizontal: spacing.sm,
              paddingVertical: 6, marginTop: spacing.sm, alignSelf: 'flex-start'}]}>
              <Text style={[typography.labelSm, {color: colors.status.success}]}>
                ⭐ {p.subscription_plan_name}
              </Text>
            </View>
          )}
        </View>

        {/* ── Sections ── */}
        <View style={{paddingHorizontal: spacing.md}}>

          {/* Business */}
          {user.hasBusiness && p.business_name ? (
            <SectionCard title="Business">
              <Text style={[typography.h3, {color: colors.text.primary, marginBottom: 4}]}>
                {p.business_name}
              </Text>
              {p.business_description ? (
                <Text style={[typography.bodySm,
                  {color: colors.text.secondary, marginBottom: spacing.sm}]}>
                  {p.business_description}
                </Text>
              ) : null}
              {p.business_link ? (
                <Text style={[typography.bodySm, {color: colors.primary}]}>
                  🔗 {p.business_link}
                </Text>
              ) : null}
              {p.business_account_feature?.length > 0 && (
                <View style={[styles.chipWrap, {marginTop: spacing.md}]}>
                  {p.business_account_feature.map(f => (
                    <FeatureCard key={f.id} feature={f} />
                  ))}
                </View>
              )}
            </SectionCard>
          ) : null}

          {/* Posts */}
          {p.latest_posts?.length > 0 && (
            <SectionCard title={`Posts · ${p.post_count} total`}>
              {p.latest_posts.map((post, i) => (
                <PostRow key={post.id} post={post}
                  last={i === p.latest_posts.length - 1} />
              ))}
            </SectionCard>
          )}

          {/* Followers */}
          {p.latest_followers?.length > 0 && (
            <SectionCard title={`Followers · ${p.follower_count}`}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipWrap}>
                  {p.latest_followers.map(f => (
                    <FollowerChip key={f.id} item={f} />
                  ))}
                </View>
              </ScrollView>
            </SectionCard>
          )}

          {/* Following */}
          {p.latest_following?.length > 0 && (
            <SectionCard title={`Following · ${p.following_count}`}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipWrap}>
                  {p.latest_following.map(f => (
                    <FollowerChip key={f.id} item={f} />
                  ))}
                </View>
              </ScrollView>
            </SectionCard>
          )}

          {/* Account info */}
          <SectionCard title="Account">
            {[
              ['Role',         p.role_name],
              ['Member since', new Date(p.created_date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })],
            ].map(([label, value]) => (
              <View key={label} style={[styles.infoRow, {borderBottomColor: colors.divider}]}>
                <Text style={[typography.label,
                  {color: colors.text.secondary, width: 120}]}>
                  {label}
                </Text>
                <Text style={[typography.body, {color: colors.text.primary, flex: 1}]}>
                  {value}
                </Text>
              </View>
            ))}
          </SectionCard>
        </View>

        <View style={{height: 48}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         {flex: 1},
  center:       {flex: 1, alignItems: 'center', justifyContent: 'center'},
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1,
  },
  logoutBtn:    {flexDirection: 'row', alignItems: 'center',
                 paddingHorizontal: 12, paddingVertical: 7},
  themeBar:     {flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1},
  switcher:     {flexDirection: 'row', alignItems: 'center'},
  switcherOpt:  {flexDirection: 'row', alignItems: 'center',
                 paddingHorizontal: 10, paddingVertical: 7},
  hero:         {borderBottomWidth: 1},
  heroTop:      {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  statsRow:     {flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end'},
  statPill:     {alignItems: 'center', paddingHorizontal: 10},
  statDiv:      {width: 1, height: 28, marginHorizontal: 2},
  nameRow:      {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6},
  badge:        {paddingHorizontal: 8, paddingVertical: 3},
  chipWrap:     {flexDirection: 'row', flexWrap: 'wrap'},
  followerChip: {},
  featureCard:  {alignItems: 'center', minWidth: 76, borderWidth: 1},
  sectionCard:  {borderWidth: 1},
  postRow:      {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  infoRow:      {flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1},
  btn:          {paddingVertical: 12, paddingHorizontal: 32},
});