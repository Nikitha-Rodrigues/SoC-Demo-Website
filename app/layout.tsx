import '../styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'DBMS SOC',
  description: 'Security Operations Center Dashboard',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-light antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
