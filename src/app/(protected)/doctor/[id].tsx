import { db } from "@/../firebaseConfig";
import Avatar from "@/components/Avatar";
import LoadingScreen from "@/components/LoadingScreen";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import CustomIcon from "@/components/CustomIcon";
import Biography from "@/components/screens/doctor/Biography";
import Specializations from "@/components/screens/doctor/Specializations";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getLanguageOptions } from "@/constants/options";
import { PublicProfile } from "@/types/publicProfile";
import ContainerView from "@/components/ContainerView";

const Page = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [doctor, setDoctor] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const publicProfileRef = doc(db, "publicProfiles", id);
        const docSnap = await getDoc(publicProfileRef);

        if (docSnap.exists()) {
          setDoctor(docSnap.data() as PublicProfile);
        } else {
          setError("Doctor profile not found");
        }
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError("Failed to load doctor profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDoctorProfile();
  }, [id]);

  const handleBooking = () => {
    router.navigate(`/doctor/booking?id=${id}`);
  };

  const languageLabel = (() => {
    if (!doctor?.languages?.length) return "-";

    return doctor.languages
      .map(
        (code) =>
          getLanguageOptions(t).find((opt) => opt.value === code)?.label ||
          code,
      )
      .join(t("common.list-separator"));
  })();

  if (!id) {
    return (
      <View style={styles.centered}>
        <TextRegular style={styles.errorText}>
          Doctor profile not found
        </TextRegular>
      </View>
    );
  }

  if (isLoading) return <LoadingScreen />;

  if (error || !doctor) {
    return (
      <View style={styles.centered}>
        <TextRegular style={styles.errorText}>
          {error || "Doctor not found"}
        </TextRegular>
      </View>
    );
  }

  return (
    <ContainerView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar
              size={64}
              source={doctor.image || undefined}
              initials={
                (doctor.firstName?.[0] || "") + (doctor.lastName?.[0] || "")
              }
            />

            <View style={styles.profileTextWrap}>
              <TextSemiBold
                style={styles.doctorName}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                Dr. {doctor.firstName} {doctor.lastName}
              </TextSemiBold>

              {!!doctor.timeZone && (
                <TextRegular style={styles.subtleText} numberOfLines={1}>
                  {doctor.timeZone}
                </TextRegular>
              )}
            </View>
          </View>

          <View style={styles.specializationsWrap}>
            <Specializations doctor={doctor} />
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <InfoRow
            icon={
              <Ionicons
                name="time-outline"
                size={20}
                color={Colors.black || "#111"}
              />
            }
            title={t("common.time-zone")}
            description={t("doctor.time-zone-description", {
              lastName: doctor.lastName,
              timeZone: doctor.timeZone,
            })}
          />

          <View style={styles.divider} />

          <InfoRow
            icon={
              <Ionicons
                name="language"
                size={20}
                color={Colors.black || "#111"}
              />
            }
            title={t("common.languages")}
            description={t("doctor.doctor-speaks", {
              firstName: doctor.firstName,
              languages: languageLabel,
            })}
          />

          <View style={styles.divider} />

          <InfoRow
            icon={
              <CustomIcon
                name="briefcase"
                size={20}
                color={Colors.black || "#111"}
              />
            }
            title={t("common.experience")}
            description={t("doctor.experience-description", {
              lastName: doctor.lastName,
              count: Number(doctor.experience),
            })}
          />
        </View>

        <Biography doctor={doctor} />
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[styles.ctaContainer, { paddingBottom: 16 + insets.bottom }]}
      >
        <View style={styles.priceBlock}>
          <TextRegular style={styles.priceLabel}>
            {t("common.consultation-price")}
          </TextRegular>
          <TextSemiBold style={styles.priceValue}>
            ${doctor.consultationPrice}
          </TextSemiBold>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.bookButton}
          onPress={handleBooking}
        >
          <TextSemiBold style={styles.bookButtonText}>
            {t("comon.book")}
          </TextSemiBold>
        </TouchableOpacity>
      </View>
    </ContainerView>
  );
};

type InfoRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const InfoRow = ({ icon, title, description }: InfoRowProps) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconWrap}>{icon}</View>

      <View style={styles.infoContent}>
        <TextSemiBold style={styles.infoTitle}>{title}</TextSemiBold>
        <TextRegular style={styles.infoDescription}>{description}</TextRegular>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F8FAFC",
  },
  errorText: {
    fontSize: 16,
    color: "#667085",
    textAlign: "center",
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  profileTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  doctorName: {
    fontSize: 22,
    lineHeight: 28,
    color: "#101828",
  },
  subtleText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: "#667085",
  },
  specializationsWrap: {
    marginTop: 16,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
    minWidth: 0,
  },
  infoTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#101828",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#667085",
    flexWrap: "wrap",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEF2F6",
    marginVertical: 16,
  },

  ctaContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#EEF2F6",
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  priceBlock: {
    flex: 1,
    minWidth: 0,
  },
  priceLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.lightText || "#667085",
  },
  priceValue: {
    marginTop: 2,
    fontSize: 24,
    lineHeight: 30,
    color: Colors.black || "#101828",
  },
  bookButton: {
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 20,
  },
});

export default Page;
