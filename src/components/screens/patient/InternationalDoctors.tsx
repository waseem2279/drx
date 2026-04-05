import CustomIcon from "@/components/CustomIcon";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { getDoctorCountries } from "@/constants/options";
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

type Item = {
  name: string;
  image: ImageSourcePropType;
  filter: string;
  backgroundColor: string;
};

const InternationalDoctors = () => {
  const { t, i18n } = useTranslation();
  const countries = useMemo(() => getDoctorCountries(t), [t]);
  const onPress = (filter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    router.push({
      pathname: `/filtered`,
      params: {
        filter: filter,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TextSemiBold style={styles.header}>
        {t("home.go-international")}
      </TextSemiBold>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {countries.map((item: Item, index: number) => (
          <TouchableOpacity
            onPress={() => onPress(item.filter)}
            key={index}
            style={styles.item}
          >
            <View
              style={[
                styles.countryImage,
                { backgroundColor: item.backgroundColor },
              ]}
            >
              <Image
                style={styles.image}
                source={item.image}
                contentFit="contain"
                transition={1000}
              />
            </View>
            <View style={styles.bottomText}>
              <TextSemiBold style={styles.text}>{item.name}</TextSemiBold>
              <CustomIcon
                name={i18n.dir() === "ltr" ? "arrow-forward" : "arrow-back"}
                size={20}
                color="#000"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default InternationalDoctors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
    paddingBottom: 12,
    borderBottomColor: Colors.faintGrey,
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
    justifyContent: "space-between",
    height: 130,
    width: 175,
  },
  countryImage: {
    width: "100%",
    height: 105,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  bottomText: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
});
