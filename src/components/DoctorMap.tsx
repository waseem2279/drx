import React, { useMemo, useState } from "react";
import { StyleSheet, LayoutChangeEvent } from "react-native";
import { useFilteredDoctors } from "@/stores/useDoctorSearch";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import LoadingScreen from "./LoadingScreen";
import DoctorMarker from "./map/DoctorMarker";
import { useFilters } from "@/stores/useFilterStore";
import ContainerView from "./ContainerView";

const DoctorMap = () => {
  const filters = useFilters();
  const doctors = useFilteredDoctors(filters);
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

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMapDimensions({ width, height });
  };

  return (
    <ContainerView onLayout={handleLayout}>
      {mapDimensions ? (
        <MapView
          paddingAdjustmentBehavior="never"
          moveOnMarkerPress={false}
          provider={PROVIDER_DEFAULT}
          style={styles.mapView}
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
              variant={"avatar"}
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
