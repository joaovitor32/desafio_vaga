import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React from "react";
import Typography from "@mui/material/Typography";

export default function Copyright() {
  return (
    <AppBar position="fixed" color="inherit" sx={{ top: 'auto', bottom: 0 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={2}>
          <Typography variant="body2" color="primary.main" fontWeight={"bold"}>
            &copy; {new Date().getFullYear()} Zeztra. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </AppBar>
  );
}
