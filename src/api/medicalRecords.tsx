import { MedicalRecord } from "@/types/medicalRecord";
import { SignupUser, User } from "@/types/user";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  WriteBatch,
} from "@firebase/firestore";
import { nanoid } from "nanoid";
import { auth, db } from "../../firebaseConfig";

export type FieldCategory = "medications" | "allergies" | "conditions";

export async function createMedicalRecord(
  batch: WriteBatch,
  user: SignupUser & Pick<User, "uid" | "email" | "createdAt">
) {
  const initialMedicalRecord = {
    patientId: user.uid,
    doctorIds: [],

    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: null,
    gender: "",

    medications: [],
    allergies: [],
    screenings: [],
    vaccinations: [],
    personalHistory: [],
    surgicalHistory: [],
    womenHealth: [],
    familyHistory: [],
    socialHistory: [],
    notes: [],

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const recordRef = doc(db, "records", user.uid);
  batch.set(recordRef, initialMedicalRecord);
}

export async function addItemToMedicalRecord<T extends Record<string, any>>(
  userId: string,
  field: FieldCategory,
  item: T
) {
  const userRef = doc(db, "records", userId);
  await updateDoc(userRef, {
    [field]: arrayUnion(item),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteItemFromMedicalRecord(
  userId: string,
  medicalRecord: MedicalRecord,
  itemId: string,
  field: FieldCategory
) {
  const userRef = doc(db, "records", userId);

  const updatedItems = (medicalRecord?.[field] || []).filter(
    (item: any) => item.id !== itemId
  );

  await updateDoc(userRef, {
    [field]: updatedItems,
    updatedAt: serverTimestamp(),
  });
}

export async function updateItemInMedicalRecord<T extends { id: string }>(
  userId: string,
  medicalRecord: MedicalRecord,
  updatedItem: T,
  field: FieldCategory
) {
  const userRef = doc(db, "records", userId);

  const existingItems = medicalRecord?.[field] as unknown as T[];

  const updatedItems = existingItems.map((item) =>
    item.id === updatedItem.id ? updatedItem : item
  );

  await updateDoc(userRef, {
    [field]: updatedItems,
    updatedAt: serverTimestamp(),
  });
}

// Fetch the medical record of a user by their ID
export async function fetchMedicalRecord(userId: string) {
  const userRef = doc(db, "records", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as MedicalRecord;
  } else {
    throw new Error("Medical record not found");
  }
}

export async function saveItem<T>(
  isEditMode: boolean,
  medicalRecord: any,
  data: T,
  existingItem: T | undefined,
  collection: FieldCategory
) {
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to save items.");
  }

  const payload = isEditMode
    ? { ...existingItem, ...data, id: (existingItem as any).id }
    : { id: nanoid(), ...data };

  if (isEditMode) {
    await updateItemInMedicalRecord(
      auth.currentUser.uid,
      medicalRecord,
      payload,
      collection
    );
  } else {
    await addItemToMedicalRecord(auth.currentUser.uid, collection, payload);
  }
}
