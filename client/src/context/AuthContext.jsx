import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        api.get("/auth/me")
            .then(res => setUser(res.data))
            .catch(err => {
                // Only clear the session on an actual auth failure —
                // not on network errors or server hiccups.
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                }
            })
            .finally(() => setLoading(false));

    }, []);

    const login = (token, user) => {
        localStorage.setItem("token", token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };



     const onRequireAuth = () => {
    console.log("Authentication required. Redirecting...");
    navigate('/login');
  };

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                onRequireAuth,
                isAuthenticated: !!user
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
};