import { DashboardData } from "@/components/shared/DashboardData";
import { LoadingQuiz } from "@/components/shared/LoadingQuiz";
import { Reminder } from "@/components/shared/Reminder";
import SendDiscrepancyReportModal from "@/components/shared/SendDiscrepancyReportModal";
import { SProgressBar } from "@/components/shared/SProgressBar";
import { Tags } from "@/components/shared/Tags";
import { UpdatePulse } from "@/components/shared/UpdatePulse";
import { displayName } from "@/lib/user-store";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/design-tokens";
import { Typography } from "@/constants/typography";
import workData from "@/data/work-data.json";
import { CommonStyles } from "@/lib/common-styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const [demoState, setDemoState] = useState<"before" | "after" | "nxtLvl">("before");
  const [isLoading, setIsLoading] = useState(false);
  const [level3AnimationActive, setLevel3AnimationActive] = useState(false);
  const [showSendDiscrepancyReportModal, setShowSendDiscrepancyReportModal] =
    useState(false);
  const spinAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(
    new Animated.Value(
      parseInt(workData["level 2"].Dashboard.progressSection.before)
    )
  ).current;

  // Helper function to get current data based on demo state
  const getCurrentData = (dataPath: any) => {
    if (
      typeof dataPath === "object" &&
      dataPath !== null &&
      !Array.isArray(dataPath)
    ) {
      // Check if the current state exists in the data object
      if (dataPath[demoState] !== undefined) {
        return dataPath[demoState];
      }
      // Fall back to original logic for before/after states
      if (dataPath.before !== undefined && dataPath.after !== undefined) {
        return dataPath[demoState === "nxtLvl" ? "after" : demoState];
      }
    }
    return dataPath;
  };

  // Toggle demo state function with loading animation
  const toggleDemoState = () => {
    setIsLoading(true);

    // Start refresh icon spin animation
    const spinLoopAnimation = Animated.loop(
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinLoopAnimation.start();

    // Simulate loading delay for better UX
    setTimeout(() => {
      const newState = demoState === "before" ? "after" : "before";
      const newProgressValue = parseInt(
        workData["level 2"].Dashboard.progressSection[newState]
      );

      setDemoState(newState);

      // End loading after state change
      setTimeout(() => {
        setIsLoading(false);
        spinLoopAnimation.stop();
        spinAnimation.setValue(0);

        // Animate progress bar to new value
        Animated.timing(progressAnimation, {
          toValue: newProgressValue,
          duration: 2000,
          useNativeDriver: false,
        }).start();

        // Trigger Level 3 animation only when state is "after"
        setLevel3AnimationActive(newState === "after");
      }, 2000); // Additional time for progress bar animation
    }, 300);
  };

  // Get dashboard data
  const dashboardData = workData["level 2"].Dashboard;
  const schoolExamData = workData["level 2"].Dashboard.standardExamSection;

  // Skeleton loading component for text
  const SkeletonText = ({
    width = 100,
    height = 16,
  }: {
    width?: number;
    height?: number;
  }) => <View style={[styles.skeletonText, { width, height }]} />;

  return (
    <SafeAreaView style={CommonStyles.container}>
      <Image
        source={require("@/assets/images/background-grid 1.svg")}
        style={[CommonStyles.backgroundImage, { opacity: 0.12 }]}
        resizeMode="cover"
      />
      <ScrollView
        style={CommonStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Bar Spacer */}
        <View style={{ height: 47 }} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello {displayName()}</Text>
            <Text style={styles.subtitle}>
              You're getting closer to the goal everyday!
            </Text>
          </View>
          <View style={styles.updateButtonWrap}>
            <UpdatePulse size={40} />
            <TouchableOpacity
              style={styles.profileButton}
              onPress={toggleDemoState}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Sync progress data"
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: spinAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <MaterialCommunityIcons
                  name="cached"
                  size={24}
                  color={isLoading ? Colors.grey[400] : Colors.grey[700]}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            />
          </View>
          {isLoading ? (
            <SkeletonText width={40} height={18} />
          ) : (
            <Text style={styles.progressText}>
              {getCurrentData(dashboardData.progressSection)}%
            </Text>
          )}
        </View>

        {/* S-Shaped Progress */}
        <View style={styles.journeySection}>
          <SProgressBar
            percentage={getCurrentData(dashboardData.journeySectionPercentage)}
            height={50}
            level1Image={getCurrentData(
              dashboardData.level1ProgressIndicatorImage
            )}
            level1Subtext={getCurrentData(
              dashboardData.level1ProgressIndicatorSubText
            )}
            level1ContainerStyle={getCurrentData(
              dashboardData.level1ProgressIndicatorContainerStyle
            )}
            level1ImageStyle={getCurrentData(
              dashboardData.level1ProgressIndicatorImageStyle
            )}
            level2Image={getCurrentData(
              dashboardData.level2ProgressIndicatorImage
            )}
            level2Subtext={getCurrentData(
              dashboardData.level2ProgressIndicatorSubText
            )}
            level2ContainerStyle={getCurrentData(
              dashboardData.level2ProgressIndicatorContainerStyle
            )}
            level2ImageStyle={getCurrentData(
              dashboardData.level2ProgressIndicatorImageStyle
            )}
            level3Image={getCurrentData(
              dashboardData.journeyProgressIndicatorImage
            )}
            level3Subtext={getCurrentData(
              dashboardData.journeyProgressIndicatorSubText
            )}
            level3ContainerStyle={getCurrentData(
              dashboardData.journeyProgressIndicatorContainerStyle
            )}
            level3ImageStyle={getCurrentData(
              dashboardData.journeyProgressIndicatorImageStyle
            )}
            level4Image={getCurrentData(
              dashboardData.level4ProgressIndicatorImage
            )}
            level4Subtext={getCurrentData(
              dashboardData.level4ProgressIndicatorSubText
            )}
            level4ContainerStyle={getCurrentData(
              dashboardData.level4ProgressIndicatorContainerStyle
            )}
            level4ImageStyle={getCurrentData(
              dashboardData.level4ProgressIndicatorImageStyle
            )}
            sProgressContainerMargin={getCurrentData(
              dashboardData.sProgressContainerMargin
            )}
            level3AnimationTrigger={level3AnimationActive}
            isLoading={isLoading}
            onLevel3Press={
              demoState === "after" && level3AnimationActive
                ? () => setShowSendDiscrepancyReportModal(true)
                : undefined
            }
          />
        </View>

        {/* Overall Progress Section */}
        <View style={styles.dashboardDataProgress}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Overall Progress</Text>
            <DashboardData
              hoursData={getCurrentData(dashboardData.dashboardDataHours)}
              skillsData={getCurrentData(dashboardData.dashboardDataSkills)}
              schoolData={getCurrentData(dashboardData.dashboardDataSchool)}
              examData={getCurrentData(dashboardData.dashboardDataExam)}
              isLoading={isLoading}
            />
          </View>

          {/* Reminder Section */}
          <Reminder
            onHeaderPress={() => router.push("/dashboard/Dashboard_Reminder")}
            onViewMore={() => router.push("/dashboard/Dashboard_Reminder")}
          />

          {/* Exam Detail Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Exam Detail
            </Text>

            <View style={styles.examCard}>
              <View style={styles.examLeft}>
                <View style={styles.examInfo}>
                  <Text style={styles.examTitle}>
                    {getCurrentData(schoolExamData.examAttempt)}
                  </Text>
                </View>
                {isLoading ? (
                  <SkeletonText width={90} height={28} />
                ) : (
                  <Tags
                    label={getCurrentData(schoolExamData.registeredBadge)}
                  />
                )}
              </View>
              <View style={styles.examRight}>
                {isLoading ? (
                  <SkeletonText width={60} height={38} />
                ) : (
                  <>
                    <Text style={styles.score}>
                      {getCurrentData(schoolExamData.examResult)}
                    </Text>
                    {getCurrentData(schoolExamData.examResult) !== "-" && (
                      <Text style={styles.scoreUnit}>%</Text>
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Loading Quiz Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingQuiz
            loadingTitle="Updating Progress..."
            loadingContent="Please wait while we update your dashboard information to 6 months in the future."
          />
        </View>
      )}

      {/* Send Discrepancy Report Modal */}
      <SendDiscrepancyReportModal
        visible={showSendDiscrepancyReportModal}
        onClose={() => setShowSendDiscrepancyReportModal(false)}
        onSend={() => {
          setShowSendDiscrepancyReportModal(false);
          setDemoState("nxtLvl");
          
          // Animate progress bar to nxtLvl value
          const nxtLvlProgressValue = parseInt(
            workData["level 2"].Dashboard.progressSection.nxtLvl
          );
          Animated.timing(progressAnimation, {
            toValue: nxtLvlProgressValue,
            duration: 2000,
            useNativeDriver: false,
          }).start();
          
          // Reset level3 animation since we're moving to next level
          setLevel3AnimationActive(false);
        }}
        icon="icon-lock"
        iconColor={Colors.orange[400]}
        title="Level 3 Unlocked"
        content="Congratulations – you have achieved all the requirements for Level 2. Press the button below to continue your trades journey."
        buttonText="Start the Next Level"
        buttonIcon="arrow-right"
        buttonVariant="primary"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.base,
  },
  greeting: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 32,
    lineHeight: 36 * 1.05,
    color: Colors.grey[700],
  },
  subtitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    lineHeight: 16 * 1.05,
    color: Colors.grey[500],
    marginTop: 4,
  },
  updateButtonWrap: {
    width: 40,
    height: 40,
    position: "relative",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.grey[100],
    borderRadius: 40,
    overflow: "hidden",
    justifyContent: "center",
  },
  progressFill: {
    width: 244,
    height: 6,
    backgroundColor: Colors.orange[400],
    borderRadius: 40,
    marginLeft: 2,
  },
  progressText: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    lineHeight: 18 * 1.05,
    color: Colors.grey[500],
  },
  journeySection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
    flex: 1,
  },
  dashboardDataProgress: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  sectionTitle: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 20,
    lineHeight: 20 * 1.05,
    color: Colors.grey[700],
    // titles elsewhere sit 4px inside the 20px gutter
    marginLeft: 4,
  },
  sectionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  examCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.grey[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    height: 127,
  },
  examLeft: {
    flex: 1,
    gap: 32,
  },
  examInfo: {
    gap: 4,
  },
  examTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    lineHeight: 24,
    color: Colors.grey[900],
  },
  examDate: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  examRight: {
    width: 140,
    height: 103,
    borderRadius: 8,
    backgroundColor: Colors.grey[50],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginLeft: 12,
  },
  score: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 32,
    lineHeight: 36,
    color: Colors.grey[900],
  },
  scoreUnit: {
    fontFamily: "SpaceGrotesk-Light",
    fontSize: 16,
    color: Colors.grey[900],
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  skeletonText: {
    backgroundColor: Colors.grey[100],
    borderRadius: 4,
    opacity: 0.6,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(44, 44, 44, 0.18)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});
