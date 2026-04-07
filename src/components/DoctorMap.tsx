import React, { useMemo, useState } from "react";
import { StyleSheet, LayoutChangeEvent, Platform } from "react-native";
import { useFilteredDoctors } from "@/stores/useDoctorSearch";
import MapView, { Details, PROVIDER_DEFAULT, Region } from "react-native-maps";
import LoadingScreen from "./LoadingScreen";
import DoctorMarker from "./map/DoctorMarker";
import { useFilters } from "@/stores/useFilterStore";
import ContainerView from "./ContainerView";

const INITIAL_REGION = {
  latitude: 41.924447,
  longitude: -87.687339,
  latitudeDelta: 100,
  longitudeDelta: 100,
};

const CARD_MARKER_LATITUDE_DELTA = 12;

const DoctorMap = () => {
  const filters = useFilters();
  const doctors = useFilteredDoctors(filters);
  const [region, setRegion] = useState(INITIAL_REGION);
  const [mapDimensions, setMapDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const doctorPlaces = useMemo(() => {
    if (!doctors) return [];

    return doctors
      .filter(
        (
          doctor,
        ): doctor is typeof doctor & {
          coordinates: { longitude: number; latitude: number };
        } => !!doctor.coordinates,
      )
      .map((doctor) => {
        const { longitude, latitude } = doctor.coordinates;
        return {
          ...doctor,
          longitude,
          latitude,
        };
      });
  }, [doctors]);

  const handleRegionChange = (newRegion: Region, details: Details): void => {
    // If OS is android, check if the change is due to a gesture
    if (Platform.OS === "android" && details?.isGesture) setRegion(newRegion);
    if (Platform.OS === "ios") setRegion(newRegion); // isGesture is undefined on iOS
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ width, height });
  };

  const showCardMarker = region.latitudeDelta <= CARD_MARKER_LATITUDE_DELTA;

  return (
    <ContainerView onLayout={handleLayout}>
      {mapDimensions ? (
        <MapView
          paddingAdjustmentBehavior="never"
          moveOnMarkerPress={false}
          provider={PROVIDER_DEFAULT}
          style={styles.mapView}
          region={region}
          onRegionChangeComplete={handleRegionChange}
        >
          {doctorPlaces.map((doctor) => (
            <DoctorMarker
              key={doctor.id ?? doctor.uid}
              identifier={doctor.uid ?? doctor.id}
              coordinate={{
                latitude: doctor.latitude,
                longitude: doctor.longitude,
              }}
              firstName={doctor.firstName}
              lastName={doctor.lastName}
              image={doctor.image}
              uid={doctor.uid}
              price={doctor.consultationPrice}
              variant={showCardMarker ? "card" : "avatar"}
            />
          ))}
        </MapView>
      ) : (
        <LoadingScreen />
      )}
    </ContainerView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
});

export default DoctorMap;
