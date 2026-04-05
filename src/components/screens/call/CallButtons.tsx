import CustomIcon from "@/components/CustomIcon";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { formatTime } from "@/utils/callUtils";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { I18nManager, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CallButtons = ({
  name,
  toggleVideo,
  isVideoEnabled,
  switchCamera,
  toggleMute,
  isMuted,
  secondsElapsed,
}: {
  name: string;
  toggleVideo: () => void;
  isVideoEnabled: boolean;
  switchCamera: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  secondsElapsed: number;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        footer.container,
        {
          bottom: insets.bottom,
          left: I18nManager.isRTL ? undefined : "50%",
          right: I18nManager.isRTL ? "50%" : undefined,
        },
      ]}
    >
      <BlurView intensity={50} tint="dark" style={footer.blurView}>
        <View style={footer.userRow}>
          <TextRegular style={footer.otherPersonName}>{name}</TextRegular>

          <TextSemiBold style={footer.timer}>
            {formatTime(secondsElapsed)}
          </TextSemiBold>
        </View>
        <View style={footer.divider} />
        <View style={footer.buttonsContainer}>
          <TouchableOpacity style={footer.button} onPress={toggleVideo}>
            <CustomIcon
              name={isVideoEnabled ? "videocam" : "videocam-off"}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>
          <TouchableOpacity style={footer.button} onPress={toggleMute}>
            <CustomIcon
              name={isMuted ? "mic-off" : "mic"}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>
          <TouchableOpacity style={footer.button} onPress={switchCamera}>
            <CustomIcon name="camera-switch" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={footer.endCallButton}
            onPress={() => router.back()}
          >
            <CustomIcon name="call" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

export default CallButtons;

const footer = StyleSheet.create({
  container: {
    position: "absolute",
    transform: [{ translateX: "-50%" }],
    zIndex: 9999,
    borderRadius: 24,
    overflow: "hidden",
  },
  userRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  timer: {
    fontSize: 14,
    color: "#FFF7",
  },
  otherPersonName: {
    fontSize: 14,
    color: "#FFF",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#FFF2",
  },
  blurView: {
    flexDirection: "column",
    gap: 16,
    padding: 16,
    backgroundColor: "#FFF2",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF1",
    borderWidth: 1,
    borderColor: "#FFF1",
    alignItems: "center",
    justifyContent: "center",
  },
  endCallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.pink,
    alignItems: "center",
    justifyContent: "center",
  },
});
