import ControllerInput from "@/components/form/ControllerInput";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import SubmitButton from "@/components/SubmitButton";
import Colors from "@/constants/Colors";
import { useSession } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { FirebaseError } from "firebase/app";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import CustomIcon from "@/components/CustomIcon";
import OrDivider from "@/components/OrDivider";
import { useClearDisclaimer, useDisclaimer } from "@/stores/useDisclaimerStore";
import { useTheme } from "@/hooks/useTheme";

const SignIn = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { signIn } = useSession();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const disclaimer = useDisclaimer();
  const clearDisclaimer = useClearDisclaimer();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    clearDisclaimer();
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      setError("other", {
        type: "custom",
        message: getErrorMessage(error, t),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={62}
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
      contentContainerStyle={styles.keyboardAwareScrollView}
    >
      <TextSemiBold style={styles.headerText}>{t("login.header")}</TextSemiBold>

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
        sensitive
        rules={{
          required: t("common.password-required"),
          minLength: { value: 6, message: t("common.password-min-length") },
        }}
      />

      <View style={styles.loginButtonContainer}>
        {typeof errors.other?.message === "string" && (
          <TextRegular style={styles.error}>{errors.other.message}</TextRegular>
        )}
        <SubmitButton
          text={t("login.login")}
          loading={loading}
          disabled={loading}
          onPress={() => {
            clearErrors("other");
            handleSubmit(onSubmit)();
          }}
        />
      </View>

      <OrDivider />

      <SubmitButton
        text={t("login.signup")}
        variant="secondary"
        disabled={loading}
        onPress={() => router.navigate("/signup")}
      />

      <View style={styles.forgotContainer}>
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => router.navigate("/forgot-password")}
        >
          <CustomIcon
            name="data-loss-prevention"
            size={24}
            color={Colors.black}
          />
          <TextSemiBold style={styles.forgotButtonText}>
            {t("recover.recover-my-account")}
          </TextSemiBold>
        </TouchableOpacity>
      </View>

      {disclaimer && (
        <TextSemiBold style={styles.disclaimer}>{disclaimer}</TextSemiBold>
      )}
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

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
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 24,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  loginButtonContainer: {
    position: "relative",
    marginTop: 20,
  },
  disclaimer: {
    width: "100%",
    textAlign: "center",
    marginTop: 16,
    color: Colors.green,
    fontSize: 14,
  },
  error: {
    position: "absolute",
    top: -24,
    left: 0,
    color: Colors.pink,
    fontSize: 12,
  },
  forgotContainer: { flex: 1, alignItems: "center", marginTop: 16 },
  forgotButton: { flexDirection: "row", alignItems: "center", gap: 8 },
  forgotButtonText: {
    fontSize: 14,
    color: Colors.black,
  },
});

function getErrorMessage(
  error: FirebaseError,
  t: (key: string) => string,
): string {
  if (error instanceof Error && error.cause === "email-not-verified") {
    return t("login.error.please-verify-your-email-before-signing-in");
  }

  if (!(error instanceof FirebaseError)) {
    return t("login.error.unknown");
  }

  switch (error.code) {
    case "auth/invalid-credential":
      return t("login.error.invalid-credentials");
    default:
      return t("login.error.unknown");
  }
}
