import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Animated,
  DimensionValue,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import JourneyProgressIndicator from "./JourneyProgressIndicator";
import { JourneyRipple } from "./JourneyRipple";

// The in-progress marker carries a looping ripple glow
const isInProgressIcon = (imagePath: any) =>
  typeof imagePath === "string" && imagePath.includes("inprogress");

interface SProgressBarProps {
  percentage: number;
  height?: number;
  level1Image?: any;
  level1Subtext?: string;
  level1ContainerStyle?: any;
  level1ImageStyle?: any;
  level2Image?: any;
  level2Subtext?: string;
  level2ContainerStyle?: any;
  level2ImageStyle?: any;
  level3Image?: any;
  level3Subtext?: string;
  level3ContainerStyle?: any;
  level3ImageStyle?: any;
  level4Image?: any;
  level4Subtext?: string;
  level4ContainerStyle?: any;
  level4ImageStyle?: any;
  containerMargin?: DimensionValue;
  sProgressContainerMargin?: DimensionValue;
  level3AnimationTrigger?: boolean;
  isLoading?: boolean;
  onLevel3Press?: () => void;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Serpentine geometry: five horizontal runs joined by four semicircle turns,
// drawn bottom-up as one continuous path so the fill can sweep it in a single
// stroke-dashoffset animation instead of section-by-section jumps.
const TRACK_WIDTH = 12;
const FILL_WIDTH = TRACK_WIDTH * 0.6;
const TURN_RADIUS = 66; // centerline radius of each semicircle turn
const ROW_GAP = TURN_RADIUS * 2; // vertical distance between run centerlines
const SVG_HEIGHT = 548; // 4 turns + bottom slack, matches the old stacked layout
const Y_BOTTOM = SVG_HEIGHT - 20; // bottom run centerline (old bar: bottom 14 + h/2)
const WINDOW_HEIGHT = 380; // the visible slice of the journey on the dashboard

const buildJourneyPath = (width: number) => {
  const xLeft = 72;
  const xRight = width - 72;
  const xStart = 20;
  const xEnd = Math.min(55 + width * 0.8, width - 4);
  const rows = [0, 1, 2, 3, 4].map((i) => Y_BOTTOM - ROW_GAP * i);
  const r = TURN_RADIUS;

  const d = [
    `M ${xStart} ${rows[0]}`,
    `L ${xRight} ${rows[0]}`,
    `A ${r} ${r} 0 0 0 ${xRight} ${rows[1]}`,
    `L ${xLeft} ${rows[1]}`,
    `A ${r} ${r} 0 0 1 ${xLeft} ${rows[2]}`,
    `L ${xRight} ${rows[2]}`,
    `A ${r} ${r} 0 0 0 ${xRight} ${rows[3]}`,
    `L ${xLeft} ${rows[3]}`,
    `A ${r} ${r} 0 0 1 ${xLeft} ${rows[4]}`,
    `L ${xEnd} ${rows[4]}`,
  ].join(" ");

  const arc = Math.PI * r;
  const length =
    (xRight - xStart) + // bottom run
    3 * (xRight - xLeft) + // three middle runs
    (xEnd - xLeft) + // top run
    4 * arc;

  return { d, length };
};

export const SProgressBar: React.FC<SProgressBarProps> = ({
  percentage,
  height = 40,
  level1Image,
  level1Subtext = "completed",
  level1ContainerStyle,
  level1ImageStyle,
  level2Image,
  level2Subtext = "In-Progress",
  level2ContainerStyle,
  level2ImageStyle,
  level3Image,
  level3Subtext = "Locked",
  level3ContainerStyle,
  level3ImageStyle,
  level4Image,
  level4Subtext = "Locked",
  level4ContainerStyle,
  level4ImageStyle,
  containerMargin = 0,
  sProgressContainerMargin,
  level3AnimationTrigger = false,
  isLoading = false,
  onLevel3Press,
}) => {
  const [trackWidth, setTrackWidth] = React.useState(0);

  // One value drives the whole sweep: 0 → percentage/100 of the path length
  const fillAnimation = React.useRef(new Animated.Value(0)).current;

  // The journey is a real scroll view now (drag up to peek at Level 4);
  // the demo state still steers which slice is framed by default
  const scrollRef = React.useRef<ScrollView>(null);
  const scrollPlaced = React.useRef(false);
  const targetScrollY = React.useMemo(() => {
    const margin =
      typeof sProgressContainerMargin === "number" ? sProgressContainerMargin : 0;
    return Math.max(0, Math.min(SVG_HEIGHT - WINDOW_HEIGHT, -margin));
  }, [sProgressContainerMargin]);

  // Function to resolve image sources from string paths
  const getImageSource = (imagePath: string) => {
    switch (imagePath) {
      case "@/assets/images/locked_journeyIcon.png":
        return require("@/assets/images/locked_journeyIcon.png");
      case "@/assets/images/unlocked_journeyIcon.png":
        return require("@/assets/images/unlocked_journeyIcon.png");
      case "@/assets/images/inprogress_journeyIcon.png":
        return require("@/assets/images/inprogress_journeyIcon.png");
      case "@/assets/images/completed_journeyIcon.png":
        return require("@/assets/images/completed_journeyIcon.png");
      default:
        return require("@/assets/images/inprogress_journeyIcon.png");
    }
  };

  // Function to parse style objects from JSON (if they're strings) or use them directly
  const parseStyleProp = (styleProp: any) => {
    if (typeof styleProp === "string") {
      try {
        return JSON.parse(styleProp);
      } catch {
        return {};
      }
    }
    return styleProp || {};
  };

  // Level 3 pulsing animation
  const level3ScaleAnimation = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (level3AnimationTrigger) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(level3ScaleAnimation, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(level3ScaleAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
        level3ScaleAnimation.setValue(1);
      };
    } else {
      level3ScaleAnimation.setValue(1);
    }
  }, [level3AnimationTrigger, level3ScaleAnimation]);

  // Sweep the fill along the path whenever the target percentage lands.
  // While loading, hold at zero — the sweep starts once the overlay clears.
  React.useEffect(() => {
    fillAnimation.setValue(0);
    if (isLoading || trackWidth === 0) return;

    const fraction = Math.max(0, Math.min(100, percentage)) / 100;
    const sweep = Animated.sequence([
      Animated.delay(500), // let the LoadingQuiz overlay finish fading
      Animated.timing(fillAnimation, {
        toValue: fraction,
        // distance-proportional so the tip moves at a steady pace
        duration: 600 + 1600 * fraction,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
    ]);
    sweep.start();

    return () => sweep.stop();
  }, [percentage, isLoading, trackWidth, fillAnimation]);

  // Re-frame the window when the demo state shifts it (smooth scroll); the
  // very first placement happens instantly in onContentSizeChange
  React.useEffect(() => {
    if (isLoading || !scrollPlaced.current) return;
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: targetScrollY, animated: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [targetScrollY, isLoading]);

  const { d, length } = React.useMemo(
    () => (trackWidth > 0 ? buildJourneyPath(trackWidth) : { d: "", length: 1 }),
    [trackWidth]
  );

  const dashOffset = fillAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [length, 0],
  });

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.journeyWindow}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        onContentSizeChange={() => {
          if (scrollPlaced.current) return;
          scrollRef.current?.scrollTo({ y: targetScrollY, animated: false });
          scrollPlaced.current = true;
        }}
        // the global overscroll kill-switch exempts this scroller so a swipe
        // that runs out of journey keeps moving the page (see app/_layout)
        {...({ dataSet: { allowoverscroll: "true" } } as any)}
      >
      <View
        style={[styles.sProgressContainer, { margin: containerMargin }]}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        {trackWidth > 0 && (
          <Svg
            width={trackWidth}
            height={SVG_HEIGHT}
            style={styles.journeySvg}
            pointerEvents="none"
          >
            <Path
              d={d}
              stroke={Colors.white}
              strokeWidth={TRACK_WIDTH}
              strokeLinecap="round"
              fill="none"
            />
            <AnimatedPath
              d={d}
              stroke={Colors.orange[400]}
              strokeWidth={FILL_WIDTH}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${length} ${length}`}
              strokeDashoffset={dashOffset as any}
              // react-native-svg's web setNativeProps only applies values that
              // arrive inside `style`, so the animated offset rides there too
              style={{ strokeDashoffset: dashOffset } as any}
            />
          </Svg>
        )}
        <JourneyProgressIndicator
          image={
            level1Image
              ? getImageSource(level1Image)
              : require("@/assets/images/completed_journeyIcon.png")
          }
          title="Level 1"
          subtext={level1Subtext}
          pulse={isInProgressIcon(level1Image)}
          containerStyle={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            alignContent: "flex-start",
            position: "absolute",
            bottom: 64,
            left: 40,
            zIndex: 5,
            height: 42,
            ...parseStyleProp(level1ContainerStyle),
          }}
          imageStyle={{
            marginTop: 0,
            ...parseStyleProp(level1ImageStyle),
          }}
        />
        <JourneyProgressIndicator
          image={
            level2Image
              ? getImageSource(level2Image)
              : require("@/assets/images/inprogress_journeyIcon.png")
          }
          title="Level 2"
          subtext={level2Subtext}
          pulse={isInProgressIcon(level2Image)}
          containerStyle={{
            display: "flex",
            flexDirection: "row-reverse",
            gap: 16,
            alignContent: "flex-start",
            position: "absolute",
            bottom: 196,
            right: 40,
            zIndex: 5,
            height: 42,
            ...parseStyleProp(level2ContainerStyle),
          }}
          imageStyle={{
            ...parseStyleProp(level2ImageStyle),
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            alignContent: "flex-start",
            position: "absolute",
            bottom: 328,
            left: 40,
            zIndex: 5,
            height: 42,
            ...parseStyleProp(level3ContainerStyle),
          }}
        >
          <TouchableOpacity
            onPress={onLevel3Press}
            disabled={!onLevel3Press}
            activeOpacity={onLevel3Press ? 0.7 : 1}
          >
            {(() => {
              const { marginTop = 0, marginBottom, marginLeft, marginRight, ...level3Inner } =
                parseStyleProp(level3ImageStyle);
              return (
                <View style={{ marginTop, marginBottom, marginLeft, marginRight }}>
                  {isInProgressIcon(level3Image) && <JourneyRipple />}
                  <Animated.Image
                    source={
                      level3Image
                        ? getImageSource(level3Image)
                        : require("@/assets/images/locked_journeyIcon.png")
                    }
                    style={[
                      level3Inner,
                      {
                        transform: [{ scale: level3ScaleAnimation }],
                      },
                    ]}
                  />
                </View>
              );
            })()}
          </TouchableOpacity>
          <View style={styles.level3TextContainer}>
            <Text style={styles.level3Title}>Level 3</Text>
            <Text style={styles.level3Subtext}>{level3Subtext}</Text>
          </View>
        </View>
        <JourneyProgressIndicator
          image={
            level4Image
              ? getImageSource(level4Image)
              : require("@/assets/images/locked_journeyIcon.png")
          }
          title="Level 4"
          subtext={level4Subtext}
          pulse={isInProgressIcon(level4Image)}
          containerStyle={{
            display: "flex",
            flexDirection: "row-reverse",
            gap: 16,
            alignContent: "flex-start",
            position: "absolute",
            bottom: 420,
            right: 40,
            zIndex: 5,
            height: 42,
            ...parseStyleProp(level4ContainerStyle),
          }}
          imageStyle={{
            marginTop: 0,
            ...parseStyleProp(level4ImageStyle),
          }}
        />
      </View>
      </ScrollView>

      {/* Edge gradients float over the scroll window */}
      <LinearGradient
        colors={[Colors.backgroundGrey, "transparent"]}
        style={styles.topGradient}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", Colors.backgroundGrey]}
        style={styles.bottomGradientContainer}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    alignSelf: "center",
    height: WINDOW_HEIGHT,
    overflow: "hidden",
  },
  journeyWindow: {
    height: WINDOW_HEIGHT,
  },
  sProgressContainer: {
    width: "100%",
    height: SVG_HEIGHT,
  },
  journeySvg: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  topGradient: {
    position: "absolute",
    top: -10,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
  },
  bottomGradientContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    zIndex: 10,
  },
  level3TextContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  level3Title: {
    ...Typography.contentSubtitle,
  },
  level3Subtext: {
    ...Typography.contentTitle,
  },
});
