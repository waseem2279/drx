import Colors from "@/constants/Colors";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Footer from "./AddFooter";
import PageScrollView from "./PageScrollView";
import i18next from "i18next";

interface FormPageProps {
  canSubmit: boolean;
  isSubmitting: boolean;
  handleSubmit: () => void;
  submitButtonText?: string;
  children: React.ReactNode;
}

const FormPage: React.FC<FormPageProps> = ({
  canSubmit,
  isSubmitting,
  handleSubmit,
  submitButtonText = i18next.t("form.save"),
  children,
}) => {
  const { height: animatedHeight } = useGradualAnimation();

  const fakeHeightStyle = useAnimatedStyle(() => ({
    height: Math.abs(animatedHeight.value),
  }));

  return (
    <>
      <PageScrollView contentContainerStyle={styles.pageScrollViewContent}>
        {children}
      </PageScrollView>

      <Footer
        keyboardHeightShared={animatedHeight}
        canSubmit={canSubmit}
        submitting={isSubmitting}
        handleSubmit={handleSubmit}
        submitButtonText={submitButtonText}
      />

      <Animated.View style={fakeHeightStyle} />
    </>
  );
};

export default FormPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  pageScrollViewContent: {
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timesPer: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  dropdownWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
});
