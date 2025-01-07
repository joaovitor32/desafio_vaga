import { Pagination as MUIPagination, Stack, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';

interface PaginacaoProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginacaoProps> = ({ totalPages, onPageChange }) => {
  const [page, setPage] = useState<number>(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    onPageChange(value);
  };

  return (
    <Stack
      spacing={1}
      alignItems="center"
      sx={{
        position: isMobile ? 'fixed' : 'static',
        bottom: isMobile ? 0 : 'auto',
        left: 0,
        right: 0,
        bgcolor: isMobile ? 'background.paper' : 'transparent',
        zIndex: isMobile ? theme.zIndex.appBar : 'auto',
        py: isMobile ? 1 : 0,
        boxShadow: isMobile ? theme.shadows[3] : 'none',
      }}
    >
      <MUIPagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
        size="large"
        variant="outlined"
        shape="rounded"
        sx={{
          py: 0,
          '& .MuiPaginationItem-root': {
            color: 'primary.main',
            border: 'none',
            '&:hover': {
              backgroundColor: 'primary.dark',
              color: 'grey.100',
            },
            '&.Mui-selected': {
              border: 'none',
              backgroundColor: 'primary.dark',
              color: 'grey.100',
            },
          },
          '& .MuiPaginationItem-outlined': {
            border: 'none',
          },
        }}
      />
    </Stack>
  );
};

export default Pagination;