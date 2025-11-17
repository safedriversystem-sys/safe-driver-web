import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { OfflineIndicator } from "@/components/offline-indicator"
import { VoiceCommandButton } from "@/components/voice-command-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SafeDriver Authority Panel",
  description: "Transport Safety Management System",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SafeDriver",
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <div className="flex">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
              <AdminSidebar />
            </div>

            {/* Main Content - full width on mobile, adjusted margin on desktop */}
            <main className="flex-1 md:ml-64 p-4 md:p-6 pt-20 md:pt-24 bg-gray-50 min-h-screen w-full">{children}</main>
          </div>

          {/* Mobile Navigation - visible only on mobile */}
          <div className="md:hidden">
            <MobileNav />
          </div>

          {/* Offline Indicator */}
          <OfflineIndicator />

          {/* Voice Command Button */}
          <VoiceCommandButton />
        </div>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
