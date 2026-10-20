import './globals.css'

export const metadata = {
  title: 'K Cabinetry | Cabinets & Countertops Made with Expertise',
  description: 'Premium cabinetry, countertops, and vanities. Made in the United States & Europe.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}