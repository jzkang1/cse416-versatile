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
    SET_CURRENT_MAP_VIEW: "SET_CURRENT_MAP_VIEW",
    SET_CURRENT_PROFILE_VIEW: "SET_CURRENT_PROFILE_VIEW",
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        personalMapCards: [],
        communityMapCards: [],
        currentMapView: null,
        currentProfileView: null,
        currentProfileMaps: [],
    });
    
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext);
    
    const storeReducer = (action) => {
        const { type, payload } = action;
        
        switch (type) {
            case GlobalStoreActionType.SET_PERSONAL_MAPS: {
                return setStore({
                    personalMapCards: payload,
                    communityMapCards: [],
                    currentMapView: null,
                    currentProfileView: null,
                    currentProfileMaps: []
                });
            }

            case GlobalStoreActionType.SET_COMMUNITY_MAPS: {
                return setStore({
                    personalMapCards: [],
                    communityMapCards: payload,
                    currentMapView: null,
                    currentProfileView: null,
                    currentProfileMaps: []
                });
            }

            case GlobalStoreActionType.SET_CURRENT_MAP_VIEW: {
                return setStore({
                    personalMapCards: [],
                    communityMapCards: [],
                    currentMapView: payload,
                    currentProfileView: null,
                    currentProfileMaps: []
                });
            }

            case GlobalStoreActionType.SET_CURRENT_PROFILE_VIEW: {
                return setStore({
                    personalMapCards: [],
                    communityMapCards: [],
                    currentMapView: null,
                    currentProfileView: payload.user,
                    currentProfileMaps: payload.maps,
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

    store.loadCommunityMaps = async function() {
        try {
            const response = await api.getPublicMaps();
            if (response.data.success) {
                let publicMaps = response.data.publicMaps;
                
                storeReducer({
                    type: GlobalStoreActionType.SET_COMMUNITY_MAPS,
                    payload: publicMaps
                });
            }
        } catch (err) {
            console.log("failed to get public maps: " + err);
        }
    }

    store.loadProfile = async function(username) {
        try {
            let userResponse = await api.getUser(username);
            let mapResponse = await api.getMapsByUser(username);

            if (userResponse.data.success && mapResponse.data.success) {
                let user = userResponse.data.user;
                let maps = mapResponse.data.maps;

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_PROFILE_VIEW,
                    payload: {
                        user: user,
                        maps: maps
                    }
                });
                navigate(`/profile/${username}`)
            }
        } catch (err) {
            console.log(err);
        }
        
    }

    store.loadMapView = async function(id) {
        try {
            let response = await api.getMap(id);
            if (response.data.success) {

                let map = response.data.map;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_MAP_VIEW,
                    payload: map
                })
                navigate(`/mapView/${id}`);
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