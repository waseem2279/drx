import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { TextRegular } from "@/components/StyledText";
import { getServicesList } from "@/constants/options";
import { useTranslation } from "react-i18next";
import { PublicProfile } from "@/types/publicProfile";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import FormPage from "@/components/FormPage";
import ControllerInput from "@/components/form/ControllerInput";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebaseConfig";
import Colors from "@/constants/Colors";
import ContainerView from "@/components/ContainerView";

const UpdateService = () => {
  const { t } = useTranslation();
  const {
    serviceId,
    price,
  }: { serviceId: keyof PublicProfile; price: string } = useLocalSearchParams();
  const service = getServicesList(t).find((s) => s.id === serviceId)!;
  const title = service.title;
  const priceLabel = service.priceLabel;
  const { control, handleSubmit, formState } = useForm<PublicProfile>({
    defaultValues: {
      [priceLabel]: price || "0",
    },
    mode: "onChange",
  });
  const { isValid, isDirty, isSubmitting } = formState;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated");
      }

      const publicProfileRef = doc(db, "publicProfiles", auth.currentUser?.uid);

      await updateDoc(publicProfileRef, {
        [priceLabel]: data[priceLabel],
        services:
          data[priceLabel] === "0"
            ? arrayRemove(serviceId)
            : arrayUnion(serviceId),
      });

      router.back();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <ContainerView>
      <Stack.Screen
        options={{
          title: t("page.manage-service"),
        }}
      />
      <FormPage
        canSubmit={isValid && isDirty}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <TextRegular style={{ color: Colors.lightText }}>
          {t("service.form-instructions")}
        </TextRegular>
        <ControllerInput
          label={t("form.service-price", {
            service: title,
          })}
          placeholder={t("form.e-g-50")}
          name={priceLabel as keyof PublicProfile}
          control={control}
          rules={{
            required: t("form.please-enter-a-price"),
            // Greater than or equal 0 validation
            validate: (value) =>
              (typeof value === "string" && parseInt(value, 10) >= 0) ||
              t("form.value-must-be-a-number-greater-than-or-equal-to-0"),
          }}
          keyboardType="numeric"
          textInputStyle={{ width: "100%" }}
        />
      </FormPage>
    </ContainerView>
  );
};

export default UpdateService;
