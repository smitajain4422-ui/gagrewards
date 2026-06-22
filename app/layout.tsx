import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Grow a Garden 2 | Official',
  description: 'Claim your favourite Grow a Garden Pets & Seeds instantly for FREE!',
  generator: 'v0.app',
  icons: {
    icon: '/rovloclick-logo.png',
    apple: '/rovloclick-logo.png',
  },
  openGraph: {
    title: 'Grow a Garden 2 | Official',
    description: 'Claim your favourite Grow a Garden Pets & Seeds instantly for FREE!',
    images: [
      {
        url: '/rovloclick-logo.png',
        width: 980,
        height: 965,
        alt: 'Grow a Garden 2',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grow a Garden 2 | Official',
    description: 'Claim your favourite Grow a Garden Pets & Seeds instantly for FREE!',
    images: ['/rovloclick-logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="font-sans antialiased bg-black">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
