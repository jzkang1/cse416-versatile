import { Global } from "@emotion/react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AuthContext from "../auth";

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
  SET_CURRENT_MAP_EDIT: "SET_CURRENT_MAP_EDIT",
};

function GlobalStoreContextProvider(props) {
  const [store, setStore] = useState({
    personalMapCards: [],
    communityMapCards: [],
    currentMapView: null,
    currentProfileView: null,
    currentProfileMaps: [],
    shareMapId: null,
    currentMapEdit: null,
  });

  const navigate = useNavigate();
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
          shareMapId: null,
          currentMapEdit: null,
        });
      }

      case GlobalStoreActionType.SET_COMMUNITY_MAPS: {
        return setStore({
          personalMapCards: [],
          communityMapCards: payload,
          currentMapView: null,
          currentProfileView: null,
          currentProfileMaps: [],
          shareMapId: null,
          currentMapEdit: null,
        });
      }

      case GlobalStoreActionType.SET_CURRENT_MAP_VIEW: {
        return setStore({
          personalMapCards: [],
          communityMapCards: [],
          currentMapView: payload,
          currentProfileView: null,
          currentProfileMaps: [],
          shareMapId: null,
          currentMapEdit: null,
        });
      }

      case GlobalStoreActionType.SET_CURRENT_PROFILE_VIEW: {
        return setStore({
          personalMapCards: [],
          communityMapCards: [],
          currentMapView: null,
          currentProfileView: payload.user,
          currentProfileMaps: payload.maps,
          shareMapId: null,
          currentMapEdit: null,
        });
      }

      case GlobalStoreActionType.SHARE_MODAL: {
        console.log("SHARE_MODAL reducer: " + payload);
        return setStore({
          personalMapCards: store.personalMapCards,
          communityMapCards: [],
          currentMapView: null,
          currentProfileView: [],
          currentProfileMaps: [],
          shareMapId: payload,
          currentMapEdit: null,
        });
      }

      case GlobalStoreActionType.SET_CURRENT_MAP_EDIT: {
        return setStore({
          personalMapCards: [],
          communityMapCards: [],
          currentMapView: null,
          currentProfileView: [],
          currentProfileMaps: [],
          shareMapId: store.shareMapId,
          currentMapEdit: payload,
        });
      }

      default:
        return store;
    }
  };

  store.loadPersonalMaps = async function () {
    try {
      console.log("loading personal maps");
      const response = await api.getPersonalMaps(auth.user.username);
      if (response.data.success) {
        let personalMaps = response.data.personalMaps;

        storeReducer({
          type: GlobalStoreActionType.SET_PERSONAL_MAPS,
          payload: personalMaps,
        });
        console.log("loaded personal maps");
      } else {
        console.log("api failed to retrieve personal maps");
      }
    } catch (err) {
      console.log("failed to get personal maps: " + err);
    }
  };

  store.loadCommunityMaps = async function () {
    try {
      const response = await api.getPublicMaps();
      if (response.data.success) {
        let publicMaps = response.data.publicMaps;

        storeReducer({
          type: GlobalStoreActionType.SET_COMMUNITY_MAPS,
          payload: publicMaps,
        });
      }
    } catch (err) {
      console.log("failed to get public maps: " + err);
    }
  };

  store.loadProfile = async function (username) {
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
            maps: maps,
          },
        });
        navigate(`/profile/${username}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  store.loadMapView = async function (id) {
    try {
      let response = await api.getMap(id);
      if (response.data.success) {
        let map = response.data.map;
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_MAP_VIEW,
          payload: map,
        });
        navigate(`/mapView/${id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  store.openShareModal = async function (mapId) {
    console.log("openShareModal: " + mapId);
    storeReducer({
      type: GlobalStoreActionType.SHARE_MODAL,
      payload: mapId,
    });
  };

  store.closeShareModal = async function () {
    storeReducer({
      type: GlobalStoreActionType.SHARE_MODAL,
      payload: null,
    });
  };

  store.shareMap = async function (mapId, newUser) {
    let userResponse = await api.getUser(newUser);

    if (userResponse.data.success) {
      const personalMaps = store.personalMapCards;
      for (let i = 0; i < personalMaps.length; i++) {
        if (personalMaps[i]._id == mapId) {
          if (!personalMaps[i].collaborators.includes(newUser)) {
            personalMaps[i].collaborators.push(newUser);
            store.updateMap(personalMaps[i]);

            return newUser;
          } else {
            auth.showModal(newUser + " has already been added!");
          }
        }
      }
    } else {
      auth.showModal(newUser + " does not exist!");
    }
  };

  store.removeShare = async function (mapId, user) {
    const personalMaps = store.personalMapCards;
    let index = 0;
    for (let i = 0; i < personalMaps.length; i++) {
      if (personalMaps[i]._id == mapId) {
        for (let j = 0; j < personalMaps[i].collaborators.length; j++) {
          if (personalMaps[i].collaborators[j] == user) {
            personalMaps[i].collaborators.splice(j, 1);
          }
        }
      }
    }

    store.updateMap(personalMaps[index]);
  };

  store.updateMap = async function (map) {
    const personalMaps = store.personalMapCards;
    console.log(map);
    const response = await api.updateMap(map);
    if (response.status == 200) {
      for (let i = 0; i < personalMaps.length; i++) {
        if (personalMaps[i]._id == map._id) {
          personalMaps[i] = map;
        }
      }
    }
    // store.closeShareModal();
  };

  store.searchCommunityMap = async function (searchText) {
    try {
      const response = await api.getPublicMaps();
      if (response.data.success) {
        let allPublicMaps = response.data.publicMaps;

        const filteredMaps = allPublicMaps.filter((map) =>
          map.name.includes(searchText)
        );
        storeReducer({
          type: GlobalStoreActionType.SET_COMMUNITY_MAPS,
          payload: filteredMaps,
        });
      }
    } catch (err) {
      console.log("failed to get public maps: " + err);
    }
  };

  store.sortCommunityMaps = async function (sort, isReversed) {
    try {
      const response = await api.getPublicMaps();
      if (response.data.success) {
        let sortedMaps = store.communityMapCards;
        console.log(sortedMaps);

        if (sort == "Date") {
          if (isReversed > 0)
            sortedMaps = sortedMaps.sort(
              (a, b) => Date.parse(b.publishDate) - Date.parse(a.publishDate)
            );
          else
            sortedMaps = sortedMaps.sort(
              (a, b) => Date.parse(a.publishDate) - Date.parse(b.publishDate)
            );
        } else if (sort == "Like") {
          if (isReversed > 0)
            sortedMaps = sortedMaps.sort(
              (a, b) => b.usersWhoLiked.length - a.usersWhoLiked.length
            );
          else
            sortedMaps = sortedMaps.sort(
              (a, b) => a.usersWhoLiked.length - b.usersWhoLiked.length
            );
        } else if (sort == "Views") {
          if (isReversed > 0)
            sortedMaps = sortedMaps.sort((a, b) => b.views - a.views);
          else sortedMaps = sortedMaps.sort((a, b) => a.views - b.views);
        }

        storeReducer({
          type: GlobalStoreActionType.SET_COMMUNITY_MAPS,
          payload: sortedMaps,
        });
      }
    } catch (err) {
      console.log("failed to get public maps: " + err);
    }
  };

  store.searchPersonalMap = async function (searchText) {
    try {
      const response = await api.getPersonalMaps(auth.user.username);
      if (response.data.success) {
        let personalMaps = response.data.personalMaps;

        const filteredMaps = personalMaps.filter((map) =>
          map.name.includes(searchText)
        );
        storeReducer({
          type: GlobalStoreActionType.SET_PERSONAL_MAPS,
          payload: filteredMaps,
        });
      }
    } catch (err) {
      console.log("failed to get public maps: " + err);
    }
  };

  store.sortPersonalMaps = async function (sort) {
    try {
      const response = await api.getPersonalMaps(auth.user.username);
      if (response.data.success) {
        let personalMaps = response.data.personalMaps;
        if (sort == "owned") {
          personalMaps = personalMaps.filter(
            (map) => map.owner == auth.user.username
          );
        }
        if (sort == "shared") {
          personalMaps = personalMaps.filter((map) =>
            map.collaborators.includes(auth.user.username)
          );
        }

        storeReducer({
          type: GlobalStoreActionType.SET_PERSONAL_MAPS,
          payload: personalMaps,
        });
      } else {
        console.log("api failed to retrieve personal maps");
      }
    } catch (err) {
      console.log("failed to get personal maps: " + err);
    }
  };

  store.likeMap = async function () {
    let _id = store.currentMapView._id;
    let username = auth.user.username;

    if (store.currentMapView.usersWhoDisliked.includes(username)) {
      await store.undislikeMap();
    }

    let response = await api.likeMap({ _id, username });
    if (response.data.success) {
      store.currentMapView.usersWhoLiked.push(username);
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_MAP_VIEW,
        payload: store.currentMapView,
      });
    }
  };

  store.unlikeMap = async function () {
    let _id = store.currentMapView._id;
    let username = auth.user.username;

    let response = await api.unlikeMap({ _id, username });
    if (response.data.success) {
      let index = store.currentMapView.usersWhoLiked.indexOf(username);
      if (index !== -1) {
        store.currentMapView.usersWhoLiked.splice(index, 1);
      }
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_MAP_VIEW,
        payload: store.currentMapView,
      });
    }
  };

  store.dislikeMap = async function () {
    let _id = store.currentMapView._id;
    let username = auth.user.username;

    if (store.currentMapView.usersWhoLiked.includes(username)) {
      await store.unlikeMap();
    }

    let response = await api.dislikeMap({ _id, username });
    if (response.data.success) {
      store.currentMapView.usersWhoDisliked.push(username);
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_MAP_VIEW,
        payload: store.currentMapView,
      });
    }
  };

  store.undislikeMap = async function () {
    let _id = store.currentMapView._id;
    let username = auth.user.username;

    let response = await api.undislikeMap({ _id, username });
    if (response.data.success) {
      let index = store.currentMapView.usersWhoDisliked.indexOf(username);
      if (index !== -1) {
        store.currentMapView.usersWhoDisliked.splice(index, 1);
      }
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_MAP_VIEW,
        payload: store.currentMapView,
      });
    }
  };

  store.postComment = async function (comment) {
    let _id = store.currentMapView._id;
    let response = await api.postComment({ _id, comment });
    if (response.data.success) {
      store.currentMapView.comments.push(comment);
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_MAP_VIEW,
        payload: store.currentMapView,
      });
    }
  };

  store.createMap = async function () {
    console.log("store.createMap: Creating Map...");

    let payload = {
      name: "untitled",
      owner: auth.user.username,
      height: 1024,
      width: 1024,
      tileHeight: 32,
      tileWidth: 32,
    };
    let response = await api.createMap(payload);
    if (response.data.success) {
      store.loadPersonalMaps();
    }

    console.log("store.createMap: Map Created!");
  };

  store.deleteMap = async function (mapId) {
    console.log("store.deleteMap: deleteMap...");

    console.log(mapId);
    let response = await api.deleteMap({ _id: mapId });
    if (response.data.success) {
      store.loadPersonalMaps();
    }

    console.log("store.deleteMap: deleteMap!");
  };

  store.publishMap = async function (id) {
    let payload = { _id: id };
    let response = await api.publishMap(payload);
    if (response.data.success) {
      store.loadPersonalMaps();
    }
  };

  store.duplicateMap = async function (mapId) {
    console.log("store.duplicateMap: duplicateMap...");

    console.log(mapId);
    let response = await api.duplicateMap({ _id: mapId });
    if (response.data.success) {
      store.loadPersonalMaps();
    }

    console.log("store.deleteMap: duplicateMap!");
  };

  store.handleMakeACopy = async function () {
    let _id = store.currentMapView._id;
    let owner = auth.user.username;
    console.log("store.handleMakeACopy: handleMakeACopy...");

    console.log(_id);
    let response = await api.duplicateMap({ _id, owner });
    if (response.data.success) {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_MAP_VIEW,
        payload: store.currentMapView,
      });
    }
    console.log("store.handleMakeACopy: handleMakeACopy!");
  };

  store.loadMapEdit = async function (id) {
    let response = await api.getMap(id);
    if (response.data.success) {
      let map = response.data.map;

      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_MAP_EDIT,
        payload: map,
      });

      return map;
    }
  };

  store.createTileset = async function (
    mapID,
    name,
    imageString,
    imageWidth,
    imageHeight
  ) {
    console.log("store.createTileset: Creating tileset... ");

    let payload = {
      mapID: mapID,
      name: name,
      data: imageString,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
    };

    let response = await api.createTileset(payload);

    if (response.data.success) {
      let map = response.data.map;
      console.log(map);
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_MAP_EDIT,
        payload: map,
      });

      console.log("store.createTileset: tileset created");
    }
  };

  store.updateTileset = async function (mapID, tilesetID, name, imageString) {
    console.log("store.updateTileset: Updating tileset ");
    let payload = {
      mapID: mapID,
      tilesetID: tilesetID,
      name: name,
      data: imageString,
    };

    let response = await api.updateTileset(payload);

    if (response.data.success) {
      let map = response.data.map;
      console.log(map);
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_MAP_EDIT,
        payload: map,
      });

      console.log("store.updateTileset: tileset updated");
    }
  };

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
