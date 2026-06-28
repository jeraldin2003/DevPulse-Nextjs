"use client";

import { AuthProvider } from "~/features/auth/context/AuthContext.jsx";
import { ThemeProvider } from "~/features/auth/context/ThemeContext.jsx";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
