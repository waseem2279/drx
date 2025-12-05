import { doc, onSnapshot } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";

export default function useAppContent() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    const contentDocRef = doc(db, "admin/content");

    // Subscribe to Firestore document
    const unsubscribe = onSnapshot(
      contentDocRef,
      (snapshot) => {
        const data = snapshot.data();
        const urls = data?.home_carousel ?? [];
        const specs = data?.doctor_specialties ?? [];

        setSpecialties(specs);
        setImageUrls(urls);
      },
      (error) => {
        console.error("Error subscribing to carousel images:", error);
      }
    );

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);

  return { imageUrls, specialties };
}
