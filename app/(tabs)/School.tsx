import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import workData from "@/data/work-data.json";

import { CompetencyCompletion } from "@/components/shared/CompetencyCompletion";
import { CompletedLines } from "@/components/shared/CompletedLines";
import { ExpenseCard } from "@/components/shared/ExpenseCard";
import { FinancialSupport } from "@/components/shared/FinancialSupport";
import { InformationalMessage } from "@/components/shared/InformationalMessage";
import { LoadingQuiz } from "@/components/shared/LoadingQuiz";
import MaterialIcon from "@/components/shared/MaterialIcon";
import { PageSwitch } from "@/components/shared/PageSwitch";
import { SchoolSlots } from "@/components/shared/SchoolSlots";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { useColorScheme } from "@/hooks/use-color-scheme";
import dimensions from "@/lib/dimensions";
import { router } from "expo-router";
import { Platform } from "react-native";

// In-school record for the Skills tab: theory sign-offs per line, before and
// after a sync. Totals mirror data/skills-competency-summary.json.
const SKILLS_RECORD = {
    theory: {
        completed: { before: 14, after: 22 },
        total: 36,
        lastUpdated: { before: "Dec 05, 2025", after: "Dec 12, 2025" },
    },
    lines: [
        { name: "Line A", total: 16, before: 7, after: 11 },
        { name: "Line B", total: 2, before: 2, after: 2 },
        { name: "Line C", total: 1, before: 1, after: 1 },
        { name: "Line D", total: 2, before: 1, after: 2 },
        { name: "Line G", total: 2, before: 2, after: 2 },
        { name: "Line H", total: 2, before: 1, after: 2 },
        { name: "Line I", total: 2, before: 0, after: 1 },
        { name: "Line J", total: 2, before: 0, after: 1 },
        { name: "Line L", total: 2, before: 0, after: 0 },
        { name: "Line Q", total: 1, before: 0, after: 0 },
        { name: "Line R", total: 2, before: 0, after: 0 },
        { name: "Line V", total: 2, before: 0, after: 0 },
    ],
};

// Campus details surfaced when a Next Enrollment card is tapped
const CAMPUS_INFO: Record<string, string> = {
    "BCIT Burnaby Campus":
        "BCIT Burnaby Campus — 3700 Willingdon Ave, Burnaby. Level 2 Industrial Electrician runs 10 weeks, full-time. Use Add Enrollment on the Program tab to register for a slot.",
    "North Delta Secondary":
        "North Delta Secondary — 11447 82 Ave, Delta. Evening and weekend Level 2 intakes for working apprentices. Use Add Enrollment on the Program tab to register for a slot.",
};

