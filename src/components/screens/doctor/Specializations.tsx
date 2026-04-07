import Pills from "@/components/Pills";
import { TextSemiBold } from "@/components/StyledText";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const Specializations = ({ doctor }: { doctor: any }) => {
  const { t } = useTranslation();

  const capitalizedSpecializations = doctor?.specializations.map(
    (spec: string) => {
      return spec.charAt(0).toUpperCase() + spec.slice(1);
    },
  );

  return (
    <View style={{ flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <TextSemiBold style={{ fontSize: 16, textAlign: "left" }}>
        {t("common.specializations")}
      </TextSemiBold>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <Pills items={capitalizedSpecializations} />
      </View>
    </View>
  );
};

export default Specializations;
