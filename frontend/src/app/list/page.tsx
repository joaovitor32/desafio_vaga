"use client"

import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Suspense, useEffect, useState } from "react";

import Pagination from "../globals/components/ui/Pagination";
import axios from "axios";
import { formatCPFOrCNPJ } from "../globals/utils/document";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const GetCompanyData = async (page: number) => {
    const { data, status } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions`, {
      params: { page },
      timeout: 0,
    });

    return { data, status };
  };

  const { data, refetch } = useQuery({
    queryKey: ["transaction", currentPage],
    queryFn: () => GetCompanyData(currentPage),
    retry: 3,
    enabled: currentPage > 0,
  });

  const pagination = data?.data.pagination;
  const totalPages = pagination?.totalPages;
  const transactions = data?.data?.data;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: 2,
        display: "flex",
        flexDirection: "column",
        gap: 3
      }}
    >
      <Typography
        variant="h4"
        color="primary.main"
        fontWeight="bold"
      >
        Tabela de transações
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Transaction Id</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              transactions?.map((row: any, index: any) => (
                <TableRow key={`${row.userId.nome}-${index}`}>
                  <TableCell>{row.userId.nome}</TableCell>
                  <TableCell>{formatCPFOrCNPJ(row.userId.cpfCnpj)}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
    </Container>
  );
}
