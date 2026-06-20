// Header (Üst Menü) Bileşeni
// Sayfanın en üstünde sabit olarak durur, her sayfada görünür

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Sayfa yenilenmeden yönlendirme
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, admin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Profil Menüsü State'i
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.error("Çıkış hatası:", e);
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid #1e2d3d" }}>
      <Toolbar sx={{ px: { xs: 2, md: 5 }, minHeight: "64px !important", justifyContent: "space-between" }}>
        
        {/* Sol Taraf: Logo ve Site Adı */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none"
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              boxShadow: "0 0 16px rgba(0, 229, 255, 0.4)",
              flexShrink: 0
            }}
          >
            ⚡
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #00e5ff 0%, #ae62ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: { xs: "none", sm: "block" }
            }}
          >
            Tech Store
          </Typography>
        </Box>

        {/* Sağ Taraf: Sepet ve Kullanıcı Giriş/Profil İşlemleri */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          
          {/* Sepet İkonu ve Badge */}
          <IconButton
            component={Link}
            to="/cart"
            color="inherit"
            aria-label="sepet"
            sx={{
              border: "1px solid #1e2d3d",
              "&:hover": { borderColor: "#00e5ff", background: "rgba(0, 229, 255, 0.05)" }
            }}
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon sx={{ color: "#00e5ff" }} />
            </Badge>
          </IconButton>

          {/* Kullanıcı Durumu */}
          {user ? (
            <>
              {/* Profil Butonu */}
              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  border: "1px solid #1e2d3d",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: "#7b2ff7", backgroundColor: "rgba(123, 47, 247, 0.05)" }
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#fff"
                  }}
                >
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : "K"}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#e8f0fe",
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: { xs: "none", md: "block" }
                  }}
                >
                  {user.displayName || "Kullanıcı"}
                </Typography>
              </Box>

              {/* Kullanıcı Seçenekler Açılır Menüsü */}
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    background: "#0f1724",
                    border: "1px solid #1e2d3d",
                    mt: 1.5,
                    minWidth: 200,
                    "& .MuiMenuItem-root": {
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#b8ccd8",
                      py: 1.2,
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.02)" }
                    }
                  }
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#e8f0fe" }}>
                    {user.displayName || "Kullanıcı"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#7a8fa6" }}>
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: "#1e2d3d" }} />
                
                {/* Sipariş Geçmişi */}
                <MenuItem component={Link} to="/orders">
                  <ListItemIcon>
                    <ReceiptIcon fontSize="small" sx={{ color: "#00e5ff" }} />
                  </ListItemIcon>
                  Siparişlerim
                </MenuItem>

                {/* Yalnızca Yönetici Paneli */}
                {admin && (
                  <MenuItem component={Link} to="/admin" sx={{ color: "#00e5ff !important" }}>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon fontSize="small" sx={{ color: "#00e5ff" }} />
                    </ListItemIcon>
                    Yönetici Paneli
                  </MenuItem>
                )}

                <Divider sx={{ borderColor: "#1e2d3d" }} />

                {/* Çıkış */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: "#ff4a6b" }} />
                  </ListItemIcon>
                  Çıkış Yap
                </MenuItem>
              </Menu>
            </>
          ) : (
            // Giriş Yapılmamışsa
            <Button
              variant="contained"
              component={Link}
              to="/login"
              startIcon={<PersonIcon />}
              sx={{
                fontWeight: 700,
                borderRadius: "20px",
                px: 3,
                fontSize: "0.85rem"
              }}
            >
              Giriş Yap
            </Button>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  );
}
