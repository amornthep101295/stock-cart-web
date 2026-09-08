import { create } from 'zustand';

// --- กำหนด Type ---
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stockQuantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  products: Product[];
  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  setProducts: (products: Product[]) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

// --- สร้าง Store ---
export const useCartStore = create<CartStore>((set) => ({
  products: [],
  cart: [],
  isCartOpen: false,
  
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  
  setProducts: (products) => set({ products }),

  // ฟังก์ชันเพิ่มสินค้าลงตะกร้า (และลดสต๊อกฝั่ง Client)
  addToCart: (productId) => set((state) => {
    const productIndex = state.products.findIndex(p => p.id === productId);
    if (productIndex === -1) return state;

    const product = state.products[productIndex];
    // ตรวจสอบว่าสินค้ามีพอหรือไม่
    if (product.stockQuantity <= 0) return state; 

    // 1. หักสต๊อกในหน้าจอ
    const newProducts = [...state.products];
    newProducts[productIndex] = { ...product, stockQuantity: product.stockQuantity - 1 };

    // 2. เพิ่มจำนวนในตะกร้า
    const cartItemIndex = state.cart.findIndex(c => c.product.id === productId);
    const newCart = [...state.cart];
    if (cartItemIndex >= 0) {
      newCart[cartItemIndex] = { ...newCart[cartItemIndex], quantity: newCart[cartItemIndex].quantity + 1 };
    } else {
      newCart.push({ product: { ...product }, quantity: 1 });
    }

    return { products: newProducts, cart: newCart };
  }),

  // ฟังก์ชันลดสินค้าจากตะกร้า (และคืนสต๊อกฝั่ง Client)
  removeFromCart: (productId) => set((state) => {
    const cartItemIndex = state.cart.findIndex(c => c.product.id === productId);
    if (cartItemIndex === -1) return state;

    const cartItem = state.cart[cartItemIndex];
    const newCart = [...state.cart];

    // 1. ลดจำนวนหรือลบออกจากตะกร้า
    if (cartItem.quantity > 1) {
      newCart[cartItemIndex] = { ...cartItem, quantity: cartItem.quantity - 1 };
    } else {
      newCart.splice(cartItemIndex, 1);
    }

    // 2. คืนสต๊อกในหน้าจอ
    const productIndex = state.products.findIndex(p => p.id === productId);
    const newProducts = [...state.products];
    if (productIndex >= 0) {
      newProducts[productIndex] = {
        ...newProducts[productIndex],
        stockQuantity: newProducts[productIndex].stockQuantity + 1
      };
    }

    return { products: newProducts, cart: newCart };
  }),

  // ฟังก์ชันล้างตะกร้าทั้งหมด
  clearCart: () => set((state) => {
    const newProducts = [...state.products];
    // คืนสต๊อกทั้งหมดกลับไปที่ตาราง
    state.cart.forEach(cartItem => {
      const pIndex = newProducts.findIndex(p => p.id === cartItem.product.id);
      if (pIndex >= 0) {
        newProducts[pIndex].stockQuantity += cartItem.quantity;
      }
    });
    return { products: newProducts, cart: [] };
  })
}));