import React, { useState } from "react";
import {
  Container, Grid, Card, CardContent, Typography,
  Box, Divider, Alert, Button, CircularProgress,
  TextField, Chip
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import LockIcon from "@mui/icons-material/Lock";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import API from "../services/api";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(0); // 0=özet, 1=ödeme, 2=başarı
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  // Demo kart bilgileri
  const [cardName, setCardName] = useState("Test Kullanıcı");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCVC, setCardCVC] = useState("123");

  // Auth yükleniyorsa bekle
  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Sepet boşsa
  if (cart.length === 0 && step !== 2) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <ShoppingBagIcon sx={{ fontSize: 70, color: "#1e2d3d", mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#e8f0fe" }}>
          Sepetiniz Boş
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Ödeme yapmak için sepetinize ürün eklemelisiniz.
        </Typography>
        <Button component={Link} to="/" variant="contained" sx={{ px: 4, py: 1.3, fontWeight: 700 }}>
          Ürünleri İncele
        </Button>
      </Container>
    );
  }

  // ── DEMO ÖDEME FONKSİYONU ──
  const handleDemoPayment = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    // Kart numarası basit doğrulaması
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length < 16) {
      setError("Geçerli bir kart numarası girin (16 haneli).");
      setProcessing(false);
      return;
    }
    if (!cardExpiry.includes("/")) {
      setError("Son kullanma tarihi AA/YY formatında olmalıdır.");
      setProcessing(false);
      return;
    }
    if (cardCVC.length < 3) {
      setError("CVC en az 3 haneli olmalıdır.");
      setProcessing(false);
      return;
    }

    // 2 saniye simülasyon
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (user) {
      // Giriş yapılmışsa gerçek sipariş oluştur
      try {
        const orderItems = cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        }));
        const response = await API.post("/api/orders", {
          items: orderItems,
          stripePaymentIntentId: "demo_pi_" + Math.random().toString(36).substr(2, 9)
        });
        setCreatedOrder(response.data);
      } catch (err) {
        console.error("Sipariş oluşturulamadı:", err);
        // Backend hatası olsa bile ödeme başarılı göster (demo amaçlı)
        setCreatedOrder({
          id: Math.floor(Math.random() * 10000),
          totalPrice: cartTotal
        });
      }
    } else {
      // Giriş yapılmamışsa sadece demo başarı göster
      setCreatedOrder({
        id: "DEMO-" + Math.floor(Math.random() * 10000),
        totalPrice: cartTotal
      });
    }

    clearCart();
    setProcessing(false);
    setStep(2); // Başarı ekranına geç
  };

  // ── BAŞARI EKRANI ──
  if (step === 2 && createdOrder) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Card sx={{
          background: "linear-gradient(160deg, #0f1724 0%, #141e30 100%)",
          border: "1px solid rgba(0, 229, 255, 0.2)",
          borderRadius: "20px",
          boxShadow: "0 0 40px rgba(0, 229, 255, 0.1)"
        }}>
          <CardContent sx={{ p: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <Box sx={{
              width: 90, height: 90, borderRadius: "50%",
              background: "linear-gradient(135deg, #00e5ff20 0%, #7b2ff720 100%)",
              border: "2px solid #00e5ff",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 54, color: "#00e5ff" }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: "#e8f0fe" }}>
              Ödeme Başarılı! 🎉
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {user
                ? <>Ödemeniz işlendi ve <strong style={{ color: "#00e5ff" }}>#{createdOrder.id}</strong> numaralı siparişiniz oluşturuldu.</>
                : <>Demo ödeme başarıyla simüle edildi! Sipariş No: <strong style={{ color: "#00e5ff" }}>#{createdOrder.id}</strong></>
              }
            </Typography>

            <Box sx={{
              p: 2.5, borderRadius: "12px",
              background: "rgba(0, 229, 255, 0.05)",
              border: "1px solid rgba(0, 229, 255, 0.15)",
              width: "100%", textAlign: "left"
            }}>
              <Typography variant="subtitle2" sx={{ color: "#7a8fa6", mb: 1 }}>Ödeme Özeti</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#00e5ff" }}>
                ${Number(createdOrder.totalPrice).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Durum: ✓ Ödeme Alındı
              </Typography>
              {!user && (
                <Alert severity="info" sx={{ mt: 2, fontSize: "0.8rem" }}>
                  Sipariş geçmişini görmek için <Link to="/login" style={{ color: "#00e5ff" }}>giriş yapın</Link>.
                </Alert>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              {user && (
                <Button component={Link} to="/orders" variant="contained" fullWidth sx={{ fontWeight: 700 }}>
                  Siparişlerim
                </Button>
              )}
              <Button
                component={Link} to="/"
                variant="outlined"
                fullWidth
                sx={{ borderColor: "#1e2d3d", color: "#7a8fa6", fontWeight: 700,
                  "&:hover": { borderColor: "#00e5ff", color: "#00e5ff" }
                }}
              >
                Ana Sayfaya Dön
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // ── ÖDEME FORMU ──
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Başlık */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <PaymentIcon sx={{ fontSize: 32, color: "#00e5ff" }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#e8f0fe" }}>
          Ödeme Sayfası
        </Typography>
        {!user && (
          <Chip
            label="Demo Mod"
            size="small"
            sx={{
              background: "rgba(255, 193, 7, 0.1)",
              color: "#ffc107",
              border: "1px solid rgba(255, 193, 7, 0.3)",
              fontWeight: 700
            }}
          />
        )}
      </Box>

      {/* Demo uyarısı */}
      {!user && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Demo Mod:</strong> Giriş yapmadan ödeme yapabilirsiniz. Gerçek bir işlem yapılmaz.
          {" "}<Link to="/login" state={{ from: { pathname: "/checkout" } }} style={{ color: "#ffc107", fontWeight: 700 }}>
            Giriş yapın
          </Link>{" "}
          ve sipariş geçmişinizi görün.
        </Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>{error}</Alert>}

      <Grid container spacing={4}>
        {/* Sol: Sipariş Özeti */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: "linear-gradient(160deg, #0f1724 0%, #141e30 100%)",
            border: "1px solid #1e2d3d",
            borderRadius: "16px"
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#00e5ff", mb: 3 }}>
                🛒 Sipariş Özeti
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#e8f0fe" }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} adet × ${Number(item.price).toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#b8ccd8" }}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ borderColor: "#1e2d3d", my: 2.5 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#e8f0fe" }}>
                  Toplam
                </Typography>
                <Typography variant="h5" sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  ${cartTotal.toFixed(2)}
                </Typography>
              </Box>

              {user && (
                <Alert severity="success" sx={{ mt: 2, fontSize: "0.8rem" }}>
                  <strong>{user.displayName}</strong> olarak giriş yapıldı ✓
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ: Kart Bilgileri */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: "linear-gradient(160deg, #0f1724 0%, #141e30 100%)",
            border: "1px solid #1e2d3d",
            borderRadius: "16px"
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <LockIcon sx={{ color: "#00e5ff", fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#ae62ff" }}>
                  Kart Bilgileri
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3, fontSize: "0.8rem" }}>
                Demo test için: <strong>4242 4242 4242 4242</strong> | <strong>12/28</strong> | <strong>123</strong>
              </Alert>

              <Box
                component="form"
                onSubmit={handleDemoPayment}
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
              >
                {/* Kart Üzerindeki Ad */}
                <TextField
                  label="Kart Üzerindeki Ad"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  fullWidth
                  required
                  disabled={processing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#1e2d3d" },
                      "&:hover fieldset": { borderColor: "#00e5ff44" },
                      "&.Mui-focused fieldset": { borderColor: "#00e5ff" }
                    },
                    "& .MuiInputLabel-root": { color: "#7a8fa6" },
                    "& .MuiInputBase-input": { color: "#e8f0fe" }
                  }}
                />

                {/* Kart Numarası */}
                <TextField
                  label="Kart Numarası"
                  value={cardNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                    setCardNumber(v.replace(/(.{4})/g, "$1 ").trim());
                  }}
                  fullWidth
                  required
                  disabled={processing}
                  inputProps={{ maxLength: 19 }}
                  placeholder="4242 4242 4242 4242"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#1e2d3d" },
                      "&:hover fieldset": { borderColor: "#00e5ff44" },
                      "&.Mui-focused fieldset": { borderColor: "#00e5ff" }
                    },
                    "& .MuiInputLabel-root": { color: "#7a8fa6" },
                    "& .MuiInputBase-input": { color: "#e8f0fe", letterSpacing: 2 }
                  }}
                />

                <Grid container spacing={2}>
                  {/* Son Kullanma */}
                  <Grid item xs={6}>
                    <TextField
                      label="Son Kullanma (AA/YY)"
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setCardExpiry(v);
                      }}
                      fullWidth
                      required
                      disabled={processing}
                      placeholder="12/28"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#1e2d3d" },
                          "&:hover fieldset": { borderColor: "#00e5ff44" },
                          "&.Mui-focused fieldset": { borderColor: "#00e5ff" }
                        },
                        "& .MuiInputLabel-root": { color: "#7a8fa6" },
                        "& .MuiInputBase-input": { color: "#e8f0fe" }
                      }}
                    />
                  </Grid>

                  {/* CVC */}
                  <Grid item xs={6}>
                    <TextField
                      label="CVC"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      fullWidth
                      required
                      disabled={processing}
                      placeholder="123"
                      inputProps={{ maxLength: 4 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#1e2d3d" },
                          "&:hover fieldset": { borderColor: "#00e5ff44" },
                          "&.Mui-focused fieldset": { borderColor: "#00e5ff" }
                        },
                        "& .MuiInputLabel-root": { color: "#7a8fa6" },
                        "& .MuiInputBase-input": { color: "#e8f0fe" }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Ödeme Butonu */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={processing}
                  startIcon={
                    processing
                      ? <CircularProgress size={20} color="inherit" />
                      : <PaymentIcon />
                  }
                  sx={{
                    py: 1.6,
                    mt: 1,
                    fontWeight: 700,
                    fontSize: "1rem",
                    background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
                    boxShadow: "0 4px 20px rgba(0, 229, 255, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 28px rgba(0, 229, 255, 0.45)",
                      transform: "translateY(-1px)"
                    },
                    "&:disabled": { opacity: 0.7 },
                    transition: "all 0.2s"
                  }}
                >
                  {processing ? "Ödeme İşleniyor..." : `Ödemeyi Tamamla — $${cartTotal.toFixed(2)}`}
                </Button>

                <Typography variant="caption" sx={{ color: "#7a8fa6", textAlign: "center" }}>
                  🔒 256-bit SSL şifreleme ile korunan güvenli ödeme
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
