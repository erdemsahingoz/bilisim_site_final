import React, { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Register() {
  const { register, isFirebaseAvailable } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Şifreler uyuşmuyor.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, displayName);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Kayıt işlemi başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", py: 4 }}>
      <Card sx={{ width: "100%", maxWidth: 450, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)" }}>
        <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
              Kayıt Ol
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Yeni bir hesap oluşturarak alışverişe başlayın
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {isFirebaseAvailable ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Ad Soyad"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Şifre Tekrar"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<PersonAddIcon />}
                fullWidth
                sx={{ mt: 1 }}
              >
                {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Alert severity="warning">
                Firebase devre dışı olduğu için yeni kullanıcı kaydı yapılamaz.
              </Alert>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
              >
                Giriş Ekranına Dön (Demo Girişi)
              </Button>
            </Box>
          )}

          {isFirebaseAvailable && (
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Zaten hesabınız var mı?{" "}
                <Link to="/login" style={{ color: "#00e5ff", textDecoration: "none", fontWeight: 700 }}>
                  Giriş Yapın
                </Link>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
