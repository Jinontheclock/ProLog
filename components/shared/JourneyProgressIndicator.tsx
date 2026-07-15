import { JourneyRipple } from "@/components/shared/JourneyRipple";
import { Typography } from "@/constants/typography";
import React from "react";
import { Image, ImageStyle, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

type JourneyIndicatorVariant = 'completed' | 'inProgress' | 'locked' | 'unlocked';

interface JourneyProgressIndicatorProps {
  image: any; // Could be more specific with ImageSourcePropType
  title: string;
  subtext: string;
  containerStyle?: ViewStyle | ViewStyle[];
  imageStyle?: ImageStyle | ImageStyle[];
  textContainerStyle?: ViewStyle | ViewStyle[];
  titleStyle?: TextStyle | TextStyle[];
  subtextStyle?: TextStyle | TextStyle[];
  pulse?: boolean; // looping ripple behind the icon (in-progress marker)
}


export default function JourneyProgressIndicator({
  image,
  title,
  subtext,
  containerStyle,
  imageStyle,
  pulse = false,
}: JourneyProgressIndicatorProps) {
    // The ripple wrapper has to hug the image exactly, so the image's
    // margins move onto the wrapper and the rings align with the artwork
    const flatImageStyle = StyleSheet.flatten(imageStyle) || {};
    const { marginTop, marginBottom, marginLeft, marginRight, ...innerImageStyle } =
      flatImageStyle as ImageStyle;

    return (
        <View style={containerStyle}>
            {pulse ? (
              <View style={{ marginTop, marginBottom, marginLeft, marginRight }}>
                <JourneyRipple />
                <Image source={image} style={innerImageStyle} />
              </View>
            ) : (
              <Image source={image} style={imageStyle} />
            )}
            <View style={styles.textContainerStyle}>
                <Text style={styles.titleStyle}>{title}</Text>
                <Text style={styles.subtextStyle}>{subtext}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textContainerStyle: {
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            },
            titleStyle:{
              ...Typography.contentSubtitle
            },
            subtextStyle:{
              ...Typography.contentTitle
            }
})
