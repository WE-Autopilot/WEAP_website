import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Sponsors from "./components/Sponsors";
import About from "./components/About";
import Join from "./components/Join";
import "./App.css";
import Competition from "./components/Competition";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/join" element={<Join />} />
        <Route path="/competition" element={<Competition />} />
      </Routes>
    </Router>
  );
}

export default App;
