import DoctorHomeScreen from "@/components/screens/DoctorHomeScreen";
import PatientHomeScreen from "@/components/screens/PatientHomeScreen";
import { useUserData } from "@/stores/useUserStore";
import React from "react";

const Home = () => {
  const userData = useUserData();

  return userData?.role === "doctor" ? (
    <DoctorHomeScreen />
  ) : (
    <PatientHomeScreen />
  );
};

export default Home;
