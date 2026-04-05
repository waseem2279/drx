import { CountryCode } from "libphonenumber-js";
import { create } from "zustand";

export type Country = {
  code: CountryCode;
  name: string;
  dial_code: string;
  emoji: string;
};

interface CountryStoreState {
  country: Country;
  internationalPhoneNumber: string;
  setCountry: (country: Country) => void;
  setInternationalPhoneNumber: (phoneNumber: string) => void;
}

const useCountryStore = create<CountryStoreState>((set) => ({
  country: {
    name: "United States",
    code: "US",
    emoji: "🇺🇸",
    unicode: "U+1F1FA U+1F1F8",
    dial_code: "+1",
  },
  internationalPhoneNumber: "",
  setCountry: (country) => set({ country }),
  setInternationalPhoneNumber: (phoneNumber) =>
    set({ internationalPhoneNumber: phoneNumber }),
}));

// Selectors
export const useCountry = () => useCountryStore((state) => state.country);

export const useSetCountry = () => useCountryStore((state) => state.setCountry);

export const useInternationalPhoneNumber = () =>
  useCountryStore((state) => state.internationalPhoneNumber);

export const useSetInternationalPhoneNumber = () =>
  useCountryStore((state) => state.setInternationalPhoneNumber);
