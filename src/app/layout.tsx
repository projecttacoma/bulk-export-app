import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "bulk-data-app",
  description: "Interactive query generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
