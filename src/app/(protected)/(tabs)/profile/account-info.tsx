import Divider from "@/components/Divider";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerDatePicker from "@/components/form/ControllerDatePicker";
import ControllerInput from "@/components/form/ControllerInput";
import Colors from "@/constants/Colors";
import { useUserData } from "@/stores/useUserStore";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { db } from "../../../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import SubmitButton from "@/components/SubmitButton";
import AddPhone from "@/components/form/AddPhone";

const AccountInfo = () => {
  const { t } = useTranslation();
  const userData = useUserData();

  const { control, handleSubmit, formState, reset } = useForm<any>({
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      phoneNumber: userData?.phoneNumber || "",
      dateOfBirth: userData?.dateOfBirth ? userData.dateOfBirth.toDate() : null,
      gender: userData?.gender || "",
    },
  });

  const { isDirty, isSubmitting } = formState;

  if (!userData) return null;

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const processedData = {
        ...data,
        gender: data.gender ? data.gender.toLowerCase() : "",
        // Convert dateOfBirth to Firestore Timestamp if it exists
        dateOfBirth: data.dateOfBirth
          ? Timestamp.fromDate(data.dateOfBirth)
          : null,
      };

      await setDoc(doc(db, "users", userData.uid), processedData, {
        merge: true,
      });

      // Reset the form with processed data to clear dirty state
      reset({
        ...processedData,
        dateOfBirth: processedData.dateOfBirth?.toDate() || null,
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      alert(t("error.something-went-wrong-saving-your-info"));
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={62}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <ControllerInput
        label={t("form.first-name")}
        control={control}
        name={"firstName"}
        rules={{ required: t("form.first-name-is-required") }}
        placeholder={t("form.e-g-john")}
      />
      <ControllerInput
        label={t("form.last-name")}
        control={control}
        name={"lastName"}
        rules={{ required: t("form.last-name-is-required") }}
        placeholder={t("form.e-g-doe")}
      />

      <Divider />

      <AddPhone />

      <Divider />

      <ControllerDatePicker
        label={t("form.date-of-birth")}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        control={control}
        name={"dateOfBirth"}
        placeholder={t("form.select-your-date-of-birth")}
      />

      <Divider />

      <ControllerCheckBoxOptions
        label={t("form.gender")}
        control={control}
        name="gender"
        options={[
          { value: "male", label: t("gender.male") },
          { value: "female", label: t("gender.female") },
          { value: "other", label: t("gender.other") },
        ]}
        singleSelect
      />

      <Divider />

      {/* Save Button */}
      <SubmitButton
        text={t("form.save")}
        disabled={!isDirty}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </KeyboardAwareScrollView>
  );
};

export default AccountInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    backgroundColor: "#fff",
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 16,
    position: "relative",
  },
  saveButton: {
    backgroundColor: Colors.black,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
