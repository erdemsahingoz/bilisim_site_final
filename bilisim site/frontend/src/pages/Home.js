// Home (Ana Sayfa) Bileşeni
// Tüm ürünleri 3 kolonlu grid yapısında listeler

import React from "react";
import Container from "@mui/material/Container"; // Sayfa genişliğini sınırlar (max-width)
import Grid from "@mui/material/Grid";           // Izgara (grid) sistemi
import Typography from "@mui/material/Typography"; // Yazı bileşeni
import Box from "@mui/material/Box";             // Genel kutu bileşeni
import ProductCard from "../components/ProductCard"; // Ürün kartı bileşeni
import { getAllProducts } from "../data/products";   // Tüm ürünleri getiren fonksiyon

export default function Home() {

  // Tüm ürünler products.js'den alınır
  const products = getAllProducts();

  return (
    // minHeight: 100vh → sayfa kısa olsa bile tam ekran yüksekliği
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg"> {/* lg → maksimum 1200px genişlik */}

        {/* Sayfa başlığı alanı */}
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>

          {/* h1 etiketi → SEO için sayfada sadece bir tane olmalı */}
          <Typography
            variant="h3"
            component="h1" // Görsel h3, ama HTML'de h1 olarak render edilir
            sx={{
              fontWeight: 800,
              // Yazıya gradyan renk efekti
              background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 1,
              fontSize: { xs: "2rem", sm: "2.6rem", md: "3rem" }, // Responsive yazı boyutu
            }}
          >
            Teknoloji Ürünleri
          </Typography>

          {/* Ürün sayısını dinamik olarak gösterir */}
          <Typography variant="body1" sx={{ color: "#7a8fa6" }}>
            {products.length} premium ürün — hızlı teslimat
          </Typography>
        </Box>

        {/* Ürün ızgarası (Grid) */}
        {/* spacing={3} → ürünler arası boşluk */}
        {/* alignItems="stretch" → tüm kartlar aynı yükseklikte olur */}
        <Grid container spacing={3} alignItems="stretch">

          {/* Her ürün için map() ile döngü → ProductCard bileşeni oluşturulur */}
          {products.map((p) => (
            // key prop → React'ın listeyi takip edebilmesi için zorunlu
            <Grid item key={p.id} xs={12} sm={6} md={4}>
              {/* xs=12 → mobilde tam genişlik (1 sütun)  */}
              {/* sm=6  → tablette yarı genişlik (2 sütun) */}
              {/* md=4  → masaüstünde üçte bir (3 sütun)  */}
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
}
