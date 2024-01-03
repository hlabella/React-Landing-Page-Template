import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Faq } from "./components/faq";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";  // Assuming you have a Login component
import SignUp from "./components/SignUp";  // Assuming you have a SignUp component
import ProtectedRoute from './components/ProtectedRoute';  // Import ProtectedRoute
import Dashboard from './components/Dashboard';  // Import Dashboard
import Agreement from './components/Agreement';
import UserProfile from './components/UserProfile';
import Patients from './components/Patients';
import PatientForm from './components/PatientForm';
import Agenda from './components/Agenda';
import Recibos from './components/Recibos';
import Relatorios from './components/Relatorios';
import Assinatura from './components/Assinatura';
import Cobranca from './components/Cobranca';

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
          <>
            <Header data={landingPageData.Header} />
            <About data={landingPageData.About} />
            <Services data={landingPageData.Services} />
            <Faq data={landingPageData.FAQ} />
            <Team data={landingPageData.Team} />
            <Contact data={landingPageData.Contact} />
          </>
        } />
        <Route path="/agreement" element={<ProtectedRoute component={Agreement} />} />
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />

        <Route path="/dashboard/meu-consultorio" element={<ProtectedRoute component={UserProfile} />} />
        <Route path="/dashboard/minha-agenda" element={<ProtectedRoute component={Agenda} />} />
        <Route path="/dashboard/meus-pacientes" element={<ProtectedRoute component={Patients} />} />
        <Route path="/dashboard/meus-pacientes/add" element={<ProtectedRoute component={PatientForm} />} />
        <Route path="/dashboard/meus-pacientes/edit/:patientId" element={<ProtectedRoute component={PatientForm} />} />
        <Route path="/dashboard/meus-recibos" element={<ProtectedRoute component={Recibos} />} />
        <Route path="/dashboard/relatorios" element={<ProtectedRoute component={Relatorios} />} />
        <Route path="/dashboard/assinatura" element={<ProtectedRoute component={Assinatura} />} />
        <Route path="/dashboard/cobranca" element={<ProtectedRoute component={Cobranca} />} />
      </Routes>
    </Router>
  );
};

export default App;
