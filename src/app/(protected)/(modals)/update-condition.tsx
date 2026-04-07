import { saveItem } from "@/api/medicalRecords";
import Footer from "@/components/AddFooter";
import ContainerView from "@/components/ContainerView";
import ControllerInput from "@/components/form/ControllerInput";
import PageScrollView from "@/components/PageScrollView";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import {
  useMedicalRecord,
  useRecordStoreConditionById,
} from "@/stores/useRecordStore"; // Update to use correct hook
import { Condition } from "@/types/medicalRecord";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

type ConditionForm = Pick<Condition, "name" | "comments">;

const UpdateCondition = () => {
  const { t } = useTranslation();
  const { mode, id } = useLocalSearchParams();
  const { height } = useGradualAnimation();
  const isEditMode = mode === "edit";
  const condition = useRecordStoreConditionById(id as string);
  const medicalRecord = useMedicalRecord();

  const defaultValues: ConditionForm =
    isEditMode && condition
      ? {
          name: condition.name,
          comments: condition.comments || "", // Assuming comments field in condition
        }
      : {
          name: "",
          comments: "",
        };

  const { control, handleSubmit, formState } = useForm<ConditionForm>({
    defaultValues,
    mode: "onChange",
  });

  const { isDirty, isValid, isSubmitting } = formState;

  const onSubmit: SubmitHandler<ConditionForm> = async (data) => {
    try {
      await saveItem(isEditMode, medicalRecord!, data, condition, "conditions");
      router.dismiss();
    } catch (error) {
      console.error("Error saving condition:", error);
    }
  };

  const fakeView = useAnimatedStyle(() => ({
    height: Math.abs(height.value),
  }));

  return (
    <ContainerView>
      <Stack.Screen
        options={{
          title: `${isEditMode ? t("common.edit") : t("common.add")} ${t(
            "common.condition",
          )}`,
        }}
      />
      <PageScrollView contentContainerStyle={styles.pageScrollViewContent}>
        <ControllerInput
          control={control}
          name="name"
          rules={{ required: t("form.condition-name-is-required") }}
          label={t("form.condition-name")}
          placeholder={t("form.e-g-diabetes")}
        />
        <ControllerInput
          control={control}
          name="comments"
          label={t("form.comment-on-your-condition")}
          placeholder={t(
            "form.e-g-i-have-to-monitor-my-blood-sugar-levels-daily",
          )}
          multiline
          textInputStyle={styles.multilineInputStyle}
        />
      </PageScrollView>

      <Footer
        keyboardHeightShared={height}
        canSubmit={isDirty && isValid}
        submitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      />

      <Animated.View style={fakeView} />
    </ContainerView>
  );
};

export default UpdateCondition;

const styles = StyleSheet.create({
  pageScrollViewContent: {
    flexDirection: "column",
    padding: 16,
    gap: 16,
  },
  multilineInputStyle: {
    height: 128,
  },
});
