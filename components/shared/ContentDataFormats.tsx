import MaterialIcon from "@/components/shared/MaterialIcon";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface DataItem {
    label: string;
    value: string;
}

interface DateItem {
    label: string;
    value: string;
}

interface ContentDataFormatsProps {
    mainItems: DataItem[];
    dateItems?: DateItem[];
    isLoading?: boolean;
    onInfoPress?: () => void;
}

export const ContentDataFormats: React.FC<ContentDataFormatsProps> = ({
    mainItems,
    dateItems,
    isLoading = false,
    onInfoPress,
}) => {
    // ------------------------
    // Skeleton Loading Animation
    // ------------------------
    const skeletonOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isLoading) {
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(skeletonOpacity, {
                        toValue: 0.3,
                        duration: 800,
                        useNativeDriver: false,
                    }),
                    Animated.timing(skeletonOpacity, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: false,
                    }),
                ])
            );

            pulseAnimation.start();
            return () => pulseAnimation.stop();
        }
    }, [isLoading]);

    const SkeletonText = ({
        width,
        height,
    }: {
        width: number;
        height: number;
    }) => (
        <Animated.View
            style={[
                styles.skeletonText,
                { width, height, opacity: skeletonOpacity },
            ]}
        />
    );

    // ------------------------
    // Countdown Parsing
    // ------------------------
    const parseCountdown = (value: string) => {
        const match = value.match(/(\d+)\s+(\w+)/);
        if (match) {
            return { number: match[1], unit: match[2] };
        }
        return null;
    };

    // ------------------------
    // Component Render
    // ------------------------
    return (
        <View style={styles.container}>
            <View>
                {mainItems.map((item, index) => {
                    const countdown = parseCountdown(item.value);
                    const isCountdownField = item.label === "Countdown (Est.)";

                    return (
                        <View
                            key={index}
                            style={index > 0 ? { marginTop: 20 } : undefined}
                        >
                            <Text style={styles.label}>{item.label}</Text>

                            <View
                                style={
                                    index === 1
                                        ? styles.valueBigContainer
                                        : styles.valueMediumContainer
                                }
                            >
                                {/* Skeleton Loader */}
                                {isLoading && isCountdownField ? (
                                    <SkeletonText
                                        width={80}
                                        height={index === 1 ? 32 : 24}
                                    />
                                ) : countdown ? (
                                    // Parsed countdown display (number + unit)
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "baseline",
                                        }}
                                    >
                                        <Text style={styles.countdownNumber}>
                                            {countdown.number}
                                        </Text>
                                        <Text style={styles.countdownUnit}>
                                            {" "}
                                            {countdown.unit}
                                        </Text>
                                    </View>
                                ) : (
                                    // Normal value display
                                    <Text
                                        style={
                                            index === 1
                                                ? styles.valueBig
                                                : styles.valueMedium
                                        }
                                    >
                                        {item.value}
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* ------------------------ */}
            {/* DATE ITEMS SECTION       */}
            {/* ------------------------ */}
            {dateItems && dateItems.length > 0 && (
                <View style={styles.dateRow}>
                    {dateItems.map((item, index) => (
                        <View
                            key={index}
                            style={styles.dateBox}
                        >
                            <View style={styles.dateLabelRow}>
                                <Text
                                    style={
                                        index === 1
                                            ? styles.dateLabel400
                                            : styles.dateLabel
                                    }
                                >
                                    {item.label}
                                </Text>

                                {index === 1 && (
                                    <TouchableOpacity onPress={onInfoPress} accessibilityRole="button" accessibilityLabel="About the estimated end date">
                                        <MaterialIcon
                                            name="info"
                                            size={16}
                                            color={Colors.grey[400]}
                                            style={{ marginLeft: 4 }}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.dateValueContainer}>
                                {isLoading && item.label === "Est. End Date" ? (
                                    <SkeletonText
                                        width={100}
                                        height={24}
                                    />
                                ) : (
                                    <Text style={styles.dateValue}>
                                        {item.value}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
        marginHorizontal: 20,
        flexDirection: "column",
        gap: 20,
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
    label: {
        ...Typography.contentTitle,
        color: Colors.grey[300],
        marginBottom: 4,
    },
    valueMedium: {
        ...Typography.contentMedium,
        color: Colors.grey[700],
    },
    valueBig: {
        ...Typography.contentBold,
        color: Colors.grey[900],
    },
    countdownNumber: {
        ...Typography.contentBold,
        color: Colors.grey[900],
    },
    countdownUnit: {
        ...Typography.contentSuffix,
        color: Colors.grey[900],
    },
    dateRow: {
        flexDirection: "row",
        // marginTop: 20,
        gap: 16,
    },
    dateBox: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        padding: 16,
        width: 154,
        height: 76,
    },
    dateLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    dateLabel: {
        ...Typography.contentTitle,
        color: Colors.grey[400],
    },
    dateLabel400: {
        ...Typography.contentTitle,
        color: Colors.grey[400],
    },
    dateValue: {
        ...Typography.bigBody,
        color: Colors.grey[700],
    },
    valueMediumContainer: {
        minHeight: 24,
        justifyContent: "center",
    },
    valueBigContainer: {
        minHeight: 32,
        justifyContent: "center",
    },
    dateValueContainer: {
        minHeight: 24,
        justifyContent: "center",
    },
    skeletonText: {
        backgroundColor: Colors.grey[200],
        borderRadius: 4,
    },
});
