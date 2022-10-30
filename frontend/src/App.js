import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'

import AppBanner from './components/AppBanner'
import HomeScreen from './components/HomeScreen'

import ProfileScreen from './components/ProfileScreen'
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'

import PersonalScreen from './components/PersonalScreen'
import CommunityScreen from './components/CommunityScreen'

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
                        <Route path="/Home" element={<HomeScreen />} />

                        <Route path="/profile" element={<ProfileScreen />} />
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/register" element={<RegisterScreen />} />

                        <Route path="/Personal" element={<PersonalScreen />} />
                        <Route path="/Community" element={<CommunityScreen />} />
                    </Routes>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
};

export default App;