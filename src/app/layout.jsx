import '../styles/globals.css' // Must be relative path
import { useSession, signOut } from "next-auth/react";

export default function RootLayout({ children }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen">
        <header>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              {!loading && session && (
                <>
                  <li><a href="/dashboard">Dashboard</a></li>
                  <li><button onClick={() => signOut()}>Sign Out</button></li>
                </>
              )}
              {!loading && !session && (
                <>
                  <li><a href="/login">Login</a></li>
                  <li><a href="/signup">Sign Up</a></li>
                </>
              )}
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
