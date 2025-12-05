import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import {
  ListRenderItem,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Avatar from "../Avatar";
import { TextSemiBold } from "../StyledText";
import i18next from "i18next";
import Pills from "../Pills";
import DoctorLabel from "./DoctorLabel";
import useAppContent from "@/hooks/useAppContent";

export const renderDoctorRow = ({
  item,
  specialties,
}: {
  item: any;
  specialties: string[];
}) => {
  // const specializationMap = Object.fromEntries(
  //   specialties?.map((item) => [item])
  // );

  // Map the specialization IDs to their names
  // const specializations = item.specializations
  //   .map((specId: string) => specializationMap[specId])
  //   .filter(Boolean);

  return (
    <Link href={`/doctor/${item.id}` as any} asChild>
      <TouchableOpacity style={styles.listing}>
        <View style={styles.left}>
          <Avatar
            source={item.image}
            size={48}
            initials={item.firstName[0] + item.lastName[0]}
          />

          <View style={styles.info}>
            <View style={styles.nameAndLabel}>
              <TextSemiBold style={{ fontSize: 16 }}>
                {item.firstName} {item.lastName}{" "}
                <DoctorLabel label={item.doctorLabel} />
              </TextSemiBold>
            </View>

            <Pills items={item.specializations} maxPills={2} />
          </View>
        </View>

        <View style={styles.price}>
          <TextSemiBold style={styles.priceText}>
            ${item.consultationPrice}
          </TextSemiBold>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  listing: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  info: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  nameAndLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specializations: {
    textTransform: "capitalize",
    color: Colors.grey,
  },
  price: {
    height: 64,
    width: 64,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    fontSize: 16,
  },
});
