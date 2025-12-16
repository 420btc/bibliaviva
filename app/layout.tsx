import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Merriweather, Great_Vibes } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/components/settings-provider"
import { CookieBanner } from "@/components/cookie-banner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
})
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
})

export const metadata: Metadata = {
  title: "Biblia Viva - Estudio Bíblico Interactivo",
  description: "Explora la Biblia con inteligencia artificial, gamificación y estudio colaborativo",
  generator: "v0.app",
  icons: {
    icon: "/biblia.png",
    shortcut: "/biblia.png",
    apple: "/biblia.png",
  },
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
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased ${greatVibes.variable}`}>
        <AuthProvider>
          <SettingsProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <CookieBanner />
              <Analytics />
              <Toaster />
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
