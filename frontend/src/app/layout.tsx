import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Aaron Coleman Music - Professional Musician & Composer',
  description: 'Professional musician and composer Aaron Coleman. Discover original compositions, live performances, and musical collaborations.',
  keywords: 'Aaron Coleman, musician, composer, music, live performance, original compositions',
  authors: [{ name: 'Aaron Coleman' }],
  creator: 'Aaron Coleman',
  openGraph: {
    title: 'Aaron Coleman Music',
    description: 'Professional musician and composer Aaron Coleman. Discover original compositions, live performances, and musical collaborations.',
    url: 'https://aaroncolemanmusic.com',
    siteName: 'Aaron Coleman Music',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aaron Coleman Music',
    description: 'Professional musician and composer Aaron Coleman. Discover original compositions, live performances, and musical collaborations.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
} 