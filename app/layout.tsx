import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Property Listings',
  description: 'Luxury property listings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

