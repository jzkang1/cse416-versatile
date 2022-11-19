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
import RecoveryScreen from './components/RecoveryScreen'

import PersonalScreen from './components/PersonalScreen'
import CommunityScreen from './components/CommunityScreen'
import MapView from './components/MapView'

import MapEditorScreen from './components/MapEditorScreen'
import TileEditor from './components/TileEditor';


const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <AppBanner />
                    
                    <Routes>
                        <Route path="/" element={<HomeScreen/>} />
                        <Route path="/Home" element={<HomeScreen/>} />

                        <Route path="/profile/:username" element={<ProfileScreen/>} />
                        <Route path="/login" element={<LoginScreen/>} />
                        <Route path="/register" element={<RegisterScreen/>} />
                        <Route path="/recovery" element={<RecoveryScreen/>} />

                        <Route path="/personal" element={<PersonalScreen/>} />
                        <Route path="/community" element={<CommunityScreen/>} />

                        <Route path="/mapView/:id" element={<MapView/>} />

                        <Route path="/editor/:id" element={<MapEditorScreen/>} />
                        <Route path="/tileEditor" element={<TileEditor/>} />
                    </Routes>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
};

export default App;