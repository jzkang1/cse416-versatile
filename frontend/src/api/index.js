import axios from 'axios'

axios.defaults.withCredentials = true;

const PORT = process.env.PORT || 5000;

const api = axios.create({
    baseURL: 'http://localhost:' + PORT + '/api',
})

// user api
export const getLoggedIn = () => api.get(`/loggedIn/`).catch((err) => { if (err.response) return err.response; else return null });
export const registerUser = (payload) => api.post(`/register/`, payload).catch((err) => { if (err.response) return err.response; else return null });
export const loginUser = (payload) => api.put(`/login/`, payload).catch((err) => { if (err.response) return err.response; else return null });
export const logoutUser = () => api.get(`/logout/`).catch((err) => { if (err.response) return err.response; else return null });

export const getUser = (id) => api.get(`/getUser/${id}`).catch((err) => { if (err.response) return err.response; else return null });

// map api
export const getMap = (id) => api.get(`/getMap/${id}`).catch((err) => { if (err.response) return err.response; else return null });
export const createMap = (payload) => api.post(`/createMap`, payload).catch((err) => { if (err.response) return err.response; else return null });
export const updateMap = (payload) => api.post(`/updateMap`, payload).catch((err) => { if (err.response) return err.response; else return null });
export const deleteMap = (payload) => api.delete(`/deleteMap`, payload).catch((err) => { if (err.response) return err.response; else return null });

// tileset api
export const getTileset = (id) => api.get(`/getTileset/${id}`).catch((err) => { if (err.response) return err.response; else return null });
export const createTileset = (payload) => api.post(`/createTileset`, payload).catch((err) => { if (err.response) return err.response; else return null });
export const updateTileset = (payload) => api.post(`/updateTileset`, payload).catch((err) => { if (err.response) return err.response; else return null });
export const deleteTileset = (payload) => api.delete(`/deleteTileset`, payload).catch((err) => { if (err.response) return err.response; else return null });

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUser
}

export default apis