import "./globals.css";
import { AlertProvider } from "@/app/context/AlertContext";
import GlobalErrorAlert from "@/app/components/GlobalAlert";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          <GlobalErrorAlert />
          {children}
        </AlertProvider>
      </body>
    </html>
  );
}
