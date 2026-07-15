import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { useExternalLink } from '@/lib/external-link';
import { MaterialIcon } from './MaterialIcon';

interface SupportItem {
  title: string;
  description: string;
  url?: string;
  site?: string;
}

interface FinancialSupportProps {
  supportItems: SupportItem[];
}

export const FinancialSupport: React.FC<FinancialSupportProps> = ({ supportItems }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const openExternal = useExternalLink();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidth = 346; // card width + gap
    const index = Math.round(scrollPosition / cardWidth);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Support</Text>
      {/* <Text style={styles.subtitle}>
        List of financial support available for skilled trades apprenticeships.
      </Text> */}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={346}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="never"
        overScrollMode="never"
      >
        {supportItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            disabled={!item.url}
            onPress={() =>
              item.url && openExternal(item.url, item.site ?? item.title.replace("\n", " "))
            }
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.site ?? item.title.replace("\n", " ")} in a new window`}
          >
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.iconCircle}>
                  <MaterialIcon name="chevron_right" size={20} color={Colors.grey[900]} />
                </View>
              </View>
              <Text style={styles.cardDescription}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {supportItems.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? Colors.grey[900] : Colors.grey[200] }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 24,
    marginHorizontal: 20,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 20,
    lineHeight: 24,
    color: Colors.grey[700],
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Roboto-Light',
    fontSize: 12,
    lineHeight: 16,
    color: Colors.black,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    gap: 16,
    overflow: 'visible'
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 20,
    // height: 118,
    width: 338,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    lineHeight: 24,
    color: Colors.grey[900],
    flex: 1,
  },
  cardDescription: {
    fontFamily: 'Roboto-Light',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.grey[300],
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.grey[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
