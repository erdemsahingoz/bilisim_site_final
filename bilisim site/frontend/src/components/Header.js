// Header (Üst Menü) Bileşeni
// Sayfanın en üstünde sabit olarak durur, her sayfada görünür

import React from "react";
import AppBar from "@mui/material/AppBar";   // Üst çubuk
import Toolbar from "@mui/material/Toolbar"; // AppBar içi düzenleme alanı
import Typography from "@mui/material/Typography"; // Yazı bileşeni
import Box from "@mui/material/Box";         // Düzenleme kutusu (div gibi)
import { Link } from "react-router-dom";     // Sayfa yenilenmeden yönlendirme

export default function Header() {
  return (
    // position="sticky" → sayfayı aşağı kaydırınca üstte sabit kalır
    // elevation={0} → gölge kaldırıldı, tema ile border eklendi
    <AppBar position="sticky" elevation={0}>

      {/* Toolbar → içerikleri yatay hizalar */}
      <Toolbar sx={{ px: { xs: 2, md: 5 }, minHeight: "64px !important" }}>

        {/* Logo ve site adı → tıklayınca ana sayfaya gider */}
        <Box
          component={Link} // Link olarak davranıyor (a etiketi gibi)
          to="/"           // "/" → ana sayfaya yönlendir
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none", // Alt çizgi yok
          }}
        >
          {/* ⚡ simgeli renkli logo kutusu */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)", // Cyan→Mor geçiş
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              boxShadow: "0 0 16px rgba(0, 229, 255, 0.4)", // Parlama efekti
              flexShrink: 0,
            }}
          >
            ⚡
          </Box>

          {/* "Tech Store" yazısı → gradyan renk efektiyle */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              // WebkitBackgroundClip → yazıya gradyan renk uygulamak için
              background: "linear-gradient(135deg, #00e5ff 0%, #ae62ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Tech Store
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
