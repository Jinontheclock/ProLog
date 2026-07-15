import MaterialIcon from '@/components/shared/MaterialIcon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CompetencyCompletionProps {
  title?: string;
  showInfoIcon?: boolean;
  onInfoPress?: () => void;
  checkboxLabel: string;
  current: number;
  total: number;
  lastUpdated: string;
  progressImage: any;
}

export const CompetencyCompletion: React.FC<CompetencyCompletionProps> = ({
  title = 'Completion Details',
  showInfoIcon = true,
  onInfoPress,
  checkboxLabel,
  current,
  total,
  lastUpdated,
  progressImage,
}) => {
  const percentage = (current / total) * 100;
  const size = 88;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showInfoIcon && (
          <TouchableOpacity onPress={onInfoPress} accessibilityRole="button" accessibilityLabel="About completion details">
            <MaterialIcon
              name="info"
              size={20}
              color={Colors.grey[400]}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailsLeft}>
          <View style={styles.checkboxRow}>
            <MaterialIcon
              name="check_box"
              size={20}
              color={Colors.grey[400]}
            />
            <Text style={styles.detailsLabel} numberOfLines={1} ellipsizeMode="tail">{checkboxLabel}</Text>
          </View>
          
          <View style={styles.completionRow}>
            <Text style={styles.completionNumber}>{current}/{total}</Text>
            <Text style={styles.completionText}> complete</Text>
          </View>
          
          <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
        </View>
        
        <View style={styles.circularProgress}>
          <Svg width={size} height={size} style={styles.progressCircle}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.grey[100]}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.orange[400]}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          {/* Percentage text in center */}
          <View style={styles.progressText}>
            <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  sectionTitle: {
    ...Typography.sectionHeader,
    color: Colors.grey[700],
    marginBottom: 0,
    marginTop: 8,
    marginLeft: 4,
  },
  infoIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
  },
  detailsCard: {
    height: 134,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingRight: 10,
    marginBottom: 24,
    marginHorizontal: 20,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  detailsLeft: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  checkboxIcon: {
    width: 20,
    height: 20,
  },
  detailsLabel: {
    ...Typography.contentTitle,
    color: Colors.grey[300],
  },
  completionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  completionNumber: {
    ...Typography.contentBold,
    color: Colors.grey[900],
  },
  completionText: {
    ...Typography.contentSuffix,
    color: Colors.grey[900],
  },
  lastUpdated: {
    ...Typography.smBody,
    color: Colors.grey[300],
  },
  circularProgress: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
    position: 'relative',
  },
  progressCircle: {
    position: 'absolute',
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    ...Typography.sectionHeader,
    color: Colors.orange[400],
  },
  progressCircleImage: {
    width: 88,
    height: 88,
  },
});
