
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import Sidebar2 from "./components/Sidebar2";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <AuthProvider>
          {children}
          <Sidebar2 />
          </AuthProvider>
          
        </div>
      </body>
    </html>
  );
}

