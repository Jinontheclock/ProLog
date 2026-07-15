import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/shared/Buttons";
import { LoadingQuiz } from "@/components/shared/LoadingQuiz";
import MaterialIcon from "@/components/shared/MaterialIcon";
import { Typography } from "@/constants";
import { Colors } from "@/constants/colors";
import { CommonStyles } from "@/lib/common-styles";

export default function LoginCredentialsScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleEmailFocus = () => {
    setEmail("ujung@my.bcit.ca");
    setPassword("**************");
    setReEnterPassword("**************");
  };

  const handlePasswordFocus = () => {
    setPassword("**************");
  };

  const handleReEnterPasswordFocus = () => {
    setReEnterPassword("**************");
  };

  const isFormComplete =
    email.trim() !== "" &&
    password.trim() !== "" &&
    reEnterPassword.trim() !== "";

  const handleCreateAccount = () => {
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
      router.push("/Dashboard");
    }, 1500);
  };

  return (
    <SafeAreaView style={[CommonStyles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress} accessibilityRole="button" accessibilityLabel="Go back">
          <MaterialIcon
            name="icon-arrow-back"
            size={24}
            color={Colors.grey[900]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {isLoading ? (
          <LoadingQuiz isLoading={true} loadingTitle="Creating Profile..." loadingContent="Please wait while we gather all required information to get you started." />
        ) : (
          <>
            {/* Login content will go here */}
            <View style={styles.logo}>
              <Image
                style={styles.image}
                source={require("@/assets/images/login_logo.png")}
              />
            </View>
            <View style={styles.loginDetails}>
              <Text style={styles.loginInfo}>
                ProLog connects directly with SkilledTradesBC. Log in with your
                SkilledTradesBC account to get started.
              </Text>
              <View style={styles.inputSection}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.grey[300]}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={handleEmailFocus}
                />
              </View>
              <View style={styles.inputSection}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.grey[300]}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={handlePasswordFocus}
                  secureTextEntry={true}
                />
              </View>
              <View style={styles.inputSection}>
                <Text style={styles.label}>Re-Enter Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor={Colors.grey[300]}
                  value={reEnterPassword}
                  onChangeText={setReEnterPassword}
                  onFocus={handleReEnterPasswordFocus}
                  secureTextEntry={true}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                text="Create Account"
                variant={isFormComplete ? "primary" : "light"}
                fullWidth={true}
                onPress={isFormComplete ? handleCreateAccount : undefined}
                disabled={!isFormComplete}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    zIndex: 10,
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
  placeholder: {
    width: 44,
    height: 44,
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  loginDetails: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
  loginInfo: {
    ...Typography.smBody,
  },
  inputSection: {
    // marginBottom: 16,
    width: "100%",
  },
  label: {
    ...Typography.contentTitle,
    color: Colors.grey[500],
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.grey[50],
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    width: 316,
    ...Typography.bigBody,
    color: Colors.grey[900],
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
  },
  image: {
    top: 0,
    marginTop: -22,
    marginBottom: 32,
    width: 280,
    height: 220,
    resizeMode: "contain",
  },
});
