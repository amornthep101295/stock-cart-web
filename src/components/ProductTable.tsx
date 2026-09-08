'use client';

import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Box, IconButton, Typography, CircularProgress, TablePagination 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCartStore } from '../store/useCartStore';

interface ProductTableProps {
  isLoading: boolean;
  onAddToCart: (productId: string, productName: string, currentStock: number) => void;
}

export default function ProductTable({ isLoading, onAddToCart }: ProductTableProps) {
  const { products, cart, removeFromCart, addToCart } = useCartStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const getQtyInCart = (productId: string) => {
    const item = cart.find(c => c.product.id === productId);
    return item ? item.quantity : 0;
  };

  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead sx={{ bgcolor: 'grey.200' }}>
          <TableRow>
            <TableCell><b>รหัสสินค้า</b></TableCell>
            <TableCell><b>ชื่อสินค้า</b></TableCell>
            <TableCell align="right"><b>ราคา (บาท)</b></TableCell>
            <TableCell align="center"><b>สต๊อกคงเหลือ</b></TableCell>
            <TableCell align="center"><b>จัดการตะกร้า</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                <CircularProgress color="primary" />
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>กำลังโหลดข้อมูลสินค้า...</Typography>
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                ไม่พบรายการสินค้า
              </TableCell>
            </TableRow>
          ) : (
            paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.price.toLocaleString()}</TableCell>
                <TableCell align="center" sx={{ 
                  color: product.stockQuantity === 0 ? 'error.main' : 'inherit',
                  fontWeight: product.stockQuantity === 0 ? 'bold' : 'normal'
                 }}>
                  {product.stockQuantity === 0 ? 'สินค้าหมด' : product.stockQuantity}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton 
                      size="small" 
                      color="secondary"
                      onClick={() => removeFromCart(product.id)}
                      disabled={getQtyInCart(product.id) === 0}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2, minWidth: '20px', textAlign: 'center' }}>
                      {getQtyInCart(product.id)}
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => onAddToCart(product.id, product.name, product.stockQuantity)}
                      disabled={product.stockQuantity === 0}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {!isLoading && products.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="รายการต่อหน้า:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        />
      )}
    </TableContainer>
  );
}