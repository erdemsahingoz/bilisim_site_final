import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import API from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  // Firebase var mı kontrol et
  const isFirebaseAvailable = !!auth;

  useEffect(() => {
    if (isFirebaseAvailable) {
      // ── FIREBASE AUTH AKIŞI ──
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        setLoading(true);
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            localStorage.setItem("token", token);
            localStorage.setItem("loginType", "firebase");

            const response = await API.post("/api/auth/register", {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email.split("@")[0]
            });

            const dbUser = response.data;
            setUser(dbUser);
            setAdmin(dbUser.role === "ADMIN");
            setIsMockMode(false);
          } catch (error) {
            console.error("Backend kullanıcı sync hatası:", error);
            // Backend ulaşılamazsa bile Firebase user'ı kullan
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email,
              role: "USER"
            });
            setAdmin(false);
          }
        } else {
          setUser(null);
          setAdmin(false);
          localStorage.removeItem("token");
          localStorage.removeItem("loginType");
        }
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // ── MOCK AUTH AKIŞI (Firebase yoksa) ──
      const savedToken = localStorage.getItem("token");
      const savedLoginType = localStorage.getItem("loginType");

      if (savedToken && savedLoginType === "mock") {
        const isMockAdmin = savedToken === "mock-admin-token";
        const mockUid = isMockAdmin ? "mock-admin-uid" : "mock-user-uid";
        const mockEmail = isMockAdmin ? "admin@bilisim.com" : "user@bilisim.com";
        const mockDisplayName = isMockAdmin ? "Bilişim Admin" : "Test Kullanıcı";
        const mockRole = isMockAdmin ? "ADMIN" : "USER";

        // Önce local state'i hemen ayarla (UI'nin takılı kalmaması için)
        setUser({ uid: mockUid, email: mockEmail, displayName: mockDisplayName, role: mockRole });
        setAdmin(isMockAdmin);
        setIsMockMode(true);
        setLoading(false);

        // Sonra backend ile senkronize et (başarısız olsa da sorun değil)
        API.post("/api/auth/register", { uid: mockUid, email: mockEmail, displayName: mockDisplayName })
          .then(response => {
            setUser(response.data);
            setAdmin(response.data.role === "ADMIN");
          })
          .catch(err => {
            console.warn("Mock kullanıcı backend sync başarısız, yerel state kullanılıyor:", err);
            // Zaten ayarlandı, tekrar ayarlamaya gerek yok
          });
      } else {
        setUser(null);
        setAdmin(false);
        setLoading(false);
      }
    }
  }, [isFirebaseAvailable]);

  // Firebase ile e-posta/şifre girişi
  const login = (email, password) => {
    if (!isFirebaseAvailable) {
      return Promise.reject(new Error("Firebase yapılandırılmamış. Demo Giriş'i kullanın."));
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Firebase ile kayıt
  const register = async (email, password, displayName) => {
    if (!isFirebaseAvailable) {
      return Promise.reject(new Error("Firebase yapılandırılmamış. Demo Giriş'i kullanın."));
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential;
  };

  // Çıkış
  const logout = async () => {
    if (isFirebaseAvailable && localStorage.getItem("loginType") === "firebase") {
      await signOut(auth);
    }
    setUser(null);
    setAdmin(false);
    setIsMockMode(false);
    localStorage.removeItem("token");
    localStorage.removeItem("loginType");
  };

  // ── DEMO / MOCK GİRİŞ ──
  const loginAsMock = async (role) => {
    setLoading(true);
    const isMockAdmin = role === "ADMIN";
    const mockToken = isMockAdmin ? "mock-admin-token" : "mock-user-token";
    const mockUid = isMockAdmin ? "mock-admin-uid" : "mock-user-uid";
    const mockEmail = isMockAdmin ? "admin@bilisim.com" : "user@bilisim.com";
    const mockDisplayName = isMockAdmin ? "Bilişim Admin" : "Test Kullanıcı";

    localStorage.setItem("token", mockToken);
    localStorage.setItem("loginType", "mock");

    // Önce yerel state'i hemen ayarla
    const localUser = {
      uid: mockUid,
      email: mockEmail,
      displayName: mockDisplayName,
      role: role
    };
    setUser(localUser);
    setAdmin(isMockAdmin);
    setIsMockMode(true);
    setLoading(false);

    // Arka planda backend ile sync et
    try {
      const response = await API.post("/api/auth/register", {
        uid: mockUid,
        email: mockEmail,
        displayName: mockDisplayName
      });
      setUser(response.data);
      setAdmin(response.data.role === "ADMIN");
    } catch (e) {
      console.warn("Mock user backend sync hatası:", e);
      // Yerel state zaten ayarlandı, sorun değil
    }
  };

  const value = {
    user,
    admin,
    loading,
    isFirebaseAvailable,
    isMockMode,
    login,
    register,
    logout,
    loginAsMock
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
