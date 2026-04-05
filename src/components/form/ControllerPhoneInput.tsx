import Colors from "@/constants/Colors";
import examples from "libphonenumber-js/mobile/examples";
import React, { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import { IconName } from "../../constants/iconsMap";
import { TextRegular } from "../StyledText";
import MaskInput from "react-native-mask-input";
import {
  CountryCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { useTranslation } from "react-i18next";
import { useCountry } from "@/stores/useCountryStore";
import CountryPicker from "./CountryPicker";

interface ControllerPhoneInputProps<TFieldValues extends FieldValues> {
  label: string;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  /**  Set to `true` if you want eye/eye-off toggle (e.g. PIN). */
  sensitive?: boolean;
  textInputStyle?: StyleProp<TextStyle>;
  /** ISO-3166 country code for validation; default “US”. */
  region?: CountryCode;
  iconLeft?: IconName;
  autoFocus?: boolean;
}

const ControllerPhoneInput = <TFieldValues extends FieldValues>({
  control,
  rules = {},
  name,
  textInputStyle = null,
  autoFocus = false,
}: ControllerPhoneInputProps<TFieldValues>) => {
  const { t, i18n } = useTranslation();
  const [mask, setMask] = useState<(string | RegExp)[]>([
    "+",
    "1",
    " ",
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ]);
  const [maskedValue, setMaskedValue] = useState("");
  const [placeholder, setPlaceholder] = useState<string | undefined>("");
  const country = useCountry();

  // Generate a dynamic mask from libphonenumber-js
  useEffect(() => {
    try {
      const example = getExampleNumber(
        country.code,
        examples,
      )?.formatNational();
      setPlaceholder(example);
      if (example) {
        const dynamicMask = generateMaskFromExample(example);
        setMask(dynamicMask);
      }
    } catch (e) {
      console.warn("Could not generate phone mask:", e);
    }
  }, [country.code]);

  return (
    <Controller
      control={control}
      rules={{
        ...rules,
        validate: (val) => {
          const phone = parsePhoneNumberFromString(val, country.code);
          return phone?.isValid() || t("form.invalid-phone-number");
        },
      }}
      name={name}
      render={({ field: { onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.container}>
          <View style={styles.labelContainer}>
            <TextRegular style={styles.label}>
              {t("form.phone-number")}
            </TextRegular>
            <TextRegular style={styles.error}>{error?.message}</TextRegular>
          </View>

          <View style={styles.formInputContainer}>
            <CountryPicker emoji={country.emoji} />

            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: error ? Colors.pink : Colors.faintGrey,
                },
              ]}
            >
              <MaskInput
                autoFocus={autoFocus}
                keyboardType="phone-pad"
                placeholder={placeholder}
                mask={mask}
                style={[
                  styles.input,
                  {
                    textAlign: i18n.dir() === "rtl" ? "right" : "left",
                    writingDirection: i18n.dir() === "rtl" ? "rtl" : "ltr",
                  },
                  textInputStyle,
                ]}
                value={maskedValue}
                onBlur={onBlur}
                onChangeText={(masked, unmasked) => {
                  setMaskedValue(masked);
                  onChange(unmasked);
                }}
              />
            </View>
          </View>
        </View>
      )}
    />
  );
};

function generateMaskFromExample(example: string): (string | RegExp)[] {
  const mask: (string | RegExp)[] = [];

  for (const char of example) {
    if (/\d/.test(char)) {
      mask.push(/\d/);
    } else {
      mask.push(char);
    }
  }

  return mask;
}

export default ControllerPhoneInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  formInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
  },
  iconLeftContainer: {
    marginLeft: 16,
  },
  iconRightContainer: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    fontFamily: "DMSans_400Regular",
  },
});
