import { ButtonButtonBar } from "@/components/shared/ButtonButtonBar";
import { DetailsHeading } from "@/components/shared/DetailsHeading";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/design-tokens";
import { Typography } from "@/constants/typography";
import { CommonStyles } from "@/lib/common-styles";
import { completionStore } from "@/lib/completion-store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Import the competency data
import { TTSAudioPlayer } from "@/components/shared/TTSAudioPlayer";
import SuccessMessage from "@/components/shared/successMessage";
import skillsData from "@/data/skills-competency-summary.json";

type SummarySection = {
  Section: string;
  Content: string;
};

type CompetencyData = {
  id: string;
  Title: string;
  Summary: SummarySection[];
  Category: string;
  Quiz: string;
};

export default function SkillsDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { competencyId } = useLocalSearchParams<{ competencyId: string }>();
  const [competencyData, setCompetencyData] = useState<CompetencyData | null>(
    null
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const slideAnimation = useRef(new Animated.Value(100)).current;

  // Generate text content for TTS from competency data
  const generateTTSContent = (data: CompetencyData): string => {
    let content = `${data.Title}. `;
    data.Summary.forEach((section) => {
      content += `${section.Section}: ${section.Content}. `;
    });
    return content;
  };

  // Load completion status from the completion store
  const loadCompletionStatus = async (id: string) => {
    await completionStore.waitForInitialization();
    const completed = completionStore.isCompleted(id);
    setIsCompleted(completed);
  };

  // Save completion status to the completion store
  const saveCompletionStatus = async (id: string, completed: boolean) => {
    await completionStore.setCompleted(id, completed);
  };

  useEffect(() => {
    const loadData = async () => {
      if (competencyId) {
        // Find the competency anywhere in the level (all lines)
        const levelData = skillsData["level 1"] as Record<string, CompetencyData[]>;
        const foundCompetency = Object.values(levelData)
          .flat()
          .find((item) => item.id === competencyId);

        if (foundCompetency) {
          setCompetencyData(foundCompetency as CompetencyData);
          await loadCompletionStatus(competencyId);
          setIsLoading(false);
        } else {
          Alert.alert("Error", "Competency not found", [
            { text: "OK", onPress: () => router.back() },
          ]);
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [competencyId]);

  const handleStartQuiz = () => {
    if (!competencyData) return;

    router.push({
      pathname: "/skills/quiz",
      params: {
        skillId: competencyData.id,
        content: competencyData.Quiz,
      },
    });
  };

  const handleMarkAsComplete = async () => {
    if (!competencyData) return;

    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);

    try {
      await saveCompletionStatus(competencyData.id, newCompletedState);

      // Show success message with slide animation
      if (newCompletedState) {
        setShowSuccessMessage(true);
        // Slide up animation
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          // Slide down animation
          Animated.timing(slideAnimation, {
            toValue: 100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowSuccessMessage(false);
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving completion status:", error);
      // Revert the local state if save failed
      setIsCompleted(!newCompletedState);
      Alert.alert(
        "Error",
        "Failed to save completion status. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  if (!competencyData || isLoading) {
    return (
      <SafeAreaView style={CommonStyles.container}>
        <Image
          source={require("@/assets/images/background-grid 1.svg")}
          style={[CommonStyles.backgroundImage, { opacity: 0.15 }]}
          resizeMode="cover"
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading competency data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={CommonStyles.container}>
      <Image
        source={require("@/assets/images/background-grid 1.svg")}
        style={[CommonStyles.backgroundImage, { opacity: 0.12 }]}
        resizeMode="cover"
      />
      <ScrollView
        style={CommonStyles.scrollView}
        contentContainerStyle={{
          paddingBottom: 100 + insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainerBody}>
          {/* Header with DetailsHeading Component */}
          <DetailsHeading
            onBack={() => router.back()}
            lineLabel={`Line ${competencyData.id.replace(/[0-9]+$/, "")}`}
            title={competencyData.Title}
            tag={competencyData.Category}
          />

          <TTSAudioPlayer
            text={generateTTSContent(competencyData)}
            apiKey={process.env.EXPO_PUBLIC_GOOGLE_TTS_API_KEY || ""}
            languageCode="en-US"
            voiceName="en-US-Wavenet-F"
            speakingRate={1.0}
            pitch={0.0}
          />

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            {competencyData.Summary.map((section, index) => (
              <View key={index} style={styles.summaryCard}>
                <Text style={styles.sectionHeader}>{section.Section}</Text>
                <Text style={styles.sectionContent}>{section.Content}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Button Bar */}
      <View style={styles.stickyButtonContainer}>
        <ButtonButtonBar
          onComplete={handleMarkAsComplete}
          onChallenge={handleStartQuiz}
          isCompleted={isCompleted}
        />
      </View>

      {/* Success Message */}
      {showSuccessMessage && (
        <Animated.View
          style={[
            styles.successMessageContainer,
            {
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          <SuccessMessage
            text="Competency Marked as Complete"
            iconName="check"
            iconColor={Colors.orange[400]}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainerBody: {
    flexDirection: "column",
    gap: 12,
  },
  stickyButtonContainer: {
    position: "absolute",
    bottom: -16,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...Typography.contentTitle,
    color: Colors.grey[500],
  },
  summaryContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
  sectionHeader: {
    ...Typography.contentTitle,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  sectionContent: {
    ...Typography.bigBody,
    color: Colors.grey[700],
    lineHeight: 22,
  },
  successMessageContainer: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    zIndex: 10001,
  },
});
