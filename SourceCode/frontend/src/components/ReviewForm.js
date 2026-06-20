import React, { useState } from "react";
import { Box, Typography, Rating, TextField, Button, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Bu ürüne yorum yazabilmek için giriş yapmalısınız.
      </Alert>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    try {
      await API.post("/api/reviews", {
        productId: productId,
        rating: rating,
        comment: comment
      });
      setSuccess(true);
      setComment("");
      setRating(5);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" color="primary.main">
        Ürünü Değerlendir
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Yorumunuz başarıyla gönderildi!</Alert>}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography component="legend">Puanınız:</Typography>
        <Rating
          name="product-rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          size="large"
        />
      </Box>

      <TextField
        label="Yorumunuz (Opsiyonel)"
        multiline
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ürün hakkındaki görüşlerinizi yazın..."
        fullWidth
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#1e2d3d" },
            "&:hover fieldset": { borderColor: "primary.main" }
          }
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        sx={{ alignSelf: "flex-start" }}
      >
        {submitting ? "Gönderiliyor..." : "Yorumu Gönder"}
      </Button>
    </Box>
  );
}
