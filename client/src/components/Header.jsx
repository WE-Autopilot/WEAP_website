import '../stylesheets/Header.css'
import { Link } from "react-router-dom"
import { useState, memo } from "react"
function Header() {
    
    const [isMenu, setMenu] = useState(false)

    return (
        <header className="Header">
            <img src="/Logo.png" alt="Logo" className="logo" />
            
            <div className="menu-icon">
                <button className="fimenu" onClick={ () => {setMenu(!isMenu)}}>
                    
                    {isMenu ? (
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" border="none" outline="none">
                            <path fill="none" stroke="#242424" strokeWidth="3" d="M3,3 L21,21 M3,21 L21,3"></path>
                        </svg>
                        ) : (
                            <svg
                            stroke="#242424"
                            fill="none"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            height="1.5em"
                            width="1.5em"
                            border="none"
                            outline="none">
                            <line x1={3} y1={12} x2={21} y2={12} />
                            <line x1={3} y1={6} x2={21} y2={6} />
                            <line x1={3} y1={18} x2={21} y2={18} />
                            </svg>
                        )}
                </button>
            </div>

            
            
            <nav className={`nav ${isMenu ? "open" : ""}`}>
                <ul className="links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/sponsors">Sponsors</Link></li>
                    <li><Link to="/join">Join</Link></li>
                    <li><Link to="/competition">Competition</Link></li>
                </ul>
            </nav>

        </header>
    )
}


export default memo(Header);