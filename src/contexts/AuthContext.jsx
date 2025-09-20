import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser(JSON.parse(localStorage.getItem('user')));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await ApiService.login(email, password);
            ApiService.setToken(response.token);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await ApiService.register(userData);
            ApiService.setToken(response.token);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        ApiService.removeToken();
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
