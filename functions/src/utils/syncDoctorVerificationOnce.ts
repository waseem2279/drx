import { onRequest } from "firebase-functions/v2/https";
import { admin } from "../lib/admin";

type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export const syncDoctorVerificationOnce = onRequest(
  {
    timeoutSeconds: 3600,
    region: "us-central1",
  },
  async (_req, res) => {
    try {
      const db = admin.firestore();

      const usersSnap = await db
        .collection("users")
        .where("role", "==", "doctor")
        .get();

      let batch = db.batch();
      let count = 0;
      let updated = 0;

      for (const userDoc of usersSnap.docs) {
        const { verification } = userDoc.data() as {
          verification?: VerificationStatus;
        };

        if (!verification) continue;

        const publicProfileRef = db.doc(`publicProfiles/${userDoc.id}`);

        batch.set(publicProfileRef, { verification }, { merge: true });

        count++;
        updated++;

        if (count === 500) {
          await batch.commit();
          batch = db.batch();
          count = 0;
        }
      }

      if (count > 0) {
        await batch.commit();
      }

      res.status(200).json({
        success: true,
        updated,
      });
    } catch (error) {
      console.error("Sync failed:", error);
      res.status(500).json({
        success: false,
        error: "Verification sync failed",
      });
    }
  }
);
