import "./globals.css";
import { AlertProvider } from "@/app/context/AlertContext";
import { AuthProvider } from "@/app/context/setLogged";
import GlobalErrorAlert from "@/app/components/GlobalAlert";
import { PaymentProvider } from "@/app/context/PaymentContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
      <PaymentProvider>
        <AlertProvider>
          <AuthProvider>
            <GlobalErrorAlert />
            {children}
          </AuthProvider>
        </AlertProvider>
        </PaymentProvider>
      </body>
    </html>
  );
}