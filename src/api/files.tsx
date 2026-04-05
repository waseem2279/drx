import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../../firebaseConfig";

export async function uploadFile(fileUri: string, storagePath: string) {
  if (!fileUri) return null;
  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  const fileRef = ref(storage, storagePath);
  let uploadedURL: string | null = null;

  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new TypeError("Network request failed"));
    xhr.responseType = "blob";
    xhr.open("GET", fileUri, true);
    xhr.send(null);
  });

  try {
    await uploadBytes(fileRef, blob);
    uploadedURL = await getDownloadURL(fileRef);
  } catch (error) {
    console.error("uploadBytes failed:", error);
  } finally {
    // @ts-ignore
    blob.close?.();
  }

  return uploadedURL;
}
