import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from "react-native";
import React from "react";
import { TextSemiBold } from "./StyledText";
import { useTheme } from "@/hooks/useTheme";

type SubmitButtonProps = {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary";
};

const SubmitButton = ({
  disabled,
  loading,
  text,
  onPress,
  style,
  variant = "primary",
}: SubmitButtonProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isSecondary = variant === "secondary";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary ? styles.secondaryButton : styles.primaryButton,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator
          color={isSecondary ? colors.foreground : colors.primaryForeground}
        />
      ) : (
        <TextSemiBold
          style={[
            styles.text,
            isSecondary ? styles.secondaryText : styles.primaryText,
          ]}
        >
          {text}
        </TextSemiBold>
      )}
    </TouchableOpacity>
  );
};

export default SubmitButton;

const createStyles = (colors: any) =>
  StyleSheet.create({
    button: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },

    // Primary
    primaryButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    primaryText: {
      color: colors.primaryForeground,
    },

    // Secondary
    secondaryButton: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    secondaryText: {
      color: colors.foreground,
    },

    // Shared
    text: {
      fontSize: 16,
      textAlign: "center",
    },
  });
