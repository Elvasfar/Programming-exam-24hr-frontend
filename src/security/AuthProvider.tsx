import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
    username: string | null;
    signIn: (user: LoginRequest) => void;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const initialUsername = localStorage.getItem("username") || null;
    const [username, setUsername] = useState<string | null>(initialUsername);

    const signIn = (user_: LoginRequest) => {
        // Simulate authentication logic (replace with actual logic)
        if (user_.username === "Admin" && user_.password === "1234") {
            setUsername(user_.username);
            localStorage.setItem("username", user_.username);
        } else {
            throw new Error("Invalid username or password");
        }
    };

    const signOut = () => {
        setUsername(null);
        localStorage.removeItem("username");
    };

    const value: AuthContextType = {
        username,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
