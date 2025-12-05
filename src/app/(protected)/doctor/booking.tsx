import { functions } from "@/../firebaseConfig";
import ControllerDatePicker from "@/components/form/ControllerDatePicker";
import Pills from "@/components/Pills";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import SubmitButton from "@/components/SubmitButton";
import Colors from "@/constants/Colors";
import { useDoctorById } from "@/stores/useDoctorSearch";
import { useUserData } from "@/stores/useUserStore";
import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { httpsCallable } from "firebase/functions";
import i18next from "i18next";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getCalendars } from "expo-localization";
import { useEffect, useState } from "react";
import { TimeSlotInfo } from "@/types/timeSlot";
import ControllerTimeSlotOptions from "@/components/form/ControllerTimeSlotOptions";
import LoadingScreen from "@/components/LoadingScreen";
import useAppContent from "@/hooks/useAppContent";

type GetPaymentIntentRequest = {
  amount: number;
  currency: string;
  metadata?: any;
};
type GetPaymentIntentResponse = {
  paymentIntentId: string;
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
};
type CancelPaymentIntentRequest = { id: string };
type CancelPaymentIntentResponse = { success: boolean; canceledIntent?: any };

const getPaymentIntent = httpsCallable<
  GetPaymentIntentRequest,
  GetPaymentIntentResponse
>(functions, "getPaymentIntent");

const cancelPaymentIntent = httpsCallable<
  CancelPaymentIntentRequest,
  CancelPaymentIntentResponse
>(functions, "cancelPaymentIntent");

const BookingPage = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = useDoctorById(id);
  const userData = useUserData();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const insets = useSafeAreaInsets();
  const { specialties } = useAppContent();
  const [timeSlots, setTimeSlots] = useState<TimeSlotInfo>({
    dates: [],
    duration: 0,
    timezone: "UTC",
  });
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, watch, formState } = useForm<FieldValues>({
    defaultValues: { selectedDate: new Date(), timeSlot: null },
  });
  const { isSubmitting } = formState;
  const selectedDate = watch("selectedDate");

  useEffect(() => {
    const fetchTimeSlots = async () => {
      setLoading(true);
      if (!doctor?.uid) return;
      try {
        const getTimeSlots = httpsCallable<
          { doctorId: string; date: string; timeZone: string },
          TimeSlotInfo
        >(functions, "getTimeSlots");

        const res = await getTimeSlots({
          doctorId: doctor.uid,
          date: selectedDate.toISOString(),
          timeZone: getCalendars()[0].timeZone || "UTC",
        });

        setTimeSlots(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setLoading(false);
      }
    };

    fetchTimeSlots();
    console.log(selectedDate);
  }, [doctor?.uid, selectedDate]);

  const specializations =
    doctor?.specializations
      ?.map((spec: string) => specialties.find((s) => s === spec))
      .filter(Boolean) || [];

  const initializePaymentSheet = async ({
    amount,
    date,
    timeZone,
  }: {
    amount: number;
    date: string;
    timeZone: string;
  }) => {
    if (!userData) throw new Error("Patient not logged in");
    if (!amount) throw new Error("Missing amount");

    const result = await getPaymentIntent({
      amount,
      currency: "usd",
      metadata: {
        patientId: userData.uid,
        doctorId: doctor.uid,
        date,
        timeZone,
      },
    });

    const { paymentIntentId, paymentIntent, ephemeralKey, customer } =
      result.data;

    const { error: initErr } = await initPaymentSheet({
      merchantDisplayName: "DRX Genius LLC",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      returnURL: Linking.createURL("stripe-redirect"),
      applePay: { merchantCountryCode: "US" },
    });
    if (initErr) throw new Error(initErr.message);

    const { error: payErr } = await presentPaymentSheet();
    if (payErr) {
      await cancelPaymentIntent({ id: paymentIntentId });
      throw new Error(payErr.message);
    }
    Alert.alert(t("common.success"), t("form.booking-was-successful"));
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await initializePaymentSheet({
        amount: Number(doctor?.consultationPrice),
        date: data.date,
        timeZone: getCalendars()[0].timeZone || "UTC",
      });

      // Currently handle booking on backend
      router.replace({ pathname: "/(protected)/(tabs)/messages" });
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert(t("form.payment-failed"));
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#fff", paddingBottom: insets.bottom }}
    >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: Colors.light.faintGrey,
          }}
        >
          <View style={{ flex: 1 }}>
            <TextSemiBold style={{ fontSize: 20, color: "#000" }}>
              {t("doctor.name", { lastName: doctor?.lastName })}
            </TextSemiBold>
            <Pills items={specializations} />
          </View>
          <View>
            <TextSemiBold style={{ fontSize: 20, textAlign: "right" }}>
              ${doctor?.consultationPrice}
            </TextSemiBold>
            <TextRegular style={{ fontSize: 12, color: "#666" }}>
              {t("doctor.per-consultation")}
            </TextRegular>
          </View>
        </View>

        <ControllerDatePicker
          label={t("form.select-date")}
          name="selectedDate"
          control={control}
          minimumDate={new Date()}
          rules={{ required: t("form.please-select-a-date") }}
        />

        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <ControllerTimeSlotOptions
              label={t("form.select-a-time-slot")}
              name="timeSlot"
              control={control}
              timeSlots={timeSlots.dates}
              rules={{ required: t("form.please-select-a-time-slot") }}
            />

            {timeSlots.dates.length === 0 && (
              <TextSemiBold
                style={{
                  color: Colors.lightText,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                {t("form.no-available-time-slots-for-this-date")}
              </TextSemiBold>
            )}
          </>
        )}
      </ScrollView>

      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderColor: Colors.light.faintGrey,
        }}
      >
        <SubmitButton
          text={t("form.book-consultation")}
          onPress={handleSubmit(onSubmit)}
          disabled={!watch("timeSlot") || isSubmitting}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
};

export default BookingPage;

export function parseTimeSlot(str: string) {
  const [startTime, endTime] = str.split("-");
  return { startTime, endTime };
}
