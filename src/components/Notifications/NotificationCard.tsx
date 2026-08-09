import Colors from "@/constants/Colors";
import { Href, router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomIcon from "../CustomIcon";
import { TextRegular, TextSemiBold } from "../StyledText";

const NotificationCard = ({
  title,
  message,
  color = Colors.green,
  url,
}: {
  title: string;
  message: string;
  color?: string;
  url?: Href; // update to deep linking later
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => url && router.navigate(url)}
    >
      <View style={styles.titleRow}>
        <CustomIcon name="circle" size={8} color={color} />
        <TextSemiBold style={styles.title}>{title}</TextSemiBold>
      </View>
      <TextRegular style={styles.message}>{message}</TextRegular>
    </TouchableOpacity>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: 180, // Arbitrary width
    borderColor: Colors.faintGrey,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  titleRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
  message: {
    fontSize: 12,
    color: Colors.grey,
  },
});
