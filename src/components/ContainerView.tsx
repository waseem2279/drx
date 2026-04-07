import { useTheme } from "@/hooks/useTheme";
import {
  View,
  StyleSheet,
  ViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";

type ContainerViewProps = ViewProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ContainerView = ({ children, style, ...props }: ContainerViewProps) => {
  const { colors } = useTheme();

  return (
    <View
      {...props}
      style={[styles.container, { backgroundColor: colors.background }, style]}
    >
      {children}
    </View>
  );
};

export default ContainerView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
