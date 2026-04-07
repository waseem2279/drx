import { useUserData } from "@/stores/useUserStore";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import IconButton from "./IconButton";
import { TextRegular, TextSemiBold } from "./StyledText";
import UserAvatar from "./UserAvatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

const UserRow = () => {
  const userData = useUserData();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!userData) {
    return null;
  }

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: insets.top,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <WelcomeMessage
        name={userData.firstName + " " + userData.lastName}
        role={userData.role}
      />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <IconButton
          name={"notification-bell"}
          onPress={() => {
            router.navigate("/(protected)/notifications");
          }}
          iconColor={colors.primary}
        />
        <UserAvatar
          size={40}
          canUpload={false}
          onPressFallback={() => router.navigate("/(protected)/(tabs)/profile")}
        />
      </View>
    </View>
  );
};

const WelcomeMessage = ({ name, role }: { name: string; role: string }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.welcomeContainer}>
      <TextRegular
        style={[styles.welcomeText, { color: colors.mutedForeground }]}
      >
        {t("header.welcome-back")}
      </TextRegular>
      <View style={styles.textContainer}>
        <TextSemiBold style={styles.nameText}>{name}</TextSemiBold>
        <TextSemiBold
          style={[
            styles.roleText,
            {
              color: colors.primary,
            },
          ]}
        >
          {t(`common.${role}`)}
        </TextSemiBold>
      </View>
    </View>
  );
};

export default UserRow;

const styles = StyleSheet.create({
  welcomeContainer: { justifyContent: "center", alignItems: "flex-start" },
  welcomeText: {
    fontSize: 14,
  },
  textContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  nameText: {
    fontSize: 20,
  },
  roleText: {
    fontSize: 12,
  },
});
