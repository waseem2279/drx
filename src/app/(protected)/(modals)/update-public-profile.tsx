import { router } from "expo-router";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import Colors from "@/constants/Colors";
import { useUserData } from "@/stores/useUserStore";
import { db } from "../../../../firebaseConfig";

import Divider from "@/components/Divider";
import ControllerCheckBoxOptions from "@/components/form/ControllerCheckBoxOptions";
import ControllerInput from "@/components/form/ControllerInput";
import FormPage from "@/components/FormPage";
import LoadingScreen from "@/components/LoadingScreen";
import { TextSemiBold } from "@/components/StyledText";
import UserAvatar from "@/components/UserAvatar";
import { getDoctorLabels } from "@/constants/options";
import { useTranslation } from "react-i18next";
import { getCountryOptions } from "@/constants/options";
import ControllerAvailability from "@/components/form/ControllerAvailability";
import { PublicProfile } from "@/types/publicProfile";
import { getCalendars } from "expo-localization";
import ControllerLocator from "@/components/form/ControllerLocator";
import { usePublicProfile } from "@/stores/usePublicProfileStore";
import useAppContent from "@/hooks/useAppContent";

const UpdatePublicProfile = () => {
  const { t } = useTranslation();
  const publicProfile = usePublicProfile();
  const userData = useUserData();
  const { specialties } = useAppContent();
  const { control, handleSubmit, formState, watch, setValue } =
    useForm<PublicProfile>({
      mode: "onChange",
      defaultValues: async () => {
        const fallback: any = {
          doctorLabel: "doctor",
          coordinates: null,
          specializations: [],
          languages: [],
          experience: "",
          biography: "",
          countries: [],
          consultationDuration: "15",
          timeZone: getCalendars()[0].timeZone,
          availability: {
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
          },
        };

        if (!publicProfile) return fallback;

        return {
          ...fallback,
          ...publicProfile, // This takes precedence over fallback, overwriting any defaults
        };
      },
    });

  const { isDirty, isValid, isSubmitting, isLoading } = formState;

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    if (!userData) return;
    try {
      await setDoc(
        doc(db, "publicProfiles", userData.uid),
        {
          ...publicProfile,
          ...formData,
          uid: userData.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          image: userData.image || null,
          updatedAt: Timestamp.now(),
        },
        {
          merge: true,
        }
      );

      if (!userData.hasPublicProfile) {
        await setDoc(
          doc(db, "users", userData.uid),
          {
            hasPublicProfile: true,
          },
          { merge: true }
        );
      }

      router.back();
    } catch (error) {
      console.error("Error updating public profile:", error);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <FormPage
        canSubmit={isValid && isDirty}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <View style={styles.header}>
          <UserAvatar size={48} />
          <View>
            <TextSemiBold style={styles.nameText}>
              {t("common.doctor-title", {
                firstName: userData?.firstName,
                lastName: userData?.lastName,
              })}
            </TextSemiBold>
            <TextSemiBold style={styles.roleText}>
              {t("common.doctor")}
            </TextSemiBold>
          </View>
        </View>

        <ControllerCheckBoxOptions
          label={t("form.which-best-describes-your-role")}
          name="doctorLabel"
          control={control}
          rules={{ required: t("form.a-role-is-required") }}
          options={getDoctorLabels(t)}
          singleSelect
        />

        <ControllerCheckBoxOptions
          label={t("common.languages")}
          name="languages"
          control={control}
          rules={{ required: t("form.at-least-one-language-is-required") }}
          options={[
            { label: t("languages.english"), value: "en" },
            { label: t("languages.arabic"), value: "ar" },
            { label: t("languages.hindi"), value: "hi" },
          ]}
        />

        <ControllerCheckBoxOptions
          label={t("form.countries-you-are-licensed-in")}
          name="countries"
          control={control}
          rules={{ required: t("form.at-least-one-country-is-required") }}
          options={getCountryOptions(t)}
        />

        <ControllerInput
          label={t("form.experience-in-years")}
          placeholder={t("form.e-g-5")}
          name="experience"
          control={control}
          rules={{
            required: t("form.experience-is-required"),
            pattern: {
              value: /^\d+$/,
              message: t("form.must-be-a-valid-number"),
            },
          }}
          keyboardType="numeric"
        />

        <Divider />

        <ControllerInput
          label={t("form.biography")}
          placeholder={t("form.tell-us-about-yourself")}
          name="biography"
          control={control}
          rules={{ required: t("form.biography-is-required") }}
          multiline
          textInputStyle={{ height: 128 }}
        />

        <Divider />

        <ControllerLocator name="coordinates" control={control} />

        <Divider />

        <ControllerCheckBoxOptions
          label={t("common.specializations")}
          name="specializations"
          control={control}
          rules={{
            required: t("form.at-least-one-specialization-is-required"),
          }}
          options={specialties}
        />

        <Divider />

        <ControllerInput
          label={t("form.how-long-are-your-calls-in-minutes")}
          placeholder={t("form.e-g-15")}
          name="consultationDuration"
          control={control}
          rules={{
            required: t("form.duration-is-required"),
            pattern: {
              value: /^\d+$/,
              message: t("form.must-be-a-valid-number"),
            },
            validate: (value) =>
              (typeof value === "string" && parseInt(value, 10) >= 15) ||
              t("form.minimum-15-minutes"),
          }}
          keyboardType="numeric"
        />

        <ControllerAvailability
          label={t("form.availability")}
          control={control}
          name="availability"
          setValue={setValue}
          watch={watch}
        />
      </FormPage>
    </View>
  );
};

export default UpdatePublicProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", gap: 16, alignItems: "center" },
  nameText: { fontSize: 20, color: "#000" },
  roleText: { fontSize: 14, color: Colors.onlineConsultation },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  timeslotHeader: {
    fontSize: 14,
    color: Colors.black,
    textTransform: "capitalize",
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
    marginVertical: 4,
  },
  timeslotCount: {
    fontSize: 14,
    color: Colors.black,
    width: 24,
    textAlign: "center",
  },
});
