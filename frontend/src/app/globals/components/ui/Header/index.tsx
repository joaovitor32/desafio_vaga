import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import React from "react";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";

const Logo = styled("img")({
  height: "40px",
  marginRight: "16px",
});

export default function Header() {
  const { push } = useRouter()

  return (
    <AppBar position="fixed" color="inherit" elevation={4}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Logo src="/zeztra-logo.svg" alt="Zeztra Logo" />
          </Box>
          <Box display="flex" gap={2}>
            <Button color="inherit" sx={{ fontWeight: "bold", color: "primary.main" }} onClick={() => push("/")}>
              Adicionar transações
            </Button>
            <Button color="inherit" sx={{ fontWeight: "bold", color: "primary.main" }} onClick={() => push("/list")}>
              Listagem de transações
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
