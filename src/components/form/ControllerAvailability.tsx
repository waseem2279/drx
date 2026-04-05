import Colors from "@/constants/Colors";
import {
  AVAILABILITY_DAY_KEYS,
  Availability,
  AvailabilityDayKey,
  AvailabilitySlot,
} from "@/types/publicProfile";
import { getCalendars } from "expo-localization";
import React from "react";
import {
  Control,
  FieldArray,
  FieldArrayPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import IconButton from "../IconButton";
import { TextRegular, TextSemiBold } from "../StyledText";
import ControllerTimePicker from "./ControllerTimePicker";

const BUTTON_SIZE = 28;

type AvailabilityFormValues = FieldValues & {
  availability: Availability;
  timeZone: string | null;
};

interface ControllerAvailabilityProps<
  TFieldValues extends AvailabilityFormValues,
> {
  label: string;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
}

interface AvailabilityDayRowProps<TFieldValues extends AvailabilityFormValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  dayKey: AvailabilityDayKey;
}

const newTimeSlot: AvailabilitySlot = {
  start: null,
  end: null,
};

const weekdayLabelKey: Record<AvailabilityDayKey, string> = {
  "0": "Sun",
  "1": "Mon",
  "2": "Tue",
  "3": "Wed",
  "4": "Thu",
  "5": "Fri",
  "6": "Sat",
};

const AvailabilityDayRow = <TFieldValues extends AvailabilityFormValues>({
  control,
  name,
  dayKey,
}: AvailabilityDayRowProps<TFieldValues>) => {
  const { t } = useTranslation();
  const fieldArrayName = `${name}.${dayKey}` as FieldArrayPath<TFieldValues>;
  const { fields, append, remove } = useFieldArray<TFieldValues>({
    control,
    name: fieldArrayName,
  });

  return (
    <View style={styles.dayContainer}>
      {fields.length === 0 ? (
        <View style={styles.timeSlotRow}>
          <TextRegular style={styles.dayLabel}>
            {t(`weekdays.${weekdayLabelKey[dayKey]}`)}
          </TextRegular>
          <TextRegular style={styles.noSlotsText}>
            {t("form.unavailable")}
          </TextRegular>
          <View style={styles.buttonRow}>
            <View style={styles.empty} />
            <IconButton
              name="add"
              size={BUTTON_SIZE}
              onPress={() =>
                append(
                  newTimeSlot as FieldArray<
                    TFieldValues,
                    typeof fieldArrayName
                  >,
                )
              }
            />
          </View>
        </View>
      ) : (
        fields.map((field, timeSlotIdx) => (
          <View key={field.id} style={styles.timeSlotRow}>
            {timeSlotIdx === 0 ? (
              <TextRegular style={styles.dayLabel}>
                {t(`weekdays.${weekdayLabelKey[dayKey]}`)}
              </TextRegular>
            ) : (
              <View style={styles.dayLabel} />
            )}
            <View style={styles.inlineSlot}>
              <ControllerTimePicker<TFieldValues>
                name={
                  `${fieldArrayName}.${timeSlotIdx}.start` as Path<TFieldValues>
                }
                placeholder={t("form.start-time")}
                control={control}
                rules={{ required: t("form.start-time-is-required") }}
              />
              <TextSemiBold>-</TextSemiBold>
              <ControllerTimePicker<TFieldValues>
                name={
                  `${fieldArrayName}.${timeSlotIdx}.end` as Path<TFieldValues>
                }
                placeholder={t("form.end-time")}
                control={control}
                rules={{ required: t("form.end-time-is-required") }}
              />
            </View>
            <View style={styles.buttonRow}>
              <IconButton
                name="close"
                size={BUTTON_SIZE}
                onPress={() => remove(timeSlotIdx)}
              />
              {timeSlotIdx === 0 ? (
                <IconButton
                  name="add"
                  size={BUTTON_SIZE}
                  onPress={() =>
                    append(
                      newTimeSlot as FieldArray<
                        TFieldValues,
                        typeof fieldArrayName
                      >,
                    )
                  }
                />
              ) : (
                <View style={styles.empty} />
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const ControllerAvailability = <TFieldValues extends AvailabilityFormValues>({
  label,
  control,
  name,
  setValue,
  watch,
}: ControllerAvailabilityProps<TFieldValues>) => {
  return (
    <View>
      <View style={styles.labelContainer}>
        <TextRegular style={styles.label}>{label}</TextRegular>
        <View style={styles.timeZoneContainer}>
          <TextRegular style={styles.timeZone}>
            {watch("timeZone" as Path<TFieldValues>)}
          </TextRegular>
          <IconButton
            name="sync"
            size={BUTTON_SIZE}
            onPress={() => {
              const timeZone = getCalendars()[0].timeZone;
              if (!timeZone) return;
              setValue(
                "timeZone" as Path<TFieldValues>,
                timeZone as PathValue<TFieldValues, Path<TFieldValues>>,
                {
                  shouldDirty: true,
                },
              );
            }}
          />
        </View>
      </View>

      {AVAILABILITY_DAY_KEYS.map((dayKey) => (
        <AvailabilityDayRow<TFieldValues>
          key={dayKey}
          control={control}
          name={name}
          dayKey={dayKey}
        />
      ))}
    </View>
  );
};

export default ControllerAvailability;

const styles = StyleSheet.create({
  empty: {
    width: BUTTON_SIZE,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  timeZoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeZone: {
    fontSize: 14,
    color: Colors.lightText,
  },
  dayContainer: {
    flexDirection: "column",
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 14,
    color: Colors.black,
    width: 40,
  },
  inlineSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  timeSlotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 64,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 8,
  },
  noSlotsText: {
    fontSize: 14,
    color: Colors.lightText,
    flex: 1,
    fontStyle: "italic",
  },
});
