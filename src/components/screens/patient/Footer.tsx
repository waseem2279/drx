import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const Footer = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.footerContainer, { borderTopColor: colors.border }]}>
      <TextRegular
        style={[styles.footerText, { color: colors.mutedForeground }]}
      >
        {t("home.footer.commitment-message")}
        <Link href="/terms-of-service">
          <TextRegular style={[styles.textLink, { color: colors.primary }]}>
            {t("common.terms-of-service")}
          </TextRegular>
        </Link>{" "}
        {t("common.and")}
        <Link href="/privacy-policy">
          {" "}
          <TextRegular style={[styles.textLink, { color: colors.primary }]}>
            {t("common.privacy-policy")}
          </TextRegular>
        </Link>
        {t("common.period")}
      </TextRegular>
      <View style={[styles.trademark, { backgroundColor: colors.foreground }]}>
        <Image
          style={styles.logo}
          source={require("@/../assets/images/icon.png")}
          contentFit="contain"
          transition={250}
        />
        <TextSemiBold
          style={[styles.logoDescription, { color: colors.background }]}
        >
          {t("home.by-drx-genius-llc")}
        </TextSemiBold>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    alignItems: "center", // Center everything horizontally
    justifyContent: "center", // Center vertically if needed
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 16,
    marginVertical: 16,
    marginHorizontal: 16,
    textAlign: "center", // Center the text
  },
  textLink: {
    textDecorationLine: "underline",
  },
  trademark: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // Overscroll effect
    paddingBottom: 999,
    marginBottom: -999,
  },
  logo: {
    width: 64,
    height: 64,
  },
  logoDescription: {
    fontSize: 16,
  },
});
