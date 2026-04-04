import { IconProperties, PageListLinkProps } from "@/components/PageListLink";
import { TFunction } from "i18next";
import Colors from "./Colors";
import { VerificationStatus } from "@/types/user";
import { Href } from "expo-router";
import { PublicProfile } from "@/types/publicProfile";
import { FilterState } from "@/stores/useFilterStore";
import { ImageSourcePropType } from "react-native";

export const getMedicalRecordPages = (t: TFunction): PageListLinkProps[] => [
  {
    title: t("symptoms.allergies"),
    description: t("record.manage-your-allergies-and-intolerances"),
    href: "/(protected)/(tabs)/profile/medical-record/allergies",
  },
  {
    title: t("common.medications"),
    description: t("record.view-and-manage-your-current-medications"),
    href: "/(protected)/(tabs)/profile/medical-record/medications",
  },
  {
    title: t("record.diseases-and-conditions"),
    description: t("record.view-and-manage-your-diseases-and-conditions"),
    href: "/(protected)/(tabs)/profile/medical-record/conditions",
  },
];

export const getPatientPersonalInfoPages = (
  t: TFunction
): PageListLinkProps[] => [
  {
    title: t("page.account-info"),
    description: t("page.manage-your-personal-account-information"),
    href: "/(protected)/(tabs)/profile/account-info",
  },
];

export const getDoctorPersonalInfoPages = (
  t: TFunction,
  hasPublicProfile: boolean | undefined,
  verification: VerificationStatus | undefined
): PageListLinkProps[] => {
  const publicProfileIcon: IconProperties = {
    name: hasPublicProfile ? "check-circle" : "schedule",
    color: hasPublicProfile ? Colors.green : Colors.onlineConsultation,
  };

  const verificationIcon: IconProperties = {
    name: verification === "verified" ? "check-circle" : "error",
    color: verification === "verified" ? Colors.green : Colors.pink,
  };

  return [
    {
      title: t("page.account-info"),
      description: t("page.manage-your-personal-account-information"),
      href: "/(protected)/(tabs)/profile/account-info",
      icon: undefined,
    },
    {
      title: t("page.public-profile"),
      description: t(
        "page.manage-your-public-facing-profile-which-will-be-visible-to-patients"
      ),
      href: "/(protected)/(modals)/update-public-profile",
      icon: publicProfileIcon,
    },
    {
      title: t("page.my-services"),
      description: t("page.manage-the-services-you-offer-to-patients"),
      href: "/(protected)/my-services",
      icon: undefined,
    },
    {
      title: t("page.verification"),
      description: t(
        "page.verify-your-doctor-account-in-order-for-you-to-be-visible-to-patients"
      ),
      href: "/(protected)/(modals)/doctor-verification",
      icon: verificationIcon,
    },
  ];
};

export const getDoctorCountries = (t: TFunction) => [
  {
    name: t("home.american-doctors"),
    image: require("@/../assets/images/countries/us.png"),
    backgroundColor: "#FFD79F",
    filter: "us",
  },
  {
    name: t("home.arabic-doctors"),
    image: require("@/../assets/images/countries/sa.png"),
    backgroundColor: "#F4BCFF",
    filter: "sa",
  },
  {
    name: t("home.indian-doctors"),
    image: require("@/../assets/images/countries/in.png"),
    backgroundColor: "#FFBCBD",
    filter: "in",
  },
  {
    name: t("home.european-doctors"),
    image: require("@/../assets/images/countries/eu.png"),
    backgroundColor: "#CDEAFB",
    filter: "eu",
  },
];

export const getCountryOptions = (t: TFunction) => [
  { label: t("countries.united-states"), value: "us" },
  { label: t("countries.egypt"), value: "eg" },
  { label: t("countries.jordan"), value: "jo" },
  { label: t("countries.india"), value: "in" },
  { label: t("countries.france"), value: "fr" },
  { label: t("countries.germany"), value: "de" },
  { label: t("countries.greece"), value: "gr" },
  { label: t("countries.hungary"), value: "hu" },
  { label: t("countries.iceland"), value: "is" },
  { label: t("countries.ireland"), value: "ie" },
  { label: t("countries.italy"), value: "it" },
  { label: t("countries.kosovo"), value: "xk" },
  { label: t("countries.spain"), value: "es" },
  { label: t("countries.sweden"), value: "se" },
  { label: t("countries.switzerland"), value: "ch" },
  { label: t("countries.united-kingdom"), value: "gb" },
];

