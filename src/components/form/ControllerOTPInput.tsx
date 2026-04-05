import Colors from "@/constants/Colors";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import React, { useState } from "react";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import MaskInput from "react-native-mask-input";
import { TextRegular } from "../StyledText";
import { useTranslation } from "react-i18next";

interface ControllerOTPInputProps<TFieldValues extends FieldValues> {
  label: string;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  textInputStyle?: StyleProp<TextStyle>;
  autoFocus?: boolean;
  digits?: number; // Default: 6
}

const ControllerOTPInput = <TFieldValues extends FieldValues>({
  label,
  control,
  rules = {},
  name,
  textInputStyle = null,
  autoFocus = false,
  digits = 6,
}: ControllerOTPInputProps<TFieldValues>) => {
  const { i18n } = useTranslation();
  const [maskedValue, setMaskedValue] = useState("");

  const mask = Array(digits).fill(/\d/); // e.g. [/d/, /d/, /d/, /d/, /d/, /d/]

  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({ field: { onChange, onBlur }, fieldState: { error } }) => (
        <View>
          <View style={styles.labelContainer}>
            <TextRegular style={styles.label}>{label}</TextRegular>
            <TextRegular style={styles.error}>{error?.message}</TextRegular>
          </View>

          <View
            style={[
              styles.inputContainer,
              { borderColor: error ? Colors.pink : Colors.faintGrey },
            ]}
          >
            <MaskInput
              value={maskedValue}
              onChangeText={(masked, unmasked) => {
                setMaskedValue(masked);
                onChange(unmasked); // store only raw digits in form state
              }}
              onBlur={onBlur}
              mask={mask}
              keyboardType="number-pad"
              autoFocus={autoFocus}
              style={[
                styles.input,
                {
                  textAlign: "center",
                  writingDirection: i18n.dir() === "rtl" ? "rtl" : "ltr",
                },
                textInputStyle,
              ]}
              placeholder={"XXXXXX".slice(0, digits)}
              placeholderTextColor={Colors.lightText}
            />
          </View>
        </View>
      )}
    />
  );
};

export default ControllerOTPInput;

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  error: {
    fontSize: 12,
    color: Colors.pink,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
    fontFamily: "DMSans_500Medium",
    letterSpacing: 10,
  },
});
