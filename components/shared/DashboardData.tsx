import { Colors } from "@/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

type ProgressCardProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  suffix?: string;
  completionIndicator?: any;
  containerBackground?: string;
};

interface DashboardDataProps {
  hoursData?: any;
  skillsData?: any;
  schoolData?: any;
  examData?: any;
  isLoading?: boolean;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  icon,
  label,
  value,
  suffix,
  completionIndicator,
  containerBackground,
}) => {
  // Skeleton loading component
  const SkeletonText = ({ width, height }: { width: number; height: number }) => (
    <View 
      style={[
        styles.skeletonText, 
        { width, height }
      ]} 
    />
  );

  // Function to resolve image sources from string paths
  const getImageSource = (imagePath: string) => {
    switch (imagePath) {
      case "@/assets/images/In-progress_Icon.png":
        return require("@/assets/images/In-progress_Icon.png");
      case "@/assets/images/check.png":
        return require("@/assets/images/check.png");
      default:
        return require("@/assets/images/In-progress_Icon.png");
    }
  };

  // Function to resolve color values from string references
  const getColorValue = (colorString: string) => {
    switch (colorString) {
      case "Colors.white":
        return Colors.white;
      case "Colors.grey[300]":
        return Colors.grey[300];
      default:
        return Colors.white;
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <ImageBackground
        source={require("@/assets/images/dashboardDataContainer.png")}
        style={styles.card}
        imageStyle={styles.cardImage}
        resizeMode="cover"
      >
        <View style={[
          styles.iconContainer,
          containerBackground && { backgroundColor: getColorValue(containerBackground) }
        ]}>
          <Image
            style={styles.completionIndicator}
            source={completionIndicator ? getImageSource(completionIndicator) : require("@/assets/images/In-progress_Icon.png")}
          />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.labelRow}>
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={Colors.grey[400]}
            />
            <Text style={styles.cardLabel}>{label}</Text>
          </View>

          <View style={styles.valueRow}>
            <Text style={styles.mainNumber}>{value}</Text>
            {suffix && <Text style={styles.unit}>{suffix}</Text>}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export const DashboardData: React.FC<DashboardDataProps> = ({
  hoursData,
  skillsData,
  schoolData,
  examData,
  isLoading = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ProgressCard
          icon="clock-outline"
          label="Hours"
          value={hoursData?.value || "1,790"}
          suffix="hrs"
          completionIndicator={hoursData?.completionIndicator}
          containerBackground={hoursData?.containerBackground}
        />
        <ProgressCard
          icon="lightning-bolt-outline"
          label="Skills"
          value={skillsData?.value || "28 / 81"}
          completionIndicator={skillsData?.completionIndicator}
          containerBackground={skillsData?.containerBackground}
        />
      </View>
      <View style={styles.row}>
        <ProgressCard
          icon="school-outline"
          label="School"
          value={schoolData?.value || "0/10"}
          suffix="weeks"
          completionIndicator={schoolData?.completionIndicator}
          containerBackground={schoolData?.containerBackground}
        />
        <ProgressCard
          icon="trophy-outline"
          label="Exam"
          value={examData?.value || "-"}
          suffix="%"
          completionIndicator={examData?.completionIndicator}
          containerBackground={examData?.containerBackground}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 20,
  },
  iconContainer: {
    display: "flex",
    backgroundColor: Colors.white,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    position: "absolute",
    top: 0,
    right: 0,
  },
  completionIndicator: {
    width: 20,
    height: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  // ssssss
  cardWrapper: {
    flex: 1,
    // marginHorizontal: 4,
    position: "relative",
  },
  card: {
    width: "100%",
    height: 94,
    position: "relative",
    justifyContent: "flex-start",
  },
  cardContent: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  cardImage: {
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardLabel: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 16,
    color: Colors.grey[400],
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    alignSelf: "flex-start",
  },
  mainNumber: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 24,
    lineHeight: 28,
    color: Colors.grey[900],
  },
  unit: {
    fontFamily: "SpaceGrotesk-Light",
    fontSize: 16,
    color: Colors.grey[900],
  },
  skeletonText: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    opacity: 0.6,
  },
});

export default DashboardData;