export const getFilterMap = (t: TFunction) => ({
  fallback: {
    title: t("symptoms.error.title"),
    description: t("symptoms.error.description"),
    image: null,
    key: null,
    filters: [],
  },
  us: {
    title: t("home.american-doctors"),
    description: t("symptoms.doctors-licensed-in-the-us"),
    image: undefined,
    key: "countries",
    filters: ["us"],
  },
  sa: {
    title: t("home.arabic-doctors"),
    description: t("symptoms.doctors-licensed-in-arabic-countries"),
    image: undefined,
    key: "countries",
    filters: ["eg", "jo"],
  },
  in: {
    title: t("home.indian-doctors"),
    description: t("symptoms.doctors-licensed-in-india"),
    image: undefined,
    key: "countries",
    filters: ["in"],
  },
  eu: {
    title: t("home.european-doctors"),
    description: t("symptoms.doctors-licensed-in-european-countries"),
    image: undefined,
    key: "countries",
    filters: [
      "fr",
      "de",
      "gr",
      "hu",
      "is",
      "ie",
      "it",
      "xk",
      "es",
      "se",
      "ch",
      "gb",
    ],
  },
  diarrhea: {
    title: t("symptoms.diarrhea"),
    description: t("symptoms.doctors-who-treat-the-symptoms-of-diarrhea"),
    image: require("@/../assets/images/symptoms/diarrhea.png"),
    key: "specializations",
    filters: ["gastroenterology", "internal medicine", "family medicine"],
  },
  acne: {
    title: t("symptoms.acne"),
    description: t("symptoms.doctors-who-treat-acne-and-skin-conditions"),
    image: require("@/../assets/images/symptoms/acne.png"),
    key: "specializations",
    filters: ["general practice", "dermatology", "family medicine"],
  },
  heart: {
    title: t("symptoms.heart-conditions"),
    description: t("symptoms.doctors-specializing-in-heart-health"),
    image: require("@/../assets/images/symptoms/heart.png"),
    key: "specializations",
    filters: ["cardiology", "internal medicine", "family medicine"],
  },
  allergies: {
    title: t("symptoms.allergies"),
    description: t(
      "symptoms.doctors-who-treat-allergies-and-related-conditions"
    ),
    image: require("@/../assets/images/symptoms/allergies.png"),
    key: "specializations",
    filters: ["allergy and immunology", "family medicine"],
  },
  depression: {
    title: t("symptoms.depression"),
    description: t(
      "symptoms.doctors-who-specialize-in-mental-health-and-depression"
    ),
    image: require("@/../assets/images/symptoms/depression.png"),
    key: "specializations",
    filters: ["psychiatry", "family medicine"],
  },
  uti: {
    title: t("symptoms.uti"),
    description: t("symptoms.doctors-who-treat-urinary-tract-infections"),
    image: require("@/../assets/images/symptoms/uti.png"),
    key: "specializations",
    filters: ["urology", "internal medicine", "family medicine"],
  },
});

export const getDayOptions = (t: TFunction) => [
  { label: t("days.sunday"), value: "sunday" },
  { label: t("days.monday"), value: "monday" },
  { label: t("days.tuesday"), value: "tuesday" },
  { label: t("days.wednesday"), value: "wednesday" },
  { label: t("days.thursday"), value: "thursday" },
  { label: t("days.friday"), value: "friday" },
  { label: t("days.saturday"), value: "saturday" },
];

export const getLanguageOptions = (t: TFunction) => [
  { label: t("languages.english"), value: "en" },
  { label: t("languages.arabic"), value: "ar" },
  { label: t("languages.hindi"), value: "hi" },
];

export const getPatientActions = (t: TFunction) => [
  {
    name: t("actions.find-a-provider"),
    description: t("actions.browse-and-choose-the-perfect-doctor"),
    icon: "stethoscope",
    href: "/search" as Href,
    filters: {} as FilterState,
  },
  {
    name: t("actions.update-your-medical-record"),
    description: t("actions.an-up-to-date-record-is-recommended"),
    icon: "ecg-heart",
    href: "/(tabs)/profile/medical-record" as Href,
    filters: {} as FilterState,
  },
  // {
  //   name: t("actions.view-your-cases"),
  //   description: t("actions.browse-your-pending-cases"),
  //   icon: "library-books",
  //   href: "/search" as Href,
  // },
];

