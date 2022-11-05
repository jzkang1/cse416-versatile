import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    SET_PERSONAL_MAPS: "SET_PERSONAL_MAPS",
    SET_COMMUNITY_MAPS: "SET_COMMUNITY_MAPS",
    SET_CURRENT_PROFILE_VIEW: "SET_CURRENT_PROFILE_VIEW",

}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        personalMapCards: [],
        communityMapCards: [],
        currentProfileView: null,
    });
    
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext);
    
    const storeReducer = (action) => {
        const { type, payload } = action;
        
        switch (type) {
            case GlobalStoreActionType.SET_PERSONAL_MAPS: {
                return setStore({
                    personalMapCards: payload,
                    communityMapCards: store.communityMapCards,
                    currentProfileView: store.currentProfileView,
                });
            }

            case GlobalStoreActionType.SET_COMMUNITY_MAPS: {
                return setStore({
                    personalMapCards: store.personalMapCards,
                    communityMapCards: payload,
                    currentProfileView: store.currentProfileView,
                });
            }

            case GlobalStoreActionType.SET_CURRENT_PROFILE_VIEW: {
                return setStore({
                    personalMapCards: store.personalMapCards,
                    communityMapCards: store.communityMapCards,
                    currentProfileView: payload,
                });
            }

            default:
                return store;
        }
    }

    store.loadPersonalMaps = async function() {
        try {
            const response = await api.getPersonalMaps({username: auth.user.username});
            if (response.data.success) {

                let personalMaps = response.data.personalMaps;
                
                storeReducer({
                    type: GlobalStoreActionType.SET_PERSONAL_MAPS,
                    payload: personalMaps
                });
            }
            else {
                console.log("api failed to retrieve personal maps");
            }
        } catch (err) {
            console.log("failed to get personal maps: " + err);
        }
    }

    store.loadProfile = async function(username) {
        try {
            let response = await api.getUser(username);
            if (response.data.success) {

                let user = response.data.user;

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PROFILE_VIEW,
                    payload: user
                })
                navigate(`/profile/${username}`)
            }
        } catch (err) {
            console.log(err);
        }
        
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