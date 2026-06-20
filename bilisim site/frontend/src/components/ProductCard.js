// ProductCard (Ürün Kartı) Bileşeni
// Ana sayfadaki ürün grid'inde her ürün için bir kart gösterir
// Props olarak "product" nesnesi alır

import React from "react";
import Card from "@mui/material/Card";             // Kart dış çerçeve
import CardMedia from "@mui/material/CardMedia";   // Kart üstündeki resim alanı
import CardContent from "@mui/material/CardContent"; // Kart metin alanı
import CardActions from "@mui/material/CardActions"; // Kart alt buton alanı
import Typography from "@mui/material/Typography"; // Yazı bileşeni
import Button from "@mui/material/Button";         // Buton
import Chip from "@mui/material/Chip";             // Fiyat etiketi
import { Link } from "react-router-dom";           // Sayfa yönlendirme

export default function ProductCard({ product }) {

  // Resim kaynağı belirleniyor:
  // customImage varsa → yerel dosya (/public/images/)
  // yoksa → picsum.photos üzerinden rastgele fotoğraf
  const imageUrl = product.customImage
    ? product.customImage
    : `https://picsum.photos/id/${product.picsumId}/600/400`;

  return (
    // Kart → tam yükseklik, dikey flex yapısı (buton her zaman en altta)
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(160deg, #0f1724 0%, #141e30 100%)", // Koyu mavi gradyan
        border: "1px solid #1e2d3d",
        borderRadius: "14px",
        overflow: "hidden",
        // Hover efekti → üzerine gelinince kart yukarı kalkar
        transition: "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
        "&:hover": {
          transform: "translateY(-8px)",                         // 8px yukarı kayar
          boxShadow: "0 16px 48px rgba(0, 229, 255, 0.18)",    // Cyan gölge
          borderColor: "#00e5ff88",                             // Kenar rengidü değişir
        },
      }}
    >
      {/* Ürün resmi */}
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={product.name} // Erişilebilirlik için alt metin
        sx={{ objectFit: "cover" }} // Resmi kesmeden kutuya sığdır
      />

      {/* Kart içeriği → flexGrow:1 ile butonu en alta iter */}
      <CardContent sx={{ flexGrow: 1, px: 2.5, pt: 2, pb: 1 }}>

        {/* Ürün adı */}
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{ fontWeight: 700, fontSize: "0.975rem", color: "#e8f0fe", lineHeight: 1.3 }}
        >
          {product.name}
        </Typography>

        {/* Kısa açıklama */}
        <Typography
          variant="body2"
          sx={{ color: "#7a8fa6", lineHeight: 1.6, mb: 1.5, fontSize: "0.85rem" }}
        >
          {product.description}
        </Typography>

        {/* Fiyat etiketi (Chip) → toFixed(2) ile 2 ondalık basamak */}
        <Chip
          label={`$${Number(product.price).toFixed(2)}`}
          size="small"
          sx={{
            background: "rgba(0, 229, 255, 0.1)",
            color: "#00e5ff",
            border: "1px solid rgba(0, 229, 255, 0.3)",
            fontWeight: 700,
            fontSize: "0.8rem",
          }}
        />
      </CardContent>

      {/* Detay butonu → /products/:id sayfasına yönlendirir */}
      <CardActions sx={{ px: 2.5, pb: 2.5 }}>
        <Button
          fullWidth
          variant="outlined"
          component={Link}                          // React Router Link olarak davranır
          to={`/products/${product.id}`}            // Dinamik URL: /products/1, /products/2 ...
          sx={{
            borderColor: "rgba(0, 229, 255, 0.3)",
            color: "#00e5ff",
            fontWeight: 600,
            fontSize: "0.875rem",
            py: 0.9,
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "#00e5ff",
              background: "rgba(0, 229, 255, 0.08)",
              boxShadow: "0 0 12px rgba(0, 229, 255, 0.2)",
            },
          }}
        >
          Detayları Gör
        </Button>
      </CardActions>
    </Card>
  );
}
