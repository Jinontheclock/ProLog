import SendDiscrepancyReportModal from "@/components/shared/SendDiscrepancyReportModal";
import { Audio } from "expo-av";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import workData from "@/data/work-data.json";

import { Button } from "@/components/shared/Buttons";
import { CompetencyCompletion } from "@/components/shared/CompetencyCompletion";
import { CompletedLines } from "@/components/shared/CompletedLines";
import { ContentDataFormats } from "@/components/shared/ContentDataFormats";
import { ExpenseCard } from "@/components/shared/ExpenseCard";
import { FinancialSupport } from "@/components/shared/FinancialSupport";
import { HourDiscrepancy } from "@/components/shared/HourDiscrepancy";
import { InformationalMessage } from "@/components/shared/InformationalMessage";
import { LoadingQuiz } from "@/components/shared/LoadingQuiz";
import MaterialIcon from "@/components/shared/MaterialIcon";
import NotificationPopup from "@/components/shared/NotificationPopup";
import { PageSwitch } from "@/components/shared/PageSwitch";
import { SectionHeading } from "@/components/shared/SectionHeading";
import SuccessMessage from "@/components/shared/successMessage";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import dimensions from "@/lib/dimensions";

export default function WorkScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState("hours");
  const [expandedExpenseCard, setExpandedExpenseCard] = useState<number | null>(
    1
  );
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
      setDemoState((current) => (current === "before" ? "after" : "before"));

      // End loading after state change
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Additional time for progress bar animation
    }, 300);
  };

  // Demo notification handler
  const handleDemoNotification = async () => {
    try {
      // Play notification sound
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/audio/iphone_16_messege_tone.mp3'),
        { shouldPlay: true }
      );
      
      // Wait 1 second then show notification popup
      setTimeout(() => {
        setShowNotificationPopup(true);
        
        // Slide down animation from top
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Hide after 3 seconds
        setTimeout(() => {
          // Slide back up animation
          Animated.timing(slideAnimation, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowNotificationPopup(false);
          });
        }, 3000);
      }, 350);
    } catch (error) {
      console.log('Error playing notification sound:', error);
      // Still show popup even if sound fails (with same delay)
      setTimeout(() => {
        setShowNotificationPopup(true);
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Hide after 3 seconds
        setTimeout(() => {
          Animated.timing(slideAnimation, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowNotificationPopup(false);
          });
        }, 3000);
      }, 1000);
    }
  };

  // Get work page data
  const workPageData = workData["level 2"].Work_page;

  // Skeleton loading component for text
  const SkeletonText = ({
    width = 100,
    height = 16,
  }: {
    width?: number;
    height?: number;
  }) => <View style={[styles.skeletonText, { width, height }]} />;

  // Helper to render text or skeleton based on loading state
  const renderTextOrSkeleton = (text: string | number, skeletonWidth = 60) => {
    if (isLoading) {
      return <SkeletonText width={skeletonWidth} />;
    }
    return typeof text === "string" ? text : text.toString();
  };
  const [showEndDateInfoModal, setShowEndDateInfoModal] = useState(false);
  const [showDiscrepancyInfoModal, setShowDiscrepancyInfoModal] =
    useState(false);
  const [showCompletionDetailsInfoModal, setShowCompletionDetailsInfoModal] =
    useState(false);
  const [showPotentialExpensesInfoModal, setShowPotentialExpensesInfoModal] =
    useState(false);
  const [showSendDiscrepancyReportModal, setShowSendDiscrepancyReportModal] =
    useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const slideAnimation = useRef(new Animated.Value(-100)).current;
  const successSlideAnimation = useRef(new Animated.Value(100)).current;

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
          level={workPageData.sectionHeading.level}
          icon_action="cached"
          title={workPageData.sectionHeading.title}
          currentHours={getCurrentData(
            workPageData.sectionHeading.currentHours
          )}
          totalHours={workPageData.sectionHeading.totalHours}
          percentage={getCurrentData(workPageData.sectionHeading.percentage)}
          onIconPress={toggleDemoState}
          isLoading={isLoading}
        />

        {/* Tab Navigation */}
        <PageSwitch
          tabs={[
            {
              id: "hours",
              label: "Hours",
              iconName: "schedule",
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

        {selectedTab === "hours" && (
          <>
            {/* <SuccessMessage /> */}
            {/* Apprenticeship Details */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Apprenticeship Details</Text>
            </View>
            <ContentDataFormats
              mainItems={[
                {
                  label: "Sponsor",
                  value: workPageData.apprenticeshipDetails.sponsor,
                },
                {
                  label: "Countdown (Est.)",
                  value: getCurrentData(
                    workPageData.apprenticeshipDetails.estimatedDaysToGo
                  ),
                },
              ]}
              dateItems={[
                {
                  label: "Start Date",
                  value: workPageData.apprenticeshipDetails.startDate,
                },
                {
                  label: "Est. End Date",
                  value: getCurrentData(
                    workPageData.apprenticeshipDetails.estimatedEndDate
                  ),
                },
              ]}
              isLoading={isLoading}
              onInfoPress={() => setShowEndDateInfoModal(true)}
            />

            {/* Discrepancy Tracking */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Discrepancy Tracking</Text>
              <View style={styles.sectionHeaderIcons}>
                {/* Demo: plays the paystub push-notification (sound + popup) */}
                <TouchableOpacity onPress={handleDemoNotification} accessibilityRole="button" accessibilityLabel="Play notification demo">
                  <MaterialIcon
                    name="icon-bell"
                    size={20}
                    color={Colors.orange[400]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDiscrepancyInfoModal(true)}
                  accessibilityRole="button"
                  accessibilityLabel="About discrepancy tracking"
                >
                  <MaterialIcon name="info" size={20} color={Colors.grey[400]} />
                </TouchableOpacity>
              </View>
            </View>

            <HourDiscrepancy
              items={[
                {
                  title: "Paystub",
                  hours: getCurrentData(
                    workPageData.discrepancyTracking.paystubHours
                  ),
                  unit: "hrs",
                  lastUpdated: getCurrentData(
                    workPageData.discrepancyTracking.paystubDate
                  ),
                },
                {
                  title: "SkilledTradesBC",
                  hours: getCurrentData(
                    workPageData.discrepancyTracking.skilledTradeBCHours
                  ),
                  unit: "hrs",
                  lastUpdated: getCurrentData(
                    workPageData.discrepancyTracking.skilledTradeBCDate
                  ),
                },
              ]}
              discrepancy={getCurrentData(
                workPageData.discrepancyTracking.discrepancy
              )}
              onReportError={() => setShowSendDiscrepancyReportModal(true)}
              isLoading={isLoading}
            />

            {/* Paystub Records */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Paystub Records</Text>
              {/* <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/paystubs/PaystubList")}
              >
                <MaterialIcon name="document_scanner" size={20} color={Colors.grey[500]} />
              </TouchableOpacity> */}
            </View>

            {/* Working Hours Chart */}
            <TouchableOpacity
              style={styles.chartCard}
              onPress={() => router.push("/paystubs/PaystubList")}
              activeOpacity={0.7}
            >
              <View style={styles.chartHeader}>
                <Text style={styles.chartLabel}>Working Hours</Text>
                <Text style={styles.chartValue}>Hrs</Text>
              </View>
              <View style={styles.chartAverage}>
                <Text style={styles.averageLabel}>Avg.</Text>
                <View style={styles.averageValueContainer}>
                  {isLoading ? (
                    <SkeletonText width={80} height={38} />
                  ) : (
                    <Text style={styles.averageValue}>
                      {getCurrentData(
                        workPageData.paystubRecord.workingHoursAvg
                      )}
                    </Text>
                  )}
                </View>
                <Text style={styles.averageUnit}>hrs</Text>
              </View>
              <ExpoImage
                source={
                  getCurrentData(
                    workPageData.paystubRecord.workingHoursGraph
                  ) === "work_graph01.png"
                    ? require("@/assets/images/work_graph01.png")
                    : require("@/assets/images/work_graph02.png")
                }
                style={styles.chartGraphImage}
                contentFit="contain"
              />
              {/* <View style={styles.chartPeriod}>
                <Text style={styles.periodText}>
                  {getCurrentData(workPageData.paystubRecord.paystubDateStart)}
                </Text>
                <Text style={styles.periodText}>
                  {getCurrentData(workPageData.paystubRecord.paystubDateEnd)}
                </Text>
              </View> */}
            </TouchableOpacity>

            {/* Income Chart */}
            <TouchableOpacity
              style={styles.chartCard}
              onPress={() => router.push("/paystubs/PaystubList")}
              activeOpacity={0.7}
            >
              <View style={styles.chartHeader}>
                <Text style={styles.chartLabel}>Income</Text>
                <Text style={styles.chartValue}>CAD $</Text>
              </View>
              <View style={styles.chartAverage}>
                <Text style={styles.averageLabel}>Avg.</Text>
                <View style={styles.averageValueContainer}>
                  {isLoading ? (
                    <SkeletonText width={100} height={38} />
                  ) : (
                    <Text style={styles.averageValue}>
                      {getCurrentData(workPageData.paystubRecord.incomeAvg)}
                    </Text>
                  )}
                </View>
              </View>
              <ExpoImage
                source={
                  getCurrentData(workPageData.paystubRecord.incomeGraph) ===
                  "income_graph01.png"
                    ? require("@/assets/images/income_graph01.png")
                    : require("@/assets/images/income_graph02.png")
                }
                style={styles.chartGraphImage}
                contentFit="contain"
              />
              {/* <View style={styles.chartPeriod}>
                <Text style={styles.periodText}>
                  {getCurrentData(workPageData.paystubRecord.paystubDateStart)}
                </Text>
                <Text style={styles.periodText}>
                  {getCurrentData(workPageData.paystubRecord.paystubDateEnd)}
                </Text>
              </View> */}
            </TouchableOpacity>

            {/* View All Paystubs Button */}
            <Button
              text="View All Paystubs"
              variant="light"
              customStyle={{
                height: 42,
                borderRadius: 30,
                alignSelf: "stretch",
                marginHorizontal: 20,
              }}
              onPress={() => router.push("/paystubs/PaystubList")}
            />
          </>
        )}

        {selectedTab === "skills" && (
          <>
            {/* Completion Details */}
            <CompetencyCompletion
              title="Completion Details"
              showInfoIcon={true}
              onInfoPress={() => setShowCompletionDetailsInfoModal(true)}
              checkboxLabel="Practical Competencies"
              current={10}
              total={34}
              lastUpdated="On: Mar 12, 2025"
              progressImage={require("@/assets/images/Group 46.png")}
            />

            {/* Line Completion — the Level 1 lines from the program outline */}
            <CompletedLines
              title="Line Completion"
              lines={[
                { name: "Line A", current: 22, total: 22, isCompleted: true },
                { name: "Line B", current: 4, total: 4, isCompleted: true },
                { name: "Line C", current: 3, total: 4, isCompleted: false },
                { name: "Line D", current: 2, total: 4, isCompleted: false },
                { name: "Line G", current: 4, total: 4, isCompleted: true },
                { name: "Line H", current: 1, total: 4, isCompleted: false },
                { name: "Line I", current: 2, total: 4, isCompleted: false },
                { name: "Line J", current: 0, total: 4, isCompleted: false },
                { name: "Line L", current: 0, total: 4, isCompleted: false },
                { name: "Line Q", current: 3, total: 4, isCompleted: false },
                { name: "Line R", current: 1, total: 4, isCompleted: false },
                { name: "Line V", current: 0, total: 4, isCompleted: false },
              ]}
            />

            {/* View Checklist Button */}
            <Button
              text="View Checklist"
              variant="light"
              customStyle={{
                height: 42,
                borderRadius: 30,
                marginTop: 16,
                alignSelf: "center",
                width: 300,
              }}
              onPress={() => router.push("/(tabs)/My_Skills")}
            />
          </>
        )}

        {selectedTab === "finance" && (
          <>
            {/* Financial Support */}
            <FinancialSupport
              supportItems={[
                {
                  title: "Canada\nApprentice Loan",
                  description: "Interest-free loans for each period of technical training",
                  url: "https://www.canada.ca/en/services/jobs/training/support-skilled-trades-apprentices/loan.html",
                  site: "Canada.ca",
                },
                {
                  title: "WorkBC\nApprentice Services",
                  description: "Financial support for travel, childcare and relocation",
                  url: "https://www.workbc.ca/discover-employment-services/apprentice-services",
                  site: "WorkBC",
                },
                {
                  title: "Tradesperson's\nTool Deduction",
                  description: "Financial support for tradespeople to cover tool costs",
                  url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-22900-other-employment-expenses/employed-tradespersons-including-apprentice-mechanics.html",
                  site: "Canada.ca (CRA)",
                },
                {
                  title: "Canada\nTraining Credit",
                  description: "Claim a tax credit for tuition and exam fees",
                  url: "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-training-credit.html",
                  site: "Canada.ca (CRA)",
                },
              ]}
            />

            {/* Potential Expenses Section */}
            <View style={styles.financeHeaderContainer}>
              <View style={styles.financeHeaderRow}>
                <Text style={styles.sectionTitleNoMargin}>
                  Potential Expenses
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPotentialExpensesInfoModal(true)}
                  accessibilityRole="button"
                  accessibilityLabel="About potential expenses"
                >
                  <MaterialIcon name="info" size={20} color={Colors.grey[400]} />
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionSubtitleNoMargin}>
                Upcoming potential expenses to consider for financial planning
              </Text>
            </View>

            {/* Required Tools Card */}
            <ExpenseCard
              id={1}
              amount="$1,900"
              title="Tools"
              detailTitle="Required Tools"
              details={[
                { label: "Tool Belt", value: "$845" },
                { label: "Drill", value: "$155" },
                { label: "Amps Meter", value: "$240" },
              ]}
              isExpanded={expandedExpenseCard === 1}
              onToggle={() =>
                setExpandedExpenseCard(expandedExpenseCard === 1 ? null : 1)
              }
            />

            {/* Certifications Card */}
            <ExpenseCard
              id={2}
              amount="$70"
              title="Certifications"
              detailTitle="Potential Good to have's"
              details={[
                { label: "WHIMS", value: "$29.30" },
                { label: "Fire and Safety", value: "$29.50" },
              ]}
              isExpanded={expandedExpenseCard === 2}
              onToggle={() =>
                setExpandedExpenseCard(expandedExpenseCard === 2 ? null : 2)
              }
            />
          </>
        )}
      </ScrollView>

      {/* End Date Info Modal */}
      {showEndDateInfoModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEndDateInfoModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <InformationalMessage message="This is an estimate end date of your completion and is subject to change as it is based on how many hours you've worked and how many are remaining which can vary" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Discrepancy Tracking Info Modal */}
      {showDiscrepancyInfoModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDiscrepancyInfoModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <InformationalMessage message="This shows the difference between actual worked hours tracked using paystubs (monthly) Vs what SkilledTradeBC has on it's portal." />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Send Discrepancy Report Modal */}
      <SendDiscrepancyReportModal
        visible={showSendDiscrepancyReportModal}
        onClose={() => setShowSendDiscrepancyReportModal(false)}
        onSend={() => {
          setShowSendDiscrepancyReportModal(false);
          setTimeout(() => {
            setShowSuccessMessage(true);
            // Slide up animation from bottom
            Animated.timing(successSlideAnimation, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();

            setTimeout(() => {
              // Slide down animation
              Animated.timing(successSlideAnimation, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                setShowSuccessMessage(false);
              });
            }, 3000);
          }, 1500);
        }}
        buttonIcon="arrow-right"
      />
      {/* Completion Details Info Modal */}
      {showCompletionDetailsInfoModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCompletionDetailsInfoModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <InformationalMessage message="The count is displayed only for practical competency, if you want to see the full list check the skills page!" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Potential Expenses Info Modal */}
      {showPotentialExpensesInfoModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPotentialExpensesInfoModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <InformationalMessage message="These are estimated expenses and are subjected to change based on a persons choice and/or situation." />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Loading Quiz Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingQuiz
            loadingTitle="Updating Data..."
            loadingContent="Please wait while we update your work information to 6 months in the future."
          />
        </View>
      )}

      {/* Notification Popup */}
      {showNotificationPopup && (
        <Animated.View
          style={[
            styles.successMessageContainer,
            {
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          <NotificationPopup
            typeName="Notification Reminder"
            date="now"
            title="BCIT Tuition Deadline"
            content="Dec 07, 2025"
          />
        </Animated.View>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <Animated.View
          style={[
            styles.successMessageBottomContainer,
            {
              transform: [{ translateY: successSlideAnimation }],
            },
          ]}
        >
          <SuccessMessage
            text="Discrepancy Report Sent Successfully"
            iconName="check"
            iconColor={Colors.orange[400]}
          />
        </Animated.View>
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
    ...Typography.sectionHeader,
    color: Colors.grey[700],
    marginBottom: 16,
    // textAlign: 'center',
    // marginTop: 8,
    // marginHorizontal: 20,
    alignSelf: "stretch",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#999",
    marginHorizontal: 20,
    marginTop: -12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
    marginHorizontal: 24,
  },
  sectionHeaderIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  financeHeaderContainer: {
    marginHorizontal: 24,
    marginTop: 8,
  },
  financeHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  sectionTitleNoMargin: {
    ...Typography.sectionHeader,
    color: Colors.grey[700],
    marginBottom: 4,
  },
  sectionSubtitleNoMargin: {
    ...Typography.smBody,
    color: Colors.black,
    marginTop: 4,
    marginBottom: 16,
  },
  infoIcon: {
    width: 20,
    height: 20,
    tintColor: "#999",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
    marginHorizontal: 20,
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
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartLabel: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  chartValue: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  chartAverage: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
    gap: 6,
  },
  averageLabel: {
    fontFamily: "SpaceGrotesk-Light",
    fontSize: 20,
    color: Colors.grey[900],
  },
  averageValue: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 20,
    color: Colors.grey[900],
  },
  averageUnit: {
    fontFamily: "SpaceGrotesk-Light",
    fontSize: 20,
    color: Colors.grey[900],
  },
  chartGraphImage: {
    width: "100%",
    height: 120,
    marginBottom: 12,
  },
  chartPeriod: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  periodText: {
    fontSize: 12,
    color: "#999",
  },
  chartImageContainer: {
    marginBottom: 24,
    marginHorizontal: 20,
  },
  chartImage: {
    width: "100%",
    height: 280,
  },
  comingSoon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  comingSoonText: {
    fontSize: 16,
    color: "#999",
  },
  averageValueContainer: {
    minHeight: 38,
    justifyContent: "center",
  },
  periodTextContainer: {
    minHeight: 14,
    justifyContent: "center",
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
  successMessageContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10001,
  },
  successMessageBottomContainer: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    zIndex: 10001,
  },
});
