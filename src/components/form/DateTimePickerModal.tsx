import Colors from "@/constants/Colors";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { TextRegular, TextSemiBold } from "../StyledText";
import { useTranslation } from "react-i18next";

type Props = {
  visible: boolean;
  value: Date;
  mode: "date" | "time";
  locale: string;
  minimumDate?: Date;
  maximumDate?: Date;
  onConfirm: (date: Date) => void;
  onDismiss: () => void;
};

const DateTimePickerModal = ({
  visible,
  value,
  mode,
  locale,
  minimumDate,
  maximumDate,
  onConfirm,
  onDismiss,
}: Props) => {
  const { t } = useTranslation();
  const [draftDate, setDraftDate] = useState(value);
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [sheetTranslateY] = useState(() => new Animated.Value(320));

  useEffect(() => {
    if (!visible || Platform.OS === "android") return;

    sheetTranslateY.setValue(320);
    backdropOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetTranslateY, visible]);

  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 320,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onDismiss();
    });
  }, [backdropOpacity, onDismiss, sheetTranslateY]);

  const confirm = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 320,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onConfirm(draftDate);
    });
  }, [backdropOpacity, draftDate, onConfirm, sheetTranslateY]);

  if (!visible) return null;

  if (Platform.OS === "android") {
    return (
      <DateTimePicker
        mode={mode}
        presentation="dialog"
        value={value}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        onValueChange={(_, date) => onConfirm(date)}
        onDismiss={onDismiss}
        locale={locale}
        accentColor={Colors.black}
      />
    );
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={close}
    >
      <View style={styles.container}>
        <Animated.View
          pointerEvents="none"
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          <View style={styles.actions}>
            <Pressable onPress={close} hitSlop={12}>
              <TextRegular style={styles.actionText}>{t("common.cancel")}</TextRegular>
            </Pressable>
            <Pressable onPress={confirm} hitSlop={12}>
              <TextSemiBold style={styles.actionText}>{t("common.ok")}</TextSemiBold>
            </Pressable>
          </View>
          <DateTimePicker
            mode={mode}
            display="spinner"
            value={draftDate}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onValueChange={(_, date) => setDraftDate(date)}
            locale={locale}
            accentColor={Colors.black}
            style={styles.picker}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default DateTimePickerModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.32)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingBottom: 24,
  },
  actions: {
    minHeight: 48,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.faintGrey,
  },
  actionText: {
    fontSize: 16,
    color: Colors.black,
  },
  picker: {
    alignSelf: "stretch",
  },
});
