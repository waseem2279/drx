import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../firebaseConfig";
import { FilterState } from "./useFilterStore";

interface DoctorStoreState {
  doctors: any[];
  isFetchingDoctors: boolean;
  error: string | null;
  cache: Record<string, any[]>;

  fetchDoctorsByField: (field: string, values: string[]) => Promise<any[]>;
  fetchSomeDoctors: () => Promise<void>;
}

const useDoctorStore = create<DoctorStoreState>((set, get) => ({
  doctors: [],
  isFetchingDoctors: false,
  error: null,
  cache: {},

  // Actions
  fetchDoctorsByField: async (field: string, values: string[]) => {
    if (!field || values.length === 0) return [];

    const cacheKey = `${field}:${values.sort().join(",")}`;
    const { cache, doctors } = get();

    if (cache[cacheKey]) {
      // Optionally, merge cached doctors into the state
      set((state) => ({
        doctors: mergeUniqueDoctors(state.doctors, cache[cacheKey]),
      }));
      return cache[cacheKey];
    }

    try {
      const doctorsRef = collection(db, "publicProfiles");
      const q =
        values.length === 1
          ? query(doctorsRef, where(field, "array-contains", values[0]))
          : query(doctorsRef, where(field, "array-contains-any", values));

      const querySnapshot = await getDocs(q);
      const fetchedDoctors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update cache and doctors state
      set((state) => ({
        cache: { ...state.cache, [cacheKey]: fetchedDoctors },
        doctors: mergeUniqueDoctors(state.doctors, fetchedDoctors),
      }));

      return fetchedDoctors;
    } catch (error) {
      console.error(`Error fetching doctors by ${field}:`, error);
      return [];
    }
  },

  fetchSomeDoctors: async () => {
    set({ isFetchingDoctors: true, error: null });

    try {
      const doctorsRef = collection(db, "publicProfiles");
      const q = query(doctorsRef, limit(25));
      const querySnapshot = await getDocs(q);

      const doctorsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({ doctors: doctorsList });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      set({ error: "Failed to load doctors. Please try again." });
    } finally {
      set({ isFetchingDoctors: false });
    }
  },
}));

// Helper to merge doctors and avoid duplicates
const mergeUniqueDoctors = (existing: any[], incoming: any[]) => {
  const existingIds = new Set(existing.map((doc) => doc.id));
  const newDoctors = incoming.filter((doc) => !existingIds.has(doc.id));
  return [...existing, ...newDoctors];
};

// Selectors
export const useDoctors = () => useDoctorStore((state) => state.doctors);

export const useIsFetchingDoctors = () =>
  useDoctorStore((state) => state.isFetchingDoctors);

export const useDoctorsError = () => useDoctorStore((state) => state.error);

export const useFetchDoctorsByField = () =>
  useDoctorStore((state) => state.fetchDoctorsByField);

export const useFetchSomeDoctors = () =>
  useDoctorStore((state) => state.fetchSomeDoctors);

// Filtered doctors list
export const useFilteredDoctors = (filters: FilterState) => {
  const doctors = useDoctors();
  const { specialty, providerLanguages, services } = filters;

  console.log("Filtering doctors with:", filters);
  const normalizedSpecialty = specialty?.toLowerCase();
  const normalizedLanguages = Array.isArray(providerLanguages)
    ? providerLanguages.map((lang) => lang.toLowerCase())
    : [];
  const normalizedServices = Array.isArray(services)
    ? services.map((service) => service.toLowerCase())
    : [];

  let filteredDoctors = doctors;

  // Filter by specialty
  if (normalizedSpecialty && normalizedSpecialty !== "all") {
    filteredDoctors = filteredDoctors.filter((doctor) =>
      doctor.specializations?.some(
        (spec: string) => spec?.toString().toLowerCase() === normalizedSpecialty
      )
    );
  }

  // Filter by languages
  if (normalizedLanguages.length > 0) {
    filteredDoctors = filteredDoctors.filter((doctor) =>
      doctor.languages?.some((lang: string) =>
        normalizedLanguages.includes(lang.toLowerCase())
      )
    );
  }

  // Filter by provided services
  if (normalizedServices.length > 0) {
    filteredDoctors = filteredDoctors.filter((doctor) =>
      doctor.services?.some((service: string) =>
        normalizedServices.includes(service.toLowerCase())
      )
    );
  }

  return filteredDoctors;
};

// Get a doctor by ID
export const useDoctorById = (doctorId: string) => {
  const doctors = useDoctors();
  return doctors.find((doctor) => doctor.id === doctorId) || null;
};
