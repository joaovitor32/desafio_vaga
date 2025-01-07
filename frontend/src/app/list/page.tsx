"use client";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";

import Pagination from "../globals/components/ui/Pagination";
import { formatCPFOrCNPJ } from "../globals/utils/document";
import { formatPrice } from "../globals/utils/price";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Transaction = {
  userId: { nome: string; cpfCnpj: string };
  data: string;
  valor: { $numberDecimal: string };
  transactionId: string;
};

type TransactionsResponse = {
  data: Transaction[];
  pagination: { totalPages: number };
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [formData, setFormData] = useState({ nome: "", valor: 0 });

  const fetchTransactions = async (
    page: number,
    nome?: string,
    valor?: number
  ): Promise<TransactionsResponse> => {
    const params: { [key: string]: string | number } = { page };

    if (nome) params.nome = nome;
    if (valor !== undefined && valor !== 0) params.valor = valor;

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions`,
      {
        params,
        timeout: 0,
      }
    );

    return data;
  };

  const { data, isLoading, isError, error } = useQuery<TransactionsResponse>({
    queryKey: ["transaction", currentPage, formData.nome, formData.valor],
    queryFn: () =>
      fetchTransactions(currentPage, formData.nome, formData.valor),
    retry: 3,
    enabled: currentPage > 0,
  });
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const transactions = data?.data || [];

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleFieldValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1); // Reset para página inicial ao buscar
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: 4,
        paddingBottom: 12,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h4" color="primary.main" fontWeight="bold">
        Tabela de Transações
      </Typography>

      {isLoading && <CircularProgress sx={{ alignSelf: "center" }} />}
      {isError && (
        <Typography color="error" align="center">
          {error instanceof AxiosError
            ? `Erro: ${error.response?.data.message}`
            : "Ocorreu um erro ao carregar os dados."}
        </Typography>
      )}
      {!isLoading && !isError && transactions.length === 0 && (
        <Typography align="center">Nenhuma transação encontrada.</Typography>
      )}

      <Grid container spacing={2}>
        {/* Formulário */}
        <Grid item xs={12} md={4}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleFieldValueChange}
              fullWidth
            />
            <TextField
              label="Valor"
              name="valor"
              value={formData.valor}
              onChange={handleFieldValueChange}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Enviar
            </Button>
          </Box>
        </Grid>

        {/* Tabela */}
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>ID da Transação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((row, index) => (
                  <TableRow key={`${row.userId.nome}-${index}`}>
                    <TableCell>{row.userId.nome}</TableCell>
                    <TableCell>{formatCPFOrCNPJ(row.userId.cpfCnpj)}</TableCell>
                    <TableCell>
                      {new Date(row.data).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      R$ {formatPrice(row.valor.$numberDecimal)}
                    </TableCell>
                    <TableCell>{row.transactionId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
    </Container>
  );
}
