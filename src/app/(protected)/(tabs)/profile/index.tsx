import { TouchableOpacity, View } from "react-native";

import PageScrollView from "@/components/PageScrollView";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import UserAvatar from "@/components/UserAvatar";
import Colors from "@/constants/Colors";
import { useSession } from "@/contexts/AuthContext";
import { useUserData } from "@/stores/useUserStore";
import { Link, RelativePathString } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SubmitButton from "@/components/SubmitButton";
import { useTranslation } from "react-i18next";
import { getDoctorLinks, getPatientLinks } from "@/constants/options";
import { useEffect, useState } from "react";
import CustomIcon from "@/components/CustomIcon";
import { IconName } from "@/constants/iconsMap";
import {
  useIsFetchingPublicProfile,
  useStartPublicProfileListener,
} from "@/stores/usePublicProfileStore";
import LoadingScreen from "@/components/LoadingScreen";

const TOTAL_PADDING = 32;
const GAP = 8;

const Profile = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { signOut } = useSession();
  const userData = useUserData();
  const startPublicProfileListener = useStartPublicProfileListener();
  const isFetchingPublicProfile = useIsFetchingPublicProfile();
  const [componentWidth, setComponentWidth] = useState(0);
  const isPatient = userData?.role === "patient";

  const onLayout = (event: {
    nativeEvent: { layout: { width: number; height: number } };
  }) => {
    const { width } = event.nativeEvent.layout;
    setComponentWidth(width);
  };

  useEffect(() => {
    if (userData?.role === "doctor") {
      startPublicProfileListener();
    }
  }, []);

  if (isFetchingPublicProfile) return <LoadingScreen />;

  const cardWidth = (componentWidth - TOTAL_PADDING) / 2 - GAP / 2;

  const color = "#000";
  const links = isPatient ? getPatientLinks(t) : getDoctorLinks(t);

  return (
    <PageScrollView
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      contentContainerStyle={{
        paddingHorizontal: TOTAL_PADDING / 2,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
      onLayout={onLayout}
    >
      {/* User Card */}
      <View
        style={{
          width: "100%",
          backgroundColor: "#FFF",
          marginVertical: 16,

          paddingVertical: 32,
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,

          shadowColor: "#000", // ios
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
          elevation: 10, // android
        }}
      >
        <UserAvatar size={64} canUpload={true} />
        <View>
          <TextSemiBold style={{ fontSize: 20 }}>
            {userData?.firstName + " " + userData?.lastName}
          </TextSemiBold>
          <TextRegular
            style={{
              fontSize: 16,
              color: isPatient ? Colors.primary : Colors.gold,
              textAlign: "left",
            }}
          >
            {t(`common.${userData?.role}`)}
          </TextRegular>
        </View>
      </View>

      {/* Main Message */}
      <TextSemiBold style={{ fontSize: 20, marginBottom: 16 }}>
        {t("profile.how-can-we-help-you-userdata-firstname", {
          firstName: userData?.firstName,
        })}
      </TextSemiBold>

      {/* Links */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: GAP,
          justifyContent: "space-between",
        }}
      >
        {links.map((item, idx) => (
          // The links themselves
          <Link key={idx} href={item.url as RelativePathString} asChild>
            <TouchableOpacity
              style={{
                width: cardWidth,
                flexGrow: 1,
                height: 115,
                padding: 16,
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.light.faintGrey,
              }}
            >
              <CustomIcon
                name={item.icon as IconName}
                size={24}
                color={color}
              />
              <TextRegular
                style={{
                  fontSize: 12,
                  color: Colors.light.grey,
                  textAlign: "left",
                }}
              >
                {item.label}
              </TextRegular>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      {/* Logout button */}
      <SubmitButton
        style={{ marginTop: 16, width: "100%" }}
        text={t("button.log-out")}
        onPress={signOut}
      />
    </PageScrollView>
  );
};

export default Profile;
