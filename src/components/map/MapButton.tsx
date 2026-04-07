import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { TextSemiBold } from "../StyledText";
import { useTheme } from "@/hooks/useTheme";

const MapButton = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.absoluteView}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.btn, { backgroundColor: colors.primary }]}
      >
        <TextSemiBold style={{ color: colors.background }}>
          {t("common.map")}
        </TextSemiBold>
        <Ionicons name="map" size={20} color={colors.background} />
      </TouchableOpacity>
    </View>
  );
};

export default MapButton;

const styles = StyleSheet.create({
  absoluteView: {
    position: "absolute",
    bottom: 48,
    width: "100%",
    alignItems: "center",
    zIndex: 1000, // Ensure the button is above other components
  },
  btn: {
    padding: 14,
    height: 50,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
