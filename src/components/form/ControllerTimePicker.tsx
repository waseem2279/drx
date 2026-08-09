import Colors from "@/constants/Colors";
import { TimeValue } from "@/types/publicProfile";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { TextRegular } from "../StyledText";
import i18next from "i18next";
import { locales } from "@/constants/locales";
import DateTimePickerModal from "./DateTimePickerModal";

interface ControllerTimePickerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

const isTimeValue = (value: unknown): value is TimeValue =>
  typeof value === "object" &&
  value !== null &&
  "hour" in value &&
  "minute" in value &&
  typeof value.hour === "number" &&
  typeof value.minute === "number";

const ControllerTimePicker = <TFieldValues extends FieldValues>({
  control,
  name,
  rules = {},
  label,
  disabled = false,
  placeholder = "Select Time",
}: ControllerTimePickerProps<TFieldValues>) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const hasTimeValue = isTimeValue(value);
        const dateValue = hasTimeValue
          ? new Date(0, 0, 0, value.hour, value.minute)
          : new Date();
        const displayValue = hasTimeValue
          ? format(dateValue, "h:mm a", { locale: locales[i18next.language] })
          : "";

        return (
          <View style={styles.timePickerContainer}>
            <View style={styles.labelContainer}>
              {label && <TextRegular style={styles.label}>{label}</TextRegular>}
              {error && (
                <TextRegular style={styles.error}>{error.message}</TextRegular>
              )}
            </View>

            <Pressable
              onPress={() => !disabled && setShowTimePicker(true)}
              style={[
                styles.inputContainer,
                { borderColor: error ? Colors.pink : Colors.faintGrey },
              ]}
            >
              <TextRegular
                style={{ color: hasTimeValue ? "#000" : Colors.lightText }}
              >
                {hasTimeValue ? displayValue : placeholder}
              </TextRegular>
              <Ionicons name="time-outline" size={20} color={Colors.grey} />
            </Pressable>

            {showTimePicker && (
              <DateTimePickerModal
                locale={i18next.language}
                mode="time"
                visible={showTimePicker}
                value={dateValue}
                onConfirm={(date) => {
                  setShowTimePicker(false);
                  onChange({
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                  });
                }}
                onDismiss={() => setShowTimePicker(false)}
              />
            )}
          </View>
        );
      }}
    />
  );
};

export default ControllerTimePicker;

const styles = StyleSheet.create({
  timePickerContainer: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  error: {
    color: Colors.pink,
    fontSize: 12,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    justifyContent: "space-between",
  },
});
