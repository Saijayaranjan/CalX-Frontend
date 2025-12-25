import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from "next/font/local"
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

// Configure Nexa Bold custom font
const nexaFont = localFont({
  src: "../public/fonts/NexaBold.otf",
  variable: "--font-nexa",
  display: "swap",
})

export const metadata: Metadata = {
  title: 'CalX - Smart Calculator Powered by AI',
  description: 'CalX is an ESP32-powered smart calculator with AI capabilities, cloud sync, and seamless device management.',
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${nexaFont.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
