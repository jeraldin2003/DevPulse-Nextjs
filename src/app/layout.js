import { AppProviders } from "@/components/providers/AppProviders.jsx";
import "./globals.css";

export const metadata = {
  title: "DevPulse",
  description: "Development metrics dashboard and trivia workspace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
