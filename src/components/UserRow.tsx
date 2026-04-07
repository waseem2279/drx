import Colors from "@/constants/Colors";
import { useUserData } from "@/stores/useUserStore";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import IconButton from "./IconButton";
import { TextRegular, TextSemiBold } from "./StyledText";
import UserAvatar from "./UserAvatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const UserRow = () => {
  const userData = useUserData();
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
        backgroundColor: "#FFF",
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
  const color = role === "patient" ? Colors.primary : Colors.gold;

  return (
    <View style={styles.welcomeContainer}>
      <TextRegular style={styles.welcomeText}>
        {t("header.welcome-back")}
      </TextRegular>
      <View style={styles.textContainer}>
        <TextSemiBold style={styles.nameText}>{name}</TextSemiBold>
        <TextSemiBold
          style={[
            styles.roleText,
            {
              color,
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
    color: Colors.grey,
    fontSize: 14,
  },
  textContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  nameText: {
    fontSize: 20,
    color: Colors.black,
  },
  roleText: {
    fontSize: 12,
  },
});
