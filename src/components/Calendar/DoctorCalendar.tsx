import React, { useCallback, useEffect, useState } from "react";

import Colors from "@/constants/Colors";
import { useAppointments } from "@/stores/useAppointmentStore";
import {
  getDayHeight,
  getDayWidth,
  getLocaleData,
} from "@/utils/calendarUtils";
import { format } from "date-fns";
import { router } from "expo-router";
import { I18nManager, StyleSheet, TouchableOpacity, View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { Direction } from "react-native-calendars/src/types";
import DatePicker from "react-native-date-picker";
import Avatar from "../Avatar";
import IconButton from "../IconButton";
import { TextSemiBold } from "../StyledText";
import CustomIcon from "../CustomIcon";
import { locales } from "@/constants/locales";
import i18next from "i18next";
import { enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

const DoctorCalendar = () => {
  const { t } = useTranslation();
  const appointments = useAppointments();
  const [calendarDimensions, setCalendarDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"), // Default to today's date
  );

  // Set the locale for the calendar
  useEffect(() => {
    if (!locales[i18next.language]) return;
    LocaleConfig.locales[i18next.language] = getLocaleData(
      locales[i18next.language],
      t,
    );
    LocaleConfig.defaultLocale = i18next.language;
  }, [i18next.language, t]);

  const onLayout = (event: {
    nativeEvent: { layout: { width: number; height: number } };
  }) => {
    const { width, height } = event.nativeEvent.layout;
    setCalendarDimensions({ width, height });
  };

  // Handle day press
  const onDayPress = useCallback((date?: DateData | undefined) => {
    if (!date) return;

    setSelectedDate(date.dateString);
    router.navigate({
      pathname: "/(protected)/(modals)/[date]",
      params: { date: date.dateString },
    });
  }, []);

  // Custom arrow for the calendar
  const renderArrow = (direction: Direction) => {
    const isRTL = I18nManager.isRTL;
    const resolvedDirection = isRTL
      ? direction === "right"
        ? "chevron-left"
        : "chevron-right"
      : direction === "right"
        ? "chevron-right"
        : "chevron-left";

    return <IconButton name={resolvedDirection} pointerEvents="none" />;
  };

  // Custom header for the calendar
  const renderHeader = (date: string) => {
    const dateObj = new Date(date);

    return (
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.calendarHeader}
      >
        <CustomIcon name="calendar" size={24} color="#000" />
        <TextSemiBold
          style={{
            fontSize: 16,
            color: "#000",
            textAlign: "center",
          }}
        >
          {format(dateObj, "LLLL, yyyy", {
            locale: locales[i18next.language] ?? enUS,
          })}
        </TextSemiBold>
      </TouchableOpacity>
    );
  };

  // Custom day component for the calendar
  const renderDay = useCallback(
    ({ date, state }: DayProps & { date?: DateData | undefined }) => {
      if (state === "disabled") return null;

      const isToday = state === "today";
      const calendarDate = date?.dateString;

      // Filter today's appointments once
      const todaysAppointments = appointments.filter((appointment: any) => {
        const appointmentDate = format(appointment.date.toDate(), "yyyy-MM-dd");
        return appointmentDate === calendarDate;
      });

      return (
        <TouchableOpacity
          style={[
            styles.calendarDay,
            {
              width: getDayWidth(calendarDimensions?.width || 0),
              height: getDayHeight(calendarDimensions?.height || 0),
              backgroundColor: isToday ? "black" : Colors.lightGrey,
            },
          ]}
          onPress={() => onDayPress(date)}
        >
          {todaysAppointments.map((appointment) => (
            <Avatar
              key={appointment.id}
              size={24}
              source={appointment.patient.image}
              initials={
                appointment.patient.firstName[0] +
                appointment.patient.lastName[0]
              }
              pointerEvents="none"
            />
          ))}
          <TextSemiBold
            style={[
              styles.calendarDayText,
              { color: isToday ? "#FFF" : Colors.grey },
            ]}
          >
            {date?.day}
          </TextSemiBold>
        </TouchableOpacity>
      );
    },
    [selectedDate, calendarDimensions],
  );

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <Calendar
        key={selectedDate}
        disableAllTouchEventsForDisabledDays
        renderArrow={renderArrow}
        renderHeader={renderHeader}
        dayComponent={renderDay}
        current={selectedDate}
        theme={{
          backgroundColor: "transparent",
          textDayHeaderFontFamily: "DMSans_600SemiBold",
        }}
        style={styles.calendar}
      />

      <DatePicker
        locale={i18next.language}
        modal
        mode="date"
        open={showDatePicker}
        date={new Date(selectedDate)}
        onConfirm={(date) => {
          setShowDatePicker(false);
          setSelectedDate(format(date, "yyyy-MM-dd"));
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />
    </View>
  );
};

export default DoctorCalendar;

const styles = StyleSheet.create({
  calendarHeader: {
    paddingHorizontal: 24,
    height: 40,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.lightGrey2,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarDay: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  calendarDayText: {
    textAlign: "center",
    fontSize: 10,
  },
  calendar: {
    backgroundColor: "transparent",
  },
});
