import React, { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Faq } from "./components/Faq";
import { Contact } from "./components/Contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';  // Import Dashboard
import Integration from "./components/Integration";

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
        <Route path="/" element={
          <>
            <Header data={landingPageData.Header} />
            <About data={landingPageData.About} />
            <Services data={landingPageData.Services} />
            <Faq data={landingPageData.FAQ} />
            <Contact data={landingPageData.Contact} />
          </>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/integration" element={<Integration />} />
      </Routes>
    </Router>
  );
};

export default App;
