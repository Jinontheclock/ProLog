import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { IconButton } from './IconButton';
import { MaterialIcon } from './MaterialIcon';

interface SlotRow {
  startDate: string;
  startYear: string;
  endDate: string;
  endYear: string;
  slot: string;
}

interface Campus {
  name: string;
  location: string;
  slots: SlotRow[];
  onPress?: () => void;
}

interface SchoolSlotsProps {
  campuses: Campus[];
}

export const SchoolSlots: React.FC<SchoolSlotsProps> = ({ campuses }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.carouselContainer}
      contentContainerStyle={styles.carouselContent}
    >
      {campuses.map((campus, index) => (
        <View key={index} style={styles.campusCard}>
          <View style={styles.campusHeader}>
            <View>
              <Text style={styles.campusName}>{campus.name}</Text>
              <Text style={styles.campusLocation}>{campus.location}</Text>
            </View>
            <IconButton
              iconComponent={
                <View style={{ transform: [{ rotate: '-45deg' }] }}>
                  <MaterialIcon name="arrow_outward" size={24} color="#fff" />
                </View>
              }
              variant="primary"
              size={40}
              onPress={campus.onPress}
              accessibilityLabel={`View ${campus.name} details`}
            />
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Start</Text>
            <Text style={styles.tableHeaderText}>End</Text>
            <Text style={styles.tableHeaderText}>Slot</Text>
          </View>

          {campus.slots.map((slot, slotIndex) => (
            <View key={slotIndex} style={styles.tableRow}>
              <View style={styles.dateGroup}>
                <View style={styles.dateCell}>
                  <Text style={styles.dateCellText}>{slot.startDate}</Text>
                  <Text style={styles.dateCellText}>{slot.startYear}</Text>
                </View>
                <View style={styles.dateConnector}>
                  <View style={styles.lineImage} />
                </View>
                <View style={styles.dateCell}>
                  <Text style={styles.dateCellText}>{slot.endDate}</Text>
                  <Text style={styles.dateCellText}>{slot.endYear}</Text>
                </View>
              </View>
              <View style={styles.slotCell}>
                <Text style={styles.slotCellText}>{slot.slot}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 20,
    marginLeft: 0,
  },
  carouselContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  campusCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    width: 291,
    height: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  campusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  campusName: {
    ...Typography.contentMedium,
    color: Colors.grey[700], // content_medium grey 700
    marginBottom: 0,
  },
  campusLocation: {
    ...Typography.contentSubtitle,
    color: Colors.grey[600], // content_subtitle grey 600
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  tableHeaderText: {
    ...Typography.contentTitle,
    color: Colors.grey[300], // content_title grey 300
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateGroup: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    height: 52,
  },
  dateCell: {
    flex: 2,
  },
  dateCellText: {
    ...Typography.buttonText,
    color: Colors.grey[700], // button_text grey 700
    textAlign: 'center',
  },
  dateConnector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineImage: {
    width: 24,
    height: 2,
    backgroundColor: '#D5D5D5',
  },
  slotCell: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    height: 52,
  },
  slotCellText: {
    ...Typography.buttonText,
    color: Colors.grey[700], // button_text grey 700
    textAlign: 'center',
  },
});
