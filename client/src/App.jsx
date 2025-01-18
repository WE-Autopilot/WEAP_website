import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./components/Home"
import './App.css'





import Sponsors from "./components/Sponsors"


function App() {


  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about"/>
        <Route path="/sponsors" element={<Sponsors />}/>
        <Route path="/join" />
        <Route path="/competition" />

      </Routes>
    </Router>
  )
}

export default App
