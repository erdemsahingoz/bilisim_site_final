// Home (Ana Sayfa) Bileşeni
// Tüm ürünleri 3 kolonlu grid yapısında listeler

import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Box, CircularProgress, Alert } from "@mui/material"; // MUI bileşenleri
import ProductCard from "../components/ProductCard"; // Ürün kartı bileşeni
import API from "../services/api"; // Axios api instance

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get("/api/products");
        setProducts(response.data);
        setError("");
      } catch (err) {
        console.error("Ürünler çekilirken hata oluştu:", err);
        setError("Ürünler yüklenirken bir sorun oluştu. Lütfen backend sunucusunun çalıştığından emin olun.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">

        {/* Sayfa başlığı alanı */}
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 1,
              fontSize: { xs: "2rem", sm: "2.6rem", md: "3rem" },
            }}
          >
            Teknoloji Ürünleri
          </Typography>

          <Typography variant="body1" sx={{ color: "#7a8fa6" }}>
            En son teknoloji, en kaliteli donanımlar ve premium hizmetler.
          </Typography>
        </Box>

        {/* Yükleniyor Durumu */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress size={50} color="primary" />
          </Box>
        )}

        {/* Hata Durumu */}
        {error && (
          <Box sx={{ mb: 4 }}>
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          </Box>
        )}

        {/* Ürünler Listesi */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <Alert severity="info">Veritabanında henüz ürün bulunmuyor.</Alert>
            ) : (
              <Grid container spacing={3} alignItems="stretch">
                {products.map((p) => (
                  <Grid item key={p.id} xs={12} sm={6} md={4}>
                    <ProductCard product={p} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

      </Container>
    </Box>
  );
}
