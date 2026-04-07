import { addBillingDetails } from "@/api/billingDetails";
import Footer from "@/components/AddFooter";
import BillingDetailsSelector from "@/components/BillingDetails/BillingDetailsSelector";
import PageScrollView from "@/components/PageScrollView";
import RegularTextInput from "@/components/RegularTextInput";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import { useUserData } from "@/stores/useUserStore";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { db } from "../../../../firebaseConfig";
import { useTheme } from "@/hooks/useTheme";
import ContainerView from "@/components/ContainerView";

const AddCard = () => {
  const { colors } = useTheme();
  const { height } = useGradualAnimation();
  const { confirmSetupIntent } = useStripe();

  const [cardholderName, setCardholderName] = useState("");
  const [billingDetails, setBillingDetails] = useState<any>(null);
  const [canAddAddress, setCanAddAddress] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const userData = useUserData();

  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    [],
  );

  const handleSelectBillingAddress = (selected: any) => {
    setBillingDetails(selected);
  };

  const handleAddCard = async () => {
    if (!cardComplete || !cardholderName || !userData?.uid) {
      Alert.alert("Please complete the form.");
      return;
    }

    if (!billingDetails?.address) {
      Alert.alert("Please select a billing address.");
      return;
    }

    setSubmitting(true);

    try {
      const customerDoc = await getDoc(
        doc(db, "stripe_customers", userData.uid),
      );
      const { setup_secret } = customerDoc.data() || {};

      if (!setup_secret) {
        throw new Error("Missing setup secret");
      }

      const { setupIntent, error } = await confirmSetupIntent(setup_secret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            ...billingDetails,
            name: cardholderName,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Save to trigger backend function
      await addDoc(
        collection(db, "stripe_customers", userData.uid, "payment_methods"),
        {
          id: setupIntent.paymentMethodId,
        },
      );

      // Save billing address
      if (canAddAddress) {
        await addBillingDetails({
          ...billingDetails,
        });
      }

      router.back();
    } catch (err: any) {
      console.error("Add card error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ContainerView>
      <PageScrollView>
        <TextSemiBold style={[styles.title, { color: colors.foreground }]}>
          Enter the card you want to use for booking appointments
        </TextSemiBold>

        <RegularTextInput
          label="Name on Card"
          value={cardholderName}
          onChangeText={setCardholderName}
          placeholder="e.g. John Doe"
        />

        <TextRegular
          style={[styles.cardFieldLabel, { color: colors.foreground }]}
        >
          Card details
        </TextRegular>
        <View
          style={[styles.cardFieldContainer, { borderColor: colors.border }]}
        >
          <CardField
            postalCodeEnabled={true}
            placeholders={{ number: "4242 4242 4242 4242" }}
            cardStyle={{
              backgroundColor: colors.background,
              textColor: colors.foreground,
            }}
            style={{ width: "100%", height: 14, marginVertical: 20 }}
            onCardChange={(cardDetails) => {
              setCardComplete(cardDetails.complete);
            }}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <BillingDetailsSelector
            handleSelectBillingAddress={handleSelectBillingAddress}
            setCanAddAddress={setCanAddAddress}
          />
        </View>
      </PageScrollView>

      <Footer
        keyboardHeightShared={height}
        canSubmit={cardComplete && !!cardholderName}
        submitting={submitting}
        handleSubmit={handleAddCard}
      />

      <Animated.View style={fakeView} />
    </ContainerView>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    fontSize: 16,
  },
  cardFieldLabel: {
    marginBottom: 8,
    fontSize: 16,
  },
  cardFieldContainer: {
    borderRadius: 8,
    borderWidth: 1,
  },
});
