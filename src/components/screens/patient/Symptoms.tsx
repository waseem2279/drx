import { TextSemiBold } from "@/components/StyledText";
import { getPatientSymptoms } from "@/constants/options";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type TabItem = {
  name: string;
  image: ImageSourcePropType;
  filter: string | undefined;
};

const Symptoms = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const patientSymptoms = useMemo(() => getPatientSymptoms(t), [t]);
  const onPress = (item: TabItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Navigate with query
    router.navigate({
      pathname: "/filtered",
      params: {
        filter: item.filter,
      },
    });
  };
  return (
    <View
      style={[styles.symptomsContainer, { borderBottomColor: colors.border }]}
    >
      <TextSemiBold style={styles.header}>
        {t("home.what-can-we-help-with")}
      </TextSemiBold>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {patientSymptoms.map((item: TabItem, index: number) => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            key={index}
            style={styles.item}
          >
            <Image
              style={styles.image}
              source={item.image}
              contentFit="cover"
              transition={250}
            />
            <TextSemiBold style={styles.text}>{item.name}</TextSemiBold>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Symptoms;

const styles = StyleSheet.create({
  symptomsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  header: {
    fontSize: 16,
    marginHorizontal: 16,
  },
  scrollViewContentContainer: {
    minWidth: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  item: {
    flexDirection: "column",
    alignItems: "center",
    width: 64,
  },
  image: {
    width: 64,
    height: 64,
  },
  text: {
    fontSize: 10,
    color: "#000",
    textAlign: "center",
  },
});
