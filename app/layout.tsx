import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SPADIE - ポーカーデーティング",
  description: "ポーカーを通じた出会いのプラットフォーム",
  generator: "v0.app",
  openGraph: {
    title: "ここから始まる私たちのハッピーライフ",
    description: "ポーカーで出会う新しい体験型マッチング",
    images: ["/images/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ここから始まる私たちのハッピーライフ",
    description: "ポーカーで出会う新しい体験型マッチング",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e3a8a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
