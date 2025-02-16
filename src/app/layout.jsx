import '../styles/globals.css' // Must be relative path

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
