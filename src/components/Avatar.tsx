import Colors from "@/constants/Colors";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { TextSemiBold } from "./StyledText";
import { Image } from "expo-image";

const Avatar = ({
  presence = null,
  pointerEvents = "auto",
  onPress = null,
  size,
  source = null,
  initials = "",
  color = "#ddd",
  loading = false,
}: {
  presence?: "online" | "offline" | null; // Make it more robust in the future so null is not an option
  pointerEvents?: "auto" | "box-none" | "none" | "box-only";
  onPress?: null | (() => void);
  size: number;
  source?: string | number | null;
  initials?: string;
  color?: string;
  loading?: boolean;
}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (loading) {
      opacity.value = withRepeat(
        withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      opacity.value = withTiming(1);
    }
  }, [loading, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Determine the presence dot color
  const presenceColor = presence === "online" ? Colors.green : null;

  return (
    <Pressable
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: 9999,
      }}
      onPress={onPress}
      pointerEvents={pointerEvents}
    >
      {loading ? (
        <Animated.View
          style={[
            {
              width: "100%",
              height: "100%",
              backgroundColor: "#ccc",
              borderRadius: 9999,
            },
            animatedStyle,
          ]}
        />
      ) : source ? (
        <>
          <Image
            source={typeof source === "string" ? { uri: source } : source}
            style={{ width: "100%", height: "100%", borderRadius: 9999 }}
            contentFit="cover"
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </>
      ) : (
        <TextSemiBold
          style={{
            fontSize: size * 0.4,
            color: "#555",
            textAlign: "center",
          }}
        >
          {initials}
        </TextSemiBold>
      )}

      {/* Presence dot */}
      {presenceColor && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.3,
            height: size * 0.3,
            backgroundColor: presenceColor,
            borderRadius: 9999,
            borderWidth: 2,
            borderColor: "#fff",
          }}
        />
      )}
    </Pressable>
  );
};

export default Avatar;
