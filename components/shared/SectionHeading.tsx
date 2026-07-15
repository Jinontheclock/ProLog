import MaterialIcon from '@/components/shared/MaterialIcon';
import { UpdatePulse } from '@/components/shared/UpdatePulse';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SectionHeadingProps {
  level: string;
  icon_action?: keyof typeof import('./MaterialIcon').ICON_NAMES;
  title: string;
  currentHours: number;
  totalHours: number;
  percentage: number;
  onIconPress?: () => void;
  isLoading?: boolean;
  hrsText?: string;
  hoursIcon?: keyof typeof import('./MaterialIcon').ICON_NAMES;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  level,
  icon_action,
  title,
  currentHours,
  totalHours,
  percentage,
  onIconPress,
  isLoading = false,
  hrsText = "hrs",
  hoursIcon = "schedule",
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const skeletonOpacity = useRef(new Animated.Value(1)).current;
  const spinAnimation = useRef(new Animated.Value(0)).current;
  const isZero = currentHours === 0;

  useEffect(() => {
    if (isLoading) {
      // Start skeleton pulsing animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(skeletonOpacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(skeletonOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      );
      pulseAnimation.start();

      // Start refresh icon spin animation
      const spinLoopAnimation = Animated.loop(
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinLoopAnimation.start();

      return () => {
        pulseAnimation.stop();
        spinLoopAnimation.stop();
      };
    } else {
      // Animate progress bar to new percentage
      Animated.timing(progressAnimation, {
        toValue: percentage,
        duration: 1500,
        useNativeDriver: false,
      }).start();
      
      // Reset skeleton opacity and stop spin
      skeletonOpacity.setValue(1);
      spinAnimation.setValue(0);
    }
  }, [isLoading, percentage]);

  // Initialize progress animation on mount
  useEffect(() => {
    progressAnimation.setValue(percentage);
  }, []);

  const SkeletonText = ({ width, height }: { width: number; height: number }) => (
    <Animated.View 
      style={[
        styles.skeletonText,
        { width, height, opacity: skeletonOpacity }
      ]} 
    />
  );
  const isCompleted = currentHours > 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.level}>{level}</Text>
        {icon_action && (
          <View style={styles.updateButtonWrap}>
          {onIconPress && <UpdatePulse size={48} />}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={onIconPress}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Sync data"
          >
            <Animated.View
              style={{
                transform: [{
                  rotate: spinAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
              }}
            >
              <MaterialIcon
                name={icon_action}
                size={24}
                color={isLoading ? Colors.grey[400] : Colors.black}
              />
            </Animated.View>
          </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.hoursContainer}>
        <MaterialIcon
          name={hoursIcon}
          size={20}
          color={Colors.grey[500]}
        />
        <View style={{ width: 8 }} />
        <View style={styles.hoursTextContainer}>
          {isLoading ? (
            <SkeletonText width={140} height={29} />
          ) : (
            <Text style={[
              styles.hoursText,
              isCompleted && { color: Colors.grey[900] }
            ]}>
              {currentHours.toLocaleString()} / {totalHours.toLocaleString()} 
            </Text>
          )}
        </View>
        <View style={{ width: 8 }} />
        <Text style={[
          styles.hrsText,
          isZero && { color: Colors.grey[300] }
        ]}>{hrsText}</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View 
            style={[
              styles.progressBarFill, 
              { 
                width: isLoading 
                  ? progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp'
                    })
                  : progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp'
                    })
              }
            ]} 
          />
        </View>
        <View style={styles.percentageContainer}>
          {isLoading ? (
            <SkeletonText width={40} height={19} />
          ) : (
            <Text style={styles.percentageText}>{percentage}%</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    // 56 reserves the phone status-bar area on native; the web demo has no
    // status bar, so that space reads as an oversized top margin — trim it.
    paddingTop: Platform.OS === 'web' ? 24 : 56,
    paddingBottom: 20,
    paddingHorizontal: 40,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 185, // Fixed container height to prevent jumping
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    // keep the update button above the title/progress siblings that paint
    // later — without this the icon isn't hit-testable on web
    zIndex: 10,
  },
  level: {
    ...Typography.contentSubtitle,
    color: Colors.black,
  },
  updateButtonWrap: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    ...Typography.title,
    color: Colors.black,
    marginBottom: 16,
    marginTop: -4,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  hoursText: {
    ...Typography.contentRegular,
    color: Colors.grey[300],
  },
  hrsText: {
    ...Typography.contentSuffix,
    color: Colors.grey[300],
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.grey[100],
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: Colors.orange[400],
    borderRadius: 8,
    marginLeft: 2,
  },
  percentageText: {
    ...Typography.contentSubtitle,
    color: Colors.black,
    minWidth: 40,
    textAlign: 'right',
  },
  hoursTextContainer: {
    minHeight: 29, // contentRegular lineHeight: 28 * 1.05 = ~29.4px
    justifyContent: 'center',
  },
  percentageContainer: {
    minHeight: 19, // contentSubtitle lineHeight: 18 * 1.05 = ~18.9px
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  skeletonText: {
    backgroundColor: Colors.grey[200],
    borderRadius: 4,
  },
});
