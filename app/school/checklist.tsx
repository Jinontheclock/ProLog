import { CompetencyListItem } from "@/components/shared/CompetencyListItem";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/design-tokens";
import { Typography } from "@/constants/typography";
import { LINE_INFO, LINE_LETTERS } from "@/data/lines";
import skillsData from "@/data/skills-competency-summary.json";
import { checklistCompleted } from "@/lib/checklist-baseline";
import { CommonStyles } from "@/lib/common-styles";
import { completionStore } from "@/lib/completion-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CompetencyItem = {
  id: string;
  Title: string;
  Summary: any[];
  Category: string;
  Quiz: string;
};

const levelData = (skillsData as any)["level 1"] as Record<
  string,
  CompetencyItem[]
>;

export default function ChecklistScreen() {
  const [storeCompleted, setStoreCompleted] = React.useState<string[]>([]);
  // Line A carries the bulk of Level 1, so it opens expanded
  const [expandedLines, setExpandedLines] = React.useState<string[]>(["A"]);

  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      await completionStore.waitForInitialization();
      setStoreCompleted(completionStore.getCompleted());
      unsubscribe = completionStore.subscribe(setStoreCompleted);
    })();
    return () => unsubscribe?.();
  }, []);

  const isDone = (id: string) => checklistCompleted(id, storeCompleted);

  const allCompetencies = LINE_LETTERS.flatMap(
    (letter) => levelData[`Line ${letter}`] ?? []
  );
  const countDone = (category?: string) =>
    allCompetencies.filter(
      (c) => (!category || c.Category === category) && isDone(c.id)
    ).length;
  const countTotal = (category?: string) =>
    allCompetencies.filter((c) => !category || c.Category === category).length;

  const toggleLine = (letter: string) => {
    setExpandedLines((current) =>
      current.includes(letter)
        ? current.filter((l) => l !== letter)
        : [...current, letter]
    );
  };

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Colors.grey[700]}
            />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.pageTitle}>Competency Checklist</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryProgram}>
            Electrician Common Core — Harmonized Level 1
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>
                {countDone()}/{countTotal()}
              </Text>
              <Text style={styles.summaryLabel}>Signed off</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>
                {countDone("Theory")}/{countTotal("Theory")}
              </Text>
              <Text style={styles.summaryLabel}>Theory</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>
                {countDone("Practical")}/{countTotal("Practical")}
              </Text>
              <Text style={styles.summaryLabel}>Practical</Text>
            </View>
          </View>
          <Text style={styles.summaryNote}>
            Competencies are evaluated through written exams and practical
            assessments. The standardized level exam draws 85 questions from
            the lines below — tap any competency to review it.
          </Text>
        </View>

        {/* Per-line sections */}
        {LINE_LETTERS.map((letter) => {
          const lineKey = `Line ${letter}`;
          const comps = levelData[lineKey] ?? [];
          const done = comps.filter((c) => isDone(c.id)).length;
          const expanded = expandedLines.includes(letter);

          return (
            <View key={letter} style={styles.lineSection}>
              <TouchableOpacity
                style={styles.lineHeader}
                onPress={() => toggleLine(letter)}
                activeOpacity={0.7}
              >
                <View style={styles.lineBadge}>
                  <Text style={styles.lineBadgeText}>{letter}</Text>
                </View>
                <View style={styles.lineHeaderText}>
                  <Text style={styles.lineTitle} numberOfLines={1}>
                    {LINE_INFO[letter]?.title ?? lineKey}
                  </Text>
                  <Text style={styles.lineCount}>
                    {done}/{comps.length} signed off
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={24}
                  color={Colors.grey[300]}
                />
              </TouchableOpacity>

              {expanded && (
                <View style={styles.lineBody}>
                  {comps.map((competency) => (
                    <CompetencyListItem
                      key={competency.id}
                      text={competency.Title}
                      checked={isDone(competency.id)}
                      onCheckedChange={() =>
                        router.push({
                          pathname: "/skills/details",
                          params: { competencyId: competency.id },
                        })
                      }
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  backButton: {
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
    marginLeft: 20,
  },
  titleWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    pointerEvents: "none",
  },
  pageTitle: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 24,
    lineHeight: 28,
    color: Colors.grey[700],
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryProgram: {
    ...Typography.contentTitle,
    color: Colors.grey[300],
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: Colors.grey[50],
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 2,
  },
  summaryNumber: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 20,
    lineHeight: 24,
    color: Colors.grey[900],
  },
  summaryLabel: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  summaryNote: {
    ...Typography.smBody,
    color: Colors.grey[500],
    lineHeight: 18,
  },
  lineSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lineHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  lineBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.orange[50],
    alignItems: "center",
    justifyContent: "center",
  },
  lineBadgeText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 18,
    color: Colors.orange[500],
  },
  lineHeaderText: {
    flex: 1,
    gap: 2,
  },
  lineTitle: {
    ...Typography.buttonText,
    color: Colors.grey[900],
  },
  lineCount: {
    ...Typography.smBody,
    color: Colors.grey[500],
  },
  lineBody: {
    borderTopWidth: 1,
    borderTopColor: Colors.grey[50],
  },
});
