import type { Metadata } from "next";
import { Domine, Roboto_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import ArticleHeading from "./components/articleheading";

// font info
// https://nextjs.org/docs/app/building-your-application/optimizing/fonts
const domine = Domine({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "optional",
});
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
      className={`${domine.variable} ${roboto_mono.variable} ${open_sans.variable}`}
    >
      <body className="bg-white flex flex-col">
        <NavBar />
        <div className="h-screen flex flex-col">
          <div className="pt-[28px] sm:pt-[36px] w-screen flex-grow">
            {/* div that includes footer */}
            <div className="h-full">
              {/* gotta pass h-full here so that all children can inherit */}
              {/* everything in all pages should go here */}
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
