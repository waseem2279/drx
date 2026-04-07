import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomIcon from "./CustomIcon";
import { router } from "expo-router";

type ServiceListItemProps = {
  id: string;
  title: string;
  description?: string;
  price?: string;
  isEnabled?: boolean;
};

const ServiceListItem = ({
  id,
  title,
  description,
  price,
  isEnabled,
}: ServiceListItemProps) => {
  return (
    <TouchableOpacity
      style={itemStyles.container}
      onPress={() => {
        // Push with id and price
        router.push(
          `/update-service?serviceId=${id}${price ? `&price=${price}` : ""}`,
        );
      }}
    >
      <View style={itemStyles.nameContainer}>
        <TextSemiBold
          style={itemStyles.name}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
          <TextSemiBold
            style={[
              itemStyles.price,
              { color: isEnabled ? Colors.green : Colors.lightText },
            ]}
          >
            {isEnabled ? ` - $${price}` : " - Disabled"}{" "}
          </TextSemiBold>
        </TextSemiBold>
        <TextRegular
          style={itemStyles.subText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {description}
        </TextRegular>
      </View>
      <CustomIcon name={isEnabled ? "check-box" : "check-box-outline-blank"} />
    </TouchableOpacity>
  );
};

export default ServiceListItem;

const itemStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 16, // Unique to ServiceListItem
    flex: 1,
  },
  price: {
    fontSize: 14,
  },
  name: {
    fontSize: 16,
  },
  subText: {
    fontSize: 16,
    color: Colors.grey,
  },
});
