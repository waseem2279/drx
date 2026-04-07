import { ActivityIndicator, Alert, Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import { useImagePicker } from "@/hooks/useImagePicker";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../../../../firebaseConfig";

import { uploadFile } from "@/api/files";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useUserData } from "@/stores/useUserStore";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

const DoctorVerification = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { pickImage, isUploading } = useImagePicker();
  const userData = useUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uri, setUri] = useState<string | null>(null);

  const isPending = userData?.verification === "pending";
  const isVerified = userData?.verification === "verified";

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) setUri(imageUri);
  };

  const handleSubmit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !uri) return;

    setIsSubmitting(true);

    try {
      const url = await uploadFile(uri, `licenses/${uid}.jpg`);
      if (!url) throw new Error("Upload failed");

      await setDoc(doc(db, "pendingVerifications", uid), {
        uid,
        licenseImage: url,
        submittedAt: new Date(),
      });

      await updateDoc(doc(db, "users", uid), {
        verification: "pending",
        licenseImage: url,
      });

      Alert.alert(
        t("verification.submitted"),
        t("verification.verification-successfully-submitted"),
      );
    } catch (err) {
      console.error("Error submitting verification:", err);
      Alert.alert(
        t("verification.error"),
        t("verification.something-went-wrong-please-try-again"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.background,
        padding: 20,
      }}
    >
      {isVerified ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <TextSemiBold
            style={{
              fontSize: 18,
              color: Colors.green,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {t("verification.youre-verified")}
          </TextSemiBold>
          <TextRegular
            style={{
              fontSize: 14,
              color: colors.mutedForeground,
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            {t(
              "verification.youve-already-been-approved-and-are-visible-to-patients",
            )}
          </TextRegular>
        </View>
      ) : isPending ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <TextSemiBold
            style={{
              fontSize: 18,
              color: colors.mutedForeground,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {t("verification.your-verification-is-currently-pending")}
          </TextSemiBold>
          <TextRegular
            style={{
              fontSize: 14,
              color: colors.mutedForeground,
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            {t(
              "verification.well-notify-you-once-your-license-has-been-reviewed-and-approved",
            )}
          </TextRegular>
        </View>
      ) : (
        <>
          <TextSemiBold
            style={{
              fontSize: 18,
              marginBottom: 16,
              color: colors.foreground,
            }}
          >
            {t("verification.upload-your-medical-license")}
          </TextSemiBold>

          <Pressable
            onPress={handlePickImage}
            disabled={isUploading || isSubmitting}
            style={{
              width: 220,
              height: 220,
              backgroundColor: uri ? "transparent" : colors.muted,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              overflow: "hidden",
            }}
          >
            {uri ? (
              <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%", borderRadius: 16 }}
              />
            ) : isUploading ? (
              <ActivityIndicator />
            ) : (
              <TextRegular style={{ color: colors.mutedForeground }}>
                {t("verification.tap-to-upload")}
              </TextRegular>
            )}
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={!uri || isSubmitting || isUploading}
            style={{
              width: "100%",
              backgroundColor:
                !uri || isSubmitting || isUploading
                  ? colors.mutedForeground
                  : Colors.green,
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <TextSemiBold
                style={{
                  color: colors.background,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {t("verification.submit-for-verification")}
              </TextSemiBold>
            )}
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
};

export default DoctorVerification;
