import './styles/base.css';
import './styles/composition.css';
import './styles/calculator-common.css';
import './styles/page.css';
import { Inter } from 'next/font/google';
import type React from 'react';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NoDas lønnskalkulator for dansere',
  description: 'Finn din lønn basert på gjeldende avtaler',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='no'>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
