import axios from 'axios'

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

// user api
export const getLoggedIn = () => api.get(`/loggedIn/`)
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.post(`/login/`, payload)
export const logoutUser = () => api.get(`/logout/`)

export const getUser = (id) => api.get(`/getUser/${id}`)

// map api
export const getMap = (id) => api.get(`/getMap/${id}`)
export const createMap = (payload) => api.post(`/createMap`, payload)
export const updateMap = (payload) => api.post(`/updateMap`, payload)
export const deleteMap = (payload) => api.delete(`/deleteMap`, payload)

// tileset api
export const getTileset = (id) => api.get(`/getTileset/${id}`)
export const createTileset = (payload) => api.post(`/createTileset`, payload)
export const updateTileset = (payload) => api.post(`/updateTileset`, payload)
export const deleteTileset = (payload) => api.delete(`/deleteTileset`, payload)

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUser
}

export default apis