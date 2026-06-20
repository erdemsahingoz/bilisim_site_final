import React, { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function QuestionForm({ productId, onQuestionSubmitted }) {
  const { user, admin } = useAuth();
  const [questionText, setQuestionText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Bu ürün hakkında soru sorabilmek için giriş yapmalısınız.
      </Alert>
    );
  }

  // Admins cannot ask questions, they only answer
  if (admin) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Yönetici (Admin) hesabı ile soru sorulamaz. Sadece sorulan soruları cevaplayabilirsiniz.
      </Alert>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setError("");
    setSuccess(false);
    setSubmitting(true);

    try {
      await API.post("/api/questions", {
        productId: productId,
        questionText: questionText
      });
      setSuccess(true);
      setQuestionText("");
      if (onQuestionSubmitted) {
        onQuestionSubmitted();
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Soru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" color="primary.main">
        Satıcıya Soru Sor
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Sorunuz satıcıya iletildi. Cevaplandığında burada görünecektir.</Alert>}

      <TextField
        label="Sorunuz"
        multiline
        rows={3}
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Ürün özellikleri, teslimat vb. konularda merak ettiklerinizi sorun..."
        fullWidth
        required
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
        disabled={submitting || !questionText.trim()}
        sx={{ alignSelf: "flex-start" }}
      >
        {submitting ? "Gönderiliyor..." : "Soruyu Gönder"}
      </Button>
    </Box>
  );
}
