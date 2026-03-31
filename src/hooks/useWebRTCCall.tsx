import { mediaConstraints, sessionConstraints } from "@/config/webrtcConfig";
import RTCPeerConnection from "@/webrtc/ExtendedRTCPeerConnection";
import { onChildAdded, push, ref, remove, set } from "@firebase/database";
import { router } from "expo-router";
import {
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useRef, useState } from "react";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";
import { database, db, functions } from "../../firebaseConfig";
import RTCTrackEvent from "react-native-webrtc/lib/typescript/RTCTrackEvent";
import InCallManager from "react-native-incall-manager";

export function useWebRTCCall(
  chatId: string,
  callId: string,
  isCaller: boolean,
) {
  // State to hold local and remote media streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // For UX
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const peerConnection = useRef<RTCPeerConnection | null>(null); // Peer connection reference
  const remoteStreamRef = useRef<MediaStream | null>(null); // Remote stream reference
  const hasSetRemoteDescription = useRef(false); // Flag to check if remote description is set to prevent constant updates
  const queuedCandidates = useRef<RTCIceCandidateInit[]>([]);

  // Firestore reference
  const callDocRef = doc(db, "calls", callId); // The call document
  const firestoreUnsub = useRef<(() => void) | null>(null);
  const rtdbListeners = useRef<(() => void)[]>([]);

  // Realtime Database references
  const offerCandidatesRef = ref(database, `calls/${callId}/offerCandidates`);
  const answerCandidatesRef = ref(database, `calls/${callId}/answerCandidates`);

  useEffect(() => {
    (async () => {
      try {
        const getTurnCredentials = httpsCallable(
          functions,
          "getTurnCredentials",
        );
        const response = await getTurnCredentials();
        const { iceServers } = response.data as { iceServers: RTCIceServer[] };

        peerConnection.current = new RTCPeerConnection({ iceServers });
      } catch (err) {
        console.error("Failed to fetch ICE servers:", err);

        // Fallback to default STUN server if TURN server fetch fails
        peerConnection.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
      }

      if (isCaller) {
        hostCall();
      } else {
        joinCall();
      }
    })();

    return () => {
      endCall();
    };
  }, []);

  const handleIceCandidate = async (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      const candidateJSON = event.candidate.toJSON();
      const refToUse = isCaller ? offerCandidatesRef : answerCandidatesRef;

      try {
        const newRef = push(refToUse);
        await set(newRef, candidateJSON);
      } catch (err) {
        console.error("[RTDB] Failed to store ICE candidate:", err);
      }
    }
  };

  const handleTrack = (event: RTCTrackEvent<"track">) => {
    remoteStreamRef.current = remoteStreamRef.current || new MediaStream();
    if (event.track) {
      remoteStreamRef.current.addTrack(event.track);
      remoteStreamRef.current.getAudioTracks()[0]._setVolume(10); // 0 - 10, 1 is default
      setRemoteStream(remoteStreamRef.current);
    }
  };

  const handleIceConnectionStateChange = () => {
    const state = peerConnection.current?.iceConnectionState;
    console.log("ICE connection state:", state);
    const peerDisconnected = state === "disconnected";

    if (peerDisconnected) {
      router.back();
    }
  };

  const handleNegotiationNeeded = async () => {
    const offer = await peerConnection.current?.createOffer(sessionConstraints);
    await peerConnection.current?.setLocalDescription(offer);
    await setDoc(callDocRef, { offer });
  };

  async function getMediaStream() {
    try {
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
      setLocalStream(mediaStream); // For video
      return mediaStream;
    } catch (err) {
      console.error("[Media] Failed to get user media:", err);
      return null;
    }
  }

  async function hostCall() {
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    InCallManager.start({ media: "audio" });
    InCallManager.setForceSpeakerphoneOn(true);
    InCallManager.setKeepScreenOn(true);
    InCallManager.stopProximitySensor();

    mediaStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, mediaStream);
    });

    peerConnection.current?.addEventListener(
      "icecandidate",
      handleIceCandidate,
    );
    peerConnection.current?.addEventListener("track", handleTrack);
    peerConnection.current?.addEventListener(
      "iceconnectionstatechange",
      handleIceConnectionStateChange,
    );
    peerConnection.current?.addEventListener("icegatheringstatechange", () => {
      console.log(
        "[ICE] Gathering state:",
        peerConnection.current?.iceGatheringState,
      );
    });
    peerConnection.current?.addEventListener(
      "negotiationneeded",
      handleNegotiationNeeded,
    );

    // Listen to the call document, then set remote description
    firestoreUnsub.current = onSnapshot(callDocRef, async (snapshot) => {
      const data = snapshot.data();
      if (
        data?.answer &&
        !peerConnection.current?.remoteDescription &&
        !hasSetRemoteDescription.current
      ) {
        hasSetRemoteDescription.current = true;
        await peerConnection.current?.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );

        for (const candidate of queuedCandidates.current) {
          await peerConnection.current?.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
        }
        queuedCandidates.current = [];
      }
    });

    const off = onChildAdded(answerCandidatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const candidate = new RTCIceCandidate(data);
        if (peerConnection.current?.remoteDescription) {
          peerConnection.current.addIceCandidate(candidate);
        } else {
          queuedCandidates.current.push(data);
        }
      }
    });
    rtdbListeners.current.push(() => off());
  }

  async function joinCall() {
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    InCallManager.start({ media: "audio" });
    InCallManager.setForceSpeakerphoneOn(true);
    InCallManager.setKeepScreenOn(true);
    InCallManager.stopProximitySensor();

    peerConnection.current?.addEventListener(
      "icecandidate",
      handleIceCandidate,
    );
    peerConnection.current?.addEventListener("track", handleTrack);
    peerConnection.current?.addEventListener(
      "iceconnectionstatechange",
      handleIceConnectionStateChange,
    );
    peerConnection.current?.addEventListener("icegatheringstatechange", () => {
      console.log(
        "[ICE] Gathering state:",
        peerConnection.current?.iceGatheringState,
      );
    });

    mediaStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, mediaStream);
    });

    // Listen to the call document, then set remote description
    firestoreUnsub.current = onSnapshot(callDocRef, async (snapshot) => {
      const data = snapshot.data();
      if (
        data?.offer &&
        !peerConnection.current?.remoteDescription &&
        !hasSetRemoteDescription.current
      ) {
        hasSetRemoteDescription.current = true;
        try {
          await peerConnection.current?.setRemoteDescription(
            new RTCSessionDescription(data.offer),
          );
          const answer = await peerConnection.current?.createAnswer();
          await peerConnection.current?.setLocalDescription(answer);
          await updateDoc(callDocRef, { answer });

          for (const candidate of queuedCandidates.current) {
            await peerConnection.current?.addIceCandidate(
              new RTCIceCandidate(candidate),
            );
          }
          queuedCandidates.current = [];
        } catch (err) {
          console.error("[Participant] Error handling offer/answer:", err);
        }
      }
    });

    // Listen for ICE candidates from the caller
    const off = onChildAdded(offerCandidatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const candidate = new RTCIceCandidate(data);
        if (peerConnection.current?.remoteDescription) {
          peerConnection.current.addIceCandidate(candidate);
        } else {
          queuedCandidates.current.push(data);
        }
      }
    });
    rtdbListeners.current.push(() => off());
  }

  async function endCall() {
    InCallManager.stop();

    localStream?.getTracks().forEach((t) => t.stop());
    localStream?.release();
    setLocalStream(null);

    remoteStreamRef.current?.getTracks().forEach((t) => t.stop());
    remoteStreamRef.current?.release();
    setRemoteStream(null);
    remoteStreamRef.current = null;

    peerConnection.current?.close();
    peerConnection.current = null;

    const chatDocRef = doc(db, "chats", chatId);
    await updateDoc(chatDocRef, { hasActiveCall: false });

    // Delete the call document to prevent race conditions
    try {
      await deleteDoc(callDocRef);
    } catch (e) {
      console.error("[Firestore] Failed to delete call document:", e);
    }

    try {
      await remove(offerCandidatesRef);
    } catch (e) {
      console.error("[RTDB] Failed to remove offer candidates:", e);
    }

    try {
      await remove(answerCandidatesRef);
    } catch (e) {
      console.error("[RTDB] Failed to remove answer candidates:", e);
    }

    // Unsubscribe Firestore listener
    firestoreUnsub.current?.();

    // Remove all RTDB listeners
    rtdbListeners.current.forEach((off) => off());
    rtdbListeners.current = [];
  }

  async function switchCamera() {
    if (!localStream || !peerConnection.current) return;

    const newFacingMode = facingMode === "user" ? "environment" : "user";

    try {
      // Stop old video tracks
      localStream.getVideoTracks().forEach((track) => track.stop());

      // Get new stream with the opposite facing mode
      const newStream = await mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: newFacingMode,
        },
      });

      const newVideoTrack = newStream.getVideoTracks()[0];
      const videoSender = peerConnection.current
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");

      if (videoSender && newVideoTrack) {
        await videoSender.replaceTrack(newVideoTrack);
      }

      // Combine with existing audio tracks
      const updatedStream = new MediaStream([
        newVideoTrack,
        ...localStream.getAudioTracks(),
      ]);
      setLocalStream(updatedStream);
      setFacingMode(newFacingMode);
    } catch (error) {
      console.error("[Camera Switch] Failed to switch camera:", error);
    }
  }

  function toggleMute() {
    if (!localStream) return;

    const newMuteState = !isMuted;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !newMuteState; // false = muted, true = unmuted
    });

    setIsMuted(newMuteState);
  }

  function toggleVideo() {
    if (!localStream) return;

    const newVideoState = !isVideoEnabled;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = newVideoState;
    });

    setIsVideoEnabled(newVideoState);
  }

  return {
    localStream,
    remoteStream,
    switchCamera,
    toggleMute,
    toggleVideo,
    isVideoEnabled,
    isMuted,
    endCall,
    facingMode,
  };
}
