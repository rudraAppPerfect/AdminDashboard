import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ModalProvider from "@/components/providers/modal-provider";
import UserState from "@/contextApi/UserState";
import { AuthProvider } from "@/contextApi/AuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserState>
            <ModalProvider />
            {children}
          </UserState>
        </AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
