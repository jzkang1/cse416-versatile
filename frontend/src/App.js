import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import HomeScreen from './components/HomeScreen'
import AppBanner from './components/AppBanner'

const App = () => {
  return (
    <BrowserRouter>
      <AppBanner />
      <Routes>
        <Route path="/" element={<HomeScreen/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
