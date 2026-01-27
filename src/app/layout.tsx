
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

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
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}

