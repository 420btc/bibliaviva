import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Merriweather } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Biblia Viva - Estudio Bíblico Interactivo",
  description: "Explora la Biblia con inteligencia artificial, gamificación y estudio colaborativo",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#1a1625",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
