// ProductDetail (Ürün Detay Sayfası) Bileşeni
// URL'deki :id parametresine göre tek bir ürünün detaylarını gösterir
// Route: /products/:id

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // useParams → URL'deki :id'yi okur
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CardMedia,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Tabs,
  Tab
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import API from "../services/api";
import { useCart } from "../context/CartContext";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import QuestionList from "../components/QuestionList";
import QuestionForm from "../components/QuestionForm";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [addedToCartVisual, setAddedToCartVisual] = useState(false);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError("");

      // Ürün bilgilerini çek
      const productResponse = await API.get(`/api/products/${id}`);
      setProduct(productResponse.data);

      // Yorumları çek
      const reviewsResponse = await API.get(`/api/reviews/product/${id}`);
      setReviews(reviewsResponse.data);

      // Soruları çek
      const questionsResponse = await API.get(`/api/questions/product/${id}`);
      setQuestions(questionsResponse.data);

    } catch (err) {
      console.error("Ürün detayları yüklenemedi:", err);
      setError("Ürün detayları sunucudan yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    setAddedToCartVisual(true);
    setTimeout(() => {
      setAddedToCartVisual(false);
    }, 2000);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#ff4a6b", mb: 2 }}>
          Ürün Bulunamadı
        </Typography>
        <Typography variant="body1" sx={{ color: "#7a8fa6", mb: 4 }}>
          {error || "Aradığınız ürün mevcut değil veya kaldırılmış olabilir."}
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ px: 4, py: 1.2 }}>
          Ana Sayfaya Dön
        </Button>
      </Container>
    );
  }

  const imageUrl = product.imagePath
    ? product.imagePath.startsWith("http") || product.imagePath.startsWith("/images")
      ? product.imagePath
      : product.imagePath
    : `https://picsum.photos/id/${(product.id % 20) + 1}/900/600`;

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        {/* 2 kolonlu düzen: Sol → resim, Sağ → bilgiler */}
        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="flex-start" sx={{ mb: 6 }}>
          {/* Sol taraf: Ürün resmi */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #1e2d3d",
                background: "#0f1724",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5)"
              }}
            >
              <CardMedia
                component="img"
                image={imageUrl}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: { xs: 280, sm: 360, md: 440 },
                  objectFit: "cover",
                  display: "block"
                }}
              />
            </Paper>
          </Grid>

          {/* Sağ taraf: Ürün bilgileri */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, color: "#e8f0fe", lineHeight: 1.2 }}>
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
              <Chip
                label={`$${Number(product.price).toFixed(2)}`}
                sx={{
                  background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  height: 38,
                  px: 1,
                  boxShadow: "0 4px 16px rgba(0, 229, 255, 0.3)"
                }}
              />
              <Chip
                label={product.stock > 0 ? `Stokta: ${product.stock} Adet` : "Stokta Yok"}
                color={product.stock > 0 ? "success" : "error"}
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Box>

            <Typography variant="body1" sx={{ color: "#b8ccd8", lineHeight: 1.8, mb: 2.5 }}>
              {product.description}
            </Typography>

            <Divider sx={{ borderColor: "#1e2d3d", mb: 2.5 }} />

            <Typography
              variant="caption"
              sx={{
                color: "#00e5ff",
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                display: "block",
                mb: 1
              }}
            >
              Teknik Özellikler
            </Typography>

            <Typography variant="body2" sx={{ color: "#7a8fa6", lineHeight: 1.95, mb: 4 }}>
              {product.details || "Bu ürün için detaylı teknik bilgi girilmemiş."}
            </Typography>

            {/* Butonlar */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                startIcon={addedToCartVisual ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
                sx={{
                  px: 4,
                  py: 1.3,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  background: addedToCartVisual ? "#00e5ff" : "primary.main",
                  color: addedToCartVisual ? "#0f1724" : "#fff",
                  "&:hover": {
                    background: addedToCartVisual ? "#00c8e0" : "primary.dark"
                  }
                }}
              >
                {product.stock <= 0 ? "Stokta Yok" : addedToCartVisual ? "Sepete Eklendi!" : "Sepete Ekle"}
              </Button>

              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/"
                sx={{
                  px: 3,
                  py: 1.3,
                  borderColor: "#1e2d3d",
                  color: "#7a8fa6",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#00e5ff",
                    color: "#00e5ff",
                    background: "rgba(0, 229, 255, 0.05)"
                  }
                }}
              >
                ← Ana Sayfaya Dön
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Alt Kısım: Yorumlar ve Sorular Sekmeli Alanı */}
        <Paper
          elevation={0}
          sx={{
            background: "#0f1724",
            border: "1px solid #1e2d3d",
            borderRadius: "16px",
            overflow: "hidden"
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ borderBottom: "1px solid #1e2d3d" }}
          >
            <Tab label={`Müşteri Değerlendirmeleri (${reviews.length})`} sx={{ fontWeight: 700 }} />
            <Tab label={`Soru & Cevap (${questions.length})`} sx={{ fontWeight: 700 }} />
          </Tabs>

          {/* Yorumlar Sekmesi */}
          {activeTab === 0 && (
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#e8f0fe" }}>
                    Yorumlar
                  </Typography>
                  <ReviewList reviews={reviews} />
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box sx={{ position: "sticky", top: 80 }}>
                    <ReviewForm productId={product.id} onReviewSubmitted={fetchProductData} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Sorular Sekmesi */}
          {activeTab === 1 && (
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#e8f0fe" }}>
                    Sorulan Sorular
                  </Typography>
                  <QuestionList questions={questions} onQuestionAnswered={fetchProductData} />
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box sx={{ position: "sticky", top: 80 }}>
                    <QuestionForm productId={product.id} onQuestionSubmitted={fetchProductData} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
