import { Inter } from "next/font/google";
import "./globals.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stock App",
  description: "Stock App for managing products and categories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={inter.className}>
        {/* Navigation bar */}
        <ResponsiveAppBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
