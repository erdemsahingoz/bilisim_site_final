// Uygulamanın ana bileşeni
// Tüm sayfaları ve temayı bir arada tutan kapsayıcı yapıdır

import React from "react";
import { Routes, Route } from "react-router-dom"; // Sayfa yönlendirme için
import { ThemeProvider, CssBaseline } from "@mui/material"; // MUI tema sistemi

import theme from "./theme";             // Kendi oluşturduğumuz karanlık tema
import Header from "./components/Header"; // Üst menü bileşeni
import Home from "./pages/Home";           // Ana sayfa (ürün listesi)
import ProductDetail from "./pages/ProductDetail"; // Ürün detay sayfası
import "./App.css";                       // Global stiller

function App() {
  return (
    // ThemeProvider → tüm uygulama boyunca MUI temasını uygular
    <ThemeProvider theme={theme}>

      {/* CssBaseline → tarayıcı varsayılan stillerini sıfırlar, dark arka planı uygular */}
      <CssBaseline />

      {/* Header her sayfada sabit kalır (sticky) */}
      <Header />

      {/* Routes → URL'e göre hangi sayfanın açılacağını belirler */}
      <Routes>
        {/* / → ana sayfa, tüm ürünleri listeler */}
        <Route path="/" element={<Home />} />

        {/* /products/:id → id'ye göre dinamik detay sayfası */}
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>

    </ThemeProvider>
  );
}

export default App;
