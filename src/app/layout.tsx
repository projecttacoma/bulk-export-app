import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import {
  AppShell,
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import App from "next/app";

const inter = Inter({ subsets: ["latin"] });

const colorTheme: MantineColorsTuple = [
  "#ebefff",
  "#d5dafc",
  "#a9b1f1",
  "#7b87e9",
  "#5362e1",
  "#3a4bdd",
  "#2d3fdc",
  "#1f32c4",
  "#182cb0",
  "#0b259c",
];

const theme = createTheme({
  colors: { colorTheme },
});

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
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
