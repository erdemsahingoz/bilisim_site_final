// ProductDetail (Ürün Detay Sayfası) Bileşeni
// URL'deki :id parametresine göre tek bir ürünün detaylarını gösterir
// Route: /products/:id

import React from "react";
import { useParams, Link } from "react-router-dom"; // useParams → URL'deki :id'yi okur
import { getProductById } from "../data/products";  // ID'ye göre ürün bulan fonksiyon

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia"; // Resim göstermek için
import Chip from "@mui/material/Chip";           // Fiyat etiketi
import Divider from "@mui/material/Divider";     // Yatay ayırıcı çizgi
import Paper from "@mui/material/Paper";         // Resim çerçevesi

export default function ProductDetail() {

  // useParams → URL'den :id değerini string olarak alır
  // Örnek: /products/3 → id = "3"
  const { id } = useParams();

  // ID'ye göre ürünü products dizisinde arar
  const product = getProductById(id);

  // Ürün bulunamazsa → hata mesajı ve geri dön butonu göster (conditional rendering)
  if (!product) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#ff4a6b", mb: 2 }}
        >
          Ürün bulunamadı
        </Typography>
        <Typography variant="body1" sx={{ color: "#7a8fa6", mb: 4 }}>
          Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{ px: 4, py: 1.2 }}
        >
          Ana Sayfaya Dön
        </Button>
      </Container>
    );
  }

  // Resim kaynağı: customImage varsa yerel dosya, yoksa picsum
  const imageUrl = product.customImage
    ? product.customImage
    : `https://picsum.photos/id/${product.picsumId}/900/600`;

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">

        {/* 2 kolonlu düzen: Sol → resim, Sağ → bilgiler */}
        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="flex-start">

          {/* ── Sol taraf: Ürün resmi ── */}
          <Grid item xs={12} md={6}>
            {/* md=6 → masaüstünde yarım ekran, xs=12 → mobilde tam ekran */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #1e2d3d",
                background: "#0f1724",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              }}
            >
              {/* Büyük ürün resmi */}
              <CardMedia
                component="img"
                image={imageUrl}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: { xs: 280, sm: 360, md: 440 }, // Responsive yükseklik
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Paper>
          </Grid>

          {/* ── Sağ taraf: Ürün bilgileri ── */}
          <Grid item xs={12} md={6}>

            {/* Ürün adı → h1 etiketi (SEO) */}
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 800, color: "#e8f0fe", lineHeight: 1.2 }}
            >
              {product.name}
            </Typography>

            {/* Fiyat etiketi → toFixed(2) ile 2 ondalık basamak */}
            <Chip
              label={`$${Number(product.price).toFixed(2)}`}
              sx={{
                mb: 3,
                background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.05rem",
                height: 38,
                px: 1,
                boxShadow: "0 4px 16px rgba(0, 229, 255, 0.3)",
              }}
            />

            {/* Kısa açıklama */}
            <Typography
              variant="body1"
              sx={{ color: "#b8ccd8", lineHeight: 1.8, mb: 2.5 }}
            >
              {product.description}
            </Typography>

            {/* Yatay ayırıcı */}
            <Divider sx={{ borderColor: "#1e2d3d", mb: 2.5 }} />

            {/* Teknik özellikler başlığı */}
            <Typography
              variant="caption"
              sx={{
                color: "#00e5ff",
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                display: "block",
                mb: 1,
              }}
            >
              Teknik Özellikler
            </Typography>

            {/* Uzun teknik açıklama */}
            <Typography
              variant="body2"
              sx={{ color: "#7a8fa6", lineHeight: 1.95, mb: 4 }}
            >
              {product.details}
            </Typography>

            {/* Butonlar */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>

              {/* Sepete Ekle butonu (demo: işlev yok) */}
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.3,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Sepete Ekle
              </Button>

              {/* Ana sayfaya dön butonu → Link bileşeni ile yönlendirme */}
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/" // "/" → ana sayfaya git
                sx={{
                  px: 3,
                  py: 1.3,
                  borderColor: "#1e2d3d",
                  color: "#7a8fa6",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#00e5ff",
                    color: "#00e5ff",
                    background: "rgba(0, 229, 255, 0.05)",
                  },
                }}
              >
                ← Ana Sayfaya Dön
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
