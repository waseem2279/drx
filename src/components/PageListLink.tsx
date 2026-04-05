import Colors from "@/constants/Colors";
import { LinkProps, RelativePathString, router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextRegular, TextSemiBold } from "./StyledText";
import CustomIcon from "./CustomIcon";
import { IconName } from "@/constants/iconsMap";
import { useTranslation } from "react-i18next";

export type IconProperties = {
  name: IconName;
  color: string;
};

export type PageListLinkProps = {
  title: string;
  description: string;
  href?: RelativePathString | LinkProps["href"];
  onPress?: () => void;
  icon?: IconProperties;
};

const PageListLink = ({
  title,
  description,
  href,
  onPress,
  icon,
}: PageListLinkProps) => {
  const { i18n } = useTranslation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (href) {
      router.navigate(href);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessibilityRole="button"
      style={styles.container}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <TextSemiBold style={styles.title}>{title}</TextSemiBold>
            {!!icon && (
              <CustomIcon name={icon.name} size={20} color={icon.color} />
            )}
          </View>
          <TextRegular style={styles.description}>{description}</TextRegular>
        </View>
        <CustomIcon
          name={i18n.dir() === "ltr" ? "chevron-right" : "chevron-left"}
          size={24}
          color="#000"
        />
      </View>
    </TouchableOpacity>
  );
};

export default PageListLink;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.light.faintGrey,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flexShrink: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 16,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
});
