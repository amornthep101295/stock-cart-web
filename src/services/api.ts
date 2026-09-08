const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Types ---
export interface CheckoutPayload {
  items: {
    productId: string;
    quantity: number;
  }[];
}

// --- API Functions ---

// 1. ฟังก์ชันดึงข้อมูลสินค้า
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/Products`);
  if (!response.ok) {
    throw new Error('ไม่สามารถดึงข้อมูลสินค้าได้');
  }
  return response.json();
};

// 2. ฟังก์ชันชำระเงิน
export const checkoutOrder = async (payload: CheckoutPayload) => {
  const response = await fetch(`${API_URL}/Orders/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  // ถ้า Backend ส่ง HTTP Status Code ที่ไม่ใช่ 200 (เช่น 400 Bad Request) ให้โยน Error ออกไป
  if (!response.ok) {
    throw new Error(data.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
  }

  return data; // ส่งข้อมูลกลับไปถ้าสำเร็จ (เช่น { message: 'ชำระเงินสำเร็จ!' })
};