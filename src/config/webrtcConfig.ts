export const mediaConstraints = {
  audio: true,
  video: {
    frameRate: 24,
    facingMode: "user",
  },
};

// Define STUN and TURN servers for ICE candidate negotiation
export const peerConstraints = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:turn.anyfirewall.com:443?transport=tcp",
      username: "webrtc",
      credential: "webrtc",
    },
  ],
};

// Constraints for SDP offer creation
export const sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true,
  },
} as RTCOfferOptions;
