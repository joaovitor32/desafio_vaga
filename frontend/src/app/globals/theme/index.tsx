import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "Satoshi, sans-serif",
  },
  palette: {
    primary: {
      main: "#005A9E",
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
      default: "#E4E7EB",
      paper: "#E4E7EB",
    },
    text: {
      primary: "#333333",
      secondary: "#4A4A4A",
    },
    grey: {
      "100": "#004A91",
      "500": "#004A91",
      "600": "#004A91",
      "700": "#004A91",
      "800": "#004A91",
    },
  },
});
