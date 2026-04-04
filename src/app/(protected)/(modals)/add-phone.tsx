import { View } from "react-native";
import React, { useState } from "react";
import FormPage from "@/components/FormPage";
import { TextRegular } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import ControllerPhoneInput from "@/components/form/ControllerPhoneInput";
import { useTranslation } from "react-i18next";
import {
  useCountry,
  useSetInternationalPhoneNumber,
} from "@/stores/useCountryStore";
import { router } from "expo-router";
import { functions } from "../../../../firebaseConfig";
import { httpsCallable } from "@firebase/functions";
import { getLocales } from "expo-localization";

const AddPhone = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  });
  const { isDirty, isSubmitting, isValid } = formState;
  const country = useCountry();
  const setInternationalPhoneNumber = useSetInternationalPhoneNumber();
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setError(null);
    const internationalPhoneNumber = `${country.dial_code}${data.phoneNumber}`;
    setInternationalPhoneNumber(internationalPhoneNumber);

    const createVerification = httpsCallable<
      { phoneNumber: string; locale?: string },
      { status: string | null; errorCode: number | null; error: string | null }
    >(functions, "createVerification");

    const result = await createVerification({
      phoneNumber: internationalPhoneNumber,
      locale: getLocales()[0].languageCode || "en",
    });

    const { status, errorCode, error: errorMsg } = result.data;

    console.log("Verification result:", result.data);

    if (status !== "pending") {
      console.error("Failed to send verification code:", result.data);

      // Unique message for twilio max attempt error code
      if (errorCode === 60203) {
        setError(
          "Max attempts reached. Please wait 10 minutes or try a different number."
        );
        return;
      }
      setError(errorMsg ?? null);
      return;
    }

    router.navigate("/(protected)/(modals)/verify-code");
  };

  return (
    <FormPage
      submitButtonText={t("common.verify")}
      canSubmit={isDirty && isValid}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit(onSubmit)}
    >
      <TextRegular style={{ color: Colors.lightText }}>
        {t("phone.verification-disclaimer")}
      </TextRegular>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        <ControllerPhoneInput
          label={t("form.phone-number")}
          control={control}
          name={"phoneNumber"}
          autoFocus
        />
      </View>
      {error && (
        <TextRegular style={{ color: Colors.pink }}>{error}</TextRegular>
      )}
    </FormPage>
  );
};

export default AddPhone;
