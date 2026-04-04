import Colors from "@/constants/Colors";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  useWatch,
} from "react-hook-form";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TextRegular, TextSemiBold } from "../StyledText";
import CustomIcon from "../CustomIcon";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import i18next from "i18next";
import DoctorMarker from "../map/DoctorMarker";
import { useUserData } from "@/stores/useUserStore";
import OrDivider from "../OrDivider";
import { useTranslation } from "react-i18next";

interface ControllerLocatorProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  rules?: any;
  label?: string;
  disabled?: boolean;
  description?: string;
}
const ControllerLocator = <T extends FieldValues>({
  control,
  name,
  rules = {},
}: ControllerLocatorProps<T>) => {
  const { t } = useTranslation();
  const TITLE = t("form.place-of-practice-optional");
  const SUBTITLE = t("form.locator-subtitle");

  const userData = useUserData();
  const [mapDimensions, setMapDimensions] = useState<
    | {
        width: number;
      }
    | undefined
  >(undefined);
  const [address, setAddress] = useState<string>("");
  const [myLocationError, setMyLocationError] = useState<string | null>(null);
  const [locationPermission, requestPermission] =
    Location.useForegroundPermissions();
  const consultationPrice = useWatch({
    control,
    name: "consultationPrice" as FieldPath<T>,
  });

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => {
        const onGeocodePress = async () => {
          const coords = await Location.geocodeAsync(address);
          if (coords.length > 0) {
            const { latitude, longitude } = coords[0];
            onChange({ latitude, longitude });
          }
        };

        const onLocateMePress = async () => {
          let permission = locationPermission;

          if (!permission || !permission.granted) {
            const newPermission = await requestPermission();
            if (newPermission.status !== "granted") {
              setMyLocationError(t("form.please-enable-location-services"));
              return;
            }
            permission = newPermission;
          }

          const location = await Location.getCurrentPositionAsync({});
          setMyLocationError(null);
          onChange({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        };

        const onRemoveLocationPress = () => {
          onChange(null);
        };

        return (
          <View style={{ flex: 1 }}>
            <View style={styles.labelInfo}>
              <View style={styles.labelContainer}>
                <TextRegular style={styles.label}>{TITLE}</TextRegular>
                {error && (
                  <TextRegular style={styles.error}>
                    {error?.message}
                  </TextRegular>
                )}
              </View>
              <TextRegular style={styles.info}>{SUBTITLE}</TextRegular>
            </View>

            <View style={styles.addressInputContainer}>
              <View
                style={[
                  styles.inputContainer,
                  { borderColor: error ? Colors.pink : Colors.faintGrey },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    {
                      textAlign: i18next.dir() === "rtl" ? "right" : "left",
                      writingDirection: i18next.dir() === "rtl" ? "rtl" : "ltr",
                    },
                  ]}
                  onBlur={onBlur}
                  onChangeText={(input) => setAddress(input)}
                  value={address}
                  placeholder={t("form.enter-an-address")}
                  placeholderTextColor={Colors.lightText}
                />
              </View>
              <TouchableOpacity
                style={styles.geocodeButton}
                onPress={onGeocodePress}
              >
                <CustomIcon name="search" size={24} color={Colors.black} />
                <TextSemiBold>{t("form.find")}</TextSemiBold>
              </TouchableOpacity>
            </View>

            <OrDivider />

            {myLocationError && (
              <TextRegular style={styles.error}>{myLocationError}</TextRegular>
            )}
            <TouchableOpacity style={styles.button} onPress={onLocateMePress}>
              <CustomIcon name="locate-me" size={24} color={Colors.black} />
              <TextSemiBold>{t("form.locate-me")}</TextSemiBold>
            </TouchableOpacity>

            {value && (
              <View
                style={styles.mapContainer}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  setMapDimensions({ width });
                }}
              >
                <View style={styles.previewLabel}>
                  <TextRegular>{t("form.what-patients-will-see")}</TextRegular>
                </View>
                <MapView
                  provider={PROVIDER_DEFAULT}
                  style={[
                    {
                      width: mapDimensions?.width,
                      height: mapDimensions?.width, // Square map
                    },
                    styles.map,
                  ]}
                  region={{
                    latitude: value.latitude,
                    longitude: value.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <DoctorMarker
                    identifier="user-location"
                    coordinate={value}
                    firstName={userData?.firstName || "First"}
                    lastName={userData?.lastName || "Last"}
                    image={userData?.image || ""}
                    uid={userData?.uid || ""}
                    price={consultationPrice}
                    shouldNavigate={false}
                  />
                </MapView>
                <TouchableOpacity
                  style={styles.button}
                  onPress={onRemoveLocationPress}
                >
                  <CustomIcon name="close" size={24} color={Colors.pink} />
                  <TextSemiBold style={styles.removeLocationText}>
                    {t("form.delete-location")}
                  </TextSemiBold>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      }}
    />
  );
};

export default ControllerLocator;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "100%",
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    textAlignVertical: "top",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    textAlign: "left",
  },
  addressInputContainer: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  previewLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 8,
    padding: 12,
    zIndex: 10,
  },
  labelInfo: {
    flexDirection: "column",
  },
  info: {
    color: Colors.lightText,
    fontSize: 14,
  },
  error: {
    color: Colors.pink,
    fontSize: 12,
  },
  geocodeButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 8,
  },
  button: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 8,
  },
  removeLocationText: {
    color: Colors.pink,
    fontSize: 14,
  },
  map: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
  },
  mapContainer: {
    marginTop: 10,
  },
});
