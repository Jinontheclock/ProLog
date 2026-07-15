import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/shared/Buttons";
import { Colors } from "@/constants/colors";
import { CommonStyles } from "@/lib/common-styles";

export default function LoginScreen() {
  return (
    <SafeAreaView style={[CommonStyles.container]}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        //   backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: -1,
        }}
      />
        <View style={styles.container}>
          {/* Login content will go here */}
          <View style={styles.logo}>
            <Image
              style={styles.image}
              source={require("@/assets/images/login_logo.png")}
            />
          </View>
          <View style={styles.slogan}>
            <Text style={styles.sloganText}>Know Where You Stand.</Text>
            <Text style={styles.sloganText}>See Where You're Going.</Text>
          </View>
          <View style={styles.buttonContainer}>
            {/* portfolio visitors can skip straight into the app */}
            <Button
              text="Start Demo"
              variant="secondary"
              fullWidth={true}
              onPress={() => router.push("/(tabs)/Dashboard")}
            />
            <Button
              text="Sign up"
              variant="primary"
              fullWidth={true}
              onPress={() => router.push("/login_credentials")}
            />
            <Button
              text="Login"
              variant="dark"
              fullWidth={true}
              onPress={() => router.push("/(tabs)/Dashboard")}
            />
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background?.default || "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  slogan: {},
  sloganText: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 28,
    lineHeight: 32,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 16,
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  logo: {},
  image: {
    marginTop: 100,
    marginBottom: 40,
    width: 280,
    height: 220,
    resizeMode: "contain",
  },
});
