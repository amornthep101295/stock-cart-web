'use client';

import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, 
  Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, CircularProgress 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useCartStore } from '../store/useCartStore';

interface CartDialogProps {
  isSubmitting: boolean;
  onCheckout: () => void;
  onAddToCart: (productId: string, productName: string, currentStock: number) => void;
}

export default function CartDialog({ isSubmitting, onCheckout, onAddToCart }: CartDialogProps) {
  const { products, cart, isCartOpen, setCartOpen, removeFromCart, clearCart } = useCartStore();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <Dialog open={isCartOpen} onClose={() => !isSubmitting && setCartOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        ตะกร้าสินค้าของคุณ
      </DialogTitle>
      <DialogContent dividers>
        {cart.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
            ยังไม่มีสินค้าในตะกร้า
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ชื่อสินค้า</TableCell>
                <TableCell align="right">ราคา/หน่วย</TableCell>
                <TableCell align="center">จำนวน</TableCell>
                <TableCell align="right">รวม (บาท)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => {
                const realProduct = products.find(p => p.id === item.product.id);
                const currentStock = realProduct ? realProduct.stockQuantity : 0;

                return (
                  <TableRow key={item.product.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell align="right">{item.product.price.toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => removeFromCart(item.product.id)} disabled={isSubmitting}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                      <IconButton 
                        size="small" 
                        onClick={() => onAddToCart(item.product.id, item.product.name, currentStock)} 
                        disabled={currentStock === 0 || isSubmitting}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      {(item.product.price * item.quantity).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        
        {cart.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6" align="right">
              จำนวนรวม: {totalCartItems} ชิ้น
            </Typography>
            <Typography variant="h5" align="right" color="primary.main" sx={{ fontWeight: 'bold' }}>
              ยอดสุทธิ: {totalCartPrice.toLocaleString()} บาท
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<DeleteSweepIcon />} 
          onClick={clearCart}
          disabled={cart.length === 0 || isSubmitting}
        >
          ล้างตะกร้า
        </Button>
        <Box>
          <Button variant="text" color="secondary" onClick={() => setCartOpen(false)} sx={{ mr: 1 }} disabled={isSubmitting}>
            ปิดหน้าต่าง
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={cart.length === 0 || isSubmitting}
            onClick={onCheckout}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'ชำระเงิน (Check Out)'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}