export const getPatientLinks = (t: TFunction) => [
  {
    icon: "account-circle",
    label: t("profile.manage-your-personal-information"),
    url: "/(tabs)/profile/personal",
  },
  {
    icon: "medical-information",
    label: t("profile.view-your-medical-record"),
    url: "/(tabs)/profile/medical-record",
  },
  // {
  //   icon: "card-outline",
  //   label: "Payment methods",
  //   url: "/(tabs)/profile/payment-methods",
  // },
  {
    icon: "privacy-tip",
    label: t("profile.view-our-apps-privacy-policy"),
    url: "/privacy-policy",
  },
  {
    icon: "contract",
    label: t("profile.view-our-apps-terms-of-service"),
    url: "/terms-of-service",
  },
  {
    icon: "settings",
    label: t("profile.change-the-app-settings"),
    url: "/(tabs)/profile/settings",
  },
  {
    icon: "support-agent",
    label: t("profile.contact-support"),
    url: "/support",
  },
];

export const getDoctorLinks = (t: TFunction) => [
  {
    icon: "account-circle",
    label: t("profile.manage-your-personal-information"),
    url: "/(tabs)/profile/personal",
  },
  {
    icon: "clinical-notes",
    label: t("profile.view-your-patients"),
    url: "/(tabs)/profile/patients",
  },
  // {
  //   icon: "card-outline",
  //   label: "Payment methods",
  //   url: "/(tabs)/profile/payment-methods",
  // },
  {
    icon: "privacy-tip",
    label: t("profile.view-our-apps-privacy-policy"),
    url: "/privacy-policy",
  },
  {
    icon: "contract",
    label: t("profile.view-our-apps-terms-of-service"),
    url: "/terms-of-service",
  },
  {
    icon: "settings",
    label: t("profile.change-the-app-settings"),
    url: "/(tabs)/profile/settings",
  },
  {
    icon: "support-agent",
    label: t("profile.contact-support"),
    url: "/support",
  },
];

export type ServiceItem = {
  name: string;
  image: ImageSourcePropType;
  buttonText: string;
  backgroundColor: string;
  href: Href;
  filters: FilterState;
};

export const getOurServices = (t: TFunction): ServiceItem[] => [
  {
    name: t("services.get-peace-of-mind-with-an-expert-second-opinion"),
    buttonText: t("services.start-a-request"),
    image: require("@/../assets/images/services/relax.png"),
    backgroundColor: "#F4BCFF",
    href: "/(protected)/(modals)/create-second-opinion" as Href,
    filters: {},
  },
  {
    name: t("services.have-a-doctor-review-your-radiology-scans"),
    buttonText: t("services.submit-a-review"),
    image: require("@/../assets/images/services/radiology.png"),
    backgroundColor: "#CDEAFB",
    href: "/search" as Href,
    filters: {
      services: ["radiology"],
    },
  },
  {
    name: t("services.in-egypt-request-in-home-care-today"),
    buttonText: t("services.discover-in-home-care"),
    image: require("@/../assets/images/services/home.png"),
    backgroundColor: "#FFD79F",
    href: "/search" as Href,
    filters: {
      services: ["inHomeCare"],
    },
  },
  {
    name: t("services.start-your-weight-loss-journey-with-drx"),
    buttonText: t("services.find-a-doctor"),
    image: require("@/../assets/images/services/runners.png"),
    backgroundColor: "#B0C1BF",
    href: "/search" as Href,
    filters: {
      services: ["weightLoss"],
    },
  },
];

export const getDoctorLabels = (t: TFunction) => [
  {
    value: "doctor",
    label: t("practitioners.physician"),
    color: Colors.skyBlue,
  },
  {
    value: "nurse",
    label: t("practitioners.nurse"),
    color: Colors.red,
  },
  {
    value: "intern",
    label: t("practitioners.medical-intern"),
    color: Colors.magenta,
  },
];

