import { Button } from '@/components/shared/Buttons';
import MaterialIcon from '@/components/shared/MaterialIcon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HourItem {
  title: string;
  hours: string;
  unit: string;
  lastUpdated: string;
}

interface HourDiscrepancyProps {
  items: HourItem[];
  discrepancy: string;
  onReportError?: () => void;
  isLoading?: boolean;
}

export const HourDiscrepancy: React.FC<HourDiscrepancyProps> = ({
  items,
  discrepancy,
  onReportError,
  isLoading = false,
}) => {
  const isNegative = Number(discrepancy) < 0;
  const hasDiscrepancy = Number(discrepancy) !== 0;

  const SkeletonText = ({ width, height }: { width: number; height: number }) => (
    <View 
      style={[
        styles.skeletonText,
        { width, height }
      ]} 
    />
  );

  // Sort items: SkilledTradesBC first, Paystub second
  const sortedItems = [...items].sort((a, b) => {
    if (a.title === 'SkilledTradesBC') return -1;
    if (b.title === 'SkilledTradesBC') return 1;
    if (a.title === 'Paystub') return 1;
    if (b.title === 'Paystub') return -1;
    return 0;
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Left column with 2 cards */}
        <View style={styles.leftColumn}>
          {sortedItems.map((item, index) => (
            <React.Fragment key={index}>
              <View style={[styles.card, styles.shadow]}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.valueRow}>
                  <View style={styles.valueContainer}>
                    {isLoading ? (
                      <SkeletonText width={80} height={28} />
                    ) : (
                      <Text style={styles.value}>{item.hours}</Text>
                    )}
                  </View>
                  <Text style={styles.unit}> {item.unit}</Text>
                </View>
                <View style={styles.lastUpdatedContainer}>
                  {isLoading ? (
                    <SkeletonText width={120} height={16} />
                  ) : (
                    <Text style={styles.lastUpdated}>Last updated: {item.lastUpdated}</Text>
                  )}
                </View>
              </View>
              {index < sortedItems.length - 1 && <View style={styles.spacer} />}
            </React.Fragment>
          ))}
        </View>

        {/* Right discrepancy card - positioned absolutely to overlap */}
        <View style={[styles.discrepancyCard, styles.shadow]}>
          <View style={styles.discrepancyHeader}>
            <Text style={styles.discrepancyLabel}>Discrepancy</Text>
            {hasDiscrepancy && (
              <MaterialIcon
                name="warning_amber"
                size={18}
                color="#D92D20"
              />
            )}
          </View>
          
          <View style={styles.valueRow}>
            <View style={styles.valueContainer}>
              {isLoading ? (
                <SkeletonText width={60} height={28} />
              ) : (
                <Text style={[styles.value, isNegative && styles.negativeValue]}>{discrepancy}</Text>
              )}
            </View>
            <Text style={styles.unit}>hrs</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              text="Report Error"
              variant={hasDiscrepancy ? 'light' : 'grey200'}
              onPress={onReportError}
              disabled={!hasDiscrepancy || isLoading}
              fullWidth
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const RADIUS = 18;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 32,
    marginHorizontal: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  leftColumn: {
    width: '100%',
  },
  spacer: {
    height: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: RADIUS,
    padding: 18,
  },
  cardTitle: {
    ...Typography.contentTitle,
    color: Colors.grey[300],
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    ...Typography.contentBold,
    color: Colors.grey[900],
    lineHeight: 24,
  },
  unit: {
    ...Typography.contentSuffix,
    color: Colors.grey[900],
    marginLeft: 6,
    marginBottom: 4,
  },
  lastUpdated: {
    ...Typography.smBody,
    color: Colors.grey[500],
    marginTop: 8,
  },
  discrepancyCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: RADIUS,
    borderBottomLeftRadius: RADIUS,
    padding: 18,
    width: 180,
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -75,
    zIndex: 2,
    borderColor: Colors.backgroundGrey,
    borderWidth: 12,
    borderRightWidth: 0,
  },
  discrepancyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  warningIcon: {
    width: 18,
    height: 18,
    tintColor: '#D92D20',
  },
  discrepancyLabel: {
    ...Typography.contentTitle,
    color: Colors.grey[300],
    fontWeight: undefined,
    fontSize: undefined,
  },
  negativeValue: {
    color: '#111827',
  },
  buttonContainer: {
    marginTop: 12,
    width: '100%',
  },
  // shadow: {
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 6 },
  //       shadowOpacity: 0.12,
  //       shadowRadius: 12,
  //     },
  //     android: {
  //       elevation: 6,
  //     },
  //     default: {},
  //   }),
  // },
  valueContainer: {
    minHeight: 28,
    justifyContent: 'center',
  },
  lastUpdatedContainer: {
    minHeight: 16,
    justifyContent: 'center',
  },
  skeletonText: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    opacity: 0.6,
  },
});
