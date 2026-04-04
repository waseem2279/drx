import { StyleSheet } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { getDoctorLabels } from "@/constants/options";
import { TextSemiBold } from "../StyledText";

const DoctorLabel = ({ label }: { label: string }) => {
  const { t } = useTranslation();

  const displayLabel = getDoctorLabels(t).filter(
    (item) => item.value === label
  )[0];
  const labelText = displayLabel?.label;
  const labelColor = displayLabel?.color;

  return (
    <TextSemiBold style={[styles.label, { color: labelColor }]}>
      {labelText}
    </TextSemiBold>
  );
};

export default DoctorLabel;

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
  },
});
