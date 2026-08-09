import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { TextRegular } from "../StyledText";
import i18next from "i18next";
import { enUS } from "date-fns/locale";
import { locales } from "@/constants/locales";
import DateTimePickerModal from "./DateTimePickerModal";

const ControllerDatePicker = ({
  control,
  name,
  rules = {},
  label,
  disabled = false,
  placeholder = i18next.t("form.select-date"),
  formatDate = "MMMM d, yyyy",
  maximumDate = undefined,
  minimumDate = undefined,
}: {
  control: Control;
  name: string;
  rules?: any;
  label: string;
  disabled?: boolean;
  placeholder?: string;
  formatDate?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <View>
            <View style={styles.labelContainer}>
              <TextRegular style={styles.label}>{label}</TextRegular>
              {error && (
                <TextRegular style={styles.error}>{error?.message}</TextRegular>
              )}
            </View>

            <Pressable
              onPress={() => !disabled && setShowDatePicker(true)}
              style={[
                styles.inputContainer,
                { borderColor: error ? Colors.pink : Colors.faintGrey },
              ]}
            >
              <TextRegular
                style={{
                  fontSize: 16,
                  color: value ? "#000" : Colors.lightText,
                }}
              >
                {value
                  ? format(value, formatDate, {
                      locale: locales[i18next.language] ?? enUS,
                    })
                  : placeholder}
              </TextRegular>
              <Ionicons name="calendar-outline" size={20} color={Colors.grey} />
            </Pressable>

            {showDatePicker && (
              <DateTimePickerModal
                mode="date"
                visible={showDatePicker}
                value={value || new Date()}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onConfirm={(date) => {
                  setShowDatePicker(false);
                  onChange(date);
                }}
                onDismiss={() => setShowDatePicker(false)}
                locale={i18next.language}
              />
            )}
          </View>
        );
      }}
    />
  );
};

export default ControllerDatePicker;

const styles = StyleSheet.create({
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
    fontSize: 14,
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
