import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/NextUiProvider";
import { Toaster } from "react-hot-toast";
import Header from "../components/layout/Header";
import { headers } from "next/headers";
import withAuth from "../components/hoc/withAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Demo App",
  description: "Created BY Namrah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heads = headers();
  const pathname = heads.get("next-url");
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {pathname?.startsWith("/protected")
            ? withAuth(() => children)({})
            : children}
        </Providers>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
