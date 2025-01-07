import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "Satoshi, sans-serif",
  },
  palette: {
    primary: {
      main: "#1c4389",
      dark: "#003366",
      200: "#A8CBE6",
      "300": "#7AAFD1",
      "700": "#005085",
      "800": "#003F6B",
    },
    secondary: {
      main: "#006AD3",
    },
    background: {
      default: "#E8ECEF",
      paper: "#F5F5F5",
    },
    text: {
      primary: "#333333",
      secondary: "#4A4A4A",
    },
    grey: {
      "100": "#F5F5F5",
      "500": "#A9A9A9",
      "600": "#808080",
      "700": "#4F4F4F",
      "800": "#2E2E2E",
    },
  },
});
