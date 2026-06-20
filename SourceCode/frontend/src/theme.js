import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00e5ff",
      light: "#6effff",
      dark: "#00b2cc",
      contrastText: "#000",
    },
    secondary: {
      main: "#7b2ff7",
      light: "#ae62ff",
      dark: "#4a00c4",
      contrastText: "#fff",
    },
    background: {
      default: "#080d1a",
      paper: "#0f1724",
    },
    text: {
      primary: "#e8f0fe",
      secondary: "#7a8fa6",
    },
    divider: "#1e2d3d",
  },
  typography: {
    fontFamily: "'Outfit', 'Inter', 'Segoe UI', sans-serif",
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          scrollbarColor: "#1e2d3d #080d1a",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": { background: "#080d1a" },
          "&::-webkit-scrollbar-thumb": {
            background: "#1e2d3d",
            borderRadius: 4,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(8, 13, 26, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #1e2d3d",
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0f1724",
          border: "1px solid #1e2d3d",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          letterSpacing: 0.3,
          padding: "8px 20px",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #00e5ff 0%, #7b2ff7 100%)",
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(135deg, #6effff 0%, #ae62ff 100%)",
            boxShadow: "0 4px 24px rgba(0, 229, 255, 0.35)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
  },
});

export default theme;
