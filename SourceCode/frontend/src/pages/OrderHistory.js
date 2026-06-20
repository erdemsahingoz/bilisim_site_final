// OrderHistory (Sipariş Geçmişi) Sayfası
// Kullanıcının geçmiş siparişlerini listeler

import React, { useEffect, useState } from "react";
import {
  Container, Typography, Box, CircularProgress,
  Alert, Button
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderCard from "../components/OrderCard";
import API from "../services/api";

export default function OrderHistory() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Auth yüklenene kadar bekle
    if (authLoading) return;

    // Giriş yapılmamışsa login'e yönlendir
    if (!user) {
      navigate("/login", { replace: true, state: { from: { pathname: "/orders" } } });
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get("/api/orders/my");
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.");
        } else {
          setError("Sipariş geçmişiniz yüklenirken bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, navigate]);

  // Auth yükleniyorsa bekle
  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Giriş yapılmamışsa (navigate çalışana kadar)
  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }} color="text.primary">
        Sipariş Geçmişim
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : orders.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Henüz hiç sipariş vermemişsiniz.
          </Typography>
          <Button component={Link} to="/" variant="contained">
            Alışverişe Başla
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Box>
      )}
    </Container>
  );
}
