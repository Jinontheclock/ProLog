import { Colors } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

interface UpdatePulseProps {
  size: number;
  pulses?: number;
}

// A soft orange halo behind an update button that breathes a few times after
// the screen appears, nudging the user toward the demo's sync action without
// shouting. It fades out for good once the pulses finish.
export const UpdatePulse: React.FC<UpdatePulseProps> = ({
  size,
  pulses = 3,
}) => {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.delay(1200),
      ...Array.from({ length: pulses }).flatMap(() => [
        Animated.timing(glow, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 750,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(220),
      ]),
    ]);
    sequence.start();
    return () => sequence.stop();
  }, [glow, pulses]);

  return (
    <Animated.View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.halo,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: glow.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.75],
          }),
          transform: [
            {
              scale: glow.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.06],
              }),
            },
          ],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  halo: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.orange[300],
    shadowColor: Colors.orange[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default UpdatePulse;
