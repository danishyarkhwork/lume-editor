import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lume Editor - Rich Text Editor",
  description: "A world-class rich text editor built with Lexical and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
