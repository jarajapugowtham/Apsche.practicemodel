import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authAPI } from "../services/api.js";

/* =========================================================
   AUTH CONTEXT
========================================================= */

const AuthContext =
  createContext(null);

/* =========================================================
   AUTH PROVIDER
========================================================= */

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(() => {
      try {
        const savedUser =
          localStorage.getItem(
            "apsche_user"
          );

        return savedUser
          ? JSON.parse(savedUser)
          : null;
      } catch {
        return null;
      }
    });

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     SAVE USER
  ======================================================= */

  const saveUser = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "apsche_user",
      JSON.stringify(userData)
    );
  };

  /* =======================================================
     REGISTER
  ======================================================= */

  const register = async (
    data
  ) => {
    const response =
      await authAPI.register(data);

    const {
      token,
      user: userData,
    } = response.data;

    if (token) {
      localStorage.setItem(
        "apsche_token",
        token
      );
    }

    if (userData) {
      saveUser(userData);
    }

    return response.data;
  };

  /* =======================================================
     LOGIN
  ======================================================= */

  const login = async (
    data
  ) => {
    const response =
      await authAPI.login(data);

    const {
      token,
      user: userData,
    } = response.data;

    if (token) {
      localStorage.setItem(
        "apsche_token",
        token
      );
    }

    if (userData) {
      saveUser(userData);
    }

    return response.data;
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = () => {
    localStorage.removeItem(
      "apsche_token"
    );

    localStorage.removeItem(
      "apsche_user"
    );

    setUser(null);
  };

  /* =======================================================
     CHECK CURRENT USER
  ======================================================= */

  const loadCurrentUser =
    async () => {
      const token =
        localStorage.getItem(
          "apsche_token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await authAPI.me();

        if (
          response.data?.user
        ) {
          saveUser(
            response.data.user
          );
        }
      } catch (error) {
        console.error(
          "Session check failed:",
          error
        );

        localStorage.removeItem(
          "apsche_token"
        );

        localStorage.removeItem(
          "apsche_user"
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     INITIAL SESSION CHECK
  ======================================================= */

  useEffect(() => {
    loadCurrentUser();
  }, []);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {
    user,

    loading,

    isAuthenticated:
      Boolean(user),

    isAdmin:
      user?.role === "admin",

    register,

    login,

    logout,

    refreshUser:
      loadCurrentUser,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   USE AUTH HOOK
========================================================= */

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;
