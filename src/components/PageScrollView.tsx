import React, { ReactNode } from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";

type PageScrollViewProps = ScrollViewProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const PageScrollView = ({
  children,
  style,
  contentContainerStyle,
  ...props
}: PageScrollViewProps) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      {...props}
      style={[styles.container, { backgroundColor: colors.background }, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
};

export default PageScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    position: "relative",
  },
});
