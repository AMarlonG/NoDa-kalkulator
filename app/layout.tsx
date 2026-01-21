import './styles/base.css';
import './styles/composition.css';
import './styles/calculator-common.css';
import './styles/page.css';
import { Roboto } from 'next/font/google';
import type React from 'react';
import { Analytics } from '@vercel/analytics/next';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

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
      <body className={roboto.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
