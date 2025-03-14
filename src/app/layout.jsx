import '../styles/globals.css'; // Must be relative path
import dynamic from "next/dynamic";

// Dynamically import ClientLayout to disable SSR for this component
const ClientLayout = dynamic(() => import("../components/ClientLayout"), { ssr: false });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
