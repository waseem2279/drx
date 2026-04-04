import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SubmitButton from "./SubmitButton";
import i18next from "i18next";

const Footer = ({
  keyboardHeightShared,
  canSubmit,
  handleSubmit,
  submitting,
  submitButtonText = i18next.t("form.save"),
}: {
  keyboardHeightShared: SharedValue<number>;
  canSubmit: boolean;
  submitting: boolean;
  handleSubmit?: () => void;
  submitButtonText?: string;
}) => {
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    const basePadding = 16;
    const safeAreaBottom = insets.bottom;

    // Smoothly interpolate between full padding and minimal when keyboard shows
    const paddingBottom = interpolate(
      keyboardHeightShared.value,
      [0, 350], // Find another way instead of hardcoding 350
      [basePadding + safeAreaBottom, basePadding]
    );

    return {
      paddingBottom,
    };
  }, [insets.bottom]);

  return (
    <Animated.View style={[footer.container, animatedStyle]}>
      <SubmitButton
        text={submitButtonText}
        disabled={!canSubmit || submitting}
        loading={submitting}
        onPress={() => {
          if (canSubmit && !submitting) {
            handleSubmit?.();
          }
        }}
      />
    </Animated.View>
  );
};

export default Footer;

const footer = StyleSheet.create({
  container: {
    padding: 16,
    borderTopColor: Colors.faintGrey,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
  },
});
