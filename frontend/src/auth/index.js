import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    SHOW_MODAL: "SHOW_MODAL",
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        modalText: null
    });

    const navigate = useNavigate()

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    modalText: null
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    modalText: null
                })
            }
            case AuthActionType.LOGIN_USER: { 
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    modalText: null
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    modalText: null
                });
            }
            case AuthActionType.SHOW_MODAL: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    modalText: payload.modalText
                });
            }
            default:
                return auth;
        }
    }

    auth.closeModal = function () {
        authReducer({
            type: AuthActionType.SHOW_MODAL,
            payload: {
                modalText: null
            }
        })
    }

    auth.getLoggedIn = async function(store) {
        try {
            const response = await api.getLoggedIn();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
                // store.loadIdNamePairs();
                navigate("/");
            }
        } catch (err) {
            console.log(err)
        }
    }

    auth.registerUser = async function(userData, store) {
        try {
            const response = await api.registerUser(userData);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                });
                navigate("/personal");
                // store.loadIdNamePairs();
            } 
            else {
                authReducer({
                    type: AuthActionType.SHOW_MODAL,
                    payload: {
                        modalText: response.data.errorMessage
                    }
                });
            }
        } catch (err) {
            authReducer({
                type: AuthActionType.SHOW_MODAL,
                payload: {
                    modalText: err.response
                }
            });
        }
    }

    auth.loginUser = async function(userData, store) {
        try {
            const response = await api.loginUser(userData);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                });
                navigate('/personal')
            } else {
                console.log(response.data)
                authReducer({
                    type: AuthActionType.SHOW_MODAL,
                    payload: {
                        modalText: response.data.errorMessage
                    }
                });
            }
        } catch (err) {
            console.log(err)
            authReducer({
                type: AuthActionType.SHOW_MODAL,
                payload: {
                    modalText: "Invalid email or password"
                }
            });
        }
    }

    auth.logoutUser = async function() {
        try {
            let response = await api.getLoggedIn();
            if (response.data.loggedIn) {
                await api.logoutUser();
            }
        } catch (err) {

        }

        authReducer({
            type: AuthActionType.LOGOUT_USER,
            payload: {}
        });
        navigate("/");
    }

    auth.getUser = async function(id) {
        try {
            let response = await api.getUser(id);
            if (response.data.success) {
                return response.data.user;
            }
        } catch (err) {
            console.log(`user ${id} not found`)
        }
    }

    return (
        <AuthContext.Provider value={{auth}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };