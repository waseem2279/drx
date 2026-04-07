import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { TextRegular, TextSemiBold } from "../StyledText";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { useUserData } from "@/stores/useUserStore";
import parsePhoneNumberFromString from "libphonenumber-js";

const AddPhone = () => {
  const { t } = useTranslation();
  const userData = useUserData();

  const phone = parsePhoneNumberFromString(userData?.phoneNumber ?? "");

  const handlePress = useCallback(() => {
    router.navigate("/(protected)/(modals)/add-phone");
  }, []);

  return (
    <View style={styles.addPhoneContainer}>
      <TextRegular style={styles.label}>{t("form.phone-number")}</TextRegular>
      <View style={styles.phoneInfo}>
        {userData?.phoneNumber && (
          <TextRegular style={styles.phoneNumber}>
            {phone?.formatNational()}
          </TextRegular>
        )}

        <TouchableOpacity onPress={handlePress}>
          <TextSemiBold style={styles.addButton}>
            {userData?.phoneNumber ? t("common.edit") : t("common.add")}
          </TextSemiBold>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddPhone;

const styles = StyleSheet.create({
  addPhoneContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  phoneNumber: {
    fontSize: 14,
    color: Colors.black,
  },
  phoneInfo: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    fontSize: 14,
    color: Colors.black,
    textDecorationLine: "underline",
  },
});
