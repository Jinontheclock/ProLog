import { InformationalMessage } from "@/components/shared/InformationalMessage";
import MaterialIcon from "@/components/shared/MaterialIcon";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { CommonStyles } from "@/lib/common-styles";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock exam data
const examAttempts = [
  {
    attemptNumber: 3,
    score: 38,
    total: 40,
    percentage: 95,
    date: "Nov 14, 2025",
    improvement: 30,
    isBestRecord: true,
    previousScore: { score: 26, total: 40, date: "Aug 7, 2025" },
    newScore: { score: 38, total: 40, date: "Aug 14, 2025" },
  },
  {
    attemptNumber: 2,
    score: 26,
    total: 40,
    percentage: 65,
    date: "Aug 7, 2025",
    improvement: -13,
  },
  {
    attemptNumber: 1,
    score: 32,
    total: 40,
    percentage: 78,
    date: "Nov 14, 2025",
    improvement: null,
  },
];

export default function ExamPrepScreen() {
  const [showProgressInfoModal, setShowProgressInfoModal] = React.useState(false);
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const maxAppWidth = 428;
  const appWidth = Math.min(screenWidth, maxAppWidth);

  const handleBackPress = () => {
    router.back();
  };

  const handleNewExam = () => {
    router.push("/skills/loadingExam");
  };

  const bestAttempt =
    examAttempts.find((a) => a.isBestRecord) || examAttempts[0];

  return (
    <View style={[CommonStyles.container, { backgroundColor: "#F0F0F0" }]}>
      <Image
        source={require("@/assets/images/background-grid 1.svg")}
        style={[CommonStyles.backgroundImage, { opacity: 0.12 }]}
        resizeMode="cover"
      />

      <View
        style={[
          styles.contentWrapper,
          { width: appWidth, alignSelf: "center" },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <MaterialIcon
                name="icon-arrow-back"
                size={24}
                color={Colors.grey[900]}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Exam Prep</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Give New Exam Card */}
          <TouchableOpacity style={styles.newExamCard} activeOpacity={0.8} onPress={handleNewExam}>
            <Image
              source={require("@/assets/images/Exam_prep.svg")}
              style={styles.newExamBackground}
              resizeMode="cover"
            />
            <View style={styles.newExamContent}>
              <View style={styles.newExamTextContent}>
                <Text style={styles.newExamTitle}>Give{"\n"}New Exam</Text>
                <View style={styles.newExamIconContainer}>
                  <MaterialIcon
                    name="chevron_right"
                    size={24}
                    color={Colors.grey[900]}
                  />
                </View>
              </View>
              <Text style={styles.newExamDescription}>
                Test your skills with AI-generated questions, covering all lines
                in your current level.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Progress Update Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Progress Update</Text>
              <TouchableOpacity
                onPress={() => setShowProgressInfoModal(true)}
                accessibilityRole="button"
                accessibilityLabel="About progress update"
              >
                <MaterialIcon name="info" size={20} color={Colors.grey[400]} />
              </TouchableOpacity>
            </View>

            {/* Best Attempt Card */}
            <View style={styles.progressCard}>
              <Text style={styles.attemptLabel}>
                Attempt {bestAttempt.attemptNumber}
              </Text>
              <View style={styles.progressMainContent}>
                <View style={styles.progressLeft}>
                  <Text style={styles.percentageText}>
                    {bestAttempt.percentage}%
                  </Text>
                  <View style={styles.bestRecordBadge}>
                    <Text style={styles.bestRecordText}>Best record</Text>
                  </View>
                </View>
                <View style={styles.progressRight}>
                  <Text style={styles.improvementText}>
                    You achieved{" "}
                    <Text style={styles.improvementBold}>
                      {bestAttempt.improvement}%
                    </Text>{" "}
                    more than your previous attempt, passing the test pass mark
                    by <Text style={styles.improvementBold}>+25%</Text> margin.
                  </Text>
                </View>
              </View>
            </View>

            {/* Score Comparison */}
            <View style={styles.scoreComparison}>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>Previous Score</Text>
                <Text style={styles.scoreValue}>
                  {bestAttempt.previousScore.score}/
                  {bestAttempt.previousScore.total}
                </Text>
                <Text style={styles.scoreDate}>
                  {bestAttempt.previousScore.date}
                </Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>New Score</Text>
                <Text style={styles.scoreValue}>
                  {bestAttempt.newScore.score}/{bestAttempt.newScore.total}
                </Text>
                <Text style={styles.scoreDate}>
                  {bestAttempt.newScore.date}
                </Text>
              </View>
            </View>
          </View>

          {/* Exam Log Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exam Log</Text>

            {examAttempts.map((attempt, index) => (
              <View key={index} style={styles.examLogItem}>
                <View style={styles.examLogLeft}>
                  <Text style={styles.examLogAttempt}>
                    Attempt {attempt.attemptNumber}
                  </Text>
                  <Text style={styles.examLogScore}>
                    {attempt.score}/{attempt.total}
                  </Text>
                  <Text style={styles.examLogDate}>{attempt.date}</Text>
                </View>
                <View style={styles.examLogRight}>
                  {attempt.improvement !== null && (
                    <View
                      style={[
                        styles.improvementBadge,
                        attempt.improvement > 0
                          ? styles.improvementPositive
                          : styles.improvementNegative,
                      ]}
                    >
                      <Text style={styles.improvementBadgeText}>
                        {attempt.improvement > 0 ? "+" : ""}
                        {attempt.improvement}%
                      </Text>
                    </View>
                  )}
                  <View style={styles.percentageBox}>
                    <Text style={styles.percentageBoxText}>
                      {attempt.percentage}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Progress Update Info Modal */}
        {showProgressInfoModal && (
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowProgressInfoModal(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <InformationalMessage message="Your best practice-exam attempt and how it compares to the one before it. Retake the exam anytime to push the record up." />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  contentWrapper: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  headerTitle: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 24,
    color: Colors.grey[700],
  },
  newExamCard: {
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    overflow: "hidden",
    position: "relative",
  },
  newExamBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  newExamContent: {
    flexDirection: "column",
    gap: 12,
    // justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    minHeight: 136,
    backgroundColor: Colors.orange[400],
  },
  newExamTextContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    width: "100%",
    gap: 8,
  },
  newExamTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 20,
    lineHeight: 24,
    color: Colors.white,
  },
  newExamDescription: {
    ...Typography.contentSubtitle,
    color: Colors.white,
    // maxWidth: 300,
  },
  newExamIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 20,
    lineHeight: 24,
    color: Colors.grey[700],
  },
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.grey[100],
  },
  attemptLabel: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 20,
    lineHeight: 24,
    color: Colors.grey[900],
  },
  progressMainContent: {
    flexDirection: "row",
    gap: 16,
  },
  progressLeft: {
    gap: 12,
  },
  percentageText: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 36,
    lineHeight: 40,
    color: Colors.grey[900],
  },
  bestRecordBadge: {
    backgroundColor: Colors.grey[600],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  bestRecordText: {
    fontFamily: "Roboto-Bold",
    fontSize: 12,
    color: Colors.white,
  },
  progressRight: {
    flex: 1,
    justifyContent: "center",
  },
  improvementText: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: Colors.grey[800],
  },
  improvementBold: {
    fontFamily: "Roboto-Bold",
    color: Colors.grey[900],
  },
  scoreComparison: {
    flexDirection: "row",
    gap: 12,
  },
  scoreBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.grey[100],
  },
  scoreLabel: {
    ...Typography.contentTitle,
    color: Colors.grey[300],
  },
  scoreValue: {
    ...Typography.contentBold,
    color: Colors.grey[900],
  },
  scoreDate: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  examLogItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "start",
    borderWidth: 1,
    borderColor: Colors.grey[100],
    position: "relative",
  },
  examLogLeft: {
    gap: 4,
  },
  examLogAttempt: {
    ...Typography.contentTitle,
    color: Colors.grey[300],
  },
  examLogScore: {
    ...Typography.contentBold,
    color: Colors.grey[900],
  },
  examLogDate: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  examLogRight: {
    gap: 8,
    alignItems: "flex-end",
    zIndex: 10,
    position: "relative",
  },
  improvementBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 5,
    marginTop: -8,
    marginRight: -8
  },
  improvementPositive: {
    backgroundColor: "#E97851",
  },
  improvementNegative: {
    backgroundColor: "#4A9B9F",
  },
  improvementBadgeText: {
    ...Typography.captionBold,
    color: Colors.white,
  },
  percentageBox: {
    position: "absolute",
    top: "50%",
    right: -8,
    width: 160,
    height: 77,
    backgroundColor: Colors.grey[50],
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -38.5 }],
    zIndex: 1,
  },
  percentageBoxText: {
    ...Typography.sectionHeader,
    color: Colors.grey[900],
  },
});
