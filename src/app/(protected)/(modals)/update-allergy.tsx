import { saveItem } from "@/api/medicalRecords";
import Footer from "@/components/AddFooter";
import ControllerInput from "@/components/form/ControllerInput";
import PageScrollView from "@/components/PageScrollView";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import {
  useMedicalRecord,
  useRecordStoreAllergyById,
} from "@/stores/useRecordStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

type AllergyForm = {
  name: string;
  reaction: string;
};

const UpdateAllergy = () => {
  const { t } = useTranslation();
  const { mode, id } = useLocalSearchParams();
  const { height } = useGradualAnimation();
  const isEditMode = mode === "edit";
  const allergy = useRecordStoreAllergyById(id as string);
  const medicalRecord = useMedicalRecord();

  const initialValues =
    isEditMode && allergy
      ? { name: allergy.name, reaction: allergy.reaction }
      : { name: "", reaction: "" };

  const { control, handleSubmit, formState } = useForm<AllergyForm>({
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { isSubmitting, isValid, isDirty } = formState;

  const onSubmit: SubmitHandler<AllergyForm> = async (data) => {
    try {
      await saveItem(isEditMode, medicalRecord!, data, allergy, "allergies");

      router.dismiss();
    } catch (error) {
      console.error("Error saving allergy:", error);
    }
  };

  const fakeView = useAnimatedStyle(() => ({
    height: Math.abs(height.value),
  }));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t(isEditMode ? "page.edit-allergy" : "page.add-allergy"),
        }}
      />
      <PageScrollView contentContainerStyle={styles.pageScrollViewContent}>
        <ControllerInput
          control={control}
          name="name"
          label={t("form.allergy-name")}
          rules={{ required: t("form.allergy-name-is-required") }}
          placeholder={t("form.e-g-pollen")}
        />
        <ControllerInput
          control={control}
          name="reaction"
          label={t("form.reaction-description")}
          rules={{ required: t("form.reaction-description-is-required") }}
          placeholder={t("form.e-g-hives-and-swelling")}
          multiline
          textInputStyle={styles.multilineInputStyle}
        />
      </PageScrollView>

      <Footer
        keyboardHeightShared={height}
        canSubmit={isValid && isDirty}
        submitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      />

      <Animated.View style={fakeView} />
    </View>
  );
};

export default UpdateAllergy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageScrollViewContent: {
    flexDirection: "column",
    gap: 16,
    padding: 16,
  },
  multilineInputStyle: {
    height: 128,
  },
});
