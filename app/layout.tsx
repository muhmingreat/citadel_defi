import React from "react"
import type { Metadata } from 'next'
// import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { WalletProvider } from '@/context/wallet-context'
import { Web3Provider } from '@/components/web3-provider'
import './globals.css'

// const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
// const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });
const inter = { variable: 'font-sans' };
const jetbrainsMono = { variable: 'font-mono' };

export const metadata: Metadata = {
  title: 'Citadel - Autonomous Defensive DeFi Yield Vault',
  description: 'Stoic, defensive, precise. Mission-critical DeFi protection and yield optimization.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --font-sans: 'Inter', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
          }
        `}} />
      </head>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <Web3Provider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  )
}
