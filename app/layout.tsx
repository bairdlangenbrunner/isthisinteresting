import type { Metadata } from "next";
import { Roboto_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "./components/navbar";
import Footer from "./components/footer";

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "optional",
});
const open_sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "optional",
});

export const metadata: Metadata = {
  title: "is this interesting",
  description: "by Baird Langenbrunner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto_mono.variable} ${open_sans.variable}`}
    >
      <body className="bg-white">
        <div className="app-container">
          <NavBar />
          <div className="flex-1 w-full flex flex-col">
            <div className="h-full">{children}</div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
