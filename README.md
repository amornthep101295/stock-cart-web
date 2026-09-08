# 🛒 Stock & Shopping Cart System (Frontend)

หน้าจอผู้ใช้งาน (Frontend) สำหรับระบบจัดการสต๊อกและตะกร้าสินค้า (E-Commerce & Inventory Management) พัฒนาด้วยสถาปัตยกรรมที่เน้นประสิทธิภาพ การจัดการ State ที่รวดเร็ว และโครงสร้างโค้ดแบบ Separation of Concerns (SoC)

## 🚀 Tech Stack (เทคโนโลยีที่ใช้)
* **Framework:** Next.js (App Router) & React
* **Language:** TypeScript
* **UI Library:** Material-UI (MUI v5)[cite: 14] พร้อมระบบ ThemeRegistry รองรับ SSR[cite: 15]
* **State Management:** Zustand
* **Styling:** MUI `sx` prop (CSS-in-JS)

---

## 🛠️ Prerequisites (สิ่งที่ต้องเตรียมก่อนติดตั้ง)
กรุณาตรวจสอบให้แน่ใจว่าเครื่องของคุณได้ติดตั้งซอฟต์แวร์เหล่านี้แล้ว:
* **Node.js** (เวอร์ชัน 18.17.0 หรือใหม่กว่า)
* **npm** (มาพร้อมกับ Node.js) หรือ **yarn**
* **Backend API** (รัน .NET 10 Web API ไว้ที่พอร์ตที่กำหนด)

---

## ⚙️ Installation & Setup (วิธีการติดตั้งและรันโปรเจกต์)

**1. ติดตั้ง Dependencies**
เปิด Terminal ในโฟลเดอร์โปรเจกต์และรันคำสั่ง:
```bash
npm install

**2. ตั้งค่า Environment Variables
สร้างไฟล์ชื่อ .env.local ไว้ที่ Root ของโปรเจกต์ (ระดับเดียวกับ package.json) และกำหนด URL ของ Backend API: NEXT_PUBLIC_API_URL=https://localhost:7123/api


**3. รัน Development Server
เริ่มต้นเซิร์ฟเวอร์ด้วยคำสั่ง:
Bash
npm run dev