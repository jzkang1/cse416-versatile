import axios from 'axios'

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: '/api',
})

// user api
export const getLoggedIn = () => api.get(`/loggedIn/`).catch(catcher);
export const registerUser = (payload) => api.post(`/register/`, payload).catch(catcher);
export const loginUser = (payload) => api.put(`/login/`, payload).catch(catcher);
export const logoutUser = () => api.get(`/logout/`).catch(catcher);
// user - postman api
export const sendRecoveryCode = (payload) => api.put(`/sendCode/`, payload).catch(catcher);
export const validateRecoveryCode = (payload) => api.put(`/validateCode/`, payload).catch(catcher);
export const changePassword = (payload) => api.put(`/changePassword/`, payload).catch(catcher);

export const getUser = (username) => api.get(`/getUser/${username}`).catch(catcher);

// map api
export const getPersonalMaps = (payload) => api.get(`/getPublicMaps`, payload).catch(catcher);
export const getPublicMaps = (payload) => api.get(`/getPublicMaps`, payload).catch(catcher);

export const getMap = (id) => api.get(`/getMap/${id}`).catch(catcher);
export const createMap = (payload) => api.post(`/createMap`, payload).catch(catcher);
export const updateMap = (payload) => api.post(`/updateMap`, payload).catch(catcher);
export const deleteMap = (payload) => api.delete(`/deleteMap`, payload).catch(catcher);

export const getMapsByUser = (username) => api.get(`/getMapsByUser/${username}`).catch(catcher);

// tileset api
export const getTileset = (id) => api.get(`/getTileset/${id}`).catch(catcher);
export const createTileset = (payload) => api.post(`/createTileset`, payload).catch(catcher);
export const updateTileset = (payload) => api.post(`/updateTileset`, payload).catch(catcher);
export const deleteTileset = (payload) => api.delete(`/deleteTileset`, payload).catch(catcher);

let catcher = (err) => { if (err.response) return err.response; else return null }

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    sendRecoveryCode,
    validateRecoveryCode,
    changePassword,

    getPersonalMaps,
    getPublicMaps,

    getMap,
    createMap,
    updateMap,
    deleteMap,
    
    getMapsByUser,

    getTileset,
    createTileset,
    updateTileset,
    deleteTileset
}

export default apis