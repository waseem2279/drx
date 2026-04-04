import React, { useState } from "react";
import FormPage from "@/components/FormPage";
import { TextRegular } from "@/components/StyledText";
import ControllerOTPInput from "@/components/form/ControllerOTPInput";
import { SubmitHandler, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { useInternationalPhoneNumber } from "@/stores/useCountryStore";
import { functions } from "../../../../firebaseConfig";
import { httpsCallable } from "@firebase/functions";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

type FormData = {
  otp: string;
};

const VerifyCode = () => {
  const internationalPhoneNumber = useInternationalPhoneNumber();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const { control, handleSubmit, formState } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      otp: "",
    },
  });

  const { isSubmitting, isValid } = formState;

  const onPress: SubmitHandler<FormData> = async ({ otp }) => {
    setError(null);
    if (!internationalPhoneNumber) {
      console.error("Missing phone number for verification.");
      return;
    }

    const createVerificationCheck = httpsCallable<
      { code: string; phoneNumber: string },
      { status: string | null; error: string | null }
    >(functions, "createVerificationCheck");

    const result = await createVerificationCheck({
      code: otp,
      phoneNumber: internationalPhoneNumber,
    });

    const { status, error: errorMsg } = result.data;

    if (status !== "approved") {
      console.error("Failed to verify code:", result.data);
      setError(errorMsg ?? null);
      return;
    }

    router.dismissTo("/(protected)/(tabs)/profile/account-info");
  };

  return (
    <FormPage
      canSubmit={isValid}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit(onPress)}
      submitButtonText={t("common.verify")}
    >
      <TextRegular style={{ color: Colors.lightText }}>
        {t("phone.otp-request", {
          internationalPhoneNumber: internationalPhoneNumber,
        })}
      </TextRegular>

      <ControllerOTPInput
        label={t("phone.verification-code")}
        control={control}
        name="otp"
        autoFocus
        rules={{
          required: t("phone.otp-is-required"),
          minLength: 6,
        }}
      />
      {error && (
        <TextRegular style={{ color: Colors.pink }}>{error}</TextRegular>
      )}
    </FormPage>
  );
};

export default VerifyCode;
