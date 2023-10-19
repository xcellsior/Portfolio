// Navbar.js
import React, {useContext, useState} from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import ThemeToggle from './ThemeToggle'; // adjust the path based on your project structure

function Navbar({ onToggleTheme, sidebarOpen }) {
    const theme = useContext(ThemeContext);
    const navStyle = {
        backgroundColor: sidebarOpen ? theme.navbarBackground : 'transparent',
        color: theme.foreground,
        width: '200px',
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (

        <div className={`navbar ${sidebarOpen ? 'open' : 'closed'} ${theme}`} style={navStyle}>
            {sidebarOpen &&
                <nav className={`navbar-nav ${sidebarOpen ? 'open' : 'closed'} ${theme}`}>
                    <ul>
                        <li>
                            <NavLink to="/" end className="link" activeClassName="active">Home</NavLink>
                        </li>
                        <li>
                            <div className="dropdown" onClick={toggleDropdown}>
                                {isDropdownOpen ? '▲' : '▼'} Dapps
                                {isDropdownOpen &&
                                    <div className="dropdown-content">
                                        <li>
                                            <NavLink to="/msgboard" className="link" onClick={event => event.stopPropagation()}>Message Board</NavLink>
                                        </li>
                                    </div>
                                }
                            </div>
                        </li>
                        <li>
                            <NavLink to="/resume" className="link" activeClassName="active">Resume</NavLink>
                        </li>
                    </ul>
                </nav>
            }
        </div>
    );
}



export default Navbar;
