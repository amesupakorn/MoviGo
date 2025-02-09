import "./globals.css";
import { AlertProvider } from "@/app/context/AlertContext";
import { AuthProvider } from "@/app/context/setLogged";
import GlobalErrorAlert from "@/app/components/GlobalAlert";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          <AuthProvider>
            <GlobalErrorAlert />
            {children}
          </AuthProvider>
        </AlertProvider>
      </body>
    </html>
  );
}