// Login (Giriş) Sayfası
// Firebase ile veya Demo Mod ile giriş

import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Divider, Grid, CircularProgress
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

export default function Login() {
  const { login, loginAsMock, isFirebaseAvailable } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Giriş sonrası nereye dön
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Giriş başarısız. E-posta veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = async (role) => {
    setError("");
    setLoading(true);
    try {
      await loginAsMock(role);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Demo girişi sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      py: 4,
      px: 2
    }}>
      <Card sx={{
        width: "100%",
        maxWidth: 460,
        background: "linear-gradient(160deg, #0f1724 0%, #141e30 100%)",
        border: "1px solid #1e2d3d",
        borderRadius: "16px",
        boxShadow: "0 8px 48px rgba(0,0,0,0.5)"
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Başlık */}
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              mx: "auto",
              mb: 2,
              boxShadow: "0 0 24px rgba(0, 229, 255, 0.4)"
            }}>
              ⚡
            </Box>
            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800, mb: 0.5 }}>
              Bilişim Mağazası
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hesabınıza giriş yapın
            </Typography>
          </Box>

          {/* Hata Mesajı */}
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Firebase Giriş Formu */}
          {isFirebaseAvailable ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                disabled={loading}
                size="small"
              />
              <TextField
                label="Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                disabled={loading}
                size="small"
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LoginIcon />}
                fullWidth
                sx={{ py: 1.2, fontWeight: 700 }}
              >
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Hesabınız yok mu?{" "}
                  <Link to="/register" style={{ color: "#00e5ff", textDecoration: "none", fontWeight: 700 }}>
                    Kayıt Olun
                  </Link>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Alert severity="info">
              Firebase yapılandırması yok — aşağıdaki <strong>Demo Giriş</strong> butonlarını kullanın.
            </Alert>
          )}

          {/* Demo Giriş Bölümü */}
          <Divider sx={{ my: 0 }}>
            <Typography variant="caption" color="text.secondary">
              DEMO GİRİŞ
            </Typography>
          </Divider>

          <Alert severity="warning" sx={{ fontSize: "0.8rem", py: 0.5 }}>
            Hızlı test için aşağıdaki demo butonlarından birini tıklayın. Gerçek şifre gerekmez.
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleMockLogin("USER")}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PersonIcon />}
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.2,
                  borderColor: "secondary.main",
                  color: "secondary.light",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "secondary.light",
                    backgroundColor: "rgba(123, 47, 247, 0.08)"
                  }
                }}
              >
                Müşteri Girişi
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleMockLogin("ADMIN")}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AdminPanelSettingsIcon />}
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.2,
                  borderColor: "primary.main",
                  color: "primary.light",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "primary.light",
                    backgroundColor: "rgba(0, 229, 255, 0.08)"
                  }
                }}
              >
                Admin Girişi
              </Button>
            </Grid>
          </Grid>

          {/* Ana sayfaya dön */}
          <Box sx={{ textAlign: "center" }}>
            <Button
              component={Link}
              to="/"
              variant="text"
              size="small"
              sx={{ color: "#7a8fa6", fontSize: "0.8rem" }}
            >
              ← Ana Sayfaya Dön
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
