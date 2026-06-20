import React from "react";
import { Box, Typography, Card, CardContent, Rating, Avatar } from "@mui/material";

export default function ReviewList({ reviews = [] }) {
  if (reviews.length === 0) {
    return (
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography color="text.secondary" variant="body1">
          Bu ürüne henüz yorum yapılmamış. İlk yorumu siz yapın!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      {reviews.map((review) => {
        const date = new Date(review.createdAt);
        const formattedDate = date.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        return (
          <Card key={review.id} sx={{ backgroundColor: "background.paper", border: "1px solid #1e2d3d" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: "primary.main", color: "background.default", fontWeight: "bold" }}>
                    {review.userDisplayName ? review.userDisplayName.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" color="text.primary">
                      {review.userDisplayName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formattedDate}
                    </Typography>
                  </Box>
                </Box>
                <Rating value={review.rating} readOnly precision={1} size="small" />
              </Box>
              <Typography variant="body2" color="text.primary" sx={{ pl: 1, borderLeft: "2px solid", borderColor: "secondary.main" }}>
                {review.comment || "Puan verildi, yorum yazılmadı."}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
