import dimensions from '@/lib/dimensions';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/colors';

interface CustomTabBarProps {
  activeTab?: 'school' | 'work' | 'dashboard' | 'skills' | 'resources';
}

export default function CustomTabBar({ activeTab = 'dashboard' }: CustomTabBarProps) {
  const tabs = [
    { key: 'school', icon: require('@/assets/images/school.svg'), route: '/(tabs)/School' },
    { key: 'work', icon: require('@/assets/images/tab-work.svg'), route: '/(tabs)/Work' },
    { key: 'dashboard', icon: require('@/assets/images/tab-dashboard.svg'), route: '/(tabs)/Dashboard' },
    { key: 'skills', icon: require('@/assets/images/tab-skills.svg'), route: '/(tabs)/My_Skills' },
    { key: 'resources', icon: require('@/assets/images/tab-resources.svg'), route: '/(tabs)/Resources' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabItem}
          onPress={() => router.push(tab.route as any)}
        >
          <Image
            source={tab.icon}
            style={[
              styles.tabIcon,
              { tintColor: activeTab === tab.key ? Colors.grey[900] : Colors.grey[500] }
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
    borderRadius: 60,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 6,
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -180, // Half of width (360/2)
    width: Math.min(360, dimensions.constrainedWidth - 40), // Max 360 or constrained width minus padding
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    // Ensure shadow doesn't overflow
    overflow: 'visible',
  },
  tabItem: {
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
    borderRadius: 26,
    flexDirection: 'row',
    height: 52,
    padding: 14,
    width: 52,
    justifyContent: 'center',
    marginHorizontal: 9,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});
