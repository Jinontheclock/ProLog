import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SmallDataCardProps {
  icon?: any;
  iconComponent?: ReactNode;
  label: string;
  value: string;
  unit: string;
  lastUpdated: string;
}

export const SmallDataCard: React.FC<SmallDataCardProps> = ({
  iconComponent,
  label,
  value,
  unit,
  lastUpdated,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Previous Score</Text>
      <View style={styles.labelValueSpacer} />
      <View style={styles.valueRow}>
        <Text style={styles.value}>26/40</Text>
      </View>
      <Text style={styles.lastUpdated}>Aug 7, 2026</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: 171,
    height: 112,
    justifyContent: 'flex-start',
  },
  label: {
    ...Typography.contentTitle,
    color: Colors.grey[300],
    textAlign: 'left',
  },
  labelValueSpacer: {
    height: 16,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    ...Typography.contentBold,
    color: Colors.grey[900],
    textAlign: 'left',
  },
  lastUpdated: {
    ...Typography.smBody,
    color: Colors.grey[500],
    textAlign: 'left',
  },
});
