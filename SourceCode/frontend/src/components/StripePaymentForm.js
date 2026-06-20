import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, Button, Typography, Alert, TextField, Grid } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import API from "../services/api";

export default function StripePaymentForm({ totalPrice, onPaymentSuccess, isMockPayment = false }) {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock form states
  const [mockCard, setMockCard] = useState({
    number: "4242 4242 4242 4242",
    expiry: "12/28",
    cvc: "123",
    name: "Test Kullanıcı"
  });

  const handleRealPayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe henüz yüklenmedi. Lütfen sayfayı yenileyin.");
      return;
    }

    setError("");
    setProcessing(true);

    try {
      // 1. Create PaymentIntent on the Spring Boot backend
      const intentResponse = await API.post("/api/payments/create-intent", {
        amount: totalPrice,
        currency: "usd"
      });

      const clientSecret = intentResponse.data.clientSecret;

      // 2. Confirm card payment with Stripe client SDK
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement
        }
      });

      if (result.error) {
        setError(result.error.message || "Ödeme işlemi başarısız.");
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          setSuccess(true);
          onPaymentSuccess(result.paymentIntent.id);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Ödeme başlatılırken bir sunucu hatası oluştu.");
      setProcessing(false);
    }
  };

  const handleMockPayment = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    // Simulate Network Latency
    setTimeout(() => {
      setSuccess(true);
      setProcessing(false);
      // Pass a dummy payment intent ID to succeed order creation on backend
      onPaymentSuccess("mock_pi_" + Math.random().toString(36).substr(2, 9));
    }, 2000);
  };

  if (isMockPayment) {
    return (
      <Box component="form" onSubmit={handleMockPayment} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Alert severity="warning" sx={{ mb: 1 }}>
          Stripe API anahtarı girilmediği için <strong>Simüle Demo Ödeme</strong> modundasınız. Herhangi bir kart bilgisi girebilirsiniz.
        </Alert>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Simüle ödeme başarıyla onaylandı!</Alert>}

        <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600 }}>
          Kart Bilgileri (Simüle)
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Kart Numarası"
              value={mockCard.number}
              onChange={(e) => setMockCard({ ...mockCard, number: e.target.value })}
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Son Kullanma"
              placeholder="AA/YY"
              value={mockCard.expiry}
              onChange={(e) => setMockCard({ ...mockCard, expiry: e.target.value })}
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CVC"
              value={mockCard.cvc}
              onChange={(e) => setMockCard({ ...mockCard, cvc: e.target.value })}
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Kart Üzerindeki İsim"
              value={mockCard.name}
              onChange={(e) => setMockCard({ ...mockCard, name: e.target.value })}
              fullWidth
              size="small"
              required
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={processing || success}
          startIcon={<PaymentIcon />}
          sx={{
            mt: 2,
            background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
            fontWeight: "bold",
            color: "#fff"
          }}
        >
          {processing ? "Ödeme Simüle Ediliyor..." : `Ödeme Yap ($${totalPrice.toFixed(2)})`}
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleRealPayment} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Ödemeniz başarıyla alındı!</Alert>}

      <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600 }}>
        Kredi veya Banka Kartı
      </Typography>

      <Box
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.01)",
          "&:hover": { borderColor: "primary.main" }
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                color: "#e8f0fe",
                fontFamily: "'Outfit', 'Inter', sans-serif",
                fontSize: "16px",
                "::placeholder": {
                  color: "#7a8fa6"
                }
              },
              invalid: {
                color: "#ff5252",
                iconColor: "#ff5252"
              }
            }
          }}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={!stripe || processing || success}
        startIcon={<PaymentIcon />}
        sx={{
          background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
          fontWeight: "bold",
          color: "#fff"
        }}
      >
        {processing ? "Ödeme Yapılıyor..." : `Stripe ile Öde ($${totalPrice.toFixed(2)})`}
      </Button>
    </Box>
  );
}
