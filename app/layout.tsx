import "./styles/base.css"
import { Inter } from "next/font/google"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NoDas lønnskalkulator for dansere",
  description: "Beregn din rettferdige lønn som danser",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <body className={inter.className}>{children}</body>
    </html>
  )
}


import './globals.css'