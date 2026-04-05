export type TimeValue = {
  hour: number;
  minute: number;
};

export type AvailabilitySlot = {
  start: TimeValue | null;
  end: TimeValue | null;
};

export const AVAILABILITY_DAY_KEYS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
] as const;

export type AvailabilityDayKey = (typeof AVAILABILITY_DAY_KEYS)[number];

export type Availability = Record<AvailabilityDayKey, AvailabilitySlot[]>;

export type PublicProfile = {
  doctorLabel: "doctor" | "nurse" | "intern";
  image?: string;
  name?: string;
  firstName?: string;
  lastName?: string;

  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  specializations: string[];
  languages: string[];
  experience: string;
  biography: string;
  countries: string[];
  consultationPrice: string;
  secondOpinionPrice: string;
  weightLossPrice: string;
  radiologyPrice: string;
  inHomeCarePrice: string;
  services: string[];
  consultationDuration: string;
  availability: Availability;
  timeZone: string | null;
};
