import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Gradient } from "./assets/Gradient.js";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Sponsors from "./components/Sponsors";
import About from "./components/About";
import Join from "./components/Join";
import "./App.css";
import Competition from "./components/Competition";


function TitleUpdater() {
  const location = useLocation(); 

  useEffect(() => {
    const titleMap = {
      "/": "Home - WE Autopilot",
      "/about": "About - WE Autopilot",
      "/sponsors": "Sponsors - WE Autopilot",
      "/join": "Join Us - WE Autopilot",
      "/competition": "Competition - WE Autopilot",
    };

    document.title = titleMap[location.pathname] || "WE Autopilot";
  }, [location.pathname]); 

  return null; 
}

function App() {
  // useEffect(() => {
  //   const gradient = new Gradient();
  //   gradient.initGradient("#gradient-canvas");
  // }, []);

  return (
    <div className="app-container">
      {/* <div id="animated-bg">
        <canvas id="gradient-canvas" data-transition-in></canvas>
      </div> */}

      <div className="content">
        <Router>
          <TitleUpdater />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/join" element={<Join />} />
            <Route path="/competition" element={<Competition />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </div>
  );
}

export default App;
