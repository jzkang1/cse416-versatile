import { createContext, useContext, useState } from 'react'
import api from '../api'
import AuthContext from '../auth'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
}

function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentPage: "HOME",
    });

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    
    const storeReducer = (action) => {
        const { type, payload } = action;
        
        switch (type) {
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_CURRENT_PAGE: {
                return setStore({
                    currentPage: payload
                });
            }
            default:
                return store;
        }
    }

    store.setCurrentPage = function(newPage) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PAGE,
            payload: newPage
        })
    }

    store.viewProfile = async function(username) {
        let response = await api.getUser(username);
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };