import MaterialIcon from '@/components/shared/MaterialIcon';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface LineItem {
  name: string;
  current: number;
  total: number;
  isCompleted: boolean;
}

interface CompletedLinesProps {
  title?: string;
  lines: LineItem[];
}

export const CompletedLines: React.FC<CompletedLinesProps> = ({
  title = 'Line Completion',
  lines,
}) => {
  // Default lines follow the harmonized Level 1 outline (E/F/K… sit in
  // other levels, which is why the letters skip around)
  const defaultLines: LineItem[] = [
    { name: 'Line A', current: 12, total: 22, isCompleted: false },
    { name: 'Line B', current: 4, total: 4, isCompleted: true },
    { name: 'Line C', current: 4, total: 4, isCompleted: true },
    { name: 'Line D', current: 2, total: 4, isCompleted: false },
    { name: 'Line G', current: 4, total: 4, isCompleted: true },
    { name: 'Line H', current: 2, total: 4, isCompleted: false },
    { name: 'Line I', current: 1, total: 4, isCompleted: false },
    { name: 'Line J', current: 0, total: 4, isCompleted: false },
    { name: 'Line L', current: 0, total: 4, isCompleted: false },
    { name: 'Line Q', current: 0, total: 4, isCompleted: false },
    { name: 'Line R', current: 0, total: 4, isCompleted: false },
    { name: 'Line V', current: 0, total: 4, isCompleted: false },
  ];
  const renderLines = lines && lines.length > 0 ? lines : defaultLines;

  // NOTE: To customize scrollbar thickness on web, use global CSS:
  // ::-webkit-scrollbar { height: 4px; }
  return (
    <View style={styles.lineCompletionCard}>
      <Text style={styles.lineCompletionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.scrollViewSpacing}
        contentContainerStyle={[styles.linesContainer, { paddingRight: 56 }]}
        snapToInterval={56}
        decelerationRate="fast"
      >
        {renderLines.map((line, index) => (
          <View key={index} style={styles.lineItemBox}>
            <View style={styles.lineItem}>
              <Text style={styles.lineName}>{line.name}</Text>
              <Text style={styles.lineProgress}>
                {line.current}/{line.total}
              </Text>
              <View style={line.isCompleted ? styles.lineButtonGray : styles.lineButtonOrange}>
                <MaterialIcon
                  name={line.isCompleted ? 'check' : 'more_horiz'}
                  size={24}
                  color="#FFFFFF"
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  lineCompletionCard: {
    // stretch to the shared 20px gutter so every card lines up
    alignSelf: 'stretch',
    height: 252,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 4,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollViewSpacing: {
    marginTop: 12,
  },
  lineCompletionTitle: {
    ...Typography.contentTitle,
    color: Colors.grey[300],
    marginBottom: 0,
  },
  linesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  lineItemBox: {
    width: 75,
    height: 160,
    backgroundColor: Colors.grey[50],
    borderRadius: 40,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  lineItem: {
    alignItems: 'center',
    gap: 12,
  },
  lineName: {
    ...Typography.contentSubtitle,
    color: Colors.grey[900], // content_subtitle grey 900
  },
  lineProgress: {
    ...Typography.sectionHeader,
    color: Colors.grey[900], // section_header grey 900
  },
  lineButtonOrange: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.orange[400], // 오렌지 400
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineButtonGray: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.grey[200], // 완료 원형 배경색 그레이 200
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineButtonIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
});
