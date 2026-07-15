import { LoadingQuiz } from "@/components/shared/LoadingQuiz";
import MaterialIcon from "@/components/shared/MaterialIcon";
import { Typography } from "@/constants";
import { Colors } from "@/constants/colors";
import { CommonStyles } from "@/lib/common-styles";
import { router } from "expo-router";
import React, { useEffect } from "react";
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

export default function LoadingExamScreen() {
  const insets = useSafeAreaInsets();
  const handleBackPress = () => {
    router.back();
  };

  // Once the exam is "compiled", move on to the exam itself — a mixed
  // question set covering all lines in the current level. replace() so
  // backing out of the exam doesn't land on this loading screen again.
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace({
        pathname: "/skills/quiz",
        params: { skillId: "EXAM", content: "level-exam" },
      });
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={CommonStyles.container}>
      <Image
        source={require("@/assets/images/background-grid 1.svg")}
        style={[CommonStyles.backgroundImage, { opacity: 0.15 }]}
        resizeMode="cover"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 70 + insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress} accessibilityRole="button" accessibilityLabel="Go back">
            <MaterialIcon
              name="icon-arrow-back"
              size={24}
              color={Colors.grey[900]}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}></Text>
          <View style={styles.placeholder} />
        </View>

        <LoadingQuiz
          loadingTitle="Loading Exam..."
          loadingContent="Compiling competencies and generating questions"
          height={320}
        />
        <ScrollView 
          horizontal
          style={styles.container}
          contentContainerStyle={styles.containerContent}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={352}
          snapToAlignment="start"
          contentInsetAdjustmentBehavior="never"
          overScrollMode="never"
        >
          <View style={styles.cardContainer}>
            <View style={styles.textcontainer}>
                <View style={styles.cardTitle}>
                    <MaterialIcon name="lightbulb" size={20} color={Colors.grey[500]}/>
                    <Text style={styles.titleText}>Repeat till you feel confident</Text>
                </View>
                <Text style={styles.textBody}>If a question feels tough, eliminate the answers you know are wrong first.</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image source={require("@/assets/images/card_01.png")} style={styles.image} />
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.textcontainer}>
                <View style={styles.cardTitle}>
                    <MaterialIcon name="lightbulb" size={20} color={Colors.grey[500]}/>
                    <Text style={styles.titleText}>Check your progress afterwards</Text>
                </View>
                <Text style={styles.textBody}>Compare yourself with how you've been doing and track your improvement.</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image source={require("@/assets/images/card_02.png")} style={styles.image} />
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    marginBottom: 8,
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
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 20,
    color: Colors.grey[700],
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  container: {
    marginHorizontal: 0,
    marginTop: -12
  },
  containerContent: {
    flexDirection: 'row',
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    backgroundColor: Colors.white,
    width: 340,
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderRadius: 20,
    borderColor: Colors.borderGrey,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    
  },
  textcontainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  cardTitle: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,

  },
  titleText: {
    ...Typography.contentTitle,
    color: Colors.grey[900]    
  },
  textBody: {
    ...Typography.buttonText,
    color: Colors.grey[500]
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: 280,
    height: 220,
    resizeMode: 'cover',
  }
});
