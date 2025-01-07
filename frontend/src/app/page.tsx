"use client"

import { Box, Container, Typography, useTheme } from "@mui/material";

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


  const theme = useTheme()
  const isPending = mutation.isPending
  const isSuccess = mutation.isSuccess;

  const executionTime = mutation.data?.data?.executionTime;

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
      {isSuccess ?
        <Typography sx={{
          color: "primary.main",
          fontWeight: "bold"
        }}
        >
          O último tempo de execução das transações inseridas foi: {executionTime}
        </Typography>
        : null
      }
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
        <button
          type="button"
          disabled={isPending}
          style={{
            padding: "10px 20px",
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: "5px",
            backgroundColor: isPending ? theme.palette.grey[100] : theme.palette.primary.main,
            color: isPending ? theme.palette.grey[500] : theme.palette.grey[100],
            cursor: isPending ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          Selecionar Arquivo
        </button>
      </Box>
      {isPending &&
        <Typography sx={{
          color: "primary.main",
          fontWeight: "bold"
        }}
        >
          Enviando arquivo...
        </Typography>
      }
    </Suspense>
  </Container>;
}
