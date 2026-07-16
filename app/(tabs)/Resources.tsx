import { CommonStyles } from '@/lib/common-styles';
import { useExternalLink } from '@/lib/external-link';
import { displayName } from '@/lib/user-store';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/shared/Buttons';
import MaterialIcon from '@/components/shared/MaterialIcon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

/* A single settings row: icon + label on the left, a switch or a value with
   a chevron on the right. Rows stack inside white group cards. */
function SettingRow({
  icon,
  label,
  value,
  switchValue,
  onSwitchChange,
  onPress,
  isLast,
}: {
  icon: any;
  label: string;
  value?: string;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  onPress?: () => void;
  isLast?: boolean;
}) {
  const content = (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={styles.rowIcon}>
        <MaterialIcon name={icon} size={20} color={Colors.grey[700]} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {switchValue !== undefined ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: Colors.grey[200], true: Colors.orange[400] }}
          thumbColor={Colors.white}
          // react-native-web styles the checked thumb separately
          {...({ activeThumbColor: Colors.white } as any)}
        />
      ) : (
        <View style={styles.rowRight}>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          <MaterialIcon name="chevron_right" size={20} color={Colors.grey[300]} />
        </View>
      )}
    </View>
  );
  if (switchValue !== undefined) return content;
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const openExternal = useExternalLink();

  // demo state: the switches work locally; navigation rows are inert
  const [notifications, setNotifications] = React.useState(true);
  const [reminders, setReminders] = React.useState(true);
  const [tts, setTts] = React.useState(true);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  return (
    <SafeAreaView style={CommonStyles.container}>
      <Image
        source={require('@/assets/images/background-grid 1.svg')}
        style={[CommonStyles.backgroundImage, { opacity: 0.12 }]}
        resizeMode="cover"
      />
      <ScrollView
        style={CommonStyles.scrollView}
        contentContainerStyle={{ paddingBottom: 70 + insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Bar Spacer */}
        <View style={{ height: 47 }} />

        <View style={CommonStyles.headerSimple}>
          <Text style={CommonStyles.mainTitle}>Settings</Text>
        </View>

        <View style={styles.content}>
          {/* Profile */}
          <TouchableOpacity style={styles.profileCard} activeOpacity={0.6}>
            <View style={styles.avatar}>
              <MaterialIcon name="person" size={26} color={Colors.orange[400]} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{displayName()}</Text>
              <Text style={styles.profileSub}>Electrical Apprentice · Level 2</Text>
            </View>
            <MaterialIcon name="edit" size={18} color={Colors.grey[300]} />
          </TouchableOpacity>

          {/* Preferences */}
          <Text style={styles.groupLabel}>Preferences</Text>
          <View style={styles.groupCard}>
            <SettingRow
              icon="icon-notifications"
              label="Notifications"
              switchValue={notifications}
              onSwitchChange={setNotifications}
            />
            <SettingRow
              icon="icon-bell"
              label="Reminder alerts"
              switchValue={reminders}
              onSwitchChange={setReminders}
            />
            <SettingRow icon="icon-brightness" label="Appearance" value="Light" />
            <SettingRow icon="language" label="Language" value="English" isLast />
          </View>

          {/* Accessibility */}
          <Text style={styles.groupLabel}>Accessibility</Text>
          <View style={styles.groupCard}>
            <SettingRow
              icon="record_voice_over"
              label="Text-to-speech"
              switchValue={tts}
              onSwitchChange={setTts}
            />
            <SettingRow
              icon="animation"
              label="Reduce motion"
              switchValue={reduceMotion}
              onSwitchChange={setReduceMotion}
            />
            <SettingRow icon="format_size" label="Text size" value="Default" isLast />
          </View>

          {/* Support */}
          <Text style={styles.groupLabel}>Support</Text>
          <View style={styles.groupCard}>
            <SettingRow
              icon="help_outline"
              label="Help & FAQ"
              onPress={() =>
                openExternal("https://portal.skilledtradesbc.ca/faq/", "the SkilledTradesBC FAQ")
              }
            />
            <SettingRow
              icon="mail_outline"
              label="Contact support"
              onPress={() =>
                openExternal("https://skilledtradesbc.ca/contact-us", "SkilledTradesBC Contact Us")
              }
            />
            <SettingRow
              icon="privacy_tip"
              label="Privacy policy"
              isLast
              onPress={() =>
                openExternal("https://www2.gov.bc.ca/gov/content/home/privacy", "the B.C. government privacy page")
              }
            />
          </View>

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <Button
              text="Logout"
              variant="dark"
              fullWidth={true}
              onPress={() => router.push('/login')}
            />
          </View>

          <Text style={styles.version}>ProLog · Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.grey[100],
    padding: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.orange[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 18,
    lineHeight: 22,
    color: Colors.grey[900],
  },
  profileSub: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  groupLabel: {
    ...Typography.contentTitle,
    color: Colors.grey[400],
    marginBottom: 8,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.grey[100],
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  rowIcon: {
    width: 24,
    alignItems: 'center',
  },
  rowLabel: {
    ...Typography.bigBody,
    color: Colors.grey[900],
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    ...Typography.smBody,
    color: Colors.grey[400],
  },
  logoutContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  version: {
    ...Typography.smBody,
    color: Colors.grey[300],
    textAlign: 'center',
  },
});
