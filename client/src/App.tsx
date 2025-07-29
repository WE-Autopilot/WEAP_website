import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import Join from "./components/Join";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./components/Home";
import About from "./components/About";
import Sponsors from "./components/Sponsors";
import Competition from "./components/Competition";
import Footer from "./components/Footer";
import { Gradient } from "./assets/Gradient";
import "./App.css";

/**
 * Main App component
 * @returns The main application component
 */
const App: React.FC = () => {
  // Initialize the gradient background
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);

  return (
    <Router>
      <div className="app">
        <div id="animated-bg">
          <canvas id="gradient-canvas"></canvas>
        </div>
        <Header />
        <ErrorBoundary>
          <main className="content">
            <Routes>
              <Route path="/contact" element={<Contact />} />
              <Route path="/join" element={<Join />} />
              <Route path="/about" element={<About />} />
              <Route path="/sponsors" element={<Sponsors />} />
              {/* <Route path="/competition" element={<Competition />} /> */}
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </ErrorBoundary>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
