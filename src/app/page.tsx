'use client';

import React, { useEffect, useState } from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, Badge, Container, Box, Snackbar, Alert 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCartStore } from '../store/useCartStore';
import ProductTable from '../components/ProductTable';
import CartDialog from '../components/CartDialog';
// นำเข้า API Functions ที่เราสร้างไว้
import { getProducts, checkoutOrder } from '../services/api';

export default function HomePage() {
  const { cart, setCartOpen, setProducts, addToCart, clearCart } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });
  const [isLoading, setIsLoading] = useState(true);

  // นำฟังก์ชัน getProducts จาก api.ts มาใช้
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setSnackbar({ open: true, message: 'ดึงข้อมูลสินค้าไม่สำเร็จ', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCartClick = (productId: string, productName: string, currentStock: number) => {
    addToCart(productId);
    if (currentStock === 1) {
      setSnackbar({ 
        open: true, 
        message: `สินค้าหมด! คุณได้เพิ่ม "${productName}" ลงตะกร้าจนครบสต๊อกแล้ว`, 
        severity: 'warning' 
      });
    }
  };

  // นำฟังก์ชัน checkoutOrder จาก api.ts มาใช้
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      const payload = {
        items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity }))
      };

      const data = await checkoutOrder(payload);

      // กรณี Success (เพราะถ้า Error มันจะกระโดดไปเข้า catch อัตโนมัติ)
      setSnackbar({ open: true, message: data.message || 'ชำระเงินสำเร็จ!', severity: 'success' });
      clearCart(); 
      setCartOpen(false); 
      fetchProducts(); 
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      // นำ Error message ที่โยนมาจาก api.ts มาแสดง
      setSnackbar({ open: true, message: error.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', pb: 5 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Store Hub
          </Typography>
          <IconButton color="inherit" onClick={() => setCartOpen(true)}>
            <Badge badgeContent={totalCartItems} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>รายการสินค้า</Typography>
        
        <ProductTable 
          isLoading={isLoading} 
          onAddToCart={handleAddToCartClick} 
        />
      </Container>

      <CartDialog 
        isSubmitting={isSubmitting} 
        onCheckout={handleCheckout} 
        onAddToCart={handleAddToCartClick} 
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
        sx={{ mt: { xs: 8, sm: 10 } }} 
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', boxShadow: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}