import React, { useContext } from 'react'
import { GlobalStoreContext } from '../store'

export default function SplashScreen() {
    const { store } = useContext(GlobalStoreContext);

    function handleButtonClick(event) {
        store.testApi();
    }

    return (
        <React.Fragment>
            <button onClick={handleButtonClick}>
                test api
            </button>
        <div>
            {store.text}
        </div>
        </React.Fragment>
    )
}