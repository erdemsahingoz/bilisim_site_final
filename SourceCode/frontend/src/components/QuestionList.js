import React, { useState } from "react";
import { Box, Typography, Card, CardContent, TextField, Button, Alert, Avatar, Chip } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import API from "../services/api";

export default function QuestionList({ questions = [], onQuestionAnswered }) {
  const { admin } = useAuth();
  const [answers, setAnswers] = useState({}); // { questionId: answerText }
  const [submitting, setSubmitting] = useState({});
  const [error, setError] = useState("");

  const handleAnswerSubmit = async (questionId) => {
    const answerText = answers[questionId];
    if (!answerText || answerText.trim() === "") return;

    setError("");
    setSubmitting(prev => ({ ...prev, [questionId]: true }));

    try {
      await API.patch(`/api/questions/${questionId}/answer`, {
        answerText: answerText
      });
      // Clear answer text
      setAnswers(prev => ({ ...prev, [questionId]: "" }));
      if (onQuestionAnswered) {
        onQuestionAnswered();
      }
    } catch (err) {
      console.error(err);
      setError("Cevap gönderilirken bir hata oluştu.");
    } finally {
      setSubmitting(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const handleAnswerChange = (questionId, text) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  if (questions.length === 0) {
    return (
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography color="text.secondary" variant="body1">
          Bu ürün hakkında henüz soru sorulmamış. İlk soruyu siz sorun!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      
      {questions.map((question) => {
        const qDate = new Date(question.createdAt);
        const qFormattedDate = qDate.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        return (
          <Card key={question.id} sx={{ backgroundColor: "background.paper", border: "1px solid #1e2d3d" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              
              {/* Question Part */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar sx={{ bgcolor: "secondary.main", color: "#fff" }}>
                  <QuestionAnswerIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 700 }}>
                      {question.userDisplayName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {qFormattedDate}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                    {question.questionText}
                  </Typography>
                </Box>
              </Box>

              {/* Answer Part */}
              {question.answerText ? (
                <Box 
                  sx={{ 
                    ml: 6, 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: "rgba(0, 229, 255, 0.03)", 
                    border: "1px solid rgba(0, 229, 255, 0.15)",
                    position: "relative"
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Chip 
                      icon={<AdminPanelSettingsIcon style={{ color: "#00e5ff" }} />} 
                      label="Mağaza Cevabı" 
                      size="small" 
                      sx={{ 
                        bgcolor: "rgba(0, 229, 255, 0.1)", 
                        color: "primary.main",
                        border: "1px solid rgba(0, 229, 255, 0.2)",
                        fontWeight: 700
                      }} 
                    />
                    {question.answeredAt && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(question.answeredAt).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 450, lineHeight: 1.6 }}>
                    {question.answerText}
                  </Typography>
                </Box>
              ) : (
                /* Unanswered and User is Admin: Show Inline Answer Form */
                admin && (
                  <Box sx={{ ml: 6, display: "flex", flexDirection: "column", gap: 1 }}>
                    <TextField
                      label="Soruyu Cevapla"
                      size="small"
                      placeholder="Cevabınızı buraya yazın..."
                      fullWidth
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#1e2d3d" },
                          "&:hover fieldset": { borderColor: "primary.main" }
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={submitting[question.id] || !answers[question.id]}
                      onClick={() => handleAnswerSubmit(question.id)}
                      sx={{ 
                        alignSelf: "flex-end",
                        color: "primary.main",
                        borderColor: "primary.main",
                        "&:hover": {
                          borderColor: "primary.light",
                          backgroundColor: "rgba(0, 229, 255, 0.05)"
                        }
                      }}
                    >
                      {submitting[question.id] ? "Gönderiliyor..." : "Cevabı Kaydet"}
                    </Button>
                  </Box>
                )
              )}

            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
