import CustomIcon from "@/components/CustomIcon";
import { IconName } from "@/constants/iconsMap";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { Href, router } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { getPatientActions } from "@/constants/options";
import {
  FilterState,
  useClearAndSetFilters,
} from "@/stores/useFilterStore";

type PatientActionButton = {
  name: string;
  description: string;
  icon: string;
  href: Href;
  filters: FilterState;
};

const PatientActions = () => {
  const { t } = useTranslation();
  const clearAndSetFilters = useClearAndSetFilters();
  const patientActions = useMemo(() => getPatientActions(t), [t]);

  const onPress = (href: Href, filters: FilterState) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearAndSetFilters(filters);

    // Redirect here
    router.navigate(href, { withAnchor: true });
  };

  return (
    <View style={styles.container}>
      <TextSemiBold style={styles.header}>
        {t("home.patient-actions")}
      </TextSemiBold>
      {patientActions.map((item: PatientActionButton, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => onPress(item.href, item.filters)}
          style={styles.action}
        >
          <CustomIcon
            name={item.icon as IconName}
            size={24}
            color={Colors.black}
          />
          <View style={styles.actionRight}>
            <TextSemiBold style={styles.actionName}>{item.name}</TextSemiBold>
            <TextRegular style={styles.actionDescription}>
              {item.description}
            </TextRegular>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PatientActions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 16,
  },
  actionName: {
    fontSize: 14,
    color: Colors.black,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.grey,
  },
  action: {
    width: "100%",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.faintGrey,
  },
  actionRight: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
