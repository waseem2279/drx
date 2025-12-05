import Pills from "@/components/Pills";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { getSpecializations } from "@/constants/options";
import useAppContent from "@/hooks/useAppContent";
import i18next from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const Specializations = ({ doctor }: { doctor: any }) => {
  const { t } = useTranslation();
  // const { specialties } = useAppContent();

  // const specializationMap = Object.fromEntries(
  //   getSpecializations(i18next.t).map((item) => [item.value, item.label])
  // );

  // // Map the specialization IDs to their names
  // const specializations = doctor?.specializations
  //   .map((specId: string) => specializationMap[specId])
  //   .filter(Boolean);

  return (
    <View style={{ flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <TextSemiBold style={{ fontSize: 16, color: "#000", textAlign: "left" }}>
        {t("common.specializations")}
      </TextSemiBold>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <Pills items={doctor?.specializations} />
      </View>
    </View>
  );
};

export default Specializations;
