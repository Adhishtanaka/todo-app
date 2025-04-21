import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "todo-list",
  description: "simple todo app",
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
</head>
      <body>
        {children}
      </body>
    </html>
  );
}
