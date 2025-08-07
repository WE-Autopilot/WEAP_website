import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import Join from "./components/Join";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import Sponsors from "./components/Sponsors";
import Footer from "./components/Footer";
import "./App.css";

/**
 * Main App component
 * @returns The main application component
 */
const App: React.FC = () => {

  return (
    <Router>
      <div className="app">
        <Header />

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

        <Footer />
      </div>
    </Router>
  );
};

export default App;
