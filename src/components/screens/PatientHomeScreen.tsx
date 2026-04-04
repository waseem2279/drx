import React from "react";
import PageScrollView from "../PageScrollView";
import Footer from "./patient/Footer";
import InternationalDoctors from "./patient/InternationalDoctors";
import PatientActions from "./patient/PatientActions";
import Services from "./patient/Services";
import Symptoms from "./patient/Symptoms";
import DoctorCarousel from "./patient/DoctorCarousel";

const PatientHomeScreen = () => {
  return (
    <PageScrollView showsVerticalScrollIndicator={false} style={{ padding: 0 }}>
      <Symptoms />
      <Services />
      <InternationalDoctors />
      <DoctorCarousel />
      <PatientActions />
      <Footer />
    </PageScrollView>
  );
};
export default PatientHomeScreen;
