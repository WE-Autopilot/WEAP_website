import "../stylesheets/Header.css";
import { Link } from "react-router-dom";
import { useState, useRef, memo } from "react";
import onClickOutside from "../hooks/onClickOutside";
function Header() {
  const [isMenu, setMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navRef = useRef();

  const handleMenuClose = () => {
    setMenu(false);
    // setTimeout(() => {
    //   setMenu(false);
    //   setIsClosing(false);
    // }, 500);
  };

  onClickOutside(navRef, () => {
    console.log("clicked outside");
    if (isMenu) handleMenuClose();
  });

  return (
    <header className="Header">
      <img src="/headerlogo.png" alt="Logo" className="logo" />

      <div className="menu-icon">
        <button
          className="fimenu"
          onClick={() => {
            setMenu(!isMenu);
          }}
        >
          {isMenu ? (
            <svg
              className={`menu-icon menuRotate ${isMenu ? "active" : ""}`}
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              border="none"
              outline="none"
            >
              <path
                className="line1"
                fill="none"
                stroke="#242424"
                strokeWidth="3"
                d="M3,3 L21,21 M3,21 L21,3"
              ></path>
            </svg>
          ) : (
            <svg
              className={`menu-icon menuRotate ${isMenu ? "active" : ""}`}
              stroke="#242424"
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1.5em"
              width="1.5em"
              border="none"
              outline="none"
            >
              <line x1={3} y1={12} x2={21} y2={12} />
              <line x1={3} y1={6} x2={21} y2={6} />
              <line x1={3} y1={18} x2={21} y2={18} />
            </svg>
          )}
        </button>
      </div>

      <nav
        ref={navRef}
        className={`nav ${isMenu ? "open" : ""} ${isClosing ? " closing" : ""}`}
      >
        <ul className="links">
          <li>
            <Link to="/" onClick={handleMenuClose}>
              Home
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/about" onClick={handleMenuClose}>
              About
            </Link>
          </li>
          <li>
            <Link to="/sponsors" onClick={handleMenuClose}>
              Sponsors
            </Link>
          </li>
          <li>
            <Link to="/join" onClick={handleMenuClose}>
              Join
            </Link>
          </li>
          <li>
            <Link to="/competition" onClick={handleMenuClose}>
              Competition
            </Link>
          </li>
        </ul>
      </nav>
      <img id="headervector" src="/vectors/HeaderVector.svg"></img>
    </header>
  );
}

export default memo(Header);
