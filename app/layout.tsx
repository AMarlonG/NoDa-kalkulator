import './styles/base.css';
import './styles/composition.css';
import './styles/calculator-common.css';
import './styles/page.css';
import type React from 'react';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'NoDas lønnskalkulator',
  description: 'Velg relevant kalkulator og finn din lønn basert på gjeldende avtaler.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='no'>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
