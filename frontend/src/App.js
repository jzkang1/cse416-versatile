import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'

import AppBanner from './components/AppBanner'
import HomeScreen from './components/HomeScreen'
import LoginScreen from './components/LoginScreen'

console.log("HI")

// DARK: #001328
// MID: #001F41
// LIGHT: #002956

const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <AppBanner />
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/login" element={<LoginScreen />} />
                    </Routes>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
};

export default App;