export default function SchoolScreen() {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const [selectedTab, setSelectedTab] = useState("program");
    const [expandedExpense, setExpandedExpense] = useState<number | null>(3);
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    const [showInstitutionDropdown, setShowInstitutionDropdown] =
        useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState("");
    const [showProgramDropdown, setShowProgramDropdown] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState("");
    const [showDurationDropdown, setShowDurationDropdown] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState("");
    const [isLoadingProgram, setIsLoadingProgram] = useState(false);
    const [isProgramRegistered, setIsProgramRegistered] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showCompetencyInfoModal, setShowCompetencyInfoModal] =
        useState(false);
    const [campusInfo, setCampusInfo] = useState<string | null>(null);
    const [demoState, setDemoState] = useState<"before" | "after">("before");
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to get current data based on demo state
    const getCurrentData = (dataPath: any) => {
        if (
            typeof dataPath === "object" &&
            dataPath !== null &&
            !Array.isArray(dataPath)
        ) {
            if (dataPath.before !== undefined && dataPath.after !== undefined) {
                return dataPath[demoState];
            }
        }
        return dataPath;
    };

    // Toggle demo state function with loading animation
    const toggleDemoState = () => {
        setIsLoading(true);

        // Simulate loading delay for better UX
        setTimeout(() => {
            setDemoState((current) =>
                current === "before" ? "after" : "before"
            );

            // End loading after state change
            setTimeout(() => {
                setIsLoading(false);
            }, 2200); // Additional time for progress bar animation
        }, 300);
    };

    // The sync always lands new data: exam/heading rows once a program is
    // registered, and the Skills-tab record in every state
    const handleUpdatePress = () => {
        if (isLoading) return;
        toggleDemoState();
    };

    // Get school page data
    const schoolPageData = workData["level 2"].school_page;

    // Skeleton loading component for text
    const SkeletonText = ({
        width = 100,
        height = 16,
    }: {
        width?: number;
        height?: number;
    }) => <View style={[styles.skeletonText, { width, height }]} />;

    // Helper to render text or skeleton based on loading state
    const renderTextOrSkeleton = (
        text: string | number,
        skeletonWidth = 60
    ) => {
        if (isLoading) {
            return <SkeletonText width={skeletonWidth} />;
        }
        return typeof text === "string" ? text : text.toString();
    };

    const handleSubmit = () => {
        if (selectedInstitution && selectedProgram && selectedDuration) {
            setIsLoadingProgram(true);
            setShowEnrollmentModal(false);
            // Reset demo state to "before" when registering
            setDemoState("before");
            setTimeout(() => {
                setIsLoadingProgram(false);
                setIsProgramRegistered(true);
            }, 5000);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: "#F0F0F0" }]}>
            <Image
                source={require("@/assets/images/background-grid 1.svg")}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    opacity: 0.12,
                }}
                resizeMode="cover"
            />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{
                    paddingBottom: 70 + insets.bottom + 20,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Top Card */}
                <SectionHeading
                    level={schoolPageData.sectionHeading.level}
                    icon_action="cached"
                    title={schoolPageData.sectionHeading.title}
                    currentHours={
                        !isProgramRegistered 
                            ? schoolPageData.sectionHeading.currentHours.before 
                            : getCurrentData(schoolPageData.sectionHeading.currentHours)
                    }
                    totalHours={schoolPageData.sectionHeading.totalHours}
                    percentage={
                        !isProgramRegistered 
                            ? schoolPageData.sectionHeading.percentage.before 
                            : getCurrentData(schoolPageData.sectionHeading.percentage)
                    }
                    onIconPress={handleUpdatePress}
                    isLoading={isLoading}
                    hrsText="weeks"
                />

                {/* Not enrolled yet — explain why the header sits at zero and
                    shortcut straight into the enrollment form */}
                {!isProgramRegistered && !isLoadingProgram && (
                    <TouchableOpacity
                        style={styles.enrollHintBanner}
                        onPress={() => {
                            setSelectedTab("program");
                            setShowEnrollmentModal(true);
                        }}
                        activeOpacity={0.8}
                    >
                        <MaterialIcon
                            name="info"
                            size={16}
                            color={Colors.orange[700]}
                        />
                        <Text style={styles.enrollHintText}>
                            Not enrolled yet — add your enrollment to start
                            tracking
                        </Text>
                        <MaterialIcon
                            name="icon-arrow-forward"
                            size={16}
                            color={Colors.orange[700]}
                        />
                    </TouchableOpacity>
                )}

                {/* Tab Navigation */}
                <PageSwitch
                    key="school-tabs"
                    tabs={[
                        {
                            id: "program",
                            label: "Program",
                            iconName: "house",
                        },
                        {
                            id: "skills",
                            label: "Skills",
                            iconName: "electric_bolt",
                        },
                        {
                            id: "finance",
                            label: "Finance",
                            iconName: "paid",
                        },
                    ]}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                />

                {selectedTab === "program" && (
                    <>
                        {/* Show loading or program details if registered */}
                        {isLoadingProgram ? (
                            <View style={styles.enrollmentFormContainer}>
                                <LoadingQuiz
                                    loadingTitle="Generating Program Details..."
                                    loadingContent="Please wait while we update your technical training information to show your progress."
                                />
                            </View>
                        ) : isProgramRegistered ? (
                            <>
                                {/* Program Details Section */}
                                <Text style={styles.programDetailsTitle}>
                                    Program Details
                                </Text>
                                <View style={styles.programDetailsCard}>
                                    <Text style={styles.programLabel}>
                                        Program
                                    </Text>
                                    <Text style={styles.programValueFirst}>
                                        Level 2 Industrial Electrician, APPR
                                    </Text>

                                    <Text
                                        style={[
                                            styles.programLabel,
                                            { marginTop: 16 },
                                        ]}
                                    >
                                        Institute
                                    </Text>
                                    <Text style={styles.programValue}>
                                        British Columbia Institute of Technology
                                    </Text>

                                    <View style={styles.programDateRow}>
                                        <View style={styles.programDateBox}>
                                            <Text
                                                style={styles.programDateLabel}
                                            >
                                                Start Date
                                            </Text>
                                            <Text
                                                style={styles.programDateValue}
                                            >
                                                Jan 05, 2026
                                            </Text>
                                        </View>
                                        <View style={styles.programDateBox}>
                                            <Text
                                                style={styles.programDateLabel}
                                            >
                                                Est. End Date
                                            </Text>
                                            <Text
                                                style={styles.programDateValue}
                                            >
                                                Mar 13, 2026
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Standard Exam Section */}
                                <Text style={styles.standardExamTitle}>
                                    Standard Exam
                                </Text>
                                <View style={styles.examAttemptCard}>
                                    <View style={styles.examAttemptLeft}>
                                        <Text style={styles.examAttemptTitle}>
                                            {schoolPageData.standardExamSection.examAttempt}
                                        </Text>
                                        <Text style={styles.examAttemptDate}>
                                            {isLoading ? (
                                                <SkeletonText width={80} height={16} />
                                            ) : (
                                                getCurrentData(
                                                    schoolPageData.standardExamSection.examAttemptDate
                                                ) || "Not scheduled"
                                            )}
                                        </Text>
                                        <View style={styles.registeredBadge}>
                                            <Text
                                                style={
                                                    styles.registeredBadgeText
                                                }
                                            >
                                                {isLoading ? (
                                                    <SkeletonText width={60} height={14} />
                                                ) : (
                                                    getCurrentData(
                                                        schoolPageData.standardExamSection.registeredBadge
                                                    )
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.examAttemptRight}>
                                        <Text style={styles.examScore}>
                                            {isLoading ? (
                                                <SkeletonText width={40} height={32} />
                                            ) : (
                                                getCurrentData(
                                                    schoolPageData.standardExamSection.examResult
                                                )
                                            )}
                                        </Text>
                                        <Text style={styles.examPercent}>
                                            {!isLoading && getCurrentData(
                                                schoolPageData.standardExamSection.examResult
                                            ) !== "-" ? "%" : ""}
                                        </Text>
                                    </View>
                                </View>

                                {/* Level 3 Unlocked Card - Only show in "after" state */}
                                {demoState === "after" && (
                                    <View style={styles.levelUnlockedCard}>
                                        <View style={styles.levelUnlockedHeader}>
                                            <MaterialIcon
                                                name="icon-lock"
                                                size={20}
                                                color={Colors.orange[500]}
                                            />
                                            <Text style={styles.levelUnlockedTitle}>
                                                Level 3 Unlocked
                                            </Text>
                                        </View>
                                        <Text
                                            style={styles.levelUnlockedDescription}
                                        >
                                            Congratulations – you have achieved all
                                            the requirements for Level 2. Press the
                                            button below to continue your trades
                                            journey
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.nextLevelButton}
                                            onPress={() =>
                                                router.push(
                                                    "/(tabs)/Dashboard"
                                                )
                                            }
                                        >
                                            <Text
                                                style={styles.nextLevelButtonText}
                                            >
                                                Start the next level
                                            </Text>
                                            <MaterialIcon
                                                name="icon-arrow-forward"
                                                size={20}
                                                color={Colors.white}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Enrollment Status Card */}
                                <View style={styles.enrollmentPrompt}>
                                    <View style={styles.iconTitleWrapper}>
                                        <MaterialIcon
                                            name="help_outline"
                                            size={20}
                                            color={Colors.grey[600]}
                                        />
                                        <Text style={styles.promptTitle}>
                                            Have you enrolled yet?
                                        </Text>
                                    </View>
                                    <Text style={styles.promptDescription}>
                                        Technical training is required to
                                        proceed to the next level. Check out the
                                        available enrollments below.
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.addEnrollmentCard,
                                        showEnrollmentModal &&
                                            styles.addEnrollmentCardExpanded,
                                    ]}
                                    onPress={() =>
                                        setShowEnrollmentModal(
                                            !showEnrollmentModal
                                        )
                                    }
                                >
                                    <View style={styles.addEnrollmentContent}>
                                        <Text style={styles.addEnrollmentTitle}>
                                            Add{`\n`}Enrollment Status
                                        </Text>
                                        <Text
                                            style={
                                                styles.addEnrollmentDescription
                                            }
                                        >
                                            Add your enrolment status to start
                                            tracking your progress in technical
                                            training
                                        </Text>
                                    </View>
                                    <View style={styles.addIconCircle}>
                                        <MaterialIcon
                                            name="icon-add"
                                            size={20}
                                            color={Colors.orange[500]}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {/* Enrollment Form - Expands below card */}
                                {showEnrollmentModal && (
                                    <View
                                        style={styles.enrollmentFormContainer}
                                    >
                                        <View style={styles.formCard}>
                                            <Text
                                                style={[
                                                    styles.formSectionTitle,
                                                    styles.formSectionTitleFirst,
                                                ]}
                                            >
                                                Institution
                                            </Text>
                                            <View style={{ zIndex: 12000 }}>
                                                <TouchableOpacity
                                                    style={styles.dropdownField}
                                                    onPress={() =>
                                                        setShowInstitutionDropdown(
                                                            !showInstitutionDropdown
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropdownPlaceholder,
                                                            selectedInstitution && {
                                                                ...Typography.bigBody,
                                                                color: Colors
                                                                    .grey[900],
                                                            },
                                                        ]}
                                                    >
                                                        {selectedInstitution ||
                                                            "Select your institution"}
                                                    </Text>
                                                    <MaterialIcon
                                                        name="icon-dropdown-arrow"
                                                        size={24}
                                                        color={Colors.grey[400]}
                                                    />
                                                </TouchableOpacity>

                                                {showInstitutionDropdown && (
                                                    <>
                                                        <TouchableOpacity
                                                            style={
                                                                styles.dropdownOverlay
                                                            }
                                                            onPress={() =>
                                                                setShowInstitutionDropdown(
                                                                    false
                                                                )
                                                            }
                                                            activeOpacity={1}
                                                        />
                                                        <View
                                                            style={
                                                                styles.dropdownMenu
                                                            }
                                                        >
                                                            <TouchableOpacity
                                                                style={
                                                                    styles.dropdownOption
                                                                }
                                                                onPress={() => {
                                                                    setSelectedInstitution(
                                                                        "BCIT"
                                                                    );
                                                                    setShowInstitutionDropdown(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.dropdownOptionText
                                                                    }
                                                                >
                                                                    BCIT
                                                                </Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={
                                                                    styles.dropdownOption
                                                                }
                                                                onPress={() => {
                                                                    setSelectedInstitution(
                                                                        "North Delta Secondary"
                                                                    );
                                                                    setShowInstitutionDropdown(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.dropdownOptionText
                                                                    }
                                                                >
                                                                    North Delta Secondary
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </>
                                                )}
                                            </View>

                                            <Text
                                                style={styles.formSectionTitle}
                                            >
                                                Program
                                            </Text>
                                            <View style={{ zIndex: 11000 }}>
                                                <TouchableOpacity
                                                    style={styles.dropdownField}
                                                    onPress={() =>
                                                        setShowProgramDropdown(
                                                            !showProgramDropdown
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropdownPlaceholder,
                                                            selectedProgram && {
                                                                ...Typography.bigBody,
                                                                color: Colors
                                                                    .grey[900],
                                                            },
                                                        ]}
                                                    >
                                                        {selectedProgram ||
                                                            "Select your program"}
                                                    </Text>
                                                    <MaterialIcon
                                                        name="icon-dropdown-arrow"
                                                        size={24}
                                                        color={Colors.grey[400]}
                                                    />
                                                </TouchableOpacity>

                                                {showProgramDropdown && (
                                                    <>
                                                        <TouchableOpacity
                                                            style={
                                                                styles.dropdownOverlay
                                                            }
                                                            onPress={() =>
                                                                setShowProgramDropdown(
                                                                    false
                                                                )
                                                            }
                                                            activeOpacity={1}
                                                        />
                                                        <View
                                                            style={
                                                                styles.dropdownMenu
                                                            }
                                                        >
                                                            <TouchableOpacity
                                                                style={
                                                                    styles.dropdownOption
                                                                }
                                                                onPress={() => {
                                                                    setSelectedProgram(
                                                                        "Industrial Electrician - Level 2"
                                                                    );
                                                                    setShowProgramDropdown(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.dropdownOptionText
                                                                    }
                                                                >
                                                                    Industrial
                                                                    Electrician
                                                                    - Level 2
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </>
                                                )}
                                            </View>

                                            <Text
                                                style={styles.formSectionTitle}
                                            >
                                                Program Duration
                                            </Text>
                                            <View style={{ zIndex: 10000 }}>
                                                <TouchableOpacity
                                                    style={styles.dropdownField}
                                                    onPress={() =>
                                                        setShowDurationDropdown(
                                                            !showDurationDropdown
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dropdownPlaceholder,
                                                            selectedDuration && {
                                                                ...Typography.bigBody,
                                                                color: Colors
                                                                    .grey[900],
                                                            },
                                                        ]}
                                                    >
                                                        {selectedDuration ||
                                                            "Select your intake slot"}
                                                    </Text>
                                                    <MaterialIcon
                                                        name="icon-dropdown-arrow"
                                                        size={24}
                                                        color={Colors.grey[400]}
                                                    />
                                                </TouchableOpacity>

                                                {showDurationDropdown && (
                                                    <>
                                                        <TouchableOpacity
                                                            style={
                                                                styles.dropdownOverlay
                                                            }
                                                            onPress={() =>
                                                                setShowDurationDropdown(
                                                                    false
                                                                )
                                                            }
                                                            activeOpacity={1}
                                                        />
                                                        <View
                                                            style={
                                                                styles.dropdownMenu
                                                            }
                                                        >
                                                            <TouchableOpacity
                                                                style={
                                                                    styles.dropdownOption
                                                                }
                                                                onPress={() => {
                                                                    setSelectedDuration(
                                                                        "Jan 05 to Mar 13, 2026"
                                                                    );
                                                                    setShowDurationDropdown(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.dropdownOptionText
                                                                    }
                                                                >
                                                                    Jan 05 to Mar 13, 2026
                                                                </Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={
                                                                    styles.dropdownOption
                                                                }
                                                                onPress={() => {
                                                                    setSelectedDuration(
                                                                        "Mar 16 to May 22, 2026"
                                                                    );
                                                                    setShowDurationDropdown(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.dropdownOptionText
                                                                    }
                                                                >
                                                                    Mar 16 to May 22, 2026
                                                                </Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={
                                                                    styles.dropdownOption
                                                                }
                                                                onPress={() => {
                                                                    setSelectedDuration(
                                                                        "May 25 to Jul 31, 2026"
                                                                    );
                                                                    setShowDurationDropdown(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.dropdownOptionText
                                                                    }
                                                                >
                                                                    May 25 to Jul 31, 2026
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </>
                                                )}
                                            </View>

                                            <TouchableOpacity
                                                style={styles.submitButton}
                                                onPress={handleSubmit}
                                            >
                                                <Text
                                                    style={
                                                        styles.submitButtonText
                                                    }
                                                >
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}

                        {/* Discrepancy Tracking */}
                        <View style={[styles.discrepancyHeader, { zIndex: 1 }]}>
                            <Text style={styles.discrepancyTitle}>
                                Next Enrollment
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowInfoModal(true)}
                                accessibilityRole="button"
                                accessibilityLabel="About next enrollment"
                            >
                                <MaterialIcon
                                    name="info"
                                    size={20}
                                    color={Colors.grey[400]}
                                />
                            </TouchableOpacity>
                        </View>

                        <SchoolSlots
                            campuses={[
                                {
                                    name: "BCIT Burnaby Campus",
                                    location: "Burnaby",
                                    slots: [
                                        {
                                            startDate: "Jan 5",
                                            startYear: "2026",
                                            endDate: "Mar 13",
                                            endYear: "2026",
                                            slot: "02",
                                        },
                                        {
                                            startDate: "Jan 5,",
                                            startYear: "2026",
                                            endDate: "Mar 13,",
                                            endYear: "2026",
                                            slot: "12",
                                        },
                                        {
                                            startDate: "Jan 5,",
                                            startYear: "2026",
                                            endDate: "Mar 13",
                                            endYear: "2026",
                                            slot: "05",
                                        },
                                    ],
                                    onPress: () =>
                                        setCampusInfo(
                                            CAMPUS_INFO["BCIT Burnaby Campus"]
                                        ),
                                },
                                {
                                    name: "North Delta Secondary",
                                    location: "Delta",
                                    slots: [
                                        {
                                            startDate: "Jan 5",
                                            startYear: "2026",
                                            endDate: "Mar 13",
                                            endYear: "2026",
                                            slot: "02",
                                        },
                                        {
                                            startDate: "Jan 5,",
                                            startYear: "2026",
                                            endDate: "Mar 13,",
                                            endYear: "2026",
                                            slot: "12",
                                        },
                                        {
                                            startDate: "Jan 5,",
                                            startYear: "2026",
                                            endDate: "Mar 13,",
                                            endYear: "2026",
                                            slot: "05",
                                        },
                                    ],
                                    onPress: () =>
                                        setCampusInfo(
                                            CAMPUS_INFO["North Delta Secondary"]
                                        ),
                                },
                            ]}
                        />
                    </>
                )}

                {selectedTab === "skills" && (
                    <>
                        {/* Completion Details */}
                        <CompetencyCompletion
                            title="Completion Details"
                            showInfoIcon={true}
                            onInfoPress={() => setShowCompetencyInfoModal(true)}
                            checkboxLabel="Theoretical Competencies"
                            current={
                                isLoading
                                    ? SKILLS_RECORD.theory.completed.before
                                    : getCurrentData(
                                          SKILLS_RECORD.theory.completed
                                      )
                            }
                            total={SKILLS_RECORD.theory.total}
                            lastUpdated={getCurrentData(
                                SKILLS_RECORD.theory.lastUpdated
                            )}
                            progressImage={require("@/assets/images/Group 46.png")}
                        />

                        {/* Line Completion */}
                        <CompletedLines
                            title="Line Completion"
                            lines={SKILLS_RECORD.lines.map((line) => {
                                const current = getCurrentData({
                                    before: line.before,
                                    after: line.after,
                                });
                                return {
                                    name: line.name,
                                    current,
                                    total: line.total,
                                    isCompleted: current >= line.total,
                                };
                            })}
                        />

                        {/* View Checklist Button */}
                        <TouchableOpacity
                            style={styles.viewChecklistButton}
                            onPress={() => router.push("/school/checklist")}
                        >
                            <Text style={styles.viewChecklistButtonText}>
                                View Checklist
                            </Text>
                            <MaterialIcon
                                name="icon-arrow-forward"
                                size={20}
                                color={Colors.white}
                            />
                        </TouchableOpacity>
                    </>
                )}

                {selectedTab === "finance" && (
                    <>
                        {/* Financial Support */}
                        <FinancialSupport
                            supportItems={[
                                {
                                    title: "Canada Apprentice Loan",
                                    description: "Interest-free loans for each period of technical training",
                                    url: "https://www.canada.ca/en/services/jobs/training/support-skilled-trades-apprentices/loan.html",
                                    site: "Canada.ca",
                                },
                                {
                                    title: "Provincial Grant",
                                    description: "Financial assistance for apprentices in technical training",
                                    url: "https://skilledtradesbc.ca/financial-support",
                                    site: "SkilledTradesBC",
                                },
                                {
                                    title: "Employer Sponsorship",
                                    description: "Support from employers for educational expenses",
                                    url: "https://www.workbc.ca/develop-skills/funding-grants-learners/services-apprentices-and-employers",
                                    site: "WorkBC",
                                },
                                {
                                    title: "Scholarship Programs",
                                    description: "Merit-based financial awards for skilled trades students",
                                    url: "https://www.bcit.ca/financial-aid/",
                                    site: "BCIT Financial Aid",
                                },
                            ]}
                        />

                        {/* Potential Expenses */}
                        <View style={styles.financeHeader}>
                            <Text style={styles.financeSectionTitle}>
                                Potential Expenses
                            </Text>
                            <MaterialIcon
                                name="info"
                                size={20}
                                color={Colors.grey[400]}
                            />
                        </View>
                        <Text style={styles.financeSectionSubtitle}>
                            Upcoming potential expenses to consider for
                            financial planning
                        </Text>

                        {/* Expense Cards */}
                        <ExpenseCard
                            id={1}
                            amount="$1,900"
                            title="Tuition"
                            detailTitle="BCIT Industrial Electrician"
                            details={[
                                { label: "Tuition", value: "$1,450.30" },
                                { label: "BCITSA", value: "$155.50" },
                                { label: "Ancillary", value: "$25.30" },
                            ]}
                            isExpanded={expandedExpense === 1}
                            onToggle={() =>
                                setExpandedExpense(
                                    expandedExpense === 1 ? null : 1
                                )
                            }
                        />

                        <ExpenseCard
                            id={2}
                            amount="$200"
                            title="Tools"
                            detailTitle="BCIT Industrial Ellectrician"
                            details={[
                                { label: "Calculator", value: "$50" },
                                {
                                    label: "Clamp Circuit finder",
                                    value: "$100.00",
                                },
                                { label: "Circuit finder", value: "$50.30" },
                            ]}
                            isExpanded={expandedExpense === 2}
                            onToggle={() =>
                                setExpandedExpense(
                                    expandedExpense === 2 ? null : 2
                                )
                            }
                        />

                        <ExpenseCard
                            id={3}
                            amount="$209.05"
                            title="Books"
                            detailTitle="BCIT Bookstore"
                            details={[
                                {
                                    label: "2024 Canadian Electrical Code Part 1 (26Th...",
                                    value: "$50",
                                },
                            ]}
                            isExpanded={expandedExpense === 3}
                            onToggle={() =>
                                setExpandedExpense(
                                    expandedExpense === 3 ? null : 3
                                )
                            }
                        />
                    </>
                )}
            </ScrollView>

            {/* Info Modal */}
            {showInfoModal && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowInfoModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <InformationalMessage message="The next available dates for Level 3 Industrial Electrician apprenticeship program at BCIT." />
                    </TouchableOpacity>
                </TouchableOpacity>
            )}

            {/* Campus Info Modal */}
            {campusInfo && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setCampusInfo(null)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <InformationalMessage message={campusInfo} />
                    </TouchableOpacity>
                </TouchableOpacity>
            )}

            {/* Competency Info Modal */}
            {showCompetencyInfoModal && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCompetencyInfoModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <InformationalMessage message="The count is displayed only for theoretical competency, if you want to see the full list check the skills page!" />
                    </TouchableOpacity>
                </TouchableOpacity>
            )}

            {/* Loading Quiz Overlay */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <LoadingQuiz
                        loadingTitle="Updating Data..."
                        loadingContent="Please wait while we update your technical training information to show your progress."
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: dimensions.constrainedWidth,
        alignSelf: "center",
    },
    scrollView: {
        flex: 1,
    },
    sectionTitle: {
        ...Typography.contentTitle,
        color: Colors.grey[700],
        marginBottom: 16,
        marginTop: 8,
        marginHorizontal: 20,
    },
    skeletonText: {
        backgroundColor: Colors.grey[100],
        borderRadius: 4,
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
    financeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 24,
        marginTop: 8,
    },
    financeSectionTitle: {
        ...Typography.sectionHeader,
        color: Colors.grey[700],
    },
    financeSectionSubtitle: {
        fontFamily: "Roboto-Light",
        fontSize: 12,
        color: Colors.black,
        marginHorizontal: 24,
        marginTop: 4,
        marginBottom: 16,
    },
    detailsCard: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        marginHorizontal: 20,
        flexDirection: "column",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            },
        }),
    },
    detailLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        color: "#2C2C2C",
        fontWeight: "500",
    },
    dateRow: {
        flexDirection: "row",
        marginTop: 20,
        gap: 16,
    },
    dateBox: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        padding: 16,
    },
    dateLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 14,
        color: "#2C2C2C",
        fontWeight: "500",
    },
    examCard: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            },
        }),
    },
    examLeft: {
        flex: 1,
    },
    examTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2C2C2C",
        marginBottom: 4,
    },
    examDate: {
        fontSize: 12,
        color: "#999",
        marginBottom: 12,
    },
    examRight: {
        width: 100,
        height: 100,
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    nextEnrollmentHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 16,
        // marginHorizontal: 20,
    },
    infoIcon: {
        width: 20,
        height: 20,
        tintColor: "#999",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        marginHorizontal: 20,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
    enrollHintBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: Colors.orange[50],
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginHorizontal: 20,
        marginTop: 12,
        marginBottom: -4,
    },
    enrollHintText: {
        ...Typography.smBody,
        color: Colors.orange[700],
        flexShrink: 1,
    },
    enrollmentPrompt: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        paddingTop: 20,
        // marginTop: 32,
        marginBottom: 16,
        marginHorizontal: 20,
        // height: 122,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            },
        }),
    },
    iconTitleWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    promptTitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        lineHeight: 20,
        color: Colors.grey[900],
        marginLeft: 12,
    },
    promptDescription: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        lineHeight: 20,
        color: Colors.grey[400],
    },
    addEnrollmentCard: {
        backgroundColor: Colors.orange[400],
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.orange[500],
        padding: 24,
        marginBottom: 24,
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        // height: 136,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
            web: {
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            },
        }),
    },
    addEnrollmentCardExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0,
    },
    addEnrollmentContent: {
        flex: 1,
    },
    addEnrollmentTitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        lineHeight: 24,
        color: Colors.white,
        marginBottom: 8,
    },
    addEnrollmentDescription: {
        fontFamily: 'Roboto-Light',
        fontSize: 14,
        lineHeight: 20,
        color: Colors.white,
        width: 300,
    },
    addIconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 16,
    },
    discrepancyHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 16,
    },
    discrepancyTitle: {
        ...Typography.sectionHeader,
        color: Colors.grey[700],
    },
    enrollmentFormContainer: {
        marginHorizontal: 20,
        marginTop: 0,
        marginBottom: 24,
        zIndex: 10000,
    },
    formCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        padding: 32,
        paddingTop: 24,
        paddingBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            },
        }),
    },
    formSectionTitle: {
        ...Typography.contentTitle,
        color: Colors.grey[600],
        marginBottom: 12,
        marginTop: 16,
    },
    formSectionTitleFirst: {
        marginTop: 8,
    },
    dropdownField: {
        backgroundColor: Colors.grey[50],
        borderRadius: 8,
        paddingHorizontal: 24,
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownPlaceholder: {
        ...Typography.bigBody,
        color: Colors.grey[300],
    },
    dropdownOverlay: {
        position: "absolute",
        top: 0,
        left: -32,
        right: -32,
        bottom: 0,
        zIndex: 9998,
    },
    dropdownMenu: {
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 9999,
        overflow: "hidden",
    },
    dropdownOption: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey[100],
    },
    dropdownOptionText: {
        ...Typography.bigBody,
        color: Colors.grey[300],
    },
    submitButton: {
        backgroundColor: Colors.grey[800],
        borderRadius: 30,
        width: 168,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 8,
        alignSelf: "center",
    },
    submitButtonText: {
        ...Typography.buttonText,
        color: Colors.grey[50],
    },
    programDetailsTitle: {
        ...Typography.sectionHeader,
        color: Colors.grey[700],
        marginHorizontal: 24,
        // marginTop: 24,
        marginBottom: 16,
    },
    programDetailsCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 32,
        // height: 248,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            },
        }),
    },
    programLabel: {
        ...Typography.contentTitle,
        color: Colors.grey[300],
        marginBottom: 4,
    },
    programValue: {
        ...Typography.bigBody,
        color: Colors.grey[700],
    },
    programValueFirst: {
        ...Typography.contentMedium,
        color: Colors.grey[700],
    },
    programDateRow: {
        flexDirection: "row",
        gap: 16,
        marginTop: 16,
    },
    programDateBox: {
        width: 145.5,
        // height: 76,
        backgroundColor: Colors.grey[50],
        borderRadius: 12,
        padding: 16,
        flex: 1,
    },
    programDateLabel: {
        ...Typography.contentTitle,
        color: Colors.grey[300],
        marginBottom: 4,
    },
    programDateValue: {
        ...Typography.bigBody,
        color: Colors.grey[700],
    },
    standardExamTitle: {
        ...Typography.sectionHeader,
        color: Colors.grey[700],
        marginHorizontal: 24,
        marginBottom: 16,
    },
    examAttemptCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 24,
        height: 119,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            },
        }),
    },
    examAttemptLeft: {
        flex: 1,
    },
    examAttemptTitle: {
        ...Typography.contentMedium,
        color: Colors.grey[900],
        marginBottom: 4,
    },
    examAttemptDate: {
        ...Typography.smBody,
        color: Colors.grey[300],
        marginBottom: 12,
    },
    registeredBadge: {
        backgroundColor: Colors.grey[50],
        borderRadius: 8,
        width: 89,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
    },
    registeredBadgeText: {
        ...Typography.smBody,
        color: Colors.grey[900],
    },
    examAttemptRight: {
        backgroundColor: Colors.grey[50],
        borderRadius: 12,
        width: 140,
        height: 103,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    examScore: {
        ...Typography.contentBold,
        color: Colors.grey[900],
    },
    examPercent: {
        ...Typography.contentSuffix,
        color: Colors.grey[900],
    },
    levelUnlockedCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 24,
        height: 176,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            },
        }),
    },
    levelUnlockedHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    levelUnlockedTitle: {
        ...Typography.contentTitle,
        color: Colors.grey[900],
        marginLeft: 8,
    },
    levelUnlockedDescription: {
        ...Typography.contentSubtitle,
        color: Colors.grey[500],
        marginBottom: 12,
        lineHeight: 20,
    },
    nextLevelButton: {
        backgroundColor: Colors.grey[800],
        borderRadius: 30,
        width: 189,
        height: 42,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        gap: 8,
    },
    nextLevelButtonText: {
        ...Typography.buttonText,
        color: Colors.grey[50],
    },
    viewChecklistButton: {
        width: 151,
        height: 40,
        backgroundColor: Colors.grey[900],
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        gap: 8,
    },
    viewChecklistButtonText: {
        fontFamily: "Roboto-Medium",
        fontSize: 12,
        color: Colors.white,
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(44,44,44,0.18)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    },
});
