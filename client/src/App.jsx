import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" />
        <Route path="/sponsors" />
        <Route path="/join" />
        <Route path="/competition" />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
