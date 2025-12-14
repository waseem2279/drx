import { onCall } from "firebase-functions/v2/https";
import { admin } from "../lib/admin";

type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

const updateVerificationStatus = onCall(async (request) => {
  const { uid, updateTo } = request.data as {
    uid?: string;
    updateTo?: VerificationStatus;
  };

  if (!uid || !updateTo) {
    throw new Error("Missing uid or updateTo");
  }

  // Validate input against allowed statuses
  const validStatuses: VerificationStatus[] = [
    "unverified",
    "pending",
    "verified",
    "rejected",
  ];
  if (!validStatuses.includes(updateTo)) {
    throw new Error(`Invalid verification status: ${updateTo}`);
  }

  try {
    const batch = admin.firestore().batch();
    const userRef = admin.firestore().doc(`users/${uid}`);
    const publicProfileRef = admin.firestore().doc(`publicProfiles/${uid}`);
    const pendingVerificationRef = admin
      .firestore()
      .doc(`pendingVerifications/${uid}`);

    batch.update(userRef, {
      verification: updateTo,
    });
    batch.set(publicProfileRef, { verification: updateTo }, { merge: true });
    batch.delete(pendingVerificationRef);

    await batch.commit();

    return { success: true, message: `Verification updated to ${updateTo}` };
  } catch (error: any) {
    console.error("Error updating verification:", error);
    throw new Error("Failed to update verification status");
  }
});

export { updateVerificationStatus };
