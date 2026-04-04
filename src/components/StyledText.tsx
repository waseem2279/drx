import { Text, TextProps } from "react-native";

export function TextRegular(props: TextProps) {
  return (
    <Text
      {...props}
      allowFontScaling={false} // Even though this is bad for accessibility, scaling text breaks the layout
      style={[
        props.style,
        {
          fontFamily: "DMSans_400Regular",
        },
      ]}
    />
  );
}

export function TextSemiBold(props: TextProps) {
  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[props.style, { fontFamily: "DMSans_600SemiBold" }]}
    />
  );
}

export function TextBold(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "DMSans_700Bold" }]} />
  );
}
