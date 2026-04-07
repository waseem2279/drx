import { saveItem } from "@/api/medicalRecords";
import ContainerView from "@/components/ContainerView";
import Divider from "@/components/Divider";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerInput from "@/components/form/ControllerInput";
import FormPage from "@/components/FormPage";
import {
  useMedicalRecord,
  useRecordStoreMedicationById,
} from "@/stores/useRecordStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type MedicationForm = {
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  interval: string;
};

const UpdateMedication = () => {
  const { t } = useTranslation();
  const { mode, id } = useLocalSearchParams();
  const isEditMode = mode === "edit";
  const medication = useRecordStoreMedicationById(id as string);
  const medicalRecord = useMedicalRecord();

  const defaultValues =
    isEditMode && medication
      ? {
          name: medication.name,
          dosage: medication.dosage || "", // fallback if older data
          route: medication.route || "",
          frequency: medication.frequency,
          interval: medication.interval,
        }
      : {
          name: "",
          dosage: "",
          route: "",
          frequency: "",
          interval: "day",
        };

  const { control, handleSubmit, formState } = useForm<MedicationForm>({
    defaultValues,
    mode: "onChange",
  });

  const { isDirty, isValid, isSubmitting } = formState;

  const onSubmit: SubmitHandler<MedicationForm> = async (data) => {
    try {
      await saveItem(
        isEditMode,
        medicalRecord!,
        data,
        medication,
        "medications",
      );

      router.dismiss();
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  return (
    <ContainerView>
      <Stack.Screen
        options={{
          title: `${isEditMode ? t("common.edit") : t("common.add")} ${t(
            "common.medication",
          )}`,
        }}
      />

      <FormPage
        canSubmit={isValid && isDirty}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <ControllerInput
          control={control}
          name="name"
          rules={{ required: t("form.medication-name-is-required") }}
          label={t("form.medication-name")}
          placeholder={t("form.e-g-atorvastatin")}
        />
        <ControllerInput
          control={control}
          name="dosage"
          rules={{ required: t("form.dosage-amount-is-required") }}
          label={t("form.dosage")}
          placeholder={t("form.e-g-10mg")}
          keyboardType="default"
        />
        <ControllerCheckBoxOptions
          control={control}
          name="route"
          label={t("form.medication-route")}
          options={[
            { value: "oral", label: t("route.oral") },
            { value: "topical", label: t("route.topical") },
            { value: "inhalation", label: t("route.inhalation") },
            { value: "nasal", label: t("route.nasal") },
            { value: "ocular", label: t("route.ocular") },
            { value: "otic", label: t("route.otic") },
            { value: "rectal", label: t("route.rectal") },
            { value: "vaginal", label: t("route.vaginal") },
            { value: "intravenous", label: t("route.intravenous") },
            { value: "intramuscular", label: t("route.intramuscular") },
            { value: "subcutaneous", label: t("route.subcutaneous") },
          ]}
          rules={{ required: t("form.please-select-a-dosage-route") }}
          singleSelect
        />
        <Divider />
        <ControllerInput
          control={control}
          rules={{
            required: t("form.please-enter-a-frequency"),
          }}
          name="frequency"
          label={t("form.how-often-do-you-take-this")}
          placeholder={t("form.e-g-2")}
          keyboardType="numeric"
        />
        <ControllerCheckBoxOptions
          control={control}
          label={t("form.what-is-the-interval")}
          name="interval"
          options={[
            { value: "daily", label: t("interval.daily") },
            { value: "weekly", label: t("interval.weekly") },
            { value: "monthly", label: t("interval.monthly") },
          ]}
          rules={{ required: t("form.please-select-an-interval") }}
          singleSelect
        />
      </FormPage>
    </ContainerView>
  );
};

export default UpdateMedication;
