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
    SHARE_MODAL: "SHARE_MODAL",
    UPDATE_MAP: "UPDATE_MAP"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        personalMapCards: [],
        communityMapCards: [],
        currentMapView: null,
        currentProfileView: null,
        currentProfileMaps: [],
        shareMapId: null
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
                    currentProfileMaps: [],
                    shareMapId: null
                });
            }

            case GlobalStoreActionType.SET_COMMUNITY_MAPS: {
                return setStore({
                    personalMapCards: [],
                    communityMapCards: payload,
                    currentMapView: null,
                    currentProfileView: null,
                    currentProfileMaps: [],
                    shareMapId: null
                });
            }

            case GlobalStoreActionType.SET_CURRENT_MAP_VIEW: {
                return setStore({
                    personalMapCards: [],
                    communityMapCards: [],
                    currentMapView: payload,
                    currentProfileView: null,
                    currentProfileMaps: [],
                    shareMapId: null
                });
            }

            case GlobalStoreActionType.SET_CURRENT_PROFILE_VIEW: {
                return setStore({
                    personalMapCards: [],
                    communityMapCards: [],
                    currentMapView: null,
                    currentProfileView: payload.user,
                    currentProfileMaps: payload.maps,
                    shareMapId: null
                });
            }

            case GlobalStoreActionType.SHARE_MODAL: {
                console.log("SHARE_MODAL reducer: " + payload)
                return setStore({
                    personalMapCards: store.personalMapCards,
                    communityMapCards: [],
                    currentMapView: null,
                    currentProfileView: [],
                    currentProfileMaps: [],
                    shareMapId: payload
                });
            }

            case GlobalStoreActionType.UPDATE_MAP: {
                console.log("SHARE_MODAL reducer: " + payload)
                return setStore({
                    personalMapCards: payload.personalMapCards,
                    communityMapCards: [],
                    currentMapView: null,
                    currentProfileView: [],
                    currentProfileMaps: [],
                    shareMapId: store.shareMapId
                });
            }

            default:
                return store;
        }
    }

    store.loadPersonalMaps = async function() {
        try {
            const response = await api.getPersonalMaps(auth.user.username);
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

    store.openShareModal = async function (mapId) {
        console.log("openShareModal: " + mapId)
        storeReducer({
            type: GlobalStoreActionType.SHARE_MODAL,
            payload: mapId
        })
    }

    store.closeShareModal = async function () {
        storeReducer({
            type: GlobalStoreActionType.SHARE_MODAL,
            payload: null
        })
    }


    store.shareMap = async function (mapId, newUser) {

        let userResponse = await api.getUser(newUser);

        if (userResponse.data.success) {
            const personalMaps = store.personalMapCards;
            for(let i = 0; i < personalMaps.length; i++){
                if(personalMaps[i]._id == mapId){
                    if (!personalMaps[i].collaborators.includes(newUser)) {
                        personalMaps[i].collaborators.push(newUser);
                        store.updateMap(personalMaps[i])
                    } else {
                        auth.showModal(newUser + " has already been added!")
                    }  
                }
            }
        } else {
            auth.showModal(newUser + " does not exist!")
        }
    }

    store.removeShare = async function (mapId, user){
        const personalMaps = store.personalMapCards;
        let index = 0;
        for(let i = 0; i < personalMaps.length; i++){
            if(personalMaps[i]._id == mapId){
                for(let j = 0; j < personalMaps[i].collaborators.length; j++){
                    if(personalMaps[i].collaborators[j] == user){
                        personalMaps[i].collaborators.splice(j,1);
                    }
                }
            }
        }

        store.updateMap(personalMaps[index]);
    }

    store.updateMap = async function (map) {
        const personalMaps = store.personalMapCards;
        console.log(map)
        const response = await api.updateMap(map);
        if(response.status == 200){
            for(let i = 0; i < personalMaps.length; i++){
                if(personalMaps[i]._id == map._id){
                    personalMaps[i] = map;
                }
            }
        }
        store.closeShareModal();
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