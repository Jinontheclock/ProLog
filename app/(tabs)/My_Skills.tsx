import { CompetencyListItem } from "@/components/shared/CompetencyListItem";
import { ExamPrep } from "@/components/shared/ExamPrep";
import { InformationalMessage } from "@/components/shared/InformationalMessage";
import { LineCarousel } from "@/components/shared/LineCarousel";
import { LineDescription } from "@/components/shared/LineDescription";
import { LoadingQuiz } from "@/components/shared/LoadingQuiz";
import MaterialIcon from "@/components/shared/MaterialIcon";
import { PageSwitch } from "@/components/shared/PageSwitch";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { CommonStyles } from "@/lib/common-styles";
import { completionStore } from "@/lib/completion-store";
import { useFocusEffect } from '@react-navigation/native';
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";

// Import the competency data
import { Colors } from "@/constants";
import { LINE_INFO, LINE_LETTERS } from '@/data/lines';
import skillsData from '@/data/skills-competency-summary.json';

type CompetencyItem = {
  id: string;
  Title: string;
  Summary: any[];
  Category: string;
  Quiz: string;
};


export default function SkillsScreen() {
  const skillId = "123";
  const title = "Skill Development";
  const description = "Learn and enhance your skills effectively.";
  const learningObjectives = ["Objective 1", "Objective 2", "Objective 3"];
  const [selectedTab, setSelectedTab] = React.useState("overall");
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);
  const [completedCompetencies, setCompletedCompetencies] = React.useState<string[]>([]);
  const [selectedPracticalLine, setSelectedPracticalLine] = React.useState("A");
  const [selectedTheoreticalLine, setSelectedTheoreticalLine] = React.useState("A");
  const [practicalFilter, setPracticalFilter] = React.useState<string>('All');
  const [theoreticalFilter, setTheoreticalFilter] = React.useState<string>('All');
  const [showPracticalDropdown, setShowPracticalDropdown] = React.useState(false);
  const [showTheoreticalDropdown, setShowTheoreticalDropdown] = React.useState(false);

  // Competency data follows whichever line each tab has selected
  const levelData = skillsData['level 1'] as Record<string, CompetencyItem[]>;
  const practicalCompetencies = (levelData[`Line ${selectedPracticalLine}`] ?? [])
    .filter(comp => comp.Category === 'Practical');
  const theoryCompetencies = (levelData[`Line ${selectedTheoreticalLine}`] ?? [])
    .filter(comp => comp.Category === 'Theory');

  // Subscribe to completion store changes
  React.useEffect(() => {
    const setupStore = async () => {
      // Wait for store to initialize
      await completionStore.waitForInitialization();
      
      // Set initial state
      setCompletedCompetencies(completionStore.getCompleted());
      
      // Subscribe to changes
      const unsubscribe = completionStore.subscribe((completedIds) => {
        setCompletedCompetencies(completedIds);
      });
      
      return unsubscribe;
    };
    
    let unsubscribe: (() => void) | undefined;
    
    setupStore().then((unsub) => {
      unsubscribe = unsub;
    });
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Refresh completion status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const refreshData = async () => {
        await completionStore.waitForInitialization();
        setCompletedCompetencies(completionStore.getCompleted());
      };
      refreshData();
    }, [])
  );



  // Helper function to handle competency navigation
  const handleCompetencyPress = (competencyId: string) => {
    router.push({
      pathname: "/skills/details",
      params: { competencyId }
    });
  };

  // Update button: simulates a sync with SkilledTradesBC — newly verified
  // sign-offs land and the header counts move (before ↔ after, like the
  // other tabs' demo states)
  const [syncState, setSyncState] = React.useState<'before' | 'after'>('before');
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showExamInfoModal, setShowExamInfoModal] = React.useState(false);
  const headerData =
    syncState === 'before'
      ? { hours: 28, percentage: 35 }
      : { hours: 34, percentage: 42 };
  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      setSyncState((current) => (current === 'before' ? 'after' : 'before'));
      setTimeout(() => setIsSyncing(false), 2000);
    }, 300);
  };

  return (
    <View style={[CommonStyles.container, { backgroundColor: "#F0F0F0" }]}>
      <Image
        source={require("@/assets/images/background-grid 1.svg")}
        style={[CommonStyles.backgroundImage, { opacity: 0.12 }]}
        resizeMode="cover"
      />
      <ScrollView
        style={CommonStyles.scrollView}
        contentContainerStyle={{
          paddingBottom: 70 + insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Card */}
        <SectionHeading
          level="Level 2"
          title="Skills Competency"
          icon_action="cached"
          currentHours={headerData.hours}
          totalHours={81}
          percentage={headerData.percentage}
          hrsText=""
          hoursIcon="electric_bolt"
          onIconPress={handleSync}
          isLoading={isSyncing}
        />

        {/* Tab Navigation */}
        <PageSwitch
          key="my-skills-tabs"
          tabs={[
            {
              id: "overall",
              label: "Overall",
              iconName: "dashboard",
            },
            {
              id: "practical",
              label: "Practical",
              iconName: "back_hand",
            },
            {
              id: "theoretical",
              label: "Theoretical",
              iconName: "library_book",
            },
          ]}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />

        {/* Content based on selected tab */}
        {selectedTab === "overall" && (
          <View style={styles.overallContainer}>

            {/* Exam Prep Component */}
            <View style={styles.examPrepSection}>
              <View style={styles.examPrepHeader}>
                <Text style={styles.examPrepTitle}>Exam Prep</Text>
                <TouchableOpacity onPress={() => setShowExamInfoModal(true)} accessibilityRole="button" accessibilityLabel="About exam prep">
                  <MaterialIcon name="info" size={20} color={Colors.grey[400]} />
                </TouchableOpacity>
              </View>
              <ExamPrep onPress={() => {
                router.push('/skills/exam-prep');
              }} />
            </View>

            {/* Ranking Component */}
            {/* <View style={styles.componentContainer}>
              <Ranking title="Avg. Score" scoreRange="90-94%" rank="Top 2" />
              <Ranking title="Avg. Score" scoreRange="90-94%" rank="Top 2" />
            </View> */}
          </View>
        )}

        {selectedTab === "practical" && (
          <View style={styles.tabContentContainer}>
            {/* Line Carousel */}
            <View style={styles.tabComponentContainer}>
              <LineCarousel
                lines={[...LINE_LETTERS]}
                selectedLine={selectedPracticalLine}
                onLineSelect={(line) => setSelectedPracticalLine(line)}
              />
            </View>

            {/* Line Description */}
            <View style={styles.tabComponentContainer}>
              <LineDescription
                title={`Line ${selectedPracticalLine}`}
                description={LINE_INFO[selectedPracticalLine]?.title ?? ""}
                content={LINE_INFO[selectedPracticalLine]?.blurb ?? ""}
              />
            </View>

            {/* Competency List Items */}
            <View style={styles.competencySection}>
              <View style={styles.competencyHeaderRow}>
                <Text style={styles.competencyCountText}>
                  Competencies {practicalCompetencies.filter(comp => {
                    if (practicalFilter === 'Completed') return completedCompetencies.includes(comp.id);
                    if (practicalFilter === 'Incomplete') return !completedCompetencies.includes(comp.id);
                    return true;
                  }).length}/{practicalCompetencies.length}
                </Text>
                <View style={styles.filterWrapper}>
                  <TouchableOpacity 
                    style={styles.filterButton} 
                    onPress={() => setShowPracticalDropdown(!showPracticalDropdown)}
                  >
                    <Text style={styles.filterText}>{practicalFilter}</Text>
                    <MaterialIcon name="icon-dropdown-arrow" size={16} color={Colors.grey[500]} />
                  </TouchableOpacity>
                  {showPracticalDropdown && (
                    <View style={styles.dropdown}>
                      <ScrollView 
                        style={styles.dropdownScrollView}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                      >
                        <TouchableOpacity 
                          style={styles.dropdownItem}
                          onPress={() => {
                            setPracticalFilter('All');
                            setShowPracticalDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setPracticalFilter('Completed');
                            setShowPracticalDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>Completed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setPracticalFilter('Incomplete');
                            setShowPracticalDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>Incomplete</Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.competencyListContainer}>
                {practicalCompetencies.filter(comp => {
                  if (practicalFilter === 'Completed') return completedCompetencies.includes(comp.id);
                  if (practicalFilter === 'Incomplete') return !completedCompetencies.includes(comp.id);
                  return true;
                }).map((competency) => (
                  <CompetencyListItem
                    key={competency.id}
                    text={competency.Title}
                    checked={completedCompetencies.includes(competency.id)}
                    onCheckedChange={() => handleCompetencyPress(competency.id)}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {selectedTab === "theoretical" && (
          <View style={styles.tabContentContainer}>
            {/* Line Carousel */}
            <View style={styles.tabComponentContainer}>
              <LineCarousel
                lines={[...LINE_LETTERS]}
                selectedLine={selectedTheoreticalLine}
                onLineSelect={(line) => setSelectedTheoreticalLine(line)}
              />
            </View>

            {/* Line Description */}
            <View style={styles.tabComponentContainer}>
              <LineDescription
                title={`Line ${selectedTheoreticalLine}`}
                description={LINE_INFO[selectedTheoreticalLine]?.title ?? ""}
                content={LINE_INFO[selectedTheoreticalLine]?.blurb ?? ""}
              />
            </View>

            {/* Competency List Items */}
            <View style={styles.competencySection}>
              <View style={styles.competencyHeaderRow}>
                <Text style={styles.competencyCountText}>
                  Competencies {theoryCompetencies.filter(comp => {
                    if (theoreticalFilter === 'Completed') return completedCompetencies.includes(comp.id);
                    if (theoreticalFilter === 'Incomplete') return !completedCompetencies.includes(comp.id);
                    return true;
                  }).length}/{theoryCompetencies.length}
                </Text>
                <View style={styles.filterWrapper}>
                  <TouchableOpacity 
                    style={styles.filterButton} 
                    onPress={() => setShowTheoreticalDropdown(!showTheoreticalDropdown)}
                  >
                    <Text style={styles.filterText}>{theoreticalFilter}</Text>
                    <MaterialIcon name="icon-dropdown-arrow" size={16} color={Colors.grey[500]} />
                  </TouchableOpacity>
                  {showTheoreticalDropdown && (
                    <View style={styles.dropdown}>
                      <ScrollView 
                        style={styles.dropdownScrollView}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                      >
                        <TouchableOpacity 
                          style={styles.dropdownItem}
                          onPress={() => {
                            setTheoreticalFilter('All');
                            setShowTheoreticalDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setTheoreticalFilter('Completed');
                            setShowTheoreticalDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>Completed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setTheoreticalFilter('Incomplete');
                            setShowTheoreticalDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>Incomplete</Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.competencyListContainer}>
                {theoryCompetencies.filter(comp => {
                  if (theoreticalFilter === 'Completed') return completedCompetencies.includes(comp.id);
                  if (theoreticalFilter === 'Incomplete') return !completedCompetencies.includes(comp.id);
                  return true;
                }).map((competency) => (
                  <CompetencyListItem
                    key={competency.id}
                    text={competency.Title}
                    checked={completedCompetencies.includes(competency.id)}
                    onCheckedChange={() => handleCompetencyPress(competency.id)}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Exam Prep Info Modal */}
      {showExamInfoModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowExamInfoModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <InformationalMessage message="Exam Prep generates a practice exam that samples questions across every Level 1 line, mirroring the standardized level exam format." />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Updating overlay — same treatment as the other tabs */}
      {isSyncing && (
        <View style={styles.loadingOverlay}>
          <LoadingQuiz
            loadingTitle="Updating Data..."
            loadingContent="Please wait while we sync your competency records with your training authority."
          />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  overallContainer: {
    paddingHorizontal: 20,
    gap: 24,
    flex: 1,
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
  componentContainer: {
    alignItems: "center",
    width: '100%',
    flex: 1,
  },
  examPrepSection: {
    width: '100%',
    gap: 12,
  },
  examPrepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examPrepTitle: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 20,
    lineHeight: 24,
    color: Colors.grey[700],
  },
  tabContentContainer: {
    paddingHorizontal: 20,
    // paddingTop: 24,
    gap: 20,
  },
  tabComponentContainer: {
    alignItems: "center",
  },
  competencySection: {
    gap: 12,
    zIndex: 1,
  },
  competencyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  competencyCountText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: Colors.grey[900],
  },
  filterWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.grey[200],
    width: 120,
    height: 30,
    justifyContent: 'space-between',
  },
  filterText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    lineHeight: 16 * 1.05,
    color: Colors.grey[500],
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 0,
    width: 120,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.grey[200],
    maxHeight: 200,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  dropdownText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    lineHeight: 16 * 1.05,
    color: Colors.grey[700],
  },
  competencyListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderColor: Colors.grey[100],
    zIndex: 0,
  },
});
