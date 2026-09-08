import ThemeRegistry from '@/components/ThemeRegistry';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stock & Shopping Cart',
  description: 'ระบบสต๊อกสินค้าและตะกร้าสินค้า',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}