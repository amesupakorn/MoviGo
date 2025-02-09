"use client"; 
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

interface AuthContextType {
    isLoggedIn: boolean;
    user: { name: string; profileImage: string | null } | null;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<{ name: string; profileImage: string | null } | null>>;
    updateNavName: (info: string) => void; 
    updateNavProfileImage: (info: string) => void; 
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string; profileImage: string | null } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await api.get(`/profile`)                    
                    setIsLoggedIn(true);
                    setUser({
                        name: response.data.user.name,
                        profileImage: response.data.user.profileImage || "/default-avatar.png",
                    });
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    setIsLoggedIn(false);
                    setUser(null);
                }
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        window.location.href = "/client/auth/login";
    };

    const updateNavName = (name: string) => {
        setUser((prev) =>
            prev
                ? {
                      ...prev,
                      name,
                  }
                : null
        );
    };
    
    const updateNavProfileImage = (profileImage: string) => {
        setUser((prev) =>
            prev
                ? {
                      ...prev,
                      profileImage: `${profileImage}?t=${Date.now()}`, 
                  }
                : null
        );
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                logout,
                setUser,
                updateNavName,
                updateNavProfileImage,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};