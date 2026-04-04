import Colors from "@/constants/Colors";
import {
  useAppointmentError,
  useIsFetchingAppointments,
  useStartAppointmentsListener,
  useStopAppointmentsListener,
} from "@/stores/useAppointmentStore";
import {
  useExpoPushToken,
  useNotification,
  useNotificationError,
} from "@/stores/useNotificationStore";
import { useUserData } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DoctorCalendar from "../Calendar/DoctorCalendar";
import Notifications from "../Notifications/Notifications";
import { TextRegular, TextSemiBold } from "../StyledText";
import LoadingScreen from "../LoadingScreen";

const DoctorHomeScreen = () => {
  const userData = useUserData();
  const startAppointmentsListener = useStartAppointmentsListener();
  const stopAppointmentsListener = useStopAppointmentsListener();
  const isFetchingAppointments = useIsFetchingAppointments();
  const error = useAppointmentError();
  const insets = useSafeAreaInsets();

  const notification = useNotification();
  const notificationError = useNotificationError();
  const expoPushToken = useExpoPushToken();

  useEffect(() => {
    if (!userData?.uid) return;
    startAppointmentsListener(userData.uid);

    return () => {
      stopAppointmentsListener();
    };
  }, []);

  if (isFetchingAppointments) return <LoadingScreen />;

  if (error) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#FFF", paddingTop: insets.top }}
      >
        <TextRegular style={{ textAlign: "center", marginHorizontal: 16 }}>
          There was an error fetching your appointments. Please try again later.
        </TextRegular>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Notifications />
      <View
        style={{
          marginHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: Colors.faintGrey,
        }}
      />
      <DoctorCalendar />
    </View>
  );
};

export default DoctorHomeScreen;

export const VerificationAlert = () => {
  const handleNavigate = () => {
    router.navigate("/profile");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#FDECEA",
        padding: 12,
        margin: 16,

        borderColor: "#F5C6CB",
        borderWidth: 1,
        borderRadius: 12,
      }}
    >
      <Ionicons
        name="alert-circle-outline"
        size={20}
        color="#E53935"
        style={{ marginRight: 8 }}
      />
      <TextRegular
        style={{
          color: "#B71C1C",
          fontSize: 14,
          flex: 1,
          marginRight: 16,
        }}
      >
        Please verify your doctor account to be listed to patients!
      </TextRegular>
      <TouchableOpacity
        onPress={handleNavigate}
        style={{
          backgroundColor: "#E53935",
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
          alignSelf: "flex-start",
        }}
      >
        <TextSemiBold
          style={{
            color: "white",
            fontSize: 13,
          }}
        >
          Go to Verification
        </TextSemiBold>
      </TouchableOpacity>
    </View>
  );
};

export const PendingAlert = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF4E5",
        padding: 12,
        margin: 16,
        borderColor: "#FFD49C",
        borderWidth: 1,
        borderRadius: 12,
      }}
    >
      <Ionicons
        name="hourglass-outline"
        size={20}
        color="#FFA000"
        style={{ marginRight: 8 }}
      />
      <TextRegular
        style={{
          color: "#B26A00",
          fontSize: 14,
          flex: 1,
        }}
      >
        We are currently working to review your license. We'll notify you once
        it's approved.
      </TextRegular>
    </View>
  );
};

export const MissingPublicProfileAlert = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDECEA",
        padding: 12,
        margin: 16,
        borderColor: "#F5C6CB",
        borderWidth: 1,
        borderRadius: 12,
      }}
    >
      <Ionicons
        name="alert-circle-outline"
        size={20}
        color="#E53935"
        style={{ marginRight: 8 }}
      />
      <TextRegular
        style={{
          color: "#B71C1C",
          fontSize: 14,
          flex: 1,
          marginRight: 16,
        }}
      >
        Your public profile is not yet set up. Set it up now so that patients
        can find you. you.
      </TextRegular>
    </View>
  );
};
