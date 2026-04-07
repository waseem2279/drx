import Colors from "@/constants/Colors";
import { BillingDetails } from "@stripe/stripe-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomIcon from "../CustomIcon";
import { TextSemiBold } from "../StyledText";

const BillingAddress = ({
  billingDetails,
  isSelected,
  onPress,
  showBorder,
}: {
  billingDetails: BillingDetails;
  isSelected: boolean;
  onPress: () => void;
  showBorder: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[
        BillingAddressStyles.container,
        showBorder && BillingAddressStyles.borderBottom,
      ]}
      onPress={onPress}
    >
      <CustomIcon
        name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
      />
      <View>
        <TextSemiBold style={BillingAddressStyles.text}>
          {billingDetails.name}
        </TextSemiBold>
        <TextSemiBold style={BillingAddressStyles.text}>
          {billingDetails.address!.line1}
        </TextSemiBold>
        {billingDetails.address!.line2 && (
          <TextSemiBold style={BillingAddressStyles.text}>
            {billingDetails.address!.line2}
          </TextSemiBold>
        )}
        <TextSemiBold style={BillingAddressStyles.text}>
          {billingDetails.address!.city} {billingDetails.address!.state}{" "}
          {billingDetails.address!.postalCode}
        </TextSemiBold>
        <TextSemiBold style={BillingAddressStyles.text}>
          {billingDetails.phone}
        </TextSemiBold>
        <TextSemiBold style={BillingAddressStyles.text}>
          {billingDetails.email}
        </TextSemiBold>
      </View>
    </TouchableOpacity>
  );
};

export default BillingAddress;

const BillingAddressStyles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: Colors.faintGrey,
  },
  text: {
    fontSize: 16,
  },
});
