import './globals.css';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio Adjustment Calculator',
  description: 'Calculate how many shares to buy to reach your target average cost and optimize your investment strategy',
  authors: [{ name: "Md Nasir Uddin", url: "https://mnuworld.com" }]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
