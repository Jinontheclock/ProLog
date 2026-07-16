import { ButtonButtonBar } from "@/components/shared/ButtonButtonBar";
import { LoadingQuiz } from "@/components/shared/LoadingQuiz";
import MaterialIcon from "@/components/shared/MaterialIcon";
import QuizHeader from "@/components/shared/quiz/QuizHeader";
import QuizOption from "@/components/shared/quiz/QuizOption";
import QuizProgressBar from "@/components/shared/quiz/QuizProgressBar";
import QuizQuestionContainer from "@/components/shared/quiz/QuizQuestionContainer";
import QuizResults from "@/components/shared/QuizResults";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/design-tokens";
import { Typography } from "@/constants/typography";
import { CommonStyles } from "@/lib/common-styles";
import { showAlert } from "@/lib/web-alert";
import { completionStore } from "@/lib/completion-store";
import { generateQuiz, QuizQuestion } from "@/lib/quizApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Load API key from environment variable
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";

const QuizPage: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { skillId, content } = useLocalSearchParams<{
    skillId: string;
    content: string;
  }>();

  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Question state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [recordedToChecklist, setRecordedToChecklist] = useState(false);

  // Passing a competency quiz (80%+) records the sign-off in the checklist.
  // The practice exam ("EXAM") spans many competencies, so it never records.
  useEffect(() => {
    if (!isCompleted || recordedToChecklist) return;
    if (!skillId || skillId === "EXAM" || questions.length === 0) return;
    if (score / questions.length < 0.8) return;

    (async () => {
      await completionStore.waitForInitialization();
      await completionStore.setCompleted(skillId, true);
      setRecordedToChecklist(true);
    })();
  }, [isCompleted, recordedToChecklist, skillId, score, questions.length]);

  // Load quiz questions on component mount
  useEffect(() => {
    const loadQuiz = async () => {
      if (!skillId || !content) {
        setError("Missing skill content");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const generatedQuestions = await generateQuiz(
          skillId,
          content,
          OPENAI_API_KEY
        );

        if (generatedQuestions.length !== 5) {
          throw new Error(
            `Expected 5 questions, got ${generatedQuestions.length}`
          );
        }

        setQuestions(generatedQuestions);
        setError(null);
      } catch (err) {
        console.error("Failed to load quiz:", err);
        setError(err instanceof Error ? err.message : "Failed to load quiz");

        // Show error alert and go back
        showAlert(
          "Quiz Error",
          "Failed to generate quiz questions. Please try again later.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [skillId, content]);

  const handleOptionPress = (option: string) => {
    if (!isAnswered) {
      setSelectedOption(option);
    }
  };

  const handleCheck = () => {
    if (selectedOption && !isAnswered && questions.length > 0) {
      setIsAnswered(true);
      if (selectedOption === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz completed - show results
      setIsCompleted(true);
    }
  };

  const isLastQuestion =
    questions.length > 0 && currentQuestion === questions.length - 1;

  // Show loading screen while generating quiz
  if (isLoading) {
    return (
      <SafeAreaView style={CommonStyles.container}>
        <Image
          source={require("@/assets/images/background-grid 1.svg")}
          style={[CommonStyles.backgroundImage, { opacity: 0.12 }]}
          resizeMode="cover"
        />
        <View style={styles.loadingContainer}>
          <LoadingQuiz
            loadingTitle="Generating Quiz..."
            loadingContent="Creating personalized questions based on your skill content. This may take a moment."
          />
        </View>
      </SafeAreaView>
    );
  }

  // Handle quiz retake
  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setRecordedToChecklist(false);
  };

  // Show quiz results when completed
  if (isCompleted) {
    return (
      <SafeAreaView style={CommonStyles.container}>
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          onBack={() => router.back()}
          onRetakeQuiz={handleRetakeQuiz}
          recordedToChecklist={recordedToChecklist}
        />
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || questions.length === 0) {
    return (
      <SafeAreaView style={CommonStyles.container}>
        <Image
          source={require("@/assets/images/background-grid 1.svg")}
          style={CommonStyles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Quiz</Text>
          <Text style={styles.errorMessage}>
            {error || "No questions available"}
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render quiz content
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
          paddingBottom: 100 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Exit quiz"
          >
            <MaterialIcon
              name="icon-arrow-back"
              size={24}
              color={Colors.grey[700]}
            />
          </TouchableOpacity>
          <QuizHeader title={`${currentQuestion + 1} of ${questions.length}`} />
          <View style={{ width: 40 }} />
        </View>

        {/* Quiz Content */}
        <View style={styles.quizContainer}>
          <QuizProgressBar
            progress={currentQuestion + 1}
            total={questions.length}
          />

          <QuizQuestionContainer
            question={questions[currentQuestion].question}
          />

          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <QuizOption
                key={index}
                label={option}
                isSelected={selectedOption === option}
                isCorrect={
                  isAnswered &&
                  option === questions[currentQuestion].correctAnswer
                }
                isIncorrect={
                  isAnswered &&
                  selectedOption === option &&
                  option !== questions[currentQuestion].correctAnswer
                }
                onPress={() => handleOptionPress(option)}
                disabled={isAnswered}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Button Bar */}
      <View style={styles.stickyButtonContainer}>
        {!isAnswered ? (
          <ButtonButtonBar
            onComplete={handleCheck}
            completeText="Check Answer"
            singleButton={true}
            isCompleted={!selectedOption}
          />
        ) : (
          <ButtonButtonBar
            onComplete={handleNext}
            completeText={isLastQuestion ? "Finish Quiz" : "Next Question"}
            singleButton={true}
            isCompleted={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.base,
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
  },
  headerTitle: {
    ...Typography.sectionHeader,
    color: Colors.grey[700],
  },
  quizContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    gap: Spacing.lg,
  },

  optionsContainer: {
    gap: Spacing.sm,
  },

  stickyButtonContainer: {
    position: "absolute",
    bottom: -16,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  errorTitle: {
    ...Typography.sectionHeader,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  errorMessage: {
    ...Typography.bigBody,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  errorButtonText: {
    ...Typography.buttonText,
    color: Colors.white,
  },
});

export default QuizPage;
