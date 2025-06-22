import "./globals.css";

import { CurrencyProvider } from "@/hooks/use-currency";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Portfolio Adjustment Calculator",
  description:
    "Calculate how many shares to buy to reach your target average cost and optimize your investment strategy",
  authors: [{ name: "Md Nasir Uddin", url: "https://mnuworld.com" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", fontVariables)}>
        <Suspense fallback={<div>Loading...</div>}>
          <CurrencyProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              enableColorScheme
            >
              {children}
            </ThemeProvider>
          </CurrencyProvider>
        </Suspense>
      </body>
    </html>
  );
}
