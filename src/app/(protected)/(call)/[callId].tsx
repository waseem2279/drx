import CallButtons from "@/components/screens/call/CallButtons";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useWebRTCCall } from "@/hooks/useWebRTCCall";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RTCView } from "react-native-webrtc";

type CallProps = {
  otherPersonImage: string;
  otherPersonFirstName: string;
  otherPersonLastName: string;
  chatId: string;
  callId: string;
  callerType: string;
};

const Call = () => {
  const { t } = useTranslation();
  // Get callId and callerType (either "caller" or "callee") from URL params
  const {
    chatId,
    callId,
    callerType,
    otherPersonFirstName,
    otherPersonLastName,
  } = useLocalSearchParams<CallProps>();
  const isCaller = callerType === "caller";
  const insets = useSafeAreaInsets();

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    localStream,
    remoteStream,
    switchCamera,
    toggleMute,
    toggleVideo,
    isVideoEnabled,
    isMuted,
  } = useWebRTCCall(chatId, callId, isCaller);

  // Start the timer when the page mounts
  // In the future, grab start time from firestore and calculate elapsed time
  // when call ends, save the end time to firestore
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <View style={[styles.container]}>
      {localStream ? (
        <RTCView
          streamURL={localStream.toURL()}
          style={[styles.localVideo, { top: insets.top }]}
          objectFit="cover"
          mirror={true}
          zOrder={1}
        />
      ) : (
        <View style={[styles.localVideo, { top: insets.top }]}>
          <TextSemiBold style={styles.status}>
            {t("call.waiting-for-camera")}
          </TextSemiBold>
        </View>
      )}
      {remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
          zOrder={0}
        />
      ) : (
        <View style={styles.remoteVideo}>
          <TextSemiBold style={styles.status}>
            {t("call.calling-message", {
              firstName: otherPersonFirstName,
              lastName: otherPersonLastName,
            })}
          </TextSemiBold>
        </View>
      )}
      <CallButtons
        switchCamera={switchCamera}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        isVideoEnabled={isVideoEnabled}
        name={`${otherPersonFirstName} ${otherPersonLastName}`}
        secondsElapsed={secondsElapsed}
        isMuted={isMuted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    position: "relative",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  remoteVideo: {
    borderRadius: 8,
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  localVideo: {
    borderRadius: 8,
    zIndex: 9999, // zOrder does this also
    width: 128,
    height: 256,
    position: "absolute",
    right: 16,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    color: Colors.grey,
    textAlign: "center",
    fontSize: 16,
  },
});

export default Call;
