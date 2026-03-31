import { View, StyleSheet } from "react-native";
import React, { Ref, useMemo } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import DoctorList from "./DoctorList/DoctorList";

const DoctorsBottomSheet = ({
  handleSheetChanges,
  bottomSheetRef,
  refresh,
}: {
  handleSheetChanges: (index: number) => void;
  bottomSheetRef: Ref<BottomSheet>;
  refresh: number;
}) => {
  const snapPoints = useMemo(() => ["4%", "100%"], []);

  return (
    <BottomSheet
      animateOnMount={false}
      style={styles.sheetContainer}
      backgroundStyle={styles.bottomSheetBackground}
      snapPoints={snapPoints}
      index={1}
      ref={bottomSheetRef}
      handleIndicatorStyle={{ backgroundColor: Colors.light.grey }}
      enablePanDownToClose={false}
      onChange={handleSheetChanges}
    >
      <DoctorList refresh={refresh} />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  bottomSheetBackground: {
    borderRadius: 0,
  },
  sheetContainer: {
    borderRadius: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});

export default DoctorsBottomSheet;
