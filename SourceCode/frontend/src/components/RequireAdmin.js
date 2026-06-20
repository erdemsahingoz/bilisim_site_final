// RequireAdmin - Admin korumalı sayfa filtresi
// Loading sırasında boş ekran yerine loading spinner gösterir

import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, admin, loading } = useAuth();

  // Loading sırasında spinner göster (null yerine - crash önleme)
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!admin) return <Navigate to="/" replace />;
  return children;
}
