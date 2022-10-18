import React, { useContext } from 'react'
import { GlobalStoreContext } from '../store'

export default function SplashScreen() {
    const { store } = useContext(GlobalStoreContext);
    return (
        <div>
            {store.getTest()}
        </div>
    )
}