import { useTheme } from "@/hooks/useTheme";
import { Text, TextProps } from "react-native";

export function TextRegular(props: TextProps) {
  const { colors } = useTheme();

  return (
    <Text
      {...props}
      allowFontScaling={false} // Even though this is bad for accessibility, scaling text breaks the layout
      style={[
        {
          color: colors.foreground,
          fontFamily: "DMSans_400Regular",
        },
        props.style,
      ]}
    />
  );
}

export function TextSemiBold(props: TextProps) {
  const { colors } = useTheme();

  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[
        { color: colors.foreground, fontFamily: "DMSans_600SemiBold" },
        props.style,
      ]}
    />
  );
}

export function TextBold(props: TextProps) {
  const { colors } = useTheme();

  return (
    <Text
      {...props}
      style={[
        { color: colors.foreground, fontFamily: "DMSans_700Bold" },
        props.style,
      ]}
    />
  );
}
