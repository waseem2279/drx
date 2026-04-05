import Colors from "@/constants/Colors";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextRegular } from "../StyledText";
import CustomIcon from "../CustomIcon";

interface Option {
  value: string;
  label: string;
}

interface Props<TFieldValues extends FieldValues> {
  label: string;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  name: Path<TFieldValues>;
  options?: (string | Option)[];
  singleSelect?: boolean;
}

const normalizeOptions = (options: (string | Option)[]): Option[] =>
  options.map((option) =>
    typeof option === "string"
      ? {
          value: option,
          label: option.charAt(0).toUpperCase() + option.slice(1),
        }
      : option
  );

const ControllerCheckBoxOptions = <TFieldValues extends FieldValues>({
  label,
  control,
  rules = {},
  name,
  options = [],
  singleSelect = false,
}: Props<TFieldValues>) => {
  const normalizedOptions = normalizeOptions(options);

  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedValues: string[] = singleSelect
          ? [value ?? ""]
          : value ?? [];

        const toggleOption = (optionValue: string) => {
          if (singleSelect) {
            onChange(optionValue);
          } else {
            const updatedValues = selectedValues.includes(optionValue)
              ? selectedValues.filter((v) => v !== optionValue)
              : [...selectedValues, optionValue];
            onChange(updatedValues);
          }
        };

        const isSelected = (optionValue: string) =>
          singleSelect
            ? selectedValues[0] === optionValue
            : selectedValues.includes(optionValue);

        return (
          <View>
            <View style={styles.labelContainer}>
              <TextRegular style={styles.label}>{label}</TextRegular>
              <TextRegular style={styles.error}>{error?.message}</TextRegular>
            </View>

            <View style={styles.optionsContainer}>
              {normalizedOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() => toggleOption(option.value)}
                >
                  <CustomIcon
                    name={
                      isSelected(option.value)
                        ? singleSelect
                          ? "radio-button-checked"
                          : "check-box"
                        : singleSelect
                        ? "radio-button-unchecked"
                        : "check-box-outline-blank"
                    }
                    size={16}
                    color={Colors.black}
                  />
                  <TextRegular style={styles.optionValue}>
                    {option.label}
                  </TextRegular>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      }}
    />
  );
};

export default ControllerCheckBoxOptions;

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
    fontSize: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 4,
  },
  optionValue: {
    fontSize: 12,
  },
});
