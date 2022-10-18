import React, { createContext, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
//console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    SET_REGISTER_ERROR: "SET_REGISTER_ERROR",
    LOGIN_USER: "LOGIN_USER",
    SET_LOGIN_ERROR: "SET_LOGIN_ERROR",
    LOGOUT_USER: "LOGOUT_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        registerError: null,
        loginError: null
    });
    const history = useHistory();

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    registerError: null,
                    loginError: null
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    registerError: null,
                    loginError: null
                })
            }
            case AuthActionType.SET_REGISTER_ERROR: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    registerError: payload.registerError,
                    loginError: null
                });
            }
            case AuthActionType.LOGIN_USER: { 
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    registerError: null,
                    loginError: null
                })
            }
            case AuthActionType.SET_LOGIN_ERROR: {
                return setAuth({
                    user: auth.user,
                    loggedIn: false,
                    registerError: null,
                    loginError: payload.loginError
                });
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    registerError: null,
                    loginError: null
                });
            }
            default:
                return auth;
        }
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
                store.loadIdNamePairs();
                history.push("/");
            }
        } catch (err) {
            
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
                history.push("/");
                store.loadIdNamePairs();
            } else {
                authReducer({
                    type: AuthActionType.SET_REGISTER_ERROR,
                    payload: {
                        registerError: response.data.errorMessage
                    }
                });
            }
        } catch (err) {
            authReducer({
                type: AuthActionType.SET_REGISTER_ERROR,
                payload: {
                    registerError: err.response.data.errorMessage
                }
            });
        }
    }

    auth.closeRegisterError = function() {
        authReducer({
            type: AuthActionType.SET_REGISTER_ERROR,
            payload: {
                registerError: null
            }
        });
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
                history.push("/");
                store.loadIdNamePairs();
            } else {
                authReducer({
                    type: AuthActionType.SET_LOGIN_ERROR,
                    payload: {
                        loginError: response.data.loginError
                    }
                });
            }
        } catch (err) {
            authReducer({
                type: AuthActionType.SET_LOGIN_ERROR,
                payload: {
                    loginError: "Invalid email or password"
                }
            });
        }
    }

    auth.closeLoginError = function() {
        authReducer({
            type: AuthActionType.SET_LOGIN_ERROR,
            payload: {
                loginError: null
            }
        });
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
        history.push("/");
    }

    return (
        <AuthContext.Provider value={{auth}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };