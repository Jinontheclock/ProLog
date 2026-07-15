import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LineCarouselProps {
  lines?: string[];
  selectedLine?: string;
  onLineSelect?: (line: string) => void;
}

export const LineCarousel: React.FC<LineCarouselProps> = ({
  lines = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  selectedLine = 'A',
  onLineSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(lines.length - 2);
  const scrollViewRef = useRef<ScrollView>(null);
  // a horizontal swipe over the circles steps the carousel like the arrows
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 35;

  const itemsPerPage = 5;
  
  // Get visible lines with infinite loop logic
  const getVisibleLines = () => {
    const visibleLines = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % lines.length;
      visibleLines.push(lines[index]);
    }
    return visibleLines;
  };
  
  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? lines.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    // The selected line is always at position 2 (middle) of visible lines
    const selectedLineIndex = (newIndex + 2) % lines.length;
    onLineSelect?.(lines[selectedLineIndex]);
  };
  
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % lines.length;
    setCurrentIndex(newIndex);
    // The selected line is always at position 2 (middle) of visible lines
    const selectedLineIndex = (newIndex + 2) % lines.length;
    onLineSelect?.(lines[selectedLineIndex]);
  };

  const visibleLines = getVisibleLines();

  const swipeStart = (e: any) => {
    touchStartX.current =
      e.nativeEvent.pageX ?? e.nativeEvent.changedTouches?.[0]?.pageX ?? null;
  };
  const swipeEnd = (e: any) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end =
      e.nativeEvent.pageX ?? e.nativeEvent.changedTouches?.[0]?.pageX;
    if (end == null) return;
    const dx = end - start;
    if (dx <= -SWIPE_THRESHOLD) handleNext();
    else if (dx >= SWIPE_THRESHOLD) handlePrev();
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.lineRow}
        onTouchStart={swipeStart}
        onTouchEnd={swipeEnd}
      >
        {visibleLines.map((line, index) => {
          const isSelected = index === 2; // Middle item is always selected
          return (
            <TouchableOpacity
              key={`${line}-${index}-${currentIndex}`}
              style={[
                styles.lineCircle,
                isSelected ? styles.selectedCircle : styles.normalCircle,
              ]}
              onPress={() => {
                if (index < 2) {
                  // Navigate backward by the difference
                  const steps = 2 - index;
                  let newIndex = currentIndex;
                  for (let i = 0; i < steps; i++) {
                    newIndex = newIndex === 0 ? lines.length - 1 : newIndex - 1;
                  }
                  setCurrentIndex(newIndex);
                  const selectedLineIndex = (newIndex + 2) % lines.length;
                  onLineSelect?.(lines[selectedLineIndex]);
                } else if (index > 2) {
                  // Navigate forward by the difference
                  const steps = index - 2;
                  let newIndex = currentIndex;
                  for (let i = 0; i < steps; i++) {
                    newIndex = (newIndex + 1) % lines.length;
                  }
                  setCurrentIndex(newIndex);
                  const selectedLineIndex = (newIndex + 2) % lines.length;
                  onLineSelect?.(lines[selectedLineIndex]);
                } else {
                  // Middle item clicked - already selected
                  onLineSelect?.(line);
                }
              }}
            >
              <Text
                style={[
                  isSelected ? styles.selectedText : styles.lineText,
                ]}
              >
                {line}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <View style={styles.arrowRow}>
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={handlePrev}
          accessibilityRole="button"
          accessibilityLabel="Previous line"
        >
          <MaterialCommunityIcons 
            name="chevron-left" 
            size={20} 
            color={Colors.grey[500]} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel="Next line"
        >
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={20} 
            color={Colors.grey[500]} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: 'center',
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 80,
  },
  lineCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.grey[400],
  },
  selectedCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.orange[400],
  },
  lineText: {
    ...Typography.contentRegular,
    color: Colors.white,
  },
  selectedText: {
    ...Typography.title,
    color: Colors.white,
  },
  arrowRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 100,
  },
  arrowButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LineCarousel;
