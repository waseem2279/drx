import Avatar from "@/components/Avatar";
import IconButton from "@/components/IconButton";
import CustomIcon from "@/components/CustomIcon";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useAppointmentsByDate } from "@/stores/useAppointmentStore";
import { getChatId } from "@/utils/chatUtils";
import { format, parseISO } from "date-fns";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { locales } from "@/constants/locales";
import i18next from "i18next";
import { useTheme } from "@/hooks/useTheme";

const DayInfo = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { date } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const appointmentsByDate = useAppointmentsByDate(date as string);

  return (
    <View style={[page.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          header: () => <DayInfoHeader date={date as string} />,
        }}
      />
      <ScrollView
        style={{ flex: 1, paddingBottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {appointmentsByDate.length === 0 && (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 32,
            }}
          >
            <CustomIcon
              name="sentiment-satisfied"
              color={Colors.grey}
              size={24}
            />
            <TextSemiBold
              style={{
                fontSize: 16,
                width: 150,
                textAlign: "center",
                color: Colors.grey,
              }}
            >
              {t("day.no-appointments-for-this-date")}
            </TextSemiBold>
          </View>
        )}
        {appointmentsByDate.map((appointment) => (
          <TouchableOpacity
            key={appointment.id}
            style={{
              marginBottom: 16,
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightGrey2,
              paddingVertical: 16,
            }}
            onPress={() =>
              router.replace({
                pathname: `/(protected)/(chat)/[chatId]`,
                params: {
                  chatId: getChatId(
                    appointment.patientId,
                    appointment.doctorId,
                  ),
                },
              })
            }
          >
            <View style={{ flexDirection: "column", gap: 8 }}>
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <Avatar
                  source={appointment.patient.image}
                  size={24}
                  initials={
                    appointment.patient.firstName[0] +
                    appointment.patient.lastName[0]
                  }
                />
                <TextSemiBold style={{ fontSize: 16 }}>
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </TextSemiBold>
              </View>

              <TextSemiBold style={{ fontSize: 12, textAlign: "left" }}>
                {appointment.date.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                , {appointment.durationMinutes} {t("common.minutes")}
              </TextSemiBold>

              <TextSemiBold style={{ fontSize: 12, textAlign: "left" }}>
                {t("common.consultation")}
              </TextSemiBold>
            </View>

            <View
              style={{
                width: 64,
                height: 64,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9999,
                backgroundColor: Colors.lightSkyBlue,
              }}
            >
              <CustomIcon name="event-chair" size={32} color={Colors.skyBlue} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default DayInfo;

const DayInfoHeader = ({ date }: { date: string }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const appointmentsByDate = useAppointmentsByDate(date as string);
  const insets = useSafeAreaInsets();

  // Ignore i18n ally error for appointment count

  return (
    <View
      style={[
        header.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        Platform.OS === "android" && { paddingTop: insets.top },
      ]}
    >
      <IconButton name="close" onPress={() => router.back()} />
      <TextSemiBold style={header.date}>
        {format(parseISO(date), "MMMM d, yyyy", {
          locale: locales[i18next.language],
        })}
      </TextSemiBold>
      <View style={header.infoRow}>
        <View style={header.info}>
          <CustomIcon size={24} name="event-chair" />
          <TextSemiBold style={header.infoText}>
            {t("day.appointment-count", { count: appointmentsByDate.length })}
          </TextSemiBold>
        </View>
        <View style={header.info}>
          <CustomIcon size={24} name="schedule" />
          <TextSemiBold style={header.infoText}>
            {t("day.total-time", { length: appointmentsByDate.length * 15 })}
          </TextSemiBold>
        </View>
      </View>
    </View>
  );
};

const page = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

const header = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "column",
    gap: 16,
    borderBottomWidth: 1,
  },
  date: {
    fontSize: 24,
    textAlign: "left",
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
  },
});
