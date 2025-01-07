"use client"

import { Box, Button, Container, Typography } from "@mui/material";

import { Suspense } from "react";
import { useUploadFile } from "./globals/hooks/useUploadFiles";

export default function Home() {

  const mutation = useUploadFile();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await mutation.mutate(file);
    }
  };


  const isPending = mutation.isPending

  return <Container
    maxWidth="lg"
    sx={{
      paddingTop: 8,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }}
  >
    <Suspense fallback={<p>Carregando...</p>}>
      <Typography
        variant="h4"
        color="primary.main"
        fontWeight="bold"
      >
        Fazer upload de transações
      </Typography>
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isPending}
          accept=".txt"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        />
        {/* Botão estilizado */}
        <Button
          type="button"
          disabled={isPending}
          style={{
            padding: "10px 20px",
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: "5px",
            backgroundColor: isPending ? "grey.100" : "primary.main",
            color: isPending ? "grey.500" : "grey.100",
            cursor: isPending ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          Selecionar Arquivo
        </Button>
      </Box>
      {mutation.isPending && <p>Enviando arquivo...</p>}
    </Suspense>
  </Container>;
}
