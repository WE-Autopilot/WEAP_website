import '../stylesheets/Header.css'
import { Link } from "react-router-dom"

function Header() {
    
    return (
        <header className="Header">
            <img src="/Logo.png" alt="Logo" className="logo" />
            <nav className="nav">
                <ul className="links">
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/sponsors">Sponsors</Link></li>
                    <li><Link to="/join">Join</Link></li>
                    <li><Link to="/competition">Competition</Link></li>
                </ul>
            </nav>

        </header>
    )
}

export default Header;