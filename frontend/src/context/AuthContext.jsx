import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load saved user info from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token && parsed?.user) {
          setUserInfo(parsed);
        }
      } catch (error) {
        console.error("Error parsing userInfo:", error);
        localStorage.removeItem("userInfo");
      }
    }
    setLoading(false);
  }, []);

  // ✅ Login function
  const login = ({ token, user }) => {
    const data = { token, user };
    setUserInfo(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  // ✅ Logout function
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
  };

  // ✅ Axios instance with interceptors
  const axiosAuth = useMemo(() => {
    const instance = axios.create({
      // ⚠️ Update this IP if needed (for React Native use your PC's local IP)
      //baseURL: "http://192.168.1.7:5000/",
       baseURL: "http://localhost:5000/api/", // for web only
    });

    // ✅ Attach token to every request
    instance.interceptors.request.use(
      (config) => {
        if (userInfo?.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Auto logout on 401 Unauthorized
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Token expired or unauthorized. Logging out...");
          logout();
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [userInfo?.token]);

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        login,
        logout,
        axiosAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
