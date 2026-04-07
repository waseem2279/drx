import React from "react";
import {
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import CustomIcon from "./CustomIcon";
import { IconName } from "../constants/iconsMap";
import { useTheme } from "@/hooks/useTheme";

const DEFAULT_ICONBUTTON_SIZE = 40;

const IconButton = ({
  name,
  onPress,
  pointerEvents = "auto",
  containerStyle,
  buttonStyle,
  size = DEFAULT_ICONBUTTON_SIZE,
  iconColor = "#000",
}: {
  name: IconName;
  onPress?: (event: GestureResponderEvent) => void;
  pointerEvents?: "auto" | "box-none" | "none" | "box-only";
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  size?: number;
  iconColor?: string;
}) => {
  const { colors } = useTheme();

  return (
    <View style={containerStyle} pointerEvents={pointerEvents}>
      <TouchableOpacity
        style={[
          {
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: colors.border,
          },
          buttonStyle,
        ]}
        onPress={onPress}
      >
        <CustomIcon name={name} size={size * 0.6} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default IconButton;
