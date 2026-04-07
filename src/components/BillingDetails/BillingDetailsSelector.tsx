import Colors from "@/constants/Colors";
import { useBillingAddresses } from "@/stores/useBillingDetails";
import { BillingDetails } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextSemiBold } from "../StyledText";
import BillingAddress from "./BillingAddress";
import BillingDetailsForm from "./BillingDetailsForm";

const initBillingDetails: BillingDetails = {
  address: {
    city: "",
    country: "",
    line1: "",
    line2: "",
    postalCode: "",
    state: "",
  },
  name: "",
  phone: "",
  email: "",
};

type BillingDetailsSelectorProps = {
  handleSelectBillingAddress: (billingDetails: BillingDetails) => void;
  setCanAddAddress: (canAdd: boolean) => void;
};

const BillingDetailsSelector = ({
  handleSelectBillingAddress,
  setCanAddAddress,
}: BillingDetailsSelectorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [form, setForm] = useState<BillingDetails>(initBillingDetails);
  const billingAddresses = useBillingAddresses();
  const [formVisible, setFormVisible] = useState(billingAddresses.length === 0);

  useEffect(() => {
    if (formVisible) {
      setCanAddAddress(true);
      handleSelectBillingAddress(form);
    } else {
      setCanAddAddress(false);
      handleSelectBillingAddress(billingAddresses[currentIndex]);
    }
  }, [billingAddresses, formVisible, form]);

  const handleAddressSelect = (index: number) => {
    setCurrentIndex(index);
    handleSelectBillingAddress(billingAddresses[index]);
  };

  const updateBillingForm = (updates: Partial<BillingDetails>) => {
    setForm((prev) => ({
      ...prev,
      ...updates,
      address: {
        ...prev.address,
        ...(updates.address || {}),
      },
    }));
  };

  const handleFormVisibility = () => {
    setFormVisible((prev) => !prev);
  };

  return (
    <View style={styles.billingDetailsContainer}>
      <TextSemiBold style={styles.billingAddressTitle}>
        Billing address
      </TextSemiBold>

      {formVisible ? (
        <BillingDetailsForm form={form} updateForm={updateBillingForm} />
      ) : (
        <>
          <View style={styles.addressesContainer}>
            {billingAddresses.map(
              (billingDetails: BillingDetails, index: number) => (
                <BillingAddress
                  key={index}
                  billingDetails={billingDetails}
                  isSelected={currentIndex === index}
                  onPress={() => handleAddressSelect(index)}
                  showBorder={index < billingAddresses.length - 1}
                />
              ),
            )}
          </View>
          <TouchableOpacity onPress={handleFormVisibility}>
            <TextSemiBold style={styles.visibilityButtonText}>
              + Use a different address
            </TextSemiBold>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default BillingDetailsSelector;

const styles = StyleSheet.create({
  billingDetailsContainer: {
    flexDirection: "column",
    gap: 8,
  },
  billingAddressTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  addressesContainer: {
    flexDirection: "column",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.faintGrey,
  },
  visibilityButtonText: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
  },
});
