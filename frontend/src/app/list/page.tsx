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
import { formatDateToDDMMYYYY } from "../globals/utils/date";
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
  const [formData, setFormData] = useState({
    nome: "",
    valor: 0,
    cpfCnpj: "",
    dataInicial: "",
    dataFinal: ""
  });

  const fetchTransactions = async (
    page: number,
    nome?: string,
    valor?: number,
    cpfCnpj?: string,
    dataInicial?: string,
    dataFinal?: string
  ): Promise<TransactionsResponse> => {
    const params: { [key: string]: string | number } = { page };

    if (nome?.trim()) params.nome = nome;
    if (cpfCnpj?.trim()) params.cpfCnpj = cpfCnpj;
    if (valor !== undefined && valor !== 0) params.valor = valor;
    if (dataInicial) params.dataInicial = dataInicial;
    if (dataFinal) params.dataFinal = dataFinal;

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
    queryKey: [
      "transaction",
      currentPage,
      formData.nome,
      formData.valor,
      formData.cpfCnpj,
      formData.dataInicial,
      formData.dataFinal,
    ],
    queryFn: () =>
      fetchTransactions(
        currentPage,
        formData.nome?.trim() || undefined,
        formData.valor || undefined,
        formData.cpfCnpj || undefined,
        formData.dataInicial || undefined,
        formData.dataFinal || undefined
      ),
    retry: 3,
    enabled: currentPage > 0,
  });

  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const transactions = data?.data || [];

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleFieldValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "dataInicial" || name === "dataFinal") {
      const formattedDate = value ? new Date(value).toISOString().split('T')[0] : '';
      setFormData((prev) => ({ ...prev, [name]: formattedDate }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
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
            <TextField
              label="Document"
              name="cpfCnpj"
              value={formData.cpfCnpj}
              onChange={handleFieldValueChange}
              fullWidth
            />
            <TextField
              label="Data Inicial"
              type="date"
              name="dataInicial"
              value={formData.dataInicial}
              onChange={handleFieldValueChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data Final"
              type="date"
              name="dataFinal"
              value={formData.dataFinal}
              onChange={handleFieldValueChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Button type="submit" variant="contained" color="primary">
              Enviar
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>Nome</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>Documento</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>Data</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>Valor</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>ID da Transação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((row, index) => (
                  <TableRow key={`${row.userId.nome}-${index}`}>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>{row.userId.nome}</TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>
                      {formatCPFOrCNPJ(row.userId.cpfCnpj)}
                    </TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>
                      {formatDateToDDMMYYYY(row.data)}
                    </TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>
                      R$ {formatPrice(row.valor.$numberDecimal)}
                    </TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>{row.transactionId}</TableCell>
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