export const getSpecializations = (t: TFunction) => [
  {
    value: "general practice",
    label: t("specializations.general-practice"),
  },
  {
    value: "pediatrics",
    label: t("specializations.pediatrics"),
  },
  {
    value: "cardiology",
    label: t("specializations.cardiology"),
  },
  {
    value: "dermatology",
    label: t("specializations.dermatology"),
  },
  {
    value: "oncology",
    label: t("specializations.oncology"),
  },
  {
    value: "neurology",
    label: t("specializations.neurology"),
  },
  {
    value: "ophthalmology",
    label: t("specializations.ophthalmology"),
  },
  {
    value: "orthopedics",
    label: t("specializations.orthopedics"),
  },
  {
    value: "psychiatry",
    label: t("specializations.psychiatry"),
  },
  {
    value: "neurosurgery",
    label: t("specializations.neurosurgery"),
  },
  {
    value: "allergy and immunology",
    label: t("specializations.allergy-and-immunology"),
  },
  {
    value: "anesthesiology",
    label: t("specializations.anesthesiology"),
  },
  {
    value: "diagnostic radiology",
    label: t("specializations.diagnostic-radiology"),
  },
  {
    value: "emergency medicine",
    label: t("specializations.emergency-medicine"),
  },
  {
    value: "family medicine",
    label: t("specializations.family-medicine"),
  },
  {
    value: "internal medicine",
    label: t("specializations.internal-medicine"),
  },
  {
    value: "medical genetics",
    label: t("specializations.medical-genetics"),
  },
  {
    value: "nuclear medicine",
    label: t("specializations.nuclear-medicine"),
  },
  {
    value: "obstetrics and gynecology",
    label: t("specializations.obstetrics-and-gynecology"),
  },
  {
    value: "pathology",
    label: t("specializations.pathology"),
  },
  {
    value: "rehab",
    label: t("specializations.rehab"),
  },
  {
    value: "preventive medicine",
    label: t("specializations.preventive-medicine"),
  },
  {
    value: "radiation oncology",
    label: t("specializations.radiation-oncology"),
  },
  {
    value: "surgery",
    label: t("specializations.surgery"),
  },
  {
    value: "urology",
    label: t("specializations.urology"),
  },
  {
    value: "gastroenterology",
    label: t("specializations.gastroenterology"),
  },
];

export const getPatientSymptoms = (t: TFunction) => [
  {
    name: t("symptoms.diarrhea"),
    image: require("@/../assets/images/symptoms/diarrhea.png"),
    filter: "diarrhea",
  },
  {
    name: t("symptoms.acne"),
    image: require("@/../assets/images/symptoms/acne.png"),
    filter: "acne",
  },
  {
    name: t("symptoms.heart"),
    image: require("@/../assets/images/symptoms/heart.png"),
    filter: "heart",
  },
  {
    name: t("symptoms.allergies"),
    image: require("@/../assets/images/symptoms/allergies.png"),
    filter: "allergies",
  },
  {
    name: t("symptoms.depression"),
    image: require("@/../assets/images/symptoms/depression.png"),
    filter: "depression",
  },
  {
    name: t("symptoms.uti"),
    image: require("@/../assets/images/symptoms/uti.png"),
    filter: "uti",
  },
];

export const getTabs = (t: TFunction) => [
  { name: t("common.all"), id: "all" },
  { name: t("common.ongoing"), id: "ongoing" },
  { name: t("common.finished"), id: "finished" },
  { name: t("common.pending"), id: "pending" },
];

export const getServiceOptions = (t: TFunction) => [
  { label: t("service.consultations"), value: "consultation" },
  { label: t("service.radiology-review"), value: "radiology" },
  { label: t("service.second-opinion"), value: "secondOpinion" },
  { label: t("service.weight-loss"), value: "weightLoss" },
  { label: t("service.in-home-care"), value: "inHomeCare" },
];

export const getServicesList = (
  t: TFunction
): {
  id: string;
  priceLabel: keyof PublicProfile;
  title: string;
  description: string;
}[] => [
  {
    id: "consultation",
    priceLabel: "consultationPrice",
    title: t("service.consultations"),
    description: t(
      "service.provide-general-health-advice-via-virtual-appointments"
    ),
  },
  {
    id: "radiology",
    priceLabel: "radiologyPrice",
    title: t("service.radiology-review"),
    description: t(
      "service.review-diagnoses-or-treatment-plans-to-offer-expert-insight"
    ),
  },
  {
    id: "secondOpinion",
    priceLabel: "secondOpinionPrice",
    title: t("service.second-opinion"),
    description: t("service.interpret-and-provide-insight-on-imaging-results"),
  },
  {
    id: "weightLoss",
    priceLabel: "weightLossPrice",
    title: t("service.weight-loss"),
    description: t(
      "service.support-patients-in-their-weight-loss-journey-with-personalized-plans"
    ),
  },
  {
    id: "inHomeCare",
    priceLabel: "inHomeCarePrice",
    title: t("service.in-home-care"),
    description: t(
      "service.offer-medical-support-through-home-visits-or-remote-monitoring"
    ),
  },
];
