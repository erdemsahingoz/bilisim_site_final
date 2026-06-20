// AdminPanel (Yönetici Paneli) Bileşeni
// Sadece ADMIN rolündeki kullanıcıların erişebileceği panel.
// 3 Ana Sekmeden oluşur:
// 1. Ürün Ekleme (Yeni ürün ekleme formu)
// 2. Stok Yönetimi (Mevcut ürünlerin stoklarını güncelleme)
// 3. Soruları Yanıtla (Kullanıcıların sorduğu cevaplanmamış soruları listeler ve cevaplama imkanı sunar)

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Avatar,
  CircularProgress,
  IconButton
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import InventoryIcon from "@mui/icons-material/Inventory";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import RefreshIcon from "@mui/icons-material/Refresh";
import API from "../services/api";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: "success", message: "" });

  // Yeni Ürün Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    details: "",
    price: "",
    stock: "",
    imagePath: ""
  });

  // Stok Güncelleme Form State (productId -> stockValue)
  const [stockUpdates, setStockUpdates] = useState({});

  // Soru Cevaplama Form State (questionId -> answerText)
  const [answers, setAnswers] = useState({});

  // Verileri Sunucudan Çekme
  const fetchProducts = async () => {
    try {
      const response = await API.get("/api/products");
      setProducts(response.data);
      // Stok form girdilerini doldur
      const initialStocks = {};
      response.data.forEach((p) => {
        initialStocks[p.id] = p.stock;
      });
      setStockUpdates(initialStocks);
    } catch (err) {
      console.error("Ürünler getirilemedi:", err);
      showAlert("error", "Ürün listesi sunucudan yüklenirken bir hata oluştu.");
    }
  };

  const fetchUnansweredQuestions = async () => {
    try {
      const response = await API.get("/api/questions/unanswered");
      setUnansweredQuestions(response.data);
    } catch (err) {
      console.error("Sorular getirilemedi:", err);
      showAlert("error", "Cevaplanmamış sorular yüklenirken bir hata oluştu.");
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchUnansweredQuestions()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setAlertInfo({ show: false, type: "success", message: "" });
  };

  const showAlert = (type, message) => {
    setAlertInfo({ show: true, type, message });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1. Ürün Ekleme İşlemi
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.description || !newProduct.price || newProduct.stock === "") {
      showAlert("error", "Lütfen zorunlu alanları doldurun.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/api/products", {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10)
      });
      showAlert("success", `"${newProduct.name}" ürünü başarıyla eklendi.`);
      // Formu temizle
      setNewProduct({
        name: "",
        description: "",
        details: "",
        price: "",
        stock: "",
        imagePath: ""
      });
      await fetchProducts();
    } catch (err) {
      console.error("Ürün eklenemedi:", err);
      showAlert("error", "Ürün eklenirken sunucuda bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Stok Güncelleme İşlemi
  const handleUpdateStock = async (id) => {
    const updatedStockValue = stockUpdates[id];
    if (updatedStockValue === undefined || updatedStockValue === "") {
      showAlert("error", "Geçersiz stok miktarı.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.patch(`/api/products/${id}/stock`, {
        stock: parseInt(updatedStockValue, 10)
      });
      showAlert("success", `"${response.data.name}" ürününün stoğu güncellendi (Yeni Stok: ${response.data.stock}).`);
      await fetchProducts();
    } catch (err) {
      console.error("Stok güncellenemedi:", err);
      showAlert("error", "Stok güncellenirken sunucuda bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Soruya Cevap Verme İşlemi
  const handleAnswerQuestion = async (id) => {
    const answerText = answers[id];
    if (!answerText || !answerText.trim()) {
      showAlert("error", "Lütfen bir cevap yazın.");
      return;
    }

    try {
      setLoading(true);
      await API.patch(`/api/questions/${id}/answer`, {
        answerText: answerText.trim()
      });
      showAlert("success", "Soru başarıyla yanıtlandı.");
      // Cevap inputunu temizle
      setAnswers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      await fetchUnansweredQuestions();
    } catch (err) {
      console.error("Soru cevaplanamadı:", err);
      showAlert("error", "Cevap gönderilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Ürün ismini ID'den bulma yardımcısı (sorular sekmesi için)
  const getProductNameById = (productId) => {
    const prod = products.find((p) => p.id === productId);
    return prod ? prod.name : `Ürün #${productId}`;
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">
        {/* Başlık Alanı */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }
            }}
          >
            Yönetim Paneli
          </Typography>
          <IconButton onClick={loadData} color="primary" disabled={loading} sx={{ border: "1px solid #1e2d3d" }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
          </IconButton>
        </Box>

        {alertInfo.show && (
          <Alert severity={alertInfo.type} sx={{ mb: 4 }} onClose={() => setAlertInfo({ ...alertInfo, show: false })}>
            {alertInfo.message}
          </Alert>
        )}

        {/* Sekmeler (Tabs) */}
        <Paper
          elevation={0}
          sx={{
            background: "#0f1724",
            border: "1px solid #1e2d3d",
            borderRadius: "16px",
            overflow: "hidden"
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              borderBottom: "1px solid #1e2d3d",
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                py: 2
              }
            }}
          >
            <Tab icon={<AddBoxIcon />} iconPosition="start" label="Ürün Ekle" />
            <Tab icon={<InventoryIcon />} iconPosition="start" label="Stok Yönetimi" />
            <Tab icon={<QuestionAnswerIcon />} iconPosition="start" label="Soruları Yanıtla" />
          </Tabs>

          <Box sx={{ px: { xs: 2, md: 4 } }}>
            {/* 1. SEKME: ÜRÜN EKLEME FORMU */}
            <TabPanel value={activeTab} index={0}>
              <Box component="form" onSubmit={handleCreateProduct} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#e8f0fe" }}>
                  Yeni Ürün Detayları
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Ürün Adı *"
                      fullWidth
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Resim Yolu / URL"
                      fullWidth
                      placeholder="/images/ram.png veya http://..."
                      value={newProduct.imagePath}
                      onChange={(e) => setNewProduct({ ...newProduct, imagePath: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Fiyat ($) *"
                      type="number"
                      inputProps={{ step: "0.01", min: "0.01" }}
                      fullWidth
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Stok Adedi *"
                      type="number"
                      inputProps={{ min: "0" }}
                      fullWidth
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Kısa Açıklama *"
                      multiline
                      rows={2}
                      fullWidth
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Teknik Özellikler (Detaylar)"
                      multiline
                      rows={4}
                      fullWidth
                      placeholder="Örn: Kapasite: 1TB, Okuma Hızı: 7000MB/s..."
                      value={newProduct.details}
                      onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    alignSelf: "flex-start",
                    px: 5,
                    py: 1.5,
                    mt: 2,
                    fontWeight: 700
                  }}
                >
                  {loading ? "Ekleniyor..." : "Ürünü Ekle"}
                </Button>
              </Box>
            </TabPanel>

            {/* 2. SEKME: STOK GÜNCELLEME */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#e8f0fe" }}>
                Stok Durumları ve Güncelleme
              </Typography>
              <TableContainer component={Paper} sx={{ background: "#0b111a", border: "1px solid #1e2d3d" }}>
                <Table>
                  <TableHead sx={{ background: "#0f1724" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "#7a8fa6" }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#7a8fa6" }}>Ürün Görseli</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#7a8fa6" }}>Ürün Adı</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#7a8fa6" }}>Fiyat</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#7a8fa6" }}>Mevcut Stok</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#7a8fa6" }}>Yeni Stok Miktarı</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#7a8fa6" }}>İşlem</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} sx={{ "&:hover": { background: "rgba(255, 255, 255, 0.02)" } }}>
                        <TableCell sx={{ color: "#e8f0fe" }}>#{product.id}</TableCell>
                        <TableCell>
                          <Avatar
                            variant="rounded"
                            src={product.imagePath || `https://picsum.photos/id/${(product.id % 20) + 1}/100/100`}
                            sx={{ width: 48, height: 48, border: "1px solid #1e2d3d" }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#e8f0fe" }}>{product.name}</TableCell>
                        <TableCell sx={{ color: "#00e5ff", fontWeight: 700 }}>${product.price}</TableCell>
                        <TableCell sx={{ color: product.stock === 0 ? "#ff4a6b" : "#7a8fa6", fontWeight: 700 }}>
                          {product.stock === 0 ? "Stokta Yok" : `${product.stock} Adet`}
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            inputProps={{ min: "0" }}
                            sx={{ width: 100 }}
                            value={stockUpdates[product.id] !== undefined ? stockUpdates[product.id] : ""}
                            onChange={(e) =>
                              setStockUpdates({ ...stockUpdates, [product.id]: e.target.value })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleUpdateStock(product.id)}
                            disabled={loading}
                            sx={{ fontWeight: 700 }}
                          >
                            Güncelle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* 3. SEKME: CEVAPLANMAMIŞ SORULAR */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#e8f0fe" }}>
                Cevaplanmayı Bekleyen Sorular ({unansweredQuestions.length})
              </Typography>
              {unansweredQuestions.length === 0 ? (
                <Alert severity="success" sx={{ border: "1px solid rgba(0, 229, 255, 0.2)" }}>
                  Cevaplanmayı bekleyen herhangi bir soru bulunmuyor. Harika iş!
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {unansweredQuestions.map((q) => (
                    <Grid item xs={12} key={q.id}>
                      <Card sx={{ background: "#0b111a", border: "1px solid #1e2d3d", borderRadius: "12px" }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, flexWrap: "wrap", gap: 1 }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: "#00e5ff", fontWeight: 700, mr: 2 }}>
                                ÜRÜN: {getProductNameById(q.productId)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#7a8fa6" }}>
                                Soran: <strong>{q.userDisplayName}</strong>
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: "#7a8fa6" }}>
                              Tarih: {new Date(q.createdAt).toLocaleString("tr-TR")}
                            </Typography>
                          </Box>

                          <Typography variant="body1" sx={{ color: "#e8f0fe", mb: 3, fontStyle: "italic", pl: 2, borderLeft: "3px solid #7b2ff7" }}>
                            "{q.questionText}"
                          </Typography>

                          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                            <TextField
                              label="Cevabınız"
                              multiline
                              rows={2}
                              fullWidth
                              placeholder="Cevabınızı buraya yazın..."
                              value={answers[q.id] || ""}
                              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            />
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleAnswerQuestion(q.id)}
                              disabled={loading}
                              sx={{ px: 4, py: 1.5, height: "fit-content", fontWeight: 700 }}
                            >
                              Cevapla
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
