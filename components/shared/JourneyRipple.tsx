import { Colors } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

// A soft looping ripple behind the in-progress journey icon: two rings grow
// out of the icon and fade, echoing the static halo already baked into the
// artwork. Purely decorative — hidden from the accessibility tree.
const RING_DURATION = 2400;

const Ring: React.FC<{ delay: number }> = ({ delay }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animated.loop stalls after one cycle on react-native-web, so the loop
    // restarts itself from the completion callback instead
    let alive = true;
    const run = () => {
      if (!alive) return;
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: RING_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) run();
      });
    };
    const timer = setTimeout(run, delay);
    return () => {
      alive = false;
      clearTimeout(timer);
      progress.stopAnimation();
    };
  }, [delay, progress]);

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          opacity: progress.interpolate({
            inputRange: [0, 0.15, 1],
            outputRange: [0, 0.28, 0],
          }),
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.55, 1.5],
              }),
            },
          ],
        },
      ]}
    />
  );
};

export const JourneyRipple: React.FC = () => (
  <View
    style={StyleSheet.absoluteFill}
    pointerEvents="none"
    accessible={false}
    importantForAccessibility="no-hide-descendants"
  >
    <Ring delay={0} />
    <Ring delay={RING_DURATION / 2} />
  </View>
);

const styles = StyleSheet.create({
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    backgroundColor: Colors.orange[300],
  },
});

export default JourneyRipple;
