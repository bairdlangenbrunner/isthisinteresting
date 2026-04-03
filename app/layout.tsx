import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import AppShell from "./components/app-shell";

const open_sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "optional",
});

export const metadata: Metadata = {
  title: "Baird Langenbrunner",
  description: "Baird Langenbrunner's personal site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={open_sans.variable}>
      <head>
        <link rel="icon" href="/graphics/globe-alt.svg" type="image/svg+xml" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
