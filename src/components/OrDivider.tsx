import { View, StyleSheet } from "react-native";
import React from "react";
import Divider from "./Divider";
import { TextSemiBold } from "./StyledText";
import { useTranslation } from "react-i18next";

const OrDivider = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.orContainer}>
      <Divider />
      <TextSemiBold style={styles.orText}>{t("login.or")}</TextSemiBold>
      <Divider />
    </View>
  );
};

export default OrDivider;

const styles = StyleSheet.create({
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#444",
  },
});
