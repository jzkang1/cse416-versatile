import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
// import { AppBanner, HomeScreen } from './components'
import AppBanner from './components/AppBanner'
import HomeScreen from './components/HomeScreen'

console.log("HI")

const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <AppBanner />
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                    </Routes>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
};

export default App;