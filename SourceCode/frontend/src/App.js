// Uygulamanın ana bileşeni
// Tüm sayfaları ve temayı bir arada tutan kapsayıcı yapıdır

import React from "react";
import { Routes, Route } from "react-router-dom"; // Sayfa yönlendirme için
import { ThemeProvider, CssBaseline } from "@mui/material"; // MUI tema sistemi

import theme from "./theme";             // Kendi oluşturduğumuz karanlık tema
import Header from "./components/Header"; // Üst menü bileşeni
import Home from "./pages/Home";           // Ana sayfa (ürün listesi)
import ProductDetail from "./pages/ProductDetail"; // Ürün detay sayfası
import Login from "./pages/Login";         // Giriş sayfası
import Register from "./pages/Register";   // Kayıt sayfası
import Cart from "./pages/Cart";           // Sepet sayfası
import Checkout from "./pages/Checkout";   // Ödeme / Checkout sayfası
import OrderHistory from "./pages/OrderHistory"; // Sipariş geçmişi sayfası
import AdminPanel from "./pages/AdminPanel"; // Yönetici paneli
import RequireAdmin from "./components/RequireAdmin"; // Yönetici korumalı sayfa filtresi

import { AuthProvider } from "./context/AuthContext"; // Firebase kimlik doğrulama bağlamı
import { CartProvider } from "./context/CartContext"; // Sepet bağlamı
import "./App.css";                       // Global stiller

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          {/* Header her sayfada sabit kalır (sticky) */}
          <Header />

          {/* Routes → URL'e göre hangi sayfanın açılacağını belirler */}
          <Routes>
            {/* / → ana sayfa, tüm ürünleri listeler */}
            <Route path="/" element={<Home />} />

            {/* /products/:id → id'ye göre dinamik detay sayfası */}
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* /login → kullanıcı giriş sayfası */}
            <Route path="/login" element={<Login />} />

            {/* /register → kullanıcı kayıt sayfası */}
            <Route path="/register" element={<Register />} />

            {/* /cart → sepet sayfası (herkese açık) */}
            <Route path="/cart" element={<Cart />} />

            {/* /checkout → ödeme sayfası (kendi içinde auth kontrolü yapar) */}
            <Route path="/checkout" element={<Checkout />} />

            {/* /orders → sipariş geçmişi (kendi içinde auth kontrolü yapar) */}
            <Route path="/orders" element={<OrderHistory />} />

            {/* /admin → yönetici paneli (yalnızca adminler) */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPanel />
                </RequireAdmin>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
