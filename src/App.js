// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
//import MessageBoard from './components/MessageBoard';
import Resume from './components/Resume';
import MsgBoard from './components/MsgBoard';
import { ThemeContext, themes } from './ThemeContext';
import { WagmiConfig, createConfig, configureChains, sepolia } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import ThemeToggle from "./components/ThemeToggle";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
    [sepolia],
    [alchemyProvider({ apiKey: process.env.REACT_APP_SEPOLIA_API }),
        publicProvider()],
);
// Set up wagmi config
const config = createConfig({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new InjectedConnector({
            chains,
            options: {
                name: 'Injected',
                shimDisconnect: true,
            },
        }),
    ],
    publicClient,
    webSocketPublicClient,
})

function App() {
    const [theme, setTheme] = useState(themes.dark);
    let test = process.env.REACT_APP_SEPOLIA_API;
    console.log(test)
    const toggleTheme = () => {
        setTheme(theme === themes.dark ? themes.light : themes.dark);
    };
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    useEffect(() => {
        document.body.style.backgroundColor = theme.background;
        document.body.style.color = theme.foreground;
    }, [theme]);

    return (
        <ThemeContext.Provider value={theme}>
            <Router>
                <div className="app-layout">
                    <button onClick={toggleSidebar} className={`hamburger ${sidebarOpen ? 'sidebarOpen' : ''}`}>
                        {sidebarOpen ? 'X' : '☰'}
                    </button>
                    <Navbar sidebarOpen={sidebarOpen} />
                    <div className={`app-content ${sidebarOpen ? '' : 'expanded'}`}>
                        <WagmiConfig config={config}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/msgboard" element={<MsgBoard />} />
                                <Route path="/resume" element={<Resume />} />
                            </Routes>
                        </WagmiConfig>
                    </div>
                </div>
                <ThemeToggle onToggleTheme={toggleTheme} />
            </Router>
        </ThemeContext.Provider>
    );
}

export default App;