"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Định nghĩa kiểu cho Context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Tạo Context với kiểu dữ liệu
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider cho Context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra token khi app được render
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token); // Chuyển trạng thái thành true nếu có token
  }, []);

  // Hàm login
  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true); // Cập nhật trạng thái
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false); // Cập nhật trạng thái
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
