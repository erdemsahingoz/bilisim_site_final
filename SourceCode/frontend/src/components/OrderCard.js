import React from "react";
import { Card, CardContent, Typography, Box, Divider, Grid, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export default function OrderCard({ order }) {
  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const getStatusChip = (status) => {
    switch (status) {
      case "PAID":
        return (
          <Chip
            icon={<CheckCircleIcon style={{ color: "#00e5ff" }} />}
            label="Ödeme Başarılı"
            variant="outlined"
            sx={{
              color: "primary.main",
              borderColor: "primary.main",
              backgroundColor: "rgba(0, 229, 255, 0.05)",
              fontWeight: 700
            }}
          />
        );
      case "PENDING":
        return (
          <Chip
            icon={<AccessTimeIcon style={{ color: "#ffb300" }} />}
            label="Beklemede"
            variant="outlined"
            sx={{
              color: "#ffb300",
              borderColor: "#ffb300",
              backgroundColor: "rgba(255, 179, 0, 0.05)",
              fontWeight: 700
            }}
          />
        );
      default:
        return (
          <Chip
            label={status}
            variant="outlined"
            sx={{
              color: "text.secondary",
              borderColor: "divider",
              fontWeight: 700
            }}
          />
        );
    }
  };

  return (
    <Card sx={{ backgroundColor: "background.paper", border: "1px solid #1e2d3d", overflow: "hidden" }}>
      <Box sx={{ p: 2.5, backgroundColor: "rgba(255, 255, 255, 0.02)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ShoppingBagIcon color="primary" />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Sipariş #{order.id}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
            ${order.totalPrice.toFixed(2)}
          </Typography>
          {getStatusChip(order.status)}
        </Box>
      </Box>
      <Divider />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {order.items.map((item, index) => (
            <Grid container key={index} alignItems="center" spacing={2}>
              <Grid item xs={2} sm={1.5}>
                <Box
                  component="img"
                  src={item.productImagePath || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=150&auto=format&fit=crop"}
                  alt={item.productName}
                  sx={{
                    width: "100%",
                    maxHeight: 60,
                    objectFit: "contain",
                    borderRadius: 1.5,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    p: 0.5,
                    border: "1px solid",
                    borderColor: "divider"
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={7.5}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {item.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Birim Fiyat: ${item.unitPrice.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={3} sx={{ textAlign: "right" }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {item.quantity} Adet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Subtotal: ${(item.quantity * item.unitPrice).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
