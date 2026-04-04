import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { TouchableOpacity, View, StyleSheet  } from "react-native";
import Avatar from "../Avatar";
import { TextSemiBold } from "../StyledText";
import Pills from "../Pills";
import DoctorLabel from "./DoctorLabel";
import {
  formatDoctorPrice,
  getDoctorLicensedCountryPills,
} from "@/utils/doctorDisplay";

export const renderDoctorRow = ({ item }: { item: any }) => {
  const licensedCountryPills = getDoctorLicensedCountryPills(item.countries);

  return (
    <Link href={`/doctor/${item.id}` as any} asChild>
      <TouchableOpacity activeOpacity={0.8} style={styles.listing}>
        <View style={styles.left}>
          <Avatar
            source={item.image}
            size={48}
            initials={item.firstName[0] + item.lastName[0]}
          />

          <View style={styles.info}>
            <View style={styles.nameAndLabel}>
              <TextSemiBold numberOfLines={1} style={styles.nameText}>
                {item.firstName} {item.lastName}{" "}
                <DoctorLabel label={item.doctorLabel} />
              </TextSemiBold>
            </View>

            <Pills items={licensedCountryPills} maxPills={1} />
          </View>
        </View>

        <View style={styles.price}>
          <TextSemiBold style={styles.priceText}>
            ${formatDoctorPrice(item.consultationPrice)}
          </TextSemiBold>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  listing: {
    height: 80,
    display: "flex",
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
    backgroundColor: "#FFF",
  },
  left: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  info: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flex: 1,
    minWidth: 0,
  },
  nameAndLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
    width: "100%",
  },
  nameText: {
    fontSize: 16,
    flexShrink: 1,
  },
  price: {
    display: "flex",
    height: "100%",
    padding: 16,
    borderRadius: 12,
    alignSelf: "center",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  priceText: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    fontSize: 16,
  },
});
