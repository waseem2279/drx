import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useSession } from "@/contexts/AuthContext";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";

import Divider from "@/components/Divider";
import ControllerInput from "@/components/form/ControllerInput";
import ControllerRoleSelector from "@/components/screens/signup/ControllerRoleSelector";
import { SignupUser } from "@/types/user";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import SubmitButton from "@/components/SubmitButton";
import { useTheme } from "@/hooks/useTheme";

const SignUp = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { signUp } = useSession();
  const { control, handleSubmit, formState } = useForm<any>({
    defaultValues: { role: t("common.patient").toLowerCase() },
  });

  const { isSubmitting, isValid } = formState;

  const onSubmit: SubmitHandler<
    SignupUser & { password: string; email: string }
  > = async (data) => {
    // Data without password
    const { email, password, ...rest } = data;

    // Need to handle errors
    await signUp(email, password, { ...rest }); // Due to how signUp is defined
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={62}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.keyboardAwareScrollView}
    >
      {/* Role Selector */}
      <ControllerRoleSelector
        control={control}
        name="role"
        rules={{ required: t("signup.please-select-a-role") }}
      />

      {/* First Name */}
      <ControllerInput
        control={control}
        rules={{
          required: t("signup.first-name-is-required"),
        }}
        name="firstName"
        label={t("signup.first-name")}
        placeholder={t("signup.e-g-john")}
        shouldRemoveWhitespace
      />

      {/* Last Name */}
      <ControllerInput
        control={control}
        rules={{
          required: t("signup.last-name-is-required"),
        }}
        name="lastName"
        label={t("signup.last-name")}
        placeholder={t("signup.e-g-doe")}
        shouldRemoveWhitespace
      />

      <Divider />

      {/* Email */}
      <ControllerInput
        control={control}
        rules={{
          required: t("common.email-required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("common.email-invalid"),
          },
        }}
        label={t("common.email")}
        name="email"
        placeholder={t("common.email-placeholder")}
      />

      {/* Password */}
      <ControllerInput
        control={control}
        name="password"
        label={t("common.password")}
        placeholder={t("common.password-placeholder")}
        rules={{
          required: t("common.password-required"),
          minLength: { value: 6, message: t("common.password-min-length") },
        }}
        sensitive
      />

      <TextRegular
        style={[styles.disclaimerText, { color: colors.mutedForeground }]}
      >
        {t("login.disclaimer-start")}{" "}
        <Link href="/terms-of-service">
          <TextSemiBold style={styles.linkText}>
            {t("login.terms")}
          </TextSemiBold>
        </Link>{" "}
        {t("login.and")}{" "}
        <Link href="/privacy-policy">
          <TextSemiBold style={styles.linkText}>
            {t("login.privacy")}
          </TextSemiBold>
        </Link>
        {t("login.period")}
      </TextRegular>

      {/* Agree Button */}
      <SubmitButton
        text={t("signup.agree-and-continue")}
        loading={isSubmitting}
        disabled={!isValid}
        onPress={handleSubmit(onSubmit)}
      />
    </KeyboardAwareScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAwareScrollView: {
    padding: 16,
    flexDirection: "column",
    gap: 16,
    position: "relative",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  disclaimerText: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 16,
    marginTop: 24,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  loginButtonContainer: {
    position: "relative",
    marginTop: 20,
  },
  error: {
    position: "absolute",
    top: -24,
    left: 0,
    color: Colors.pink,
    fontSize: 12,
  },
});
