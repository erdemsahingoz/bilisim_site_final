// Cart (Sepet) Sayfası
// Kullanıcının sepetindeki ürünleri listeler, giriş yapmadan görülebilir
// Ödeme yapmak için giriş gerekir

import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Chip
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Doğrudan checkout'a git - checkout sayfası kendi içinde user kontrolü yapar
    navigate("/checkout");
  };

  // Sepet boşsa
  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <ShoppingCartIcon sx={{ fontSize: 80, color: "#1e2d3d", mb: 3 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#e8f0fe", mb: 2 }}>
          Sepetiniz Boş
        </Typography>
        <Typography variant="body1" sx={{ color: "#7a8fa6", mb: 4 }}>
          Henüz sepetinize ürün eklemediniz. Ürünlerimize göz atmak ister misiniz?
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.3,
            fontWeight: 700,
            background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)"
          }}
        >
          Ürünleri Keşfet
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        {/* Sayfa Başlığı */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
          <ShoppingCartIcon sx={{ fontSize: 36, color: "#00e5ff" }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#e8f0fe" }}>
            Sepetim
          </Typography>
          <Chip
            label={`${cart.length} Ürün`}
            sx={{
              background: "rgba(0, 229, 255, 0.1)",
              color: "#00e5ff",
              border: "1px solid rgba(0, 229, 255, 0.3)",
              fontWeight: 700
            }}
          />
        </Box>

        <Grid container spacing={4}>
          {/* Sol: Ürün Listesi */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {cart.map((item) => {
                // Resim URL'sini güvenli şekilde belirle
                const imageUrl = item.imagePath && item.imagePath.trim() !== ""
                  ? item.imagePath.startsWith("http")
                    ? item.imagePath
                    : item.imagePath
                  : `https://via.placeholder.com/80x80/0f1724/00e5ff?text=${encodeURIComponent(item.name?.charAt(0) || "?")}`;

                return (
                  <Card
                    key={item.id}
                    sx={{
                      background: "linear-gradient(160deg, #0f1724 0%, #141e30 100%)",
                      border: "1px solid #1e2d3d",
                      borderRadius: "14px",
                      transition: "border-color 0.2s",
                      "&:hover": { borderColor: "#00e5ff44" }
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
                        {/* Ürün Resmi */}
                        <Box
                          component="img"
                          src={imageUrl}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/80x80/0f1724/00e5ff?text=${encodeURIComponent(item.name?.charAt(0) || "?")}`;
                          }}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid #1e2d3d",
                            flexShrink: 0
                          }}
                        />

                        {/* Ürün Bilgisi */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle1"
                            component={Link}
                            to={`/products/${item.id}`}
                            sx={{
                              fontWeight: 700,
                              color: "#e8f0fe",
                              textDecoration: "none",
                              "&:hover": { color: "#00e5ff" },
                              transition: "color 0.2s",
                              display: "block",
                              mb: 0.5
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#7a8fa6" }}>
                            Birim Fiyat: ${Number(item.price).toFixed(2)}
                          </Typography>
                        </Box>

                        {/* Miktar Kontrolü */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            sx={{
                              border: "1px solid #1e2d3d",
                              color: "#7a8fa6",
                              "&:hover": { borderColor: "#00e5ff", color: "#00e5ff" }
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <Typography
                            variant="subtitle1"
                            sx={{
                              minWidth: 32,
                              textAlign: "center",
                              fontWeight: 700,
                              color: "#e8f0fe"
                            }}
                          >
                            {item.quantity}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            sx={{
                              border: "1px solid #1e2d3d",
                              color: "#7a8fa6",
                              "&:hover": { borderColor: "#00e5ff", color: "#00e5ff" }
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Ara Toplam */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 800,
                            color: "#00e5ff",
                            minWidth: 80,
                            textAlign: "right"
                          }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>

                        {/* Sil Butonu */}
                        <IconButton
                          onClick={() => removeFromCart(item.id)}
                          sx={{
                            color: "#ff4a6b44",
                            "&:hover": { color: "#ff4a6b", background: "rgba(255, 74, 107, 0.08)" }
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            {/* Alt Butonlar */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderColor: "#1e2d3d",
                  color: "#7a8fa6",
                  "&:hover": { borderColor: "#00e5ff", color: "#00e5ff" }
                }}
              >
                Alışverişe Devam Et
              </Button>
              <Button
                onClick={clearCart}
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                sx={{ borderColor: "rgba(255,74,107,0.3)", color: "#ff4a6b" }}
              >
                Sepeti Temizle
              </Button>
            </Box>
          </Grid>

          {/* Sağ: Sipariş Özeti */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "linear-gradient(160deg, #0f1724 0%, #141e30 100%)",
                border: "1px solid #1e2d3d",
                borderRadius: "16px",
                position: "sticky",
                top: 80
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#e8f0fe", mb: 3 }}>
                  Sipariş Özeti
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
                  {cart.map((item) => (
                    <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "#7a8fa6", maxWidth: "65%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name} ×{item.quantity}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#b8ccd8", fontWeight: 600 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ borderColor: "#1e2d3d", mb: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#e8f0fe" }}>
                    Toplam
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    ${cartTotal.toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                  startIcon={<PaymentIcon />}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: "1rem",
                    background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
                    boxShadow: "0 4px 20px rgba(0, 229, 255, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 28px rgba(0, 229, 255, 0.45)",
                      transform: "translateY(-1px)"
                    },
                    transition: "all 0.2s"
                  }}
                >
                  Ödemeye Geç
